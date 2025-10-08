import { ethers } from 'ethers';
import { WalletConfig } from '../types';
import { botConfig } from '../config';
import logger from './logger';

export class WalletManager {
  private wallets: WalletConfig[] = [];
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(botConfig.rpcUrl);
  }

  /**
   * Generate 50 wallets for bundling
   */
  generateWallets(): WalletConfig[] {
    logger.info(`Generating ${botConfig.bundlerWalletCount} bundler wallets...`);
    
    this.wallets = [];
    
    for (let i = 0; i < botConfig.bundlerWalletCount; i++) {
      const wallet = ethers.Wallet.createRandom();
      const buyAmount = this.generateBuyAmount();
      
      this.wallets.push({
        privateKey: wallet.privateKey,
        address: wallet.address,
        buyAmount: buyAmount,
        isActive: true
      });
    }

    logger.info(`Generated ${this.wallets.length} wallets`);
    return this.wallets;
  }

  /**
   * Generate random buy amount within configured range
   */
  private generateBuyAmount(): string {
    if (!botConfig.randomBuyAmounts) {
      return botConfig.minBuyAmountBnb.toString();
    }

    const min = botConfig.minBuyAmountBnb;
    const max = botConfig.maxBuyAmountBnb;
    const randomAmount = Math.random() * (max - min) + min;
    
    return randomAmount.toFixed(6); // 6 decimal places for BNB
  }

  /**
   * Get all active wallets
   */
  getActiveWallets(): WalletConfig[] {
    return this.wallets.filter(wallet => wallet.isActive);
  }

  /**
   * Get wallet by address
   */
  getWallet(address: string): WalletConfig | undefined {
    return this.wallets.find(wallet => wallet.address === address);
  }

  /**
   * Update wallet buy amount
   */
  updateWalletBuyAmount(address: string, amount: string): boolean {
    const wallet = this.getWallet(address);
    if (wallet) {
      wallet.buyAmount = amount;
      return true;
    }
    return false;
  }

  /**
   * Deactivate wallet
   */
  deactivateWallet(address: string): boolean {
    const wallet = this.getWallet(address);
    if (wallet) {
      wallet.isActive = false;
      return true;
    }
    return false;
  }

  /**
   * Get total BNB required for all wallets
   */
  getTotalBnbRequired(): string {
    const total = this.wallets
      .filter(wallet => wallet.isActive)
      .reduce((sum, wallet) => sum + parseFloat(wallet.buyAmount), 0);
    
    return total.toFixed(6);
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error(`Failed to get balance for wallet ${address}:`, error);
      return '0';
    }
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
}
