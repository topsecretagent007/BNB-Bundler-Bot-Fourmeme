export interface WalletConfig {
  privateKey: string;
  address: string;
  buyAmount: string;
  isActive: boolean;
}

export interface TokenLaunchConfig {
  name: string;
  symbol: string;
  description: string;
  website: string;
  twitter: string;
  telegram: string;
  tag: string;
  raisedToken: string;
}

export interface BotConfig {
  mainWalletPrivateKey: string;
  mainWalletAddress: string;
  rpcUrl: string;
  useTestnet: boolean;
  gasPriceGwei: number;
  gasLimit: number;
  maxRetries: number;
  retryDelayMs: number;
  bundlerWalletCount: number;
  minBuyAmountBnb: number;
  maxBuyAmountBnb: number;
  randomBuyAmounts: boolean;
  logLevel: string;
  logToFile: boolean;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  walletAddress: string;
  amount: string;
  gasUsed?: string;
}

export interface BundleResult {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalGasUsed: string;
  totalBnbSpent: string;
  results: TransactionResult[];
}
