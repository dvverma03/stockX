"use client";
import React, { useEffect, useRef, useState } from "react";
import MarketSideBar from "@/components/MarketSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import fetchCoins from "@/components/fetchCoins";
import { toggleState } from "@/components/store/gptSlice";
import Link from "next/link";
const TradingViewWidget = ({ width, height }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (width > 0) {
      const widgetContainer = document.getElementById('tradingview-widget');
      if (widgetContainer) {
        widgetContainer.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
          feedMode: 'all_symbols',
          isTransparent: false,
          displayMode: 'regular',
          width: width,
          height: height,
          colorTheme: 'dark',
          locale: 'en'
        });
        widgetContainer.appendChild(script);
      }
    }
  }, [width, height]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div id="tradingview-widget" className="tradingview-widget-container__widget"></div>
    </div>
  );
};


const TradingViewChart = () => {
  const container = useRef();
  const [selectedCoinId, setSelectedCoinId] = useState("BTC");
  const store = useSelector((store) => store);

  useEffect(() => {
    if (!store) {
      setSelectedCoinId("BTC");
    } else {
      setSelectedCoinId(store?.coin?.symbol?.toUpperCase());
    }

  }, [store?.coin?.symbol]);

  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && container.current) {
        setChartWidth(container.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (chartWidth > 0) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
          {
              "width": ${chartWidth},
              "height": "410",
              "symbol": "${selectedCoinId}",
              "interval": "1",
              "timezone": "Etc/UTC",
              "theme": "dark",
              "style": "1",
              "locale": "en",
              "allow_symbol_change": true,
              "calendar": false,
              "support_host": "https://www.tradingview.com"
          }`;
      container.current.appendChild(script);

      return () => {
        if (container.current) {
          container.current.innerHTML = ''; // Clean up
        }
      };
    }
  }, [chartWidth, selectedCoinId]);


  return (
    <div ref={container} style={{ height: "400px", width: "100%" }}>
      <div style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

function Market() {
  const [widgetWidth, setWidgetWidth] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter()
  const [coins, setCoins] = useState([]);
  const dispatch = useDispatch()
  const { gpt } = useSelector((store) => store)
  console.log("data from chat", gpt);

  useEffect(() => {
    const fetchData = async () => {
      const coins = await fetchCoins();
      setCoins(coins);
    };
    fetchData();

    if (gpt == true) {
      dispatch(toggleState())
    }
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidgetWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const key = localStorage.getItem("accessToken")
    if (key == null) {
      router.push("/login")
    }
  }, [])

  const AskGPTHandler = () => {
    dispatch(toggleState())
    router.push("/chat")
  }


  return (
    <div className="bg-[#1D2939] text-white min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/5">
        <MarketSideBar page="market" />
      </div>
      <main className="flex-1 md:w-3/5 p-5">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl">Today News</h1>
          <div className="flex">
            <a href="/home" className="px-6 bg-violet-600 cursor-pointer mx-1 py-2 rounded-[5px]">
              Home
            </a>
            <Link href="/Wallet"><div className="border cursor-pointer border-gray-600 px-6 py-2 mx-1 rounded-[5px]">
              Wallet
            </div></Link>
          </div>
        </header>
        <section className="mb-4 flex flex-col md:flex-row">
          <div className="border border-gray-500 my-2 p-5 rounded-lg mx-1 flex-1">
            <div className="flex justify-between">
              <h2 className="text-[16px] mb-2">US WASDE Report</h2>
              <p className="text-gray-400">01:27:04</p>
            </div>
            <p className="text-gray-400 text-[13px]">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="border border-gray-600 my-2 p-5 rounded-lg mx-1 flex-1">
            <div className="flex justify-between">
              <h2 className="text-[16px] mb-2">US WASDE Report</h2>
              <p className="text-gray-400">01:27:04</p>
            </div>
            <p className="text-gray-400 text-[13px]">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </section>

        <TradingViewChart />
        <section className="border border-gray-600 p-5 rounded-lg text-gray-400 mt-5">
          <div className="flex border-b-[1px] py-2">
            <div className="w-[150px] text-[16px] font-bold">
              Recommendation:
            </div>
            <div className="flex justify-evenly w-full text-[14px]">
              <div>Command</div>
              <div>Add</div>
            </div>
          </div>
          <div className="flex border-b-[1px] py-2">
            <div className="w-[150px] text-[16px] font-bold">Entry Point:</div>
            {/* <div className="flex justify-evenly w-full text-[14px]">
                            <div className="justify-self-start">{coins[0]?.low_24h}</div>
                        </div> */}
          </div>
          <div className="flex border-b-[1px] py-2">
            <div className="w-[150px] text-[16px] font-bold">Take Profit:</div>
            <div className="flex justify-evenly w-full text-[14px]">
              <div>Command</div>
              <div>Add</div>
            </div>
          </div>
          <div className="flex border-b-[1px] py-2">
            <div className="w-[150px] text-[16px] font-bold">Stop Loss:</div>
            <div className="flex justify-evenly w-full text-[14px]">
              <div>Command</div>
              <div>Add</div>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="mt-5 bg-purple-500 w-[75px] rounded-[5px] py-2">
              Trade
            </button>
          </div>
        </section>
      </main>
      <aside
        className="w-full md:w-1/5 flex flex-col justify-center bg-[#101828]"
        ref={containerRef}
      >
        <div onClick={AskGPTHandler} className="border cursor-pointer bg-purple-500 border-white mx-2 mb-4 text-center text-white font-bold py-2 rounded-[8px]">
          Ask StockX AI.
        </div>
        <div className="w-full flex justify-center">
          <TradingViewWidget width={widgetWidth} height={850} />
        </div>
      </aside>
    </div>
  );
}

export default Market;
