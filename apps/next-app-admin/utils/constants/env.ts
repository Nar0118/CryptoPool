export interface EnvVariables {
  nextPublicApiBaseUrl: string;
  custodialBaseUrl: string;
}

const env: EnvVariables = {
  nextPublicApiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080',
  custodialBaseUrl:
    process.env.NEXT_PUBLIC_CUSTODIAL_BASE_URL ?? 'http://localhost:8081',
};

export default env;
