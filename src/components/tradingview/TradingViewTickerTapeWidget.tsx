import { useEffect } from "react";

export default function TradingViewTickerTapeWidget() {
  const url =
    "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
  let script;
  useEffect(() => {
    // delete exi sting script

    script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          description: "BTC perpetual",
          proName: "BINANCE:BTCUSDU2023",
        },
        {
          description: "ETH perpetual",
          proName: "BINANCE:ETHUSDU2023",
        },
        {
          description: "XRP perpetual",
          proName: "BINANCE:XRPUSDU2023",
        },
        {
          description: "DOGE perpetual",
          proName: "BYBIT:DOGEUSDT.P",
        },
        {
          description: "ARB perpetual",
          proName: "BYBIT:ARBUSDT.P",
        },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });
    // if the element exists, delete it
    const existingScript = document.getElementById(
      "tradingview-ticker-tape-widger-container",
    );
    if (existingScript) {
      existingScript.innerHTML = "";
      existingScript.appendChild(script);
    }
  }, [url]);
  return (
    <>
      {" "}
      <div id="tradingview-ticker-tape-widger-container" />
      <div className="tradingview-widget-copyright bg-gray-900">
        <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </>
  );
}
