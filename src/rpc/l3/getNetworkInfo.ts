import { ethers } from "ethers";

export async function getChainId() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.risefinance.io",
  );
  const network = await provider.getNetwork();
  return network.chainId;
}

export async function getLatestBlockNumber() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.risefinance.io",
  );
  const blockNumber = await provider.getBlockNumber();
  return blockNumber;
}
