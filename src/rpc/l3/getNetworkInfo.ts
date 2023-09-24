import { ethers } from "ethers";

export async function getChainId() {
  const provider = new ethers.providers.JsonRpcProvider(
    // "https://rpc.risefinance.io",
    "https://goerli-rollup.arbitrum.io/rpc",
  );
  const network = await provider.getNetwork();
  return network.chainId;
}

export async function getLatestBlockNumber() {
  const provider = new ethers.providers.JsonRpcProvider(
    // "https://rpc.risefinance.io",
    "https://goerli-rollup.arbitrum.io/rpc",
  );
  const blockNumber = await provider.getBlockNumber();
  return blockNumber;
}
