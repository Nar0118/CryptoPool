import { EventData } from 'web3-eth-contract';
import { getContractRPC } from './getContractRPC';
import { PbPayCoins, contracts } from '../util/constants/contracts';
import { pbPayAxiosInstance } from '../util/api';
import { PBPayConfigs } from '../util/constants/config';
import { TempWallet } from '../models/TempWallet';

interface Senders {
  [key: string]: number;
}

export const getSenders = async (
  address: string
): Promise<{
  senders: Senders;
  transactions: Array<EventData>;
}> => {
  const [usdtContract] = getContractRPC(contracts['MTK']);

  const transactions = await usdtContract.getPastEvents('Transfer', {
    filter: { to: address },
    fromBlock: 0,
    toBlock: 'latest',
  });

  if (!transactions) return;

  const senders = {};
  transactions.map((t) => {
    if (!senders[t.returnValues.from]) {
      senders[t.returnValues.from] = Number(t.returnValues.value);
    } else {
      senders[t.returnValues.from] += Number(t.returnValues.value);
    }
  });

  return { senders, transactions };
};

export const getSendersPbp = async (
  childId: string
): Promise<{
  senders?: Senders;
  updatedTransactions?: Array<any>;
  balance?: number;
  lastTransaction?: any;
  error?: string;
}> => {
  // PBPayConfigs.MERCHANT_ID is pbpay dashboard merchant id
  const result = await pbPayAxiosInstance.get(
    `/merchant/${PBPayConfigs.MERCHANT_ID}/wallet/external-id/${childId}`
  );
  const { transactions, currency, totalDepositedAmount } = result?.data?.data;
  const senders = {};
  const coin = currency;
  const isCoinInEnum = Object.values(PbPayCoins).includes(coin);
  if (!isCoinInEnum) {
    return {
      error: 'Wrong currency token.',
    };
  }

  if (!transactions) return { updatedTransactions: [], senders };

  const txDatas = transactions.map(async (el) => {
    const txInfo = await pbPayAxiosInstance.get(
      `/merchant/${PBPayConfigs.MERCHANT_ID}/transaction/id/${el.id}`
    );
    return txInfo?.data?.data;
  });

  const updatedTransactions = await Promise.all(txDatas);
  const lastTransaction =
    updatedTransactions[updatedTransactions.length - 1] || {};
  let balance = 0;

  updatedTransactions.map((t: any) => {
    if (!senders[t?.sourceAddress]) {
      senders[t?.sourceAddress] = Number(t?.amount);
    } else {
      senders[t?.sourceAddress] += Number(t?.amount);
    }

    balance += t?.amount;
  });

  await TempWallet.findOneAndUpdate(
    { externalId: childId },
    { totalDepositedAmount },
    { new: true }
  );

  return {
    updatedTransactions,
    senders,
    balance,
    lastTransaction,
  };
};
