import { ContractInfo } from "../util/constants/contracts";
import { getContractWS } from "./getContractWS";
import { Contract } from "web3-eth-contract"

export interface TransferReturnValues {
  from: string;
  to: string;
  value: string
}

export const waitForTransfer = (
  wallet: string,
  contractInfo: ContractInfo,
  onSuccess: (TransferReturnValues) => unknown,
  onError: (any) => unknown,
): () => void => {
  let contract: Contract;
  try {
    contract = getContractWS(contractInfo)[0];
  } catch(e) {
    onError("Could not get contract");
    return;
  }

  const options = {
    filter: {
      _to: wallet,
    }
  }

  const eventEmitter = contract.events.Transfer(options, async (error, event) => {
    error ? onError(error) : onSuccess(event.returnValues);
  })

  // Use this returned function to clear subscription.
  return () => {
    console.log("Unsubscribing");
    // eventEmitter.options.requestManager.removeSubscription(subscriptionId);
    console.log(eventEmitter);
    eventEmitter.unsubscribe();
  }
}
