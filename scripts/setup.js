const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up BNB Bundler Bot for four.meme...\n');

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory');
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
    console.log('⚠️  Please update .env with your actual configuration');
  } else {
    console.log('❌ env.example file not found');
  }
} else {
  console.log('✅ .env file already exists');
}

// Create package.json scripts
console.log('\n📦 Available commands:');
console.log('  npm run dev     - Run in development mode');
console.log('  npm run build   - Build the project');
console.log('  npm start       - Run the built project');
console.log('  npm test        - Run tests');

console.log('\n🔧 Next steps:');
console.log('1. Update .env with your wallet configuration');
console.log('2. Install dependencies: npm install');
console.log('3. Test on BSC testnet first: npm run dev');
console.log('4. Update contract address in src/config/index.ts');

console.log('\n⚠️  Important:');
console.log('- Never share your private keys');
console.log('- Test on testnet before mainnet');
console.log('- Ensure sufficient BNB balance');
console.log('- Update contract address before use');

console.log('\n🎉 Setup complete!');
