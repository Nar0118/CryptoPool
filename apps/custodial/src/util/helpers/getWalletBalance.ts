import { getContractRPC } from "../../walletManager/getContractRPC";
import { contracts } from "../constants/contracts";

const getBalance = async (wallet) =>  {
  const [usdtContract] = getContractRPC(contracts['MTK']);

  if (!usdtContract) {
    return false;
  }

  return await usdtContract.methods.balanceOf(wallet.address).call();
}

export default getBalance;
