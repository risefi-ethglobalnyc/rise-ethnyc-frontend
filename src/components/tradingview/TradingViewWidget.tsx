/* eslint-disable no-return-assign */
/* eslint-disable no-new */
import React, { useEffect, useRef } from "react";
import { AspectRatio } from "@mantine/core";

let tvScriptLoadingPromise: Promise<any> | null = null;

export default function TradingViewWidget(props: { x: number; y: number }) {
  const { x, y } = props;
  const onLoadScriptRef = useRef<any>(() => {});

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current(),
    );

    return () => onLoadScriptRef.current;

    function createWidget() {
      if (
        document.getElementById("tradingview_e3072") &&
        "TradingView" in window
      ) {
        if (typeof window !== "undefined") {
          const tv: any = window.TradingView;
          new tv.widget({
            // width: 980,
            // height: 610,
            autosize: true,
            symbol: "BINANCE:ETHUSDT.P",
            interval: "60",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_side_toolbar: true,
            allow_symbol_change: true,
            container_id: "tradingview_e3072",
          });
        }
      }
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <AspectRatio ratio={x / y}>
        <div id="tradingview_e3072" />
      </AspectRatio>
      <div className="tradingview-widget-copyright bg-gray-900">
        <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
