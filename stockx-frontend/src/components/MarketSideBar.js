import React, { useEffect, useState } from "react";
import fetchCoins from "./fetchCoins";
import MarketCoinBox from "./MarketCoinBox";
import { useDispatch } from "react-redux";
import { addCoin } from "./store/coinSlice";
import Link from "next/link";

const MarketSideBar = ({ page }) => {
  const [coins, setCoins] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const [coinName, setCoinName] = useState("");
  const [preferenceArr, setPreferenceArr] = useState([]);

  if (coins?.length > 0) {
    dispatch(addCoin(coins[activeIndex]));
  }
  const [filteredCoins, setFilteredCoins] = useState([]);

  const [searchCoin, setSearchCoin] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      // Fetch coins first
      const coins = await fetchCoins();
      setCoins(coins);
      const id=localStorage.getItem("user");
      // Fetch preferences only after coins are fetched
      const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/v1/users/getAllPreferences/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.success) {
        setPreferenceArr(data.data.preferenceArray);
      } else {
        console.log(data.message);
      }
      setFilteredCoins(coins);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // if (coins.length > 0 && activeIndex !== null) {
    if (coins) {
      dispatch(addCoin(coins[activeIndex]));
    }

    // }
  }, [coins, activeIndex, dispatch]);

  useEffect(() => {
    let filtered;
    if (coins) {
      filtered = coins?.filter((coin) =>
        coin.name.toLowerCase().includes(searchCoin.toLowerCase())
      );
    }
    setFilteredCoins(filtered);
  }, [searchCoin, coins]);

  const handleCoinClick = (index) => {
    setActiveIndex(index); // Set the active index to the clicked coin
    // setSearchCoin(""); // Clear the search input
    // setFilteredCoins(coins); // Reset to show all coins
  };

  const isCoinFavorite = (symbol) => {
    return preferenceArr.includes(symbol.toUpperCase());
  };

  return (
    <aside className="w-full h-full bg-[#101828] p-5">
      <div className="flex items-center mb-5">
        <Link href="/">
          <div className="text-2xl font-bold rounded-sm text-purple-300">
            StockX
          </div>
        </Link>
      </div>
      <section>
        <input
          value={searchCoin}
          onChange={(e) => setSearchCoin(e.target.value)}
          type="text"
          placeholder="Search your coin"
          className="bg-gray-600 w-full h-[45px] rounded-[5px] pl-4 mt-4 mb-4"
        />
        <div className="h-[750px] overflow-y-scroll no-scrollbar">
          {filteredCoins?.length > 0 &&
            filteredCoins?.map((coin, index) => (
              <div
                key={index}
                onClick={() => handleCoinClick(index)}
                className="cursor-pointer"
              >
                <MarketCoinBox
                  index={index}
                  coinName={coinName}
                  activeIndex={activeIndex}
                  isActive={activeIndex === index} // Pass isActive prop to determine if this box is active
                  isFavorite={isCoinFavorite(coin.symbol)} // Pass the favorite status
                  {...coin}
                />
              </div>
            ))}
        </div>
      </section>
    </aside>
  );
};

export default MarketSideBar;
