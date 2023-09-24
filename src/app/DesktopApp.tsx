"use client";

import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  openPositionState,
  orderHistoryState,
  positionHistoryState,
  traderBalanceState,
  traderAddressShortState,
} from "@/states/atoms";

import { Notifications } from "@mantine/notifications";

import AppShellDesktop from "../components/appshells/desktop/AppShellDesktop";
import TableTabsDesktop from "@/components/tabletabs/desktop/TableTabsDesktop";
import TradingViewWidget from "@/components/tradingview/TradingViewWidget";
import TradingViewTickerTapeWidget from "@/components/tradingview/TradingViewTickerTapeWidget";
import PriceBoard from "@/components/boards/PriceBoard";
import OrderPanel from "@/components/panels/order/OrderPanel";
import AssetPanel from "@/components/panels/asset/AssetPanel";
import MarginPanel from "@/components/panels/margin/MarginPanel";
import LoaderComponent from "@/components/LoaderComponent";

import { getLatestBlockNumber } from "@/rpc/l3/getNetworkInfo";

import getOpenPositionFormatted from "@/rpc/l3/getOpenPosition";
import { getOrderHistoryFormatted } from "@/utils/getOrderHistory";
import getPositionRecordsFormatted from "@/rpc/l3/getPositionRecord";
import getTraderBalanceFormatted from "@/rpc/l3/getTraderBalance";

import SlideOver from "./SlideOver";

const statuses = {
  Verified: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c1",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c2",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c3",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c4",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c5",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c6",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c7",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },

  // More items...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DesktopApp() {
  const [isLoading, setIsLoading] = useState(true);

  const wsPrice = useRef<number>(0);
  const prevWsPrice = useRef<number>(0);
  const markPrice = useRef<number>(0);
  const prevMarkPrice = useRef<number>(0);

  const [blockNumber, setBlockNumber] = useState(0);

  const [totalActiveMargin, setTotalActiveMargin] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);

  // Action flags
  const [priceUpdateFlag, setPriceUpdateFlag] = useState(false);

  const [openPositionsCount, setOpenPositionsCount] = useState(0);
  const [openOrdersCount, setOpenOrdersCount] = useState(0); // not used yet

  // Recoil States
  const setOpenPosition = useSetRecoilState(openPositionState);
  const setOrderHistory = useSetRecoilState(orderHistoryState);
  const setPositionHistory = useSetRecoilState(positionHistoryState);
  const setTraderBalance = useSetRecoilState(traderBalanceState);
  const setTraderAddressShort = useSetRecoilState(traderAddressShortState);

  // slide over
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const _getLatestBlockNumber = async () => {
      const data = await getLatestBlockNumber();
      setBlockNumber(data);
    };
    _getLatestBlockNumber();
  }, []);

  useEffect(() => {
    const traderAddress = localStorage.getItem("traderAddress");
    const xyz = localStorage.getItem("xyz");
    const marketId = 1;
    const getOpenPositionsFormatted = async () => {
      if (!traderAddress || !xyz) {
        return;
      }

      let totalPnL = 0;
      let totalMargin = 0;
      // TODO; iteration for all markets
      // long
      let longOpenPositionsFormatted = await getOpenPositionFormatted(
        xyz,
        traderAddress,
        true,
        marketId,
        +markPrice.current,
      );
      if (+longOpenPositionsFormatted[0].size <= 0) {
        // FIXME: select proper market from the list, not the first one
        longOpenPositionsFormatted = [];
      }

      // short
      let shortOpenPositionsFormatted = await getOpenPositionFormatted(
        xyz,
        traderAddress,
        false,
        marketId,
        +markPrice.current,
      );
      if (+shortOpenPositionsFormatted[0].size <= 0) {
        shortOpenPositionsFormatted = [];
      }

      const openPositionsFormatted = longOpenPositionsFormatted.concat(
        shortOpenPositionsFormatted,
      );
      for (let i = 0; i < openPositionsFormatted.length; i += 1) {
        const position = openPositionsFormatted[i];
        const { pnl, margin } = position;
        pnl ? (totalPnL += +pnl) : (totalPnL += 0);
        margin ? (totalMargin += +margin) : (totalMargin += 0);
      }
      setOpenPosition(openPositionsFormatted); // recoil

      setOpenPositionsCount(openPositionsFormatted.length);
      setTotalPnL(totalPnL);
      setTotalActiveMargin(totalMargin);
    };
    getOpenPositionsFormatted();
  }, []);

  useEffect(() => {
    console.log(">>> Desktop::useEffect::getOrderHistory");
    const _getOrderHistory = async () => {
      const orderHistory = await getOrderHistoryFormatted();
      setOrderHistory(orderHistory);
    };
    _getOrderHistory();
  }, []);

  useEffect(() => {
    console.log(">>> Desktop::useEffect::getPositionHistory");
    const _getPositionHistory = async () => {
      const positionHistory = await getPositionRecordsFormatted();
      setPositionHistory(positionHistory);
    };
    _getPositionHistory();
  }, []);

  useEffect(() => {
    const traderAddress = localStorage.getItem("traderAddress");
    if (!traderAddress) {
      return;
    }

    getTraderBalanceFormatted(traderAddress).then((traderBalance) => {
      setTraderBalance(traderBalance);
    });

    setTraderAddressShort(
      traderAddress.slice(0, 6) + "..." + traderAddress.slice(-4),
    );
  }, []);

  // function DesktopApp() {}

  return (
    <div>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <div>
          <Notifications />
          <div className="min-h-screen overflow-auto scrollbar-hide">
            <AppShellDesktop
              blockNumber={blockNumber}
              currentPageName={"Trade"}
            />
            <div className="grid grid-cols-6 gap-0.5 justify-items-stretch items-stretch">
              <SlideOver open={slideOverOpen} setOpen={setSlideOverOpen} />
              <div className="col-span-6 justify-center">
                <div className="flex flex-col items-center justify-start gap-x-4 gap-y-4 bg-gray-800 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
                  <div className="flex items-center gap-x-3">
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <h1 className="flex gap-x-3 text-base leading-7">
                      <span className="font-semibold text-white">
                        Price Feed Status
                      </span>
                    </h1>
                  </div>
                  <div className="flex flex-row items-center gap-1 text-gray-100">
                    <div className="order-first flex-none rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                      ETH/USDC
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="col-span-1">
                    <PriceBoard
                      wsPrice={wsPrice}
                      prevWsPrice={prevWsPrice}
                      markPrice={markPrice}
                      prevMarkPrice={prevMarkPrice}
                      priceUpdateFlag={priceUpdateFlag}
                      setPriceUpdateFlag={setPriceUpdateFlag}
                    />
                  </div>
                  <div className="col-span-1 mr-5 mb-4">
                    <div className="grid grid-cols-2">
                      <div className="mr-2.5">
                        <AssetPanel totalPnL={totalPnL} />
                      </div>
                      <div className="ml-2.5">
                        <OrderPanel
                          wsPrice={wsPrice}
                          markPrice={markPrice}
                          totalPnL={totalPnL}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <TradingViewWidget x={19} y={8} /> */}
                </div>
                <TableTabsDesktop
                  wsPrice={wsPrice}
                  markPrice={markPrice}
                  openPositionsCount={openPositionsCount}
                  openOrdersCount={openOrdersCount}
                />
                {/* Activity list */}
                <div className="border-t border-white/10 pt-11">
                  <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
                    Price Data Integrity Proof
                  </h2>
                  <table className="mt-6 w-full whitespace-nowrap text-left">
                    <colgroup>
                      <col className="w-full sm:w-2/12" />
                      <col className="lg:w-2/12" />
                      <col className="lg:w-3/12" />
                      <col className="lg:w-3/12" />
                      <col className="lg:w-2/12" />
                    </colgroup>
                    <thead className="border-b border-white/10 text-sm leading-6 text-white">
                      <tr>
                        <th
                          scope="col"
                          className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                        >
                          Tx Id
                        </th>
                        <th
                          scope="col"
                          className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
                        >
                          Mark Price
                        </th>
                        <th
                          scope="col"
                          className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                        >
                          Proving Key
                        </th>
                        <th
                          scope="col"
                          className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                        >
                          Data Integrity Status
                        </th>

                        <th
                          scope="col"
                          className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                        >
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activityItems.map((item) => (
                        <tr
                          key={item.commit}
                          className="hover:bg-gray-700"
                          onClick={() => setSlideOverOpen(true)}
                        >
                          <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                            <div className="flex items-center gap-x-4">
                              <div className="truncate text-sm font-normal leading-6 text-gray-400">
                                {item.tx_id}
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                            {item.mark_price}
                          </td>
                          <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                            <div className="flex gap-x-3">
                              <div className="font-mono text-sm leading-6 text-gray-400">
                                {item.commit}
                              </div>
                              <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                                {item.branch}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                            <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                              <time
                                className="text-gray-400 sm:hidden"
                                dateTime={item.dateTime}
                              >
                                {item.date}
                              </time>
                              <div
                                className={classNames(
                                  statuses[item.status],
                                  "flex-none rounded-full p-1",
                                )}
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                              </div>
                              <div className="hidden text-white sm:block">
                                {item.status} (3/3)
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                            <time dateTime={item.dateTime}>
                              {item.dateTime}
                            </time>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="col-span-1 justify-center divide-y divide-gray-600">
                <OrderPanel
                  wsPrice={wsPrice}
                  markPrice={markPrice}
                  totalPnL={totalPnL}
                />
                <AssetPanel totalPnL={totalPnL} />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
