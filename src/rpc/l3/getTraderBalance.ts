import getReadOnlyContractsContext from "../getReadOnlyContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { formatUSDC } from "../../utils/formatter";

/// note: test only
export default async function getTraderBalanceFormatted(trader: string) {
  const ctx = await getReadOnlyContractsContext();
  const c = new Constants();
  const p = new Params();

  const traderBalance = await ctx.traderVault.getTraderBalance(
    trader,
    c.USDC_ID,
  );

  return +formatUSDC(traderBalance);
}
