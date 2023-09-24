import { getContract } from "../utils/getContract";
import getContractAddress from "../utils/getContractAddress";
import getPresetAddress from "../utils/getPresetAddress";
import { Network } from "../utils/network";

export default async function getReadOnlyContractsContext() {
  const wethAddress = await getPresetAddress("WETH");
  const testUSDCAddress = await getContractAddress("TestUSDC", Network.L3);

  const traderVault = await getContract(
    "account",
    "TraderVault",
    Network.L3,
    false,
  );
  const market = await getContract("market", "Market", Network.L3, false);
  const tokenInfo = await getContract("market", "TokenInfo", Network.L3, false);
  const risePool = await getContract("risepool", "RisePool", Network.L3, false);
  const globalState = await getContract(
    "global",
    "GlobalState",
    Network.L3,
    false,
  );
  const priceManager = await getContract(
    "price",
    "PriceManager",
    Network.L3,
    false,
  );
  const priceFetcher = await getContract(
    "order",
    "PriceFetcher",
    Network.L3,
    false,
  );
  const positionVault = await getContract(
    "position",
    "PositionVault",
    Network.L3,
    false,
  );
  const orderHistory = await getContract(
    "order",
    "OrderHistory",
    Network.L3,
    false,
  );
  const positionHistory = await getContract(
    "position",
    "PositionHistory",
    Network.L3,
    false,
  );
  return {
    wethAddress,
    testUSDCAddress,
    traderVault,
    market,
    tokenInfo,
    risePool,
    globalState,
    priceManager,
    priceFetcher,
    positionVault,
    orderHistory,
    positionHistory,
  };
}
