import getReadOnlyContractsContext from "../getReadOnlyContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { formatPriceBuffer } from "../../utils/formatter";

export default async function getPriceBuffer() {
  const ctx = await getReadOnlyContractsContext();
  const c = new Constants();
  const p = new Params();
  const priceBuffer = await ctx.priceManager.getPriceBuffer(
    c.ETH_USDC_MARKET_ID,
  );
  return formatPriceBuffer(priceBuffer);
}
