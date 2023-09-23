import getContractsContext from "../getContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { parseUSDC } from "../../utils/formatter";

export default async function _setIndexPrice(xyz: string, price: string) {
  const ctx = await getContractsContext(xyz);
  const c = new Constants();
  const p = new Params();
  console.log(">>> checkpoint 1");

  const tx = await ctx.priceManager.setPrice(
    c.ETH_USDC_MARKET_ID,
    parseUSDC(price),
  );
  console.log(">>> checkpoint 2");

  return tx;
}
