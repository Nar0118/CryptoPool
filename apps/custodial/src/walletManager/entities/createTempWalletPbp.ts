import { pbPayAxiosInstance } from '../../util/api';
import { TempWallet } from '../../models/TempWallet';
import { PBPayConfigs } from '../../util/constants/config';
import { PbPayCoins } from '../../util/constants/contracts';

const createTempWalletPbp = async (
  parentWalletId: string,
  walletCurrency: string,
  key: string
) => {
  try {
    let tempWallet = await TempWallet.create({
      parentWalletId,
      tag: null,
    });
    const response = await pbPayAxiosInstance.post(
      `/merchant/${PBPayConfigs.MERCHANT_ID}/wallet`,
      {
        externalId: tempWallet._id,
        currency: walletCurrency,
        notificationUrl: `${PBPayConfigs.NOTIFICATION_URL}/${key}`,
      }
    );

    const newWallet = response?.data?.data;

    const {
      address,
      externalId,
      merchantId,
      destination,
      totalDepositedAmount,
      currency,
      estimatedFiatCurrency,
      estimatedFiatAmount,
      notificationUrl,
      tag,
    } = newWallet;

    tempWallet = await TempWallet.findByIdAndUpdate(
      tempWallet._id,
      {
        pbId: newWallet.id,
        address,
        externalId,
        merchantId,
        destination,
        currency,
        estimatedFiatCurrency,
        totalDepositedAmount,
        estimatedFiatAmount,
        notificationUrl,
        ...(walletCurrency === PbPayCoins.XRP && { tag }),
      },
      { new: true }
    );

    return tempWallet;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default createTempWalletPbp;
