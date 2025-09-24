export type Network = "mainnet" | "testnet" | "devnet" ;

export const rpcUrls: Record<Network, string> = {
  mainnet: process.env.PUBLIC_RPC_MAINNET || "https://api.mainnet-beta.solana.com",
  testnet: process.env.PUBLIC_RPC_TESTNET || "https://api.testnet.solana.com",
  devnet:  process.env.NEXT_PUBLIC_RPC_DEVNET || "https://api.devnet.solana.com"
};