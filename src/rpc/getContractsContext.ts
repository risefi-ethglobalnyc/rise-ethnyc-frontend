import { getContract, getLibrary } from "../utils/getContract";
import getContractAddress from "../utils/getContractAddress";
import getPresetAddress from "../utils/getPresetAddress";
import { Network } from "../utils/network";

export default async function getContractsContext(xyz: string) {
  const mathUtils = await getLibrary("utils", "MathUtils", Network.L3, xyz);
  const orderUtils = await getLibrary("order", "OrderUtils", Network.L3, xyz);
  const positionUtils = await getLibrary(
    "position",
    "PositionUtils",
    Network.L3,
    xyz,
  );
  const pnlUtils = await getLibrary("position", "PnlUtils", Network.L3, xyz);

  const wethAddress = await getPresetAddress("WETH");
  const testUSDCAddress = await getContractAddress("TestUSDC", Network.L3);

  const traderVault = await getContract(
    "account",
    "TraderVault",
    Network.L3,
    false,
    xyz,
  );
  const market = await getContract("market", "Market", Network.L3, false, xyz);
  const tokenInfo = await getContract(
    "market",
    "TokenInfo",
    Network.L3,
    false,
    xyz,
  );
  const listingManager = await getContract(
    "market",
    "ListingManager",
    Network.L3,
    false,
    xyz,
  );
  const risePool = await getContract(
    "risepool",
    "RisePool",
    Network.L3,
    false,
    xyz,
  );
  const globalState = await getContract(
    "global",
    "GlobalState",
    Network.L3,
    false,
    xyz,
  );
  const priceManager = await getContract(
    "price",
    "PriceManager",
    Network.L3,
    false,
    xyz,
  );
  const priceFetcher = await getContract(
    "order",
    "PriceFetcher",
    Network.L3,
    false,
    xyz,
  );
  const positionVault = await getContract(
    "position",
    "PositionVault",
    Network.L3,
    false,
    xyz,
  );
  const orderHistory = await getContract(
    "order",
    "OrderHistory",
    Network.L3,
    false,
    xyz,
  );
  const positionHistory = await getContract(
    "position",
    "PositionHistory",
    Network.L3,
    false,
    xyz,
  );
  const marketOrder = await getContract(
    "order",
    "MarketOrder",
    Network.L3,
    false,
    xyz,
  );
  const orderRouter = await getContract(
    "order",
    "OrderRouter",
    Network.L3,
    false,
    xyz,
  );
  return {
    mathUtils,
    positionUtils,
    orderUtils,
    pnlUtils,
    wethAddress,
    testUSDCAddress,
    traderVault,
    market,
    tokenInfo,
    listingManager,
    risePool,
    globalState,
    priceManager,
    priceFetcher,
    positionVault,
    orderHistory,
    positionHistory,
    marketOrder,
    orderRouter,
  };
}
