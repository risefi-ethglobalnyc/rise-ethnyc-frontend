import { OrderRecordFormatted, formatUsdString } from "@/utils/formatter";
import { useRecoilValue } from "recoil";
import { orderHistoryState } from "@/states/atoms";
import { useMediaQuery } from "react-responsive";

export default function OrderHistoryBoardDesktop() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" }); // FIXME: 'sm' 기준으로 잡기

  const orderHistory = useRecoilValue(orderHistoryState);

  return (
    <div>
      <div className="bg-gray-900 rounded-lg">
        <div className="px-4">
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
                        Time
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                      >
                        Market
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                      >
                        Order Type
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
                        Reduce Only
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                      >
                        Price
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
                        Margin
                      </th>
                    </tr>
                  </thead>
                  {/* Desktop */}
                  <tbody className="divide-y divide-gray-600 bg-gray-900">
                    {orderHistory.map(
                      (order: OrderRecordFormatted, idx: number) => {
                        return (
                          <tr key={idx} className="text-gray-300 text-xs">
                            <td key={"Time"} className="px-2 py-3.5">
                              {order.timestamp}
                            </td>
                            <td key={"Market"} className="px-2 py-3.5">
                              ETH/USDC
                            </td>
                            <td key={"OrderType"} className="px-2 py-3.5">
                              {order.orderType}
                            </td>
                            <td
                              key={"Side"}
                              className={
                                (order.isLong ? "text-long" : "text-short") +
                                " px-2 py-3.5"
                              }
                            >
                              {order.isLong ? "Long" : "Short"}
                            </td>
                            <td key={"Reduce Only"} className="px-2 py-3.5">
                              {order.isIncrease ? "No" : "Yes"}
                            </td>
                            <td key={"Price"} className="px-2 py-3.5">
                              {formatUsdString(+order.executionPrice, 1)}
                            </td>
                            <td key={"Size"} className="px-2 py-3.5">
                              {formatUsdString(+order.sizeAbs, 2)} ETH
                            </td>
                            <td key={"Margin"} className="px-2 py-3.5">
                              {formatUsdString(+order.marginAbs, 1)} USDC
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
    </div>
  );
}
