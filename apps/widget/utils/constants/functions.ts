import QRCode from 'qrcode';
import { Coins } from 'types/wallet';

export const handleCopyText = async (text: string): Promise<void> => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      fallbackCopyTextToClipboard(text);
    }
  } else {
    fallbackCopyTextToClipboard(text);
  }
};

function fallbackCopyTextToClipboard(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

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
