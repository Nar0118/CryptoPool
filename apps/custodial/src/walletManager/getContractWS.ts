import Web3 from "web3"
import { ContractInfo } from "../util/constants/contracts";
import { chains } from "../util/constants/chains";
import { Contract } from "web3-eth-contract";

export const getContractWS = (contractInfo: ContractInfo) : [Contract, Web3] => {
  try {
    const web3 = new Web3(new Web3.providers.WebsocketProvider(chains[contractInfo.chainId].wsUrl));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [new web3.eth.Contract(contractInfo.abi, contractInfo.address), web3];
  } catch (e) {
    console.error(e);
  }
}
