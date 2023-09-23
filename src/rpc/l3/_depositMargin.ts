import getContractsContext from "../getContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { parseUSDC } from "../../utils/formatter";

export default async function _depositMargin(
  xyz: string,
  trader: string,
  amount: string,
) {
  const ctx = await getContractsContext(xyz);
  const c = new Constants();
  const p = new Params();

  const tx = await ctx.traderVault.increaseTraderBalance(
    trader,
    c.USDC_ID,
    parseUSDC(amount),
  );
  return tx;
}
