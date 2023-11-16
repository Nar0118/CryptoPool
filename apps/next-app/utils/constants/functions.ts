import moment from 'moment';
import QRCode from 'qrcode';
import { Coins } from 'types/wallet';

export const dateFormatter = (start: Date, end: Date): string => {
  const startDate = moment(start).format('DD.MM');
  const endDate = moment(end).format('DD.MM');
  return `${startDate} - ${endDate}`;
};

export const handleCopyText = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

export const handleQrCode = (text: string): string => {
  let qrUrl: string;
  QRCode.toDataURL(text, { width: 200, height: 200 }, (err, url) => {
    if (err) throw err;
    qrUrl = url;
  });

  return qrUrl;
};

export const coins: Coins = {
  ethereum: {
    base: 'ETH',
    coinId: 'ethereum',
  },
  bitcoin: {
    base: 'BTC',
    coinId: 'bitcoin',
  },
  tether: {
    base: 'USDT',
    coinId: 'tether',
  },
  ripple: {
    base: 'XRP',
    coinId: 'ripple',
  },
};
