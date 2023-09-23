import { ethers } from "ethers";
import { Network } from "../../utils/network";
import { getContract } from "../../utils/getContract";

async function main() {
  // ========================= Set Contract  =========================

  const l2MarginGateway = await getContract(
    "crosschain",
    "L2MarginGateway",
    Network.L2,
  );

  // ==================== Call Contract Functions ====================

  const gasParams = {
    _maxSubmissionCost: ethers.utils.parseEther("0.01"),
    _gasLimit: ethers.BigNumber.from("3000000"),
    _gasPriceBid: ethers.BigNumber.from("150000000"),
  };

  const _callValue = gasParams._maxSubmissionCost.add(
    gasParams._gasLimit.mul(gasParams._gasPriceBid),
  );

  const tx = await l2MarginGateway.triggerWithdrawalFromL2(
    0, // _assetId (0: tUSDC)
    ethers.utils.parseEther("1500"), // _withdrawAmount (1500 tUSDC)
    gasParams,
    {
      value: _callValue, // msg.value = maxSubmissionCost + (gasLimit * gasPriceBid) = 0.01 + 0.00045 = 0.01045 ETH
      gasLimit: ethers.BigNumber.from("3000000"),
    },
  );
  tx.wait();

  // =================================================================
}

main().catch((error) => {
  process.exitCode = 1;
});
