# BNB Bundler Bot for four.meme

four.meme token bundler bot

## Features

- 🚀 **50 Wallet Bundling**: Automatically generates and manages 50 wallets for transaction bundling
- 💰 **Main Wallet Management**: Uses main wallet for funding and gathering BNB
- 🎯 **Configurable Buy Amounts**: Random or fixed buy amounts within specified ranges
- ⛽ **Gas Optimization**: Configurable gas prices and limits
- 📊 **Progress Tracking**: Real-time progress bars and detailed logging
- 🔄 **Automatic Recovery**: Gathers remaining BNB back to main wallet
- 🛡️ **Error Handling**: Comprehensive error handling and retry mechanisms

## Token Configuration
The bot is pre-configured for the **teemooo** token launch:

https://github.com/user-attachments/assets/28e84a93-f4bf-4372-b84a-ed5b95faaf06

TX:
```https://gmgn.ai/bsc/token/0x117ed7ab9ec2d241238320cb4b42ab89913d4444```

<img width="1459" height="645" alt="image" src="https://github.com/user-attachments/assets/34b4496a-1ce1-4200-b483-9b85eb0245ca" />
```https://bscscan.com/address/0x2e828b4910333f6d211055b5717a8de0e8eb2058```

<img width="1429" height="340" alt="image" src="https://github.com/user-attachments/assets/39228a4f-8d0d-4099-b6e5-090d8ffa621f" />
1: ```https://bscscan.com/address/0x270cc208d1711768da9c8cce76b8b192dd093fa5```
2: ```https://bscscan.com/address/0x085a516a00eb9637f26d12b68fece26d44aeb3de```

Create wallet:
```0x2E828b4910333f6D211055B5717A8De0e8eB2058```

Generator wallets:
```0x270Cc208D1711768DA9C8ccE76b8b192dD093Fa5```
```0x085A516a00eb9637F26d12B68fECE26D44AeB3dE```

Token address:
```0x117ed7ab9ec2d241238320cb4b42ab89913d4444```


## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BNB-Bundler-Bot-4meme
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Main wallet configuration (for funding and gathering)
MAIN_WALLET_PRIVATE_KEY=your_main_wallet_private_key_here
MAIN_WALLET_ADDRESS=your_main_wallet_address_here

# RPC Configuration
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# Bot Configuration
USE_TESTNET=true
GAS_PRICE_GWEI=5
GAS_LIMIT=300000
MAX_RETRIES=3
RETRY_DELAY_MS=2000

# Bundler Configuration
BUNDLER_WALLET_COUNT=50
MIN_BUY_AMOUNT_BNB=0.001
MAX_BUY_AMOUNT_BNB=0.01
RANDOM_BUY_AMOUNTS=true
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Configuration Options

### Main Wallet Settings
- `MAIN_WALLET_PRIVATE_KEY`: Private key of your main wallet (for funding and gathering)
- `MAIN_WALLET_ADDRESS`: Address of your main wallet

### Network Settings
- `USE_TESTNET`: Set to `true` for BSC testnet, `false` for mainnet
- `BSC_RPC_URL`: BSC mainnet RPC URL
- `BSC_TESTNET_RPC_URL`: BSC testnet RPC URL

### Bot Settings
- `GAS_PRICE_GWEI`: Gas price in Gwei (default: 5)
- `GAS_LIMIT`: Gas limit for transactions (default: 300000)
- `MAX_RETRIES`: Maximum retry attempts for failed transactions (default: 3)
- `RETRY_DELAY_MS`: Delay between retries in milliseconds (default: 2000)

### Bundler Settings
- `BUNDLER_WALLET_COUNT`: Number of bundler wallets to create (default: 50)
- `MIN_BUY_AMOUNT_BNB`: Minimum buy amount per wallet in BNB (default: 0.001)
- `MAX_BUY_AMOUNT_BNB`: Maximum buy amount per wallet in BNB (default: 0.01)
- `RANDOM_BUY_AMOUNTS`: Whether to use random buy amounts (default: true)

## How It Works

1. **Initialization**: The bot generates 50 random wallets and calculates total BNB required
2. **Funding**: Main wallet sends BNB to each bundler wallet
3. **Buying**: Each bundler wallet executes buy transactions for the token
4. **Gathering**: Remaining BNB is gathered back to the main wallet
5. **Reporting**: Detailed results and statistics are displayed

## Safety Features

- ⚠️ **10-second confirmation delay** before executing transactions
- 🔍 **Balance validation** to ensure sufficient funds
- 📊 **Detailed logging** of all operations
- 🛡️ **Error handling** with retry mechanisms
- 💾 **Transaction receipts** for all operations

## Important Notes

- **Test First**: Always test on BSC testnet before using on mainnet
- **Sufficient Balance**: Ensure your main wallet has enough BNB for all transactions
- **Gas Fees**: Account for gas fees in your calculations
- **Contract Address**: Update `FOUR_MEME_CONTRACT_ADDRESS` with the actual contract address
- **Security**: Never share your private keys or commit them to version control

## Contract Integration

The bot includes placeholder contract integration for the four.meme platform. You'll need to:

1. Update `FOUR_MEME_CONTRACT_ADDRESS` in `src/config/index.ts`
2. Implement the actual contract ABI and method calls in `src/services/transactionService.ts`
3. Test thoroughly on testnet before mainnet deployment

## Logging

The bot provides comprehensive logging:
- Console output with colored messages
- File logging (if enabled) in `logs/` directory
- Progress bars for long-running operations
- Detailed error messages and stack traces

## Contact

**Lendon Bracewell**
- Website: [https://tsagent.xyz](https://tsagent.xyz)
- Twitter: [@lendon1114](https://x.com/lendon1114)
- Telegram: [@topsecretagent_007](https://t.me/topsecretagent_007)
- GitHub: [@topsecretagent007](https://github.com/topsecretagent007)
