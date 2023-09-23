import { useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import { Group, Box, Text } from "@mantine/core";
import EthLogo from "@/components/logos/EthLogo";

import { formatUsdString } from "../../utils/formatter";

const websocketUrl = "wss://fstream.binance.com/ws"; // futures market

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

  // Recoil States
  // const setGlobalLongOI = useSetRecoilState(globalLongOIState);
  // const setGlobalShortOI = useSetRecoilState(globalShortOIState);
  // const setPriceBuffer = useSetRecoilState(priceBufferState);

  // const priceBuffer = useRecoilValue(priceBufferState);
  // const globalLongOI = useRecoilValue(globalLongOIState);
  // const globalShortOI = useRecoilValue(globalShortOIState);

  // const _wsPrice = useRef<number | string>(0); // temporary
  // const [oraclePriceUp, setOraclePriceUp] = useState<boolean | null>(null);

  // const plusChar = +priceBuffer > 0 ? "+ " : "";

  // get websocket price
  useEffect(() => {
    getWebsocketPrice();
  }, []);

  // useEffect(() => {
  //   getOIStatus().then((oiStatus) => {
  //     const [globalLongOI, globalShortOI] = oiStatus;
  //     setGlobalLongOI(+globalLongOI);
  //     setGlobalShortOI(+globalShortOI);
  //   });

  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   getPriceBuffer().then((priceBuffer) => {
  //     // const _priceBuffer = useRecoilValue(priceBufferState);
  //     setPriceBuffer(+priceBuffer);
  //   });
  // });

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
    <div>
      <div className="hidden md:block">
        <div className="flex flex-col align-center">
          <ul
            role="list"
            className=" bg-gray-900 px-4 py-1 sm:px-0  text-gray-100"
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
              {/* <div className="flex-none w-30 h-15 px-3 text-xs text-center">
                <Box>
                  <Text fz="xs" className="text-gray-400">
                    Index Price
                  </Text>
                  <Text fz="sm">{formatUsdString(wsPrice.current, 2)}</Text>
                </Box>
              </div> */}
              {/* <div className="flex-none w-30 h-15 px-3 text-xs text-center">
                <Box>
                  <Text fz="xs" className="text-gray-400">
                    Long Open Interest
                  </Text>
                  <Text fz="sm">{formatUsdString(+globalLongOI, 1)} ETH</Text>
                </Box>
              </div>
              <div className="flex-none w-30 h-15 px-3 text-xs text-center">
                <Box>
                  <Text fz="xs" className="text-gray-400">
                    Short Open Interest
                  </Text>
                  <Text fz="sm">{formatUsdString(+globalShortOI, 1)} ETH</Text>
                </Box>
              </div>
              <div className="flex-none w-30 h-15 px-3 text-xs text-center">
                <Box>
                  <Text fz="xs" className="text-gray-400">
                    Price Buffer
                  </Text>
                  <Text fz="xm">
                    {plusChar.concat((+priceBuffer * 100).toFixed(4))}%
                  </Text>
                </Box>
              </div> */}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
