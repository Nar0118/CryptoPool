import { ethers } from 'ethers';
import { TempWallet } from '../../models/TempWallet';

const createTempWallet = async (parentWalletId: string) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    return await TempWallet.create({
      parentWalletId,
      address: wallet.address,
      mnemonic: wallet.mnemonic.phrase,
      privateKey: wallet.privateKey,
    });
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default createTempWallet;
