import { PositionRecordFormatted, formatUsdString } from "@/utils/formatter";
import { useRecoilValue } from "recoil";
import { positionHistoryState } from "@/states/atoms";

export default function PositionHistoryBoardDesktop() {
  const positionHistory = useRecoilValue(positionHistoryState);

  const marketName = "ETH/USDC";
  const baseAssetName = "ETH";
  const quoteAssetName = "USDC";

  return (
    <div className="bg-gray-900">
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
                      Status
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      PnL (USDC)
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Max Size
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Avg Open Price
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Avg Close Price
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Opened At
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Closed At
                    </th>
                  </tr>
                </thead>
                {/* Desktop */}
                <tbody className="divide-y divide-gray-600 bg-gray-900">
                  {positionHistory.map(
                    (position: PositionRecordFormatted, idx: number) => {
                      return (
                        <tr key={idx} className="text-gray-300 text-xs">
                          <td key={"Market"} className="px-2 py-3.5">
                            {marketName}
                          </td>
                          <td key={"Status"} className="px-2 py-3.5">
                            {position.isClosed ? "closed" : "open"}
                          </td>
                          <td
                            key={"PnL"}
                            className={
                              (+position.cumulativeRealizedPnl > 0
                                ? "text-long"
                                : +position.cumulativeRealizedPnl < 0
                                ? "text-short"
                                : "text-gray-100") + " px-2 py-3.5"
                            }
                          >
                            {position.isClosed
                              ? formatUsdString(
                                  +position.cumulativeRealizedPnl,
                                  1,
                                )
                              : "-"}
                          </td>
                          <td key={"Max Size"} className="px-2 py-3.5">
                            {" "}
                            {(+position.maxSize).toFixed(2)}
                            {baseAssetName}
                          </td>
                          <td key={"Avg Open Price"} className="px-2 py-3.5">
                            {formatUsdString(+position.avgOpenPrice, 1)}
                          </td>
                          <td key={"Avg Close Price"} className="px-2 py-3.5">
                            {position.isClosed
                              ? formatUsdString(+position.avgClosePrice, 1)
                              : "-"}
                          </td>
                          <td key={"Opened At"} className="px-2 py-3.5">
                            {position.openTimestamp}
                          </td>
                          <td key={"Closed At"} className="px-2 py-3.5">
                            {position.isClosed ? position.closeTimestamp : "-"}
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
