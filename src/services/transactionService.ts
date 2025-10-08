import { ethers } from 'ethers';
import { WalletConfig, TransactionResult, BundleResult } from '../types';
import { botConfig, FOUR_MEME_CONTRACT_ADDRESS, WBNB_ADDRESS } from '../config';
import logger from '../utils/logger';

export class TransactionService {
  private provider: ethers.JsonRpcProvider;
  private mainWallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(botConfig.rpcUrl);
    this.mainWallet = new ethers.Wallet(botConfig.mainWalletPrivateKey, this.provider);
  }

  /**
   * Fund bundler wallets from main wallet
   */
  async fundBundlerWallets(wallets: WalletConfig[]): Promise<TransactionResult[]> {
    logger.info('Starting to fund bundler wallets...');
    const results: TransactionResult[] = [];

    for (const wallet of wallets) {
      try {
        const amount = ethers.parseEther(wallet.buyAmount);
        const gasPrice = ethers.parseUnits(botConfig.gasPriceGwei.toString(), 'gwei');
        
        const tx = await this.mainWallet.sendTransaction({
          to: wallet.address,
          value: amount,
          gasPrice: gasPrice,
          gasLimit: 21000
        });

        await tx.wait();

        results.push({
          success: true,
          hash: tx.hash,
          walletAddress: wallet.address,
          amount: wallet.buyAmount,
          gasUsed: '21000'
        });

        logger.info(`Funded wallet ${wallet.address} with ${wallet.buyAmount} BNB`);
        
        // Add delay between transactions to avoid nonce issues
        await this.delay(1000);
        
      } catch (error) {
        logger.error(`Failed to fund wallet ${wallet.address}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          walletAddress: wallet.address,
          amount: wallet.buyAmount
        });
      }
    }

    return results;
  }

  /**
   * Execute buy transactions for all bundler wallets
   */
  async executeBuyTransactions(wallets: WalletConfig[]): Promise<BundleResult> {
    logger.info('Starting buy transaction bundle...');
    
    const results: TransactionResult[] = [];
    let successfulTransactions = 0;
    let failedTransactions = 0;
    let totalGasUsed = BigInt(0);
    let totalBnbSpent = BigInt(0);

    for (const wallet of wallets) {
      try {
        const walletInstance = new ethers.Wallet(wallet.privateKey, this.provider);
        const result = await this.executeBuyTransaction(walletInstance, wallet);
        
        results.push(result);
        
        if (result.success) {
          successfulTransactions++;
          if (result.gasUsed) {
            totalGasUsed += BigInt(result.gasUsed);
          }
          totalBnbSpent += ethers.parseEther(wallet.buyAmount);
        } else {
          failedTransactions++;
        }

        // Add delay between transactions
        await this.delay(500);
        
      } catch (error) {
        logger.error(`Failed to execute buy transaction for wallet ${wallet.address}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          walletAddress: wallet.address,
          amount: wallet.buyAmount
        });
        failedTransactions++;
      }
    }

    return {
      totalTransactions: wallets.length,
      successfulTransactions,
      failedTransactions,
      totalGasUsed: ethers.formatEther(totalGasUsed),
      totalBnbSpent: ethers.formatEther(totalBnbSpent),
      results
    };
  }

  /**
   * Execute single buy transaction
   */
  private async executeBuyTransaction(
    wallet: ethers.Wallet, 
    walletConfig: WalletConfig
  ): Promise<TransactionResult> {
    try {
      // This is a placeholder for the actual four.meme contract interaction
      // You'll need to implement the actual contract ABI and method calls
      const contractABI = [
        "function buy() external payable",
        "function buyTokens(uint256 amount) external payable"
      ];

      const contract = new ethers.Contract(FOUR_MEME_CONTRACT_ADDRESS, contractABI, wallet);
      const gasPrice = ethers.parseUnits(botConfig.gasPriceGwei.toString(), 'gwei');
      const value = ethers.parseEther(walletConfig.buyAmount);

      // Estimate gas for the transaction
      const gasEstimate = await contract.buy.estimateGas({ value });
      
      const tx = await contract.buy({
        value: value,
        gasPrice: gasPrice,
        gasLimit: gasEstimate
      });

      const receipt = await tx.wait();
      
      return {
        success: true,
        hash: tx.hash,
        walletAddress: wallet.address,
        amount: walletConfig.buyAmount,
        gasUsed: receipt?.gasUsed.toString() || '0'
      };

    } catch (error) {
      logger.error(`Buy transaction failed for wallet ${wallet.address}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        walletAddress: wallet.address,
        amount: walletConfig.buyAmount
      };
    }
  }

  /**
   * Gather remaining BNB from bundler wallets back to main wallet
   */
  async gatherBnbFromWallets(wallets: WalletConfig[]): Promise<TransactionResult[]> {
    logger.info('Starting to gather BNB from bundler wallets...');
    const results: TransactionResult[] = [];

    for (const wallet of wallets) {
      try {
        const walletInstance = new ethers.Wallet(wallet.privateKey, this.provider);
        const balance = await this.provider.getBalance(wallet.address);
        
        if (balance === 0n) {
          logger.info(`Wallet ${wallet.address} has no balance to gather`);
          continue;
        }

        const gasPrice = ethers.parseUnits(botConfig.gasPriceGwei.toString(), 'gwei');
        const gasCost = gasPrice * BigInt(21000);
        const amountToSend = balance - gasCost;

        if (amountToSend <= 0n) {
          logger.info(`Wallet ${wallet.address} has insufficient balance for gas`);
          continue;
        }

        const tx = await walletInstance.sendTransaction({
          to: botConfig.mainWalletAddress,
          value: amountToSend,
          gasPrice: gasPrice,
          gasLimit: 21000
        });

        await tx.wait();

        results.push({
          success: true,
          hash: tx.hash,
          walletAddress: wallet.address,
          amount: ethers.formatEther(amountToSend),
          gasUsed: '21000'
        });

        logger.info(`Gathered ${ethers.formatEther(amountToSend)} BNB from wallet ${wallet.address}`);
        
        // Add delay between transactions
        await this.delay(1000);
        
      } catch (error) {
        logger.error(`Failed to gather BNB from wallet ${wallet.address}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          walletAddress: wallet.address,
          amount: '0'
        });
      }
    }

    return results;
  }

  /**
   * Get main wallet balance
   */
  async getMainWalletBalance(): Promise<string> {
    try {
      const balance = await this.provider.getBalance(botConfig.mainWalletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error('Failed to get main wallet balance:', error);
      return '0';
    }
  }

  /**
   * Utility function to add delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
