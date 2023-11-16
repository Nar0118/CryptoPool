export interface EnvVariables {
  nextPublicApiBaseUrl: string;
  custodialBaseUrl: string;
  web3Provider: string;
  googleApiKey: string;
  supportEmailAddress: string;
  merchantIdentificationToken: string;
}

const env: EnvVariables = {
  nextPublicApiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080',
  custodialBaseUrl:
    process.env.NEXT_PUBLIC_CUSTODIAL_BASE_URL ?? 'http://localhost:8081',
  web3Provider:
    process.env.WEB3_PROVIDER ??
    'https://eth-goerli.g.alchemy.com/v2/fhoMkdYwgRymdjo6RSWu-VDBkf0CCEtC',
  googleApiKey: process.env.GOOGLE_AUTH_CLIENT_ID ?? '',
  supportEmailAddress:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@cryptopool.money',
  merchantIdentificationToken:
    process.env.NEXT_PUBLIC_MERCHANT_IDENTIFICATION_TOKEN,
};

export default env;
