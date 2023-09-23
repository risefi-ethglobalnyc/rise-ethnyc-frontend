import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { traderBalanceState } from "@/states/atoms";

import FaucetModal from "../order/FaucetModal";
import WithdrawModal from "./WithdrawModal";
import { formatUsdString } from "@/utils/formatter";
import getTraderBalanceFormatted from "@/rpc/l3/getTraderBalance";

export default function AssetPanel(props: { totalPnL: number }) {
  const { totalPnL } = props;
  const traderBalance = useRecoilValue(traderBalanceState);

  // Modal control
  const [openFaucetModal, setOpenFaucetModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);

  let traderAddress = "";
  let xyz = "";

  // SSR
  if (typeof window !== "undefined") {
    traderAddress = localStorage.getItem("traderAddress") as string;
    xyz = localStorage.getItem("xyz") as string;
  }

  return (
    <div className="overflow-hidden pt-1 pb-6 bg-gray-900 shadow">
      {/* <div className="overflow-hidden h-1/6 bg-gray-900 shadow hover:bg-gray-600"> */}
      <FaucetModal
        openFaucetModal={openFaucetModal}
        setOpenFaucetModal={setOpenFaucetModal}
        xyz={xyz}
        traderAddress={traderAddress}
      />
      <WithdrawModal
        openWithdrawModal={openWithdrawModal}
        setOpenWithdrawModal={setOpenWithdrawModal}
      />
      <div className="flex mt-2 justify-start mx-2 gap-x-1">
        <div className="text-gray-100 text-sm font-semibold">Assets</div>
      </div>
      <div className="flex mt-2 justify-between mx-2 gap-x-1">
        <div className="text-gray-400 text-xs font-normal">Balance</div>
        <div className="text-gray-100 text-xs font-normal">
          {formatUsdString(+traderBalance, 3)} USDC
        </div>
      </div>
      <div className="flex mt-2 justify-between mx-2 gap-x-1">
        <div className="text-gray-400 text-xs font-normal">Unrealized PnL</div>
        <div className="text-gray-100 text-xs font-normal">
          {formatUsdString(+totalPnL, 3)} USDC
        </div>
      </div>
      <div className="flex mt-5 justify-center mx-2 gap-x-1">
        <button
          type="button"
          className="rounded w-1/2  bg-blue-500 py-1 text-xs font-normal text-white shadow-sm hover:bg-blue-400 active:bg-blue-600"
          onClick={() => setOpenFaucetModal(true)}
        >
          USDC Faucet
        </button>
        <button
          type="button"
          className="rounded w-1/2 bg-white/10 py-3/4 text-xs font-normal text-white shadow-sm hover:bg-white/20 active:bg-white/5"
          onClick={() => setOpenWithdrawModal(true)}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}
