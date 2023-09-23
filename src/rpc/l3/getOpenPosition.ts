import getContractsContext from "../getContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";
import { formatPosition } from "../../utils/formatter";

export default async function getOpenPositionFormatted(
  xyz: string,
  trader: string,
  isLong: boolean,
  marketId: number,
  markPrice: number,
) {
  const ctx = await getContractsContext(xyz);
  const c = new Constants();
  const p = new Params();

  const key = await ctx.orderUtils._getPositionKey(
    trader,
    isLong,
    c.ETH_USDC_MARKET_ID, // marketId
  );

  const position = await ctx.positionVault.getPosition(key);

  return [formatPosition(position, markPrice)]; // TODO: getAllOpenPositions로 바꾸기
}
