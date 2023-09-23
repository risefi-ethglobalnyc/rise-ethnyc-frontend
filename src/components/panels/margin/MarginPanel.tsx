import { formatUsdString } from "@/utils/formatter";
import { useRecoilValue } from "recoil";
import { traderBalanceState } from "@/states/atoms";

export default function MarginPanel(props: {
  totalPnL: number;
  totalActiveMargin: number;
}) {
  const { totalPnL, totalActiveMargin } = props;
  const traderBalance = useRecoilValue(traderBalanceState);

  return (
    <div className="overflow-hidden pt-1 pb-6 bg-gray-900 shadow">
      {/* <div className="overflow-hidden h-1/6 bg-gray-900 shadow hover:bg-gray-600"> */}
      <div className="flex mt-2 justify-start mx-2 gap-x-1">
        <div className="text-gray-100 text-sm font-semibold">Margin Ratio</div>
      </div>

      <div className="flex mt-2 justify-between mx-2 gap-x-1">
        <div className="text-gray-400 text-xs font-normal">Margin Ratio</div>
        <div className="text-gray-100 text-xs font-normal">
          {formatUsdString((+totalActiveMargin / +traderBalance) * 100, 2)} %
        </div>
      </div>

      <div className="flex mt-2 justify-between mx-2 gap-x-1">
        <div className="text-gray-400 text-xs font-normal">Margin Balance</div>
        <div className="text-gray-100 text-xs font-normal">
          {formatUsdString(+traderBalance + +totalPnL, 3)} USDC
        </div>
      </div>
    </div>
  );
}
