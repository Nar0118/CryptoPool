import { PbPayCoins } from './contracts';

export interface EnvVariables {
  databaseConnectionUrl: string;
  currency: string;
  nextPublicApiBaseUrl: string;
  port: number;
}

// const env: EnvVariables = {
//   databaseConnectionUrl: process.env.DATABASE_CONNECTION_URL,
//   port: Number(process.env.PORT),
//   currency: process.env.CURRENCY,
// };

const env: EnvVariables = {
  databaseConnectionUrl:
    'mongodb+srv://cryptopooltesting:mMcQaDI6qA82jSFn@cryptopool.lcyfymz.mongodb.net/?retryWrites=true&w=majority',
  currency: PbPayCoins.USDT,
  nextPublicApiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.cryptopool.money',
  port: 8081,
};

export default env;
