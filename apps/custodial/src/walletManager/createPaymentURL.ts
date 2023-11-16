import { PbPayCoins } from '../util/constants/contracts';

export const createPaymentURL = (
  recipientAddress: string,
  currency: PbPayCoins,
  tag: string,
  amount: number
) => {
  const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const usdcContractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

  switch (currency) {
    case PbPayCoins.XRP:
      return `address=${recipientAddress}&tag=${tag}`;
    case PbPayCoins.USDT:
      return `ethereum:${usdtContractAddress}/transfer?address=${recipientAddress}&uint256=${
        amount * 1000000
      }`;
    case PbPayCoins.USDC:
      return `ethereum:${usdcContractAddress}/transfer?address=${recipientAddress}&uint256=${
        amount * 1000000
      }`;
  }
};
