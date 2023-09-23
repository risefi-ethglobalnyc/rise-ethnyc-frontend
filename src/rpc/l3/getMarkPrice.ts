import getContractsContext from "../getContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { formatUSDC } from "../../utils/formatter";

export default async function getMarkPriceFormatted(xyz: string) {
  const ctx = await getContractsContext(xyz);
  const c = new Constants();
  const p = new Params();
  const markPrice = await ctx.priceFetcher._getMarkPrice(c.ETH_USDC_MARKET_ID);
  return formatUSDC(markPrice);
}
