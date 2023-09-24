import { Network } from "../../utils/network";
import { getContract } from "../../utils/getContract";
import getPresetAddress from "../../utils/getPresetAddress";
import getContractAddress from "../../utils/getContractAddress";

// check test USDC balance on L2

async function main() {
  // ========================= Set Contract  =========================
  const testUsdc = await getContract("token", "TestUSDC", Network.L3);
  // ==================== Call Contract Functions ====================

  const deployer = getPresetAddress("deployer");
  const l2Vault = getContractAddress("L2Vault", Network.L2);

  const tokenSymbol = await testUsdc.symbol();

  // =================================================================
}

main().catch((error) => {
  process.exitCode = 1;
});
