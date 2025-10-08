import dotenv from 'dotenv';
import { BotConfig, TokenLaunchConfig } from '../types';

dotenv.config();

export const tokenLaunchConfig: TokenLaunchConfig = {
  name: process.env.TOKEN_NAME || 'Lendon',
  symbol: process.env.TOKEN_SYMBOL || 'lendon',
  description: process.env.TOKEN_DESCRIPTION || 'I am Lendon Bracewell and this is my bot',
  website: process.env.TOKEN_WEBSITE || 'https://tsagent.xyz',
  twitter: process.env.TOKEN_TWITTER || 'https://x.com/lendon1114',
  telegram: process.env.TOKEN_TELEGRAM || 'https://t.me/topsecretagent_007',
  tag: process.env.TOKEN_TAG || 'meme',
  raisedToken: process.env.RAISED_TOKEN || 'bnb'
};

export const botConfig: BotConfig = {
  mainWalletPrivateKey: process.env.MAIN_WALLET_PRIVATE_KEY || '',
  mainWalletAddress: process.env.MAIN_WALLET_ADDRESS || '',
  rpcUrl: process.env.USE_TESTNET === 'true' 
    ? process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/',
  useTestnet: process.env.USE_TESTNET === 'true',
  gasPriceGwei: parseInt(process.env.GAS_PRICE_GWEI || '5'),
  gasLimit: parseInt(process.env.GAS_LIMIT || '300000'),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
  retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '2000'),
  bundlerWalletCount: parseInt(process.env.BUNDLER_WALLET_COUNT || '50'),
  minBuyAmountBnb: parseFloat(process.env.MIN_BUY_AMOUNT_BNB || '0.001'),
  maxBuyAmountBnb: parseFloat(process.env.MAX_BUY_AMOUNT_BNB || '0.01'),
  randomBuyAmounts: process.env.RANDOM_BUY_AMOUNTS === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  logToFile: process.env.LOG_TO_FILE === 'true'
};

export const FOUR_MEME_CONTRACT_ADDRESS = botConfig.useTestnet 
  ? '0x0000000000000000000000000000000000000000' // Replace with actual testnet contract
  : '0x0000000000000000000000000000000000000000'; // Replace with actual mainnet contract

export const WBNB_ADDRESS = botConfig.useTestnet
  ? '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' // WBNB testnet
  : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'; // WBNB mainnet
