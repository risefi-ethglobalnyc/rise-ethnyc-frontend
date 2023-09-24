import { ethers } from "ethers";
import { Network } from "../../utils/network";
import { getContract } from "../../utils/getContract";
import getPresetAddress from "../../utils/getPresetAddress";
import getContractAddress from "../../utils/getContractAddress";

async function main() {
  // ========================= Set Contract  =========================
  const testUsdc = await getContract("token", "TestUSDC", Network.L3);
  // ==================== Call Contract Functions ====================

  const deployer = getPresetAddress("deployer");
  const l2Vault = getContractAddress("L2Vault", Network.L2);
  const tokenSymbol = await testUsdc.symbol();

  const _amount = ethers.utils.parseEther("300000");

  const tx = await testUsdc.approve(l2Vault, _amount); // _spender, _value
  tx.wait();

  // =================================================================
}

main().catch((error) => {
  process.exitCode = 1;
});
