"use client";
import React, { useEffect, useState, useRef } from "react";
import SideBar from "@/components/SideBar";
import fetchCoins from "@/components/fetchCoins";
import { AiOutlineBars } from "react-icons/ai";
import moment from "moment";
import { LineChart, Line, YAxis, Tooltip } from "recharts";
import { PieChart } from "react-minimal-pie-chart";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Graph = ({ chartPrices }) => {
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    // Set initial width
    updateWidth();

    // Update width on resize
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const startUnixTimestamp = moment().subtract(7, "days").unix();
  const data = chartPrices?.map((item, index) => ({
    name: moment.unix(startUnixTimestamp + (index + 1) * 3600).format("MM-DD HH:mm"),
    price: item,
    amt: item,
  }));
  const tooltipFormatter = (value) => value.toFixed(2);

  const minY = Math.min(...chartPrices);
  const maxY = Math.max(...chartPrices);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <LineChart width={chartWidth} height={370} data={data}>
        <Line type="natural" dataKey="price" stroke="green" strokeWidth={3} dot={false} />
        <YAxis domain={[minY, maxY]} />
        <Tooltip formatter={tooltipFormatter} />
      </LineChart>
    </div>
  );
};

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

function Page() {
  const [data, setData] = useState();
  const [coins, setCoins] = useState([]);
  const [visible, setVisible] = useState(false);
  const widgetContainerRef = useRef(null);
  const [widgetWidth, setWidgetWidth] = useState(0);
  const router = useRouter()


  useEffect(() => {
    const key = localStorage.getItem("accessToken")
    if (key == null) {
      router.push("/login")
    }
  }, [])

  useEffect(() => {
    if (!data) {
      const fetchData = async () => {
        const coins = await fetchCoins();
        console.log("coins", coins);
        setCoins(coins);
        console.log("bit coin price", coins[10]?.sparkline_in_7d);
        setData(coins[0]?.sparkline_in_7d);
      };
      fetchData();
    }
  }, [data]);

  useEffect(() => {
    const updateWidgetWidth = () => {
      if (widgetContainerRef.current) {
        setWidgetWidth(widgetContainerRef.current.offsetWidth);
      }
    };

    updateWidgetWidth();
    window.addEventListener("resize", updateWidgetWidth);

    return () => {
      window.removeEventListener("resize", updateWidgetWidth);
    };
  }, []);

  const handleVisible = () => {
    if (visible) {
      setVisible(!visible);
    }
  };

  return (
    <div
      className="bg-[#1D2939] text-white min-h-screen md:flex"
    >
      {visible && (
        <div className="w-64 fixed top-0 left-0">
          <SideBar page="home" handleVisible={handleVisible} />
        </div>
      )}

      {!visible && (
        <div
          onClick={() => setVisible(!visible)}
          className="cursor-pointer w-[45px] h-[45px] fixed top-2 left-2"
        >
          <AiOutlineBars size={40} />
        </div>
      )}

      <main className="flex-1 pt-[60px] md:w-4/5 p-5">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl">Today News</h1>
          <div className="flex">
            <a href="/home" className="px-6 border border-gray-600 cursor-pointer mx-1 py-2 rounded-[5px]">
              Home
            </a>
            <Link href="/wallet"><div className="border  bg-violet-600 cursor-pointer border-gray-600 px-6 py-2 mx-1 rounded-[5px]">
              Wallet
            </div></Link>
          </div>
        </header>
        <section className="mb-4 md:flex">
          <div className="border my-2 border-gray-500 p-5 rounded-lg mx-1">
            <div className="flex justify-between">
              <h2 className="text-[16px] mb-2">US WASDE Report</h2>
              <p className="text-gray-400">01:27:04</p>
            </div>
            <p className="text-gray-400 text-[13px]">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="border my-2 border-gray-600 p-5 rounded-lg mx-1">
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
        <section>
          <section className="border border-gray-600 rounded-lg pl-2 ml-2 h-[400px] py-4 mb-4 md:w-full">
            {data ? <Graph chartPrices={data?.price} /> : (<div className="items-center justify-center text-center">Loading..</div>)}
          </section>
        </section>
        <section className="border flex flex-col md:flex-row justify-between text-gray-400 border-gray-600 p-5 rounded-lg">
          <div className="max-w-screen-md my-2 md:w-1/3 h-[200px] border border-gray-600 rounded-sm">
            <div className=" flex justify-between mx-4 mt-4">
              <div> {coins[0]?.name}</div>
              <img src={coins[0]?.image} className="h-[30px] w-[30px]" alt="" />
            </div>
            <div className="ml-4 text-[25px] font-bold">
              $ {coins[0]?.current_price}
            </div>
            <div className="mx-4 flex justify-between">
              <div>$ {coins[0]?.low_24h}</div>
              <div>$ {coins[0]?.high_24h}</div>
            </div>
            <div className="ml-4 text-[25px] font-600">
              $ {coins[0]?.total_volume}
            </div>
            <div className="ml-4 text-[15px] font-600">
              Total Supply:$ {coins[0]?.total_supply}
            </div>
          </div>
          <div className="max-w-screen-sm my-2  md:w-1/3-sm h-[200px] border border-gray-600 rounded-sm">
            <div className=" flex justify-between mx-4 mt-4">
              <div> {coins[1]?.name}</div>
              <img src={coins[1]?.image} className="h-[30px] w-[30px]" alt="" />
            </div>
            <div className="ml-4 text-[25px] font-bold">
              $ {coins[1]?.current_price}
            </div>
            <div className="mx-4 flex justify-between">
              <div>$ {coins[1]?.low_24h}</div>
              <div>$ {coins[1]?.high_24h}</div>
            </div>
            <div className="ml-4 text-[25px] font-600">
              $ {coins[1]?.total_volume}
            </div>
            <div className="ml-4 text-[15px] font-600">
              Total Supply:$ {coins[1]?.total_supply}
            </div>
          </div>
          <div className="max-w-screen-md my-2 md:w-1/3 h-[200px] border border-gray-600 rounded-sm">
            <div className=" flex justify-between mx-4 mt-4">
              <div> {coins[2]?.name}</div>
              <img src={coins[2]?.image} className="h-[30px] w-[30px]" alt="" />
            </div>
            <div className="ml-4 text-[25px] font-bold">
              $ {coins[2]?.current_price}
            </div>
            <div className="mx-4 flex justify-between">
              <div>$ {coins[2]?.low_24h}</div>
              <div>$ {coins[2]?.high_24h}</div>
            </div>
            <div className="ml-4 text-[25px] font-600">
              $ {coins[2]?.total_volume}
            </div>
            <div className="ml-4 text-[15px] font-600">
              Total Supply:$ {coins[2]?.total_supply}
            </div>
          </div>
        </section>
      </main>
      <aside
        ref={widgetContainerRef}
        className="md:w-1/5 flex-col justify-center bg-[#101828]"
      >
        <div className="mx-[50px] py-[30px] w-full-md mb-4">
          <PieChart
            data={[
              { title: "One", value: coins[0]?.total_supply, color: "#E34" },
              { title: "Two", value: coins[1]?.total_supply, color: "#C13Ccc" },
              { title: "Three", value: coins[2]?.total_supply, color: "#6A2" },
              { title: "One", value: coins[3]?.total_supply, color: "#E38627" },
              { title: "Two", value: coins[4]?.total_supply, color: "#C13C37" },
              {
                title: "Three",
                value: coins[5]?.total_supply,
                color: "#6A2135",
              },
            ]}
          />
        </div>
        <div className="w-full flex justify-center">
          <TradingViewWidget width={widgetWidth - 30} height={680} />
        </div>
      </aside>
    </div>
  );
}

export default Page;