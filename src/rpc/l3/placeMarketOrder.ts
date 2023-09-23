/* eslint-disable object-shorthand */
import { ethers } from "ethers";
import getContractsContext from "../getContractsContext";
import Constants from "../../utils/constants";
import Params from "../../utils/params";

/// note: test only
export async function placeMarketOrder(
  xyz: string,
  trader: string,
  sizeAbs: string,
  marginAbs: string,
  isLong: boolean,
  isIncrease: boolean,
) {
  const ctx = await getContractsContext(xyz);
  const c = new Constants();
  const p = new Params();

  const orderRequest = {
    trader: trader,
    isLong: isLong,
    isIncrease: isIncrease,
    orderType: 0, // market order
    marketId: c.ETH_USDC_MARKET_ID,
    sizeAbs: ethers.utils.parseUnits(sizeAbs, c.ETH_DECIMALS),
    marginAbs: ethers.utils.parseUnits(marginAbs, c.USDC_DECIMALS),
    limitPrice: 0,
  };
  console.log("orderRequest", orderRequest);
  console.log(">>> orderRouter: ", ctx.orderRouter);
  const tx = await ctx.orderRouter.placeMarketOrder(orderRequest);
  console.log(">>> checkpoint 4");
  await tx.wait();
  console.log(">>> checkpoint 5");

  console.log("tx", tx);

  return tx;
}

export async function placeCloseMarketOrder(
  xyz: string,
  trader: string,
  sizeAbs: string,
  marginAbs: string,
  isLong: boolean,
  isIncrease: boolean,
) {
  const ctx = await getContractsContext(xyz);
  const c = new Constants();
  const p = new Params();

  const orderRequest = {
    trader: trader,
    isLong: isLong,
    isIncrease: isIncrease,
    orderType: 0, // market order
    marketId: c.ETH_USDC_MARKET_ID,
    sizeAbs: ethers.BigNumber.from(sizeAbs),
    marginAbs: ethers.BigNumber.from(marginAbs),
    limitPrice: 0,
  };

  const tx = await ctx.orderRouter.placeMarketOrder(orderRequest);
  await tx.wait();
  return tx;
}
