import { getContractRPC } from './getContractRPC';
import { contracts } from '../util/constants/contracts';

export enum Status {
  ZERO_BALANCE,
  SUCCESS,
  FAIL,
  CONTRACT_ERROR,
  AMOUNT_GREATER_THAN_BALANCE,
}

const sendFunds = async (
  recipientAddress: string,
  senderAddress: string,
  childPK: string,
  amount = 0
) => {
  try {
    const [usdtContract, web3] = getContractRPC(contracts['MTK']);

    if (!usdtContract)
      return { status: Status.CONTRACT_ERROR, message: 'Contract error' };

    web3.eth.accounts.wallet.add(childPK);

    const senderBalance = await usdtContract.methods
      .balanceOf(senderAddress)
      .call();

    if (senderBalance == '0') {
      console.log('Balance is zero. Returning.');
      return { status: Status.ZERO_BALANCE };
    }

    let sendAmount = senderBalance;
    if (amount > 0 && amount <= senderBalance) {
      sendAmount = amount;
    } else if (amount > 0 && amount > senderBalance) {
      console.log('Amount is less than balance. Exiting...');
      return { status: Status.AMOUNT_GREATER_THAN_BALANCE };
    }

    const trx = usdtContract.methods.transfer(recipientAddress, sendAmount);
    const gas = await trx.estimateGas({ from: senderAddress });
    const rawTx = {
      from: senderAddress,
      to: contracts['MTK'].address,
      data: trx.encodeABI(),
      gas: gas,
      value: '0x0',
    };

    // eslint-disable-next-line no-async-promise-executor
    const receipt = await web3.eth.sendTransaction(rawTx);
    console.log('Tx hash: ', receipt.transactionHash);

    return { status: Status.SUCCESS };
  } catch (e) {
    return { status: Status.FAIL, data: e };
  }
};

export default sendFunds;
