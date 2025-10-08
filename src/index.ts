import { BundlerBot } from './services/bundlerBot';
import { botConfig, tokenLaunchConfig } from './config';
import logger from './utils/logger';
import chalk from 'chalk';

async function main() {
  try {
    // Display banner
    console.log(chalk.blue.bold(`
╔══════════════════════════════════════════════════════════════╗
║                    BNB BUNDLER BOT 4MEME                     ║
║                                                              ║
║  Token: ${tokenLaunchConfig.name.padEnd(20)} (${tokenLaunchConfig.symbol.padEnd(10)}) ║
║  Network: ${botConfig.useTestnet ? 'BSC Testnet'.padEnd(20) : 'BSC Mainnet'.padEnd(20)} ║
║  Wallets: ${botConfig.bundlerWalletCount.toString().padEnd(20)} ║
║  Amount Range: ${botConfig.minBuyAmountBnb}-${botConfig.maxBuyAmountBnb} BNB${' '.repeat(15)} ║
╚══════════════════════════════════════════════════════════════╝
    `));

    // Validate configuration
    if (!botConfig.mainWalletPrivateKey || !botConfig.mainWalletAddress) {
      logger.error(chalk.red('❌ Main wallet configuration is missing!'));
      logger.error(chalk.yellow('Please set MAIN_WALLET_PRIVATE_KEY and MAIN_WALLET_ADDRESS in your .env file'));
      process.exit(1);
    }

    // Create and initialize bot
    const bot = new BundlerBot();
    await bot.initialize();

    // Display wallet information
    bot.displayWalletInfo();

    // Confirm before proceeding
    console.log(chalk.yellow.bold('\n⚠️  WARNING: This will execute real transactions!'));
    console.log(chalk.yellow('Make sure you have sufficient BNB in your main wallet.'));
    console.log(chalk.yellow('Press Ctrl+C to cancel, or wait 10 seconds to continue...\n'));

    // Wait 10 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Execute bundling
    logger.info(chalk.green.bold('🚀 Starting bundling process...'));
    const result = await bot.executeBundle();

    // Display results
    console.log(chalk.green.bold('\n✅ BUNDLING COMPLETED!'));
    console.log(chalk.cyan(`📊 Results:`));
    console.log(chalk.white(`   Total Transactions: ${result.totalTransactions}`));
    console.log(chalk.green(`   Successful: ${result.successfulTransactions}`));
    console.log(chalk.red(`   Failed: ${result.failedTransactions}`));
    console.log(chalk.yellow(`   Total BNB Spent: ${result.totalBnbSpent} BNB`));
    console.log(chalk.yellow(`   Total Gas Used: ${result.totalGasUsed} BNB`));

    // Display failed transactions if any
    const failedTransactions = result.results.filter(r => !r.success);
    if (failedTransactions.length > 0) {
      console.log(chalk.red.bold('\n❌ Failed Transactions:'));
      failedTransactions.forEach((tx, index) => {
        console.log(chalk.red(`   ${index + 1}. ${tx.walletAddress}: ${tx.error}`));
      });
    }

    logger.info(chalk.green.bold('🎉 Bot execution completed successfully!'));

  } catch (error) {
    logger.error(chalk.red.bold('❌ Bot execution failed:'), error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n⚠️  Received SIGINT. Shutting down gracefully...'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n⚠️  Received SIGTERM. Shutting down gracefully...'));
  process.exit(0);
});

// Start the bot
main().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
