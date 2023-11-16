export interface EnvVariables {
  databaseConnectionUrl: string;
  secretJwtCode: string;
  defaultEmail: string;
  defaultEmailPassword: string;
  clientId: string;
  port: number;
  custodialBaseUrl: string;
  web3Provider: string;
  deployedFrontendUrl: string;
  etherscanApiUrl: string;
  isPbpay: boolean;
  apiSelfBaseUrl: string;
}

// const env: EnvVariables = {
//   databaseConnectionUrl:
//     process.env.DATABASE_CONNECTION_URL ?? 'mongodb://localhost:27017',
//   secretJwtCode: process.env.SECRET_JWT_CODE ?? 'asl;dihf8#@GyOp',
//   defaultEmail: process.env.DEFAULT_EMAIL ?? 'cryptopooltesting@gmail.com',
//   defaultEmailPassword:
//     process.env.DEFAULT_EMAIL_PASSWORD ?? 'mmkgopxdgpikmixv',
//   port: Number(process.env.PORT) ?? 8080,
//   clientId: process.env.CLIENT_ID ?? '',
//   custodialBaseUrl:
//     process.env.NEXT_PUBLIC_CUSTODIAL_BASE_URL ?? 'http://localhost:8081',
//   web3Provider:
//     process.env.WEB3_PROVIDER ??
//     'https://eth-goerli.g.alchemy.com/v2/fhoMkdYwgRymdjo6RSWu-VDBkf0CCEtC',
//   deployedFrontendUrl:
//     process.env.DEPLOYED_FRONTEND_URL ?? 'http://localhost:4200',
//   etherscanApiUrl:
//     process.env.ETHERSCAN_API_URL ??
//     'https://api.etherscan.io/api?apikey=2UPTKBWZHZ946WGGSB55AVSHJ8Q4RN4RVS',
//   isPbpay: !process.env.IS_PBPAY ? true : process.env.IS_PBPAY === 'true',
// };

const env: EnvVariables = {
  databaseConnectionUrl:
    'mongodb+srv://cryptopooltesting:mMcQaDI6qA82jSFn@cryptopool.lcyfymz.mongodb.net/?retryWrites=true&w=majority',
  secretJwtCode: 'asl;dihf8#@GyOp',
  defaultEmail: 'transactions.cryptopool@gmail.com',
  defaultEmailPassword: 'txwwgjfslnxuywqx',
  port: 8080,
  custodialBaseUrl: 'https://custodial.cryptopool.money',
  apiSelfBaseUrl: 'https://api.cryptopool.money',
  web3Provider:
    'https://eth-goerli.g.alchemy.com/v2/fhoMkdYwgRymdjo6RSWu-VDBkf0CCEtC',
  deployedFrontendUrl: 'https://ricky.cryptopool.money',
  etherscanApiUrl:
    'https://api.etherscan.io/api?apikey=2UPTKBWZHZ946WGGSB55AVSHJ8Q4RN4RVS',
  isPbpay: true,
  clientId: process.env.CLIENT_ID ?? '',
};

export default env;
