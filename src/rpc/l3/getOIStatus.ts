import getReadOnlyContractsContext from "../getReadOnlyContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { formatETH } from "../../utils/formatter";

export default async function getOIStatus() {
  const ctx = await getReadOnlyContractsContext();
  const c = new Constants();
  const p = new Params();
  const longOI = await ctx.globalState.getLongOpenInterest(
    c.ETH_USDC_MARKET_ID,
  );
  const shortOI = await ctx.globalState.getShortOpenInterest(
    c.ETH_USDC_MARKET_ID,
  );
  return [formatETH(longOI), formatETH(shortOI)];
}
