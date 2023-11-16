export interface ChainInfo {
  rpcUrl,
  wsUrl,
  name,
  currency,
}

export const chains: { [key: number]: ChainInfo } = {
  5: {
    rpcUrl: "https://eth-goerli.g.alchemy.com/v2/0BqaJuVoB5TQEXNkQOuE8KqIlrepb2Kq",
    // wsUrl: "wss://goerli-light.eth.linkpool.io/ws",
    wsUrl: "wss://eth-goerli.g.alchemy.com/v2/0BqaJuVoB5TQEXNkQOuE8KqIlrepb2Kq",
    name: "Goerli testnet",
    currency: "ETH",
  }
}
