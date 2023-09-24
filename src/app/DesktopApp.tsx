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
              <div className="col-span-5 justify-center">
                <PriceBoard
                  wsPrice={wsPrice}
                  prevWsPrice={prevWsPrice}
                  markPrice={markPrice}
                  prevMarkPrice={prevMarkPrice}
                  priceUpdateFlag={priceUpdateFlag}
                  setPriceUpdateFlag={setPriceUpdateFlag}
                />
                {/* <TradingViewWidget x={19} y={8} /> */}
                <TableTabsDesktop
                  wsPrice={wsPrice}
                  markPrice={markPrice}
                  openPositionsCount={openPositionsCount}
                  openOrdersCount={openOrdersCount}
                />
              </div>
              <div className="col-span-1 justify-center divide-y divide-gray-600">
                <OrderPanel
                  wsPrice={wsPrice}
                  markPrice={markPrice}
                  totalPnL={totalPnL}
                />
                <AssetPanel totalPnL={totalPnL} />
                {/* <MarginPanel
                  totalPnL={totalPnL}
                  totalActiveMargin={totalActiveMargin}
                /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
