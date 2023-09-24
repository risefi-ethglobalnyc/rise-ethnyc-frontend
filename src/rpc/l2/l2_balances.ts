import { Network } from "../../utils/network";
import { getContract } from "../../utils/getContract";
import getPresetAddress from "../../utils/getPresetAddress";

// check test USDC balance on L2

async function main() {
  // ========================= Set Contract  =========================
  const testUsdc = await getContract("token", "TestUSDC", Network.L3);
  // ==================== Call Contract Functions ====================

  const deployer = getPresetAddress("deployer");

  // =================================================================
}

main().catch((error) => {
  process.exitCode = 1;
});
