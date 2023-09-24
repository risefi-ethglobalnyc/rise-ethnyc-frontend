import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { SignalIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Group, Box, Text } from "@mantine/core";
import EthLogo from "@/components/logos/EthLogo";

import { formatUsdString } from "../../utils/formatter";

const websocketUrl = "wss://fstream.binance.com/ws"; // futures market

const stats = [
  {
    id: 1,
    name: "Price Sources",
    stat: "5",
    icon: SignalIcon,
    contents: [
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
    ],
    indices: [],
  },
  {
    id: 2,
    name: "Last Prices",
    stat: "$ 1947.6",
    icon: ChartBarIcon,
    contents: ["1947.6", "1947.6", "1947.6", "1947.6", "1947.6"],
    indices: ["Source A", "Source B", "Source C", "Source D", "Source E"],
  },
];

interface PriceBoardProps {
  wsPrice: React.MutableRefObject<number>;
  prevWsPrice: React.MutableRefObject<number>;
  markPrice: React.MutableRefObject<number>;
  prevMarkPrice: React.MutableRefObject<number>;
  priceUpdateFlag: boolean;
  setPriceUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PriceBoard(props: PriceBoardProps) {
  const {
    wsPrice,
    prevWsPrice,
    markPrice,
    prevMarkPrice,
    priceUpdateFlag,
    setPriceUpdateFlag,
  } = props;

  // get websocket price
  useEffect(() => {
    getWebsocketPrice();
  }, []);

  async function getWebsocketPrice() {
    let newWsPrice: any;
    const ws = new WebSocket(websocketUrl);

    const getSubscribeOnceMsg = () => {
      const params: string[] = [];
      params.push(`ethusdt@markPrice`);

      const msg = JSON.stringify({
        method: "SUBSCRIBE",
        params,
        id: 1,
      });

      return msg;
    };

    const sendSubscribeMsg = (ws: WebSocket) => {
      const msg = getSubscribeOnceMsg();
      ws.send(msg);
    };
    // FIXME: 페이지 렌더링 다시 할 때마다 웹소켓 추가 연결됨
    ws.onopen = () => {
      sendSubscribeMsg(ws);
    };

    ws.onmessage = (_data) => {
      const dataString = JSON.parse(_data.data.toString());
      if (dataString.p) {
        newWsPrice = dataString.p;

        prevWsPrice.current = wsPrice.current;
        wsPrice.current = +newWsPrice;
        prevMarkPrice.current = markPrice.current;
        markPrice.current = +newWsPrice;
        setPriceUpdateFlag((prev) => !prev);
      }
    };

    return () => {
      ws.close();
    };
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start gap-x-4 gap-y-4 bg-gray-800 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-3">
          <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
          <h1 className="flex gap-x-3 text-base leading-7">
            <span className="font-semibold text-white">Price Feed Status</span>
          </h1>
        </div>
        <div className="flex flex-row items-center gap-1 text-gray-100">
          <div className="order-first flex-none rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
            ETH/USDC
          </div>
        </div>
      </div>

      <dl className="mx-5 mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          key={1}
          className="relative overflow-hidden rounded-lg text-gray-100 bg-gray-900 px-6 pb-5 pt-6 shadow"
        >
          <div className="flex flex-row h-14 items-center divide-x divide-gray-600">
            <div className="flex-col flex-none w-30 h-15 px-5 text-md">
              <Group>
                <EthLogo />
                <Box>
                  <Text fw={600}>ETH/USDC</Text>
                  <Text fz="xs">Perpetual</Text>
                </Box>
              </Group>
            </div>
            <div className="flex-none w-30 h-15 px-5 text-sm text-center">
              {/* Mark Price */}
              <Box>
                <div
                  className={`text-lg font-semibold ${
                    markPrice.current.toFixed(2) >
                    prevMarkPrice.current.toFixed(2)
                      ? "text-long " // Green for price going up
                      : markPrice.current.toFixed(2) <
                        prevMarkPrice.current.toFixed(2)
                      ? "text-short" // Red for price going down
                      : "text-gray-100" // White for no change
                  }`}
                >
                  {formatUsdString(markPrice.current, 2)}
                </div>
              </Box>
            </div>
          </div>
        </div>
      </dl>
      <dl className="mx-5 mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-gray-900 px-4 pb-5 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex flex-col items-baseline pb-6 sm:pb-7">
              {item.contents.map((content, idx) => (
                <div key={idx}>
                  <p className="text-xs font-semibold text-gray-100">
                    {content}
                  </p>
                </div>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
