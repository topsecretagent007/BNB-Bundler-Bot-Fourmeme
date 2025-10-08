import { WalletManager } from '../utils/wallet';
import { botConfig } from '../config';

describe('WalletManager', () => {
  let walletManager: WalletManager;

  beforeEach(() => {
    walletManager = new WalletManager();
  });

  test('should generate correct number of wallets', () => {
    const wallets = walletManager.generateWallets();
    expect(wallets).toHaveLength(botConfig.bundlerWalletCount);
  });

  test('should generate wallets with valid addresses', () => {
    const wallets = walletManager.generateWallets();
    
    wallets.forEach(wallet => {
      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
      expect(wallet.isActive).toBe(true);
      expect(parseFloat(wallet.buyAmount)).toBeGreaterThan(0);
    });
  });

  test('should calculate total BNB required correctly', () => {
    const wallets = walletManager.generateWallets();
    const totalRequired = walletManager.getTotalBnbRequired();
    
    const expectedTotal = wallets
      .reduce((sum, wallet) => sum + parseFloat(wallet.buyAmount), 0)
      .toFixed(6);
    
    expect(totalRequired).toBe(expectedTotal);
  });

  test('should deactivate wallet correctly', () => {
    const wallets = walletManager.generateWallets();
    const firstWallet = wallets[0];
    
    expect(firstWallet.isActive).toBe(true);
    
    walletManager.deactivateWallet(firstWallet.address);
    const updatedWallet = walletManager.getWallet(firstWallet.address);
    
    expect(updatedWallet?.isActive).toBe(false);
  });

  test('should update wallet buy amount correctly', () => {
    const wallets = walletManager.generateWallets();
    const firstWallet = wallets[0];
    const newAmount = '0.005';
    
    const success = walletManager.updateWalletBuyAmount(firstWallet.address, newAmount);
    expect(success).toBe(true);
    
    const updatedWallet = walletManager.getWallet(firstWallet.address);
    expect(updatedWallet?.buyAmount).toBe(newAmount);
  });
});
