import { WalletManager } from '../utils/wallet';
import { TransactionService } from './transactionService';
import { BundleResult, TransactionResult } from '../types';
import { botConfig, tokenLaunchConfig } from '../config';
import logger from '../utils/logger';
import chalk from 'chalk';
import cliProgress from 'cli-progress';

export class BundlerBot {
  private walletManager: WalletManager;
  private transactionService: TransactionService;
  private progressBar: cliProgress.SingleBar;

  constructor() {
    this.walletManager = new WalletManager();
    this.transactionService = new TransactionService();
    this.progressBar = new cliProgress.SingleBar({
      format: 'Progress |{bar}| {percentage}% | {value}/{total} | ETA: {eta}s',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
  }

  /**
   * Initialize the bot
   */
  async initialize(): Promise<void> {
    logger.info(chalk.blue.bold('🚀 Initializing BNB Bundler Bot for four.meme'));
    logger.info(chalk.cyan(`Token: ${tokenLaunchConfig.name} (${tokenLaunchConfig.symbol})`));
    logger.info(chalk.cyan(`Network: ${botConfig.useTestnet ? 'BSC Testnet' : 'BSC Mainnet'}`));
    logger.info(chalk.cyan(`Bundler Wallets: ${botConfig.bundlerWalletCount}`));
    
    // Generate wallets
    this.walletManager.generateWallets();
    
    // Check main wallet balance
    const mainBalance = await this.transactionService.getMainWalletBalance();
    logger.info(chalk.yellow(`Main wallet balance: ${mainBalance} BNB`));
    
    // Calculate total BNB required
    const totalRequired = this.walletManager.getTotalBnbRequired();
    logger.info(chalk.yellow(`Total BNB required: ${totalRequired} BNB`));
    
    if (parseFloat(mainBalance) < parseFloat(totalRequired)) {
      logger.error(chalk.red(`❌ Insufficient main wallet balance! Required: ${totalRequired} BNB, Available: ${mainBalance} BNB`));
      throw new Error('Insufficient main wallet balance');
    }
  }

  /**
   * Execute the bundling process
   */
  async executeBundle(): Promise<BundleResult> {
    logger.info(chalk.green.bold('🎯 Starting bundling process...'));
    
    const wallets = this.walletManager.getActiveWallets();
    
    // Step 1: Fund bundler wallets
    logger.info(chalk.blue('📤 Step 1: Funding bundler wallets...'));
    this.progressBar.start(wallets.length, 0);
    
    const fundingResults = await this.fundBundlerWallets(wallets);
    this.progressBar.stop();
    
    const successfulFunding = fundingResults.filter(r => r.success).length;
    logger.info(chalk.green(`✅ Successfully funded ${successfulFunding}/${wallets.length} wallets`));
    
    if (successfulFunding === 0) {
      throw new Error('Failed to fund any wallets');
    }

    // Wait a bit for transactions to be confirmed
    logger.info(chalk.yellow('⏳ Waiting for funding transactions to be confirmed...'));
    await this.delay(10000);

    // Step 2: Execute buy transactions
    logger.info(chalk.blue('🛒 Step 2: Executing buy transactions...'));
    this.progressBar.start(wallets.length, 0);
    
    const buyResults = await this.executeBuyTransactions(wallets);
    this.progressBar.stop();
    
    logger.info(chalk.green(`✅ Buy transactions completed: ${buyResults.successfulTransactions}/${buyResults.totalTransactions} successful`));
    logger.info(chalk.cyan(`💰 Total BNB spent: ${buyResults.totalBnbSpent} BNB`));
    logger.info(chalk.cyan(`⛽ Total gas used: ${buyResults.totalGasUsed} BNB`));

    // Step 3: Gather remaining BNB
    logger.info(chalk.blue('📥 Step 3: Gathering remaining BNB...'));
    this.progressBar.start(wallets.length, 0);
    
    const gatheringResults = await this.gatherBnbFromWallets(wallets);
    this.progressBar.stop();
    
    const successfulGathering = gatheringResults.filter(r => r.success).length;
    logger.info(chalk.green(`✅ Successfully gathered BNB from ${successfulGathering}/${wallets.length} wallets`));

    // Final summary
    const finalBalance = await this.transactionService.getMainWalletBalance();
    logger.info(chalk.yellow(`🏦 Final main wallet balance: ${finalBalance} BNB`));

    return buyResults;
  }

  /**
   * Fund bundler wallets
   */
  private async fundBundlerWallets(wallets: any[]): Promise<TransactionResult[]> {
    const results: TransactionResult[] = [];
    
    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      try {
        const result = await this.transactionService.fundBundlerWallets([wallet]);
        results.push(...result);
        this.progressBar.update(i + 1);
        
        // Add delay between funding transactions
        await this.delay(2000);
      } catch (error) {
        logger.error(`Failed to fund wallet ${wallet.address}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          walletAddress: wallet.address,
          amount: wallet.buyAmount
        });
        this.progressBar.update(i + 1);
      }
    }
    
    return results;
  }

  /**
   * Execute buy transactions
   */
  private async executeBuyTransactions(wallets: any[]): Promise<BundleResult> {
    return await this.transactionService.executeBuyTransactions(wallets);
  }

  /**
   * Gather BNB from wallets
   */
  private async gatherBnbFromWallets(wallets: any[]): Promise<TransactionResult[]> {
    return await this.transactionService.gatherBnbFromWallets(wallets);
  }

  /**
   * Display wallet information
   */
  displayWalletInfo(): void {
    const wallets = this.walletManager.getActiveWallets();
    
    logger.info(chalk.blue.bold('\n📋 Bundler Wallet Information:'));
    logger.info(chalk.cyan(`Total Wallets: ${wallets.length}`));
    logger.info(chalk.cyan(`Total BNB Required: ${this.walletManager.getTotalBnbRequired()} BNB`));
    
    if (wallets.length <= 10) {
      logger.info(chalk.yellow('\nWallet Details:'));
      wallets.forEach((wallet, index) => {
        logger.info(chalk.gray(`${index + 1}. ${wallet.address} - ${wallet.buyAmount} BNB`));
      });
    } else {
      logger.info(chalk.yellow('\nFirst 5 wallets:'));
      wallets.slice(0, 5).forEach((wallet, index) => {
        logger.info(chalk.gray(`${index + 1}. ${wallet.address} - ${wallet.buyAmount} BNB`));
      });
      logger.info(chalk.gray(`... and ${wallets.length - 5} more wallets`));
    }
  }

  /**
   * Utility function to add delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
