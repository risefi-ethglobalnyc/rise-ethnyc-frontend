import { useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { traderBalanceState } from "@/states/atoms";

import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ethers } from "ethers";

import {
  OpenPositionFormatted,
  formatETH,
  formatUsdString,
} from "@/utils/formatter";
// import getOpenPositionFormatted from "@/rpc/l3/getOpenPosition";
import _setIndexPrice from "@/rpc/l3/_setIndexPrice";
import { placeCloseMarketOrder } from "@/rpc/l3/placeMarketOrder";
import {
  openPositionState,
  orderHistoryState,
  positionHistoryState,
} from "@/states/atoms";
import { getOrderHistoryFormatted } from "@/utils/getOrderHistory";
import getPositionRecordsFormatted from "@/rpc/l3/getPositionRecord";

interface OpenPositionBoardProps {
  wsPrice: React.MutableRefObject<number>;
  markPrice: React.MutableRefObject<number>;
}

export default function OpenPositionBoardDesktop(
  props: OpenPositionBoardProps,
) {
  const { wsPrice, markPrice } = props;
  const traderBalance = useRecoilValue(traderBalanceState);

  const baseTokenSymbol = "ETH";

  const openPositions = useRecoilValue(openPositionState);

  const closeLongSize = useRef("abc");
  const closeLongMargin = useRef("abc");
  const closeShortSize = useRef("abc");
  const closeShortMargin = useRef("abc");
  const setOrderHistory = useSetRecoilState(orderHistoryState);
  const setPositionHistory = useSetRecoilState(positionHistoryState);

  const closeLongPosition = async () => {
    try {
      let traderAddress;
      let xyz;

      // SSR
      if (typeof window !== "undefined") {
        traderAddress = localStorage.getItem("traderAddress") as string;
        xyz = localStorage.getItem("xyz") as string;
      }
      if (!traderAddress || !xyz) {
        return;
      }

      const setPriceTx = await _setIndexPrice(xyz, wsPrice.current.toString());
      await setPriceTx.wait();

      // wait for 50 ms // TODO: check if this is necessary
      await new Promise((resolve) => setTimeout(resolve, 50));

      const tx = await placeCloseMarketOrder(
        xyz,
        traderAddress,
        closeLongSize.current,
        closeLongMargin.current,
        true,
        false,
      );

      notifications.show({
        id: "close-order-submission",
        title: "Close Order Submitted",
        message: `Close Long: ${(+formatETH(
          ethers.BigNumber.from(closeLongSize.current),
        )).toFixed(2)}${baseTokenSymbol}`,
        loading: true,
        autoClose: false,
      });
      await tx.wait();

      getOrderHistoryFormatted().then((orderHistoryFormatted) => {
        setOrderHistory(orderHistoryFormatted);
      });
      getPositionRecordsFormatted().then((positionRecordsFormatted) => {
        setPositionHistory(positionRecordsFormatted);
      });
      notifications.update({
        id: "close-order-submission",
        withCloseButton: true,
        title: `Order Placed`,
        message: `Close Long: ${(+formatETH(
          ethers.BigNumber.from(closeLongSize.current),
        )).toFixed(2)}${baseTokenSymbol}`,
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    } catch (e) {
      notifications.show({
        id: "close-order-submission",
        title: "Tx Failed",
        message: `Error: ${e}`,
        icon: <IconX size="1rem" />,
        autoClose: 2000,
      });
    }
  };

  const closeShortPosition = async () => {
    try {
      const traderAddress = localStorage.getItem("traderAddress") as string;
      const xyz = localStorage.getItem("xyz") as string;
      if (!traderAddress || !xyz) {
        return;
      }

      const setPriceTx = await _setIndexPrice(xyz, wsPrice.current.toString());
      await setPriceTx.wait();
      const tx = await placeCloseMarketOrder(
        xyz,
        traderAddress,
        closeShortSize.current,
        closeShortMargin.current,
        false,
        false,
      );
      notifications.show({
        id: "close-order-submission",
        title: "Close Order Submitted",
        message: `Close Short: ${(+formatETH(
          ethers.BigNumber.from(closeShortSize.current),
        )).toFixed(2)}${baseTokenSymbol}`,
        loading: true,
        autoClose: false,
      });
      await tx.wait();
      notifications.update({
        id: "close-order-submission",
        withCloseButton: true,
        title: `Order Placed`,
        message: `Close Short: ${(+formatETH(
          ethers.BigNumber.from(closeShortSize.current),
        )).toFixed(2)}${baseTokenSymbol}`,
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    } catch (e) {
      notifications.show({
        id: "close-order-submission",
        title: "Tx Failed",
        message: `Error: ${e}`,
        icon: <IconX size="1rem" />,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg">
      <div className="px-2 sm:px-4 lg:px-4">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-600">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-2 text-left text-xs font-semibold text-gray-400"
                    >
                      Market
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Side
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Entry Price
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Mark Price
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Margin Ratio
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Margin
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      PnL(ROE %)
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-100"
                    >
                      Close All Positions
                    </th>
                    <th
                      scope="col"
                      className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600 bg-gray-900">
                  {openPositions.map(
                    (position: OpenPositionFormatted, idx: number) => {
                      const marginRatioString = (
                        (+position.margin / +traderBalance) *
                        100
                      ).toFixed(2);
                      const pnlString = parseFloat(
                        position.pnl.toString(),
                      ).toFixed(1);

                      const roe = position.isLong
                        ? ((+markPrice.current - +position.avgOpenPrice) *
                            +position.size *
                            100) /
                          +position.margin
                        : (-1 *
                            (+markPrice.current - +position.avgOpenPrice) *
                            +position.size *
                            100) /
                          +position.margin;
                      const roeString = roe.toFixed(2);
                      return (
                        <tr key={idx} className="text-gray-300 text-xs">
                          <td key={"Market"} className="px-2 py-3.5">
                            ETH/USDC
                          </td>
                          <td
                            key={"Side"}
                            className={
                              (position.isLong ? "text-long" : "text-short") +
                              " px-2 py-3.5"
                            }
                          >
                            {position.isLong ? "Long" : "Short"}
                          </td>
                          <td
                            key={"Size"}
                            className={
                              (position.isLong ? "text-long" : "text-short") +
                              " px-2 py-3.5"
                            }
                          >
                            {formatUsdString(+position.size, 2)} ETH
                          </td>
                          <td key={"Avg Open Price"} className="px-2 py-3.5">
                            {(+position.avgOpenPrice).toFixed(1)}
                          </td>
                          <td key={"Mark Price"} className="px-2 py-3.5">
                            {(+markPrice.current).toFixed(1)}
                          </td>
                          <td key={"Margin Ratio"} className="px-2 py-3.5">
                            {marginRatioString} %
                          </td>
                          <td key={"Margin"} className="px-2 py-3.5">
                            {formatUsdString(+position.margin, 1)} USDC
                          </td>
                          <td
                            key={"PnL(ROE %)"}
                            className={
                              (+pnlString > 0
                                ? "text-long"
                                : +pnlString < 0
                                ? "text-short"
                                : "text-gray-100") + " px-2 py-3.5"
                            }
                          >
                            {formatUsdString(+pnlString, 1)} USDC
                            <br /> ({roeString} %)
                          </td>
                          <td
                            key={"Close All Positions"}
                            className="px-2 py-3.5"
                          >
                            <button
                              className="text-xs text-gray-400 hover:text-gray-100 underline"
                              onClick={async () => {
                                if (position.isLong) {
                                  closeLongSize.current =
                                    position.sizeBN.toString();
                                  closeLongMargin.current =
                                    position.marginBN.toString();
                                  await closeLongPosition();
                                } else {
                                  closeShortSize.current =
                                    position.sizeBN.toString();
                                  closeShortMargin.current =
                                    position.marginBN.toString();
                                  await closeShortPosition();
                                }
                              }}
                            >
                              Market
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
