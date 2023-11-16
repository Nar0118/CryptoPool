import navBarPaths from 'utils/constants/navBarPaths';

export const withoutAuthRoutes: Array<string> = [
  navBarPaths.login,
  navBarPaths.signUp,
  navBarPaths.recoverPassword,
  navBarPaths.newPassword,
  navBarPaths.resetPassword,
  navBarPaths.checkMail,
  navBarPaths.createNewPassword,
];

export enum PaymentMethod {
  USDT = 'USDT',
  BITCOIN = 'Bitcoin',
  XRP = 'XRP',
  USDC = 'USDC',
}

export enum PbPayCoins {
  ADA = 'ADA',
  BTC = 'BTC',
  ETH = 'ETH',
  BCH = 'BCH',
  BNB = 'BNB',
  DASH = 'DASH',
  DOGE = 'DOGE',
  LTC = 'LTC',
  MATIC = 'MATIC_POLYGON_MUMBAI',
  SOL = 'SOL',
  TRX = 'TRX',
  USDC = 'USDC',
  USDT = 'USDT_ERC20',
  XRP = 'XRP',
}
