import { Wallet } from '../../models/Wallet';
import { pbPayAxiosInstance } from '../../util/api';
import { PBPayConfigs } from '../../util/constants/config';
import env from '../../util/constants/env';

const createWalletPbp = async (userId: string) => {
  const response = await pbPayAxiosInstance.post(
    `/merchant/${PBPayConfigs.MERCHANT_ID}/wallet`,
    {
      externalId: userId,
      currency: env.currency,
      notificationUrl: PBPayConfigs.NOTIFICATION_URL,
    }
  );

  const wallet = response?.data?.data;

  const {
    address,
    externalId,
    merchantId,
    destination,
    currency,
    estimatedFiatCurrency,
    totalDepositedAmount,
    estimatedFiatAmount,
    notificationUrl,
  } = wallet;

  return await Wallet.create({
    address,
    externalId,
    merchantId,
    destination,
    currency,
    estimatedFiatCurrency,
    totalDepositedAmount,
    estimatedFiatAmount,
    notificationUrl,
  });
};

export default createWalletPbp;
