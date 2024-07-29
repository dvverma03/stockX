import React, { useState, useEffect } from 'react';
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
const MarketCoinBox = ({ image, symbol, current_price, id, isActive, isFavorite }) => {
  const [isSelected, setIsSelected] = useState(isFavorite);

  useEffect(() => {
    setIsSelected(isFavorite);
  }, [isFavorite]);

  async function handleClick() {
    try {
      const id=localStorage.getItem("user");
      const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/v1/users/${symbol.toUpperCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSelected(!isSelected);
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Cannot add more than 3");
    }
  }

  return (
    <div className={`h-16 my-1 items-center justify-center rounded-[5px] pt-2 p-1 ${isActive ? 'bg-violet-600' : ''}`}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between">
        <div className="flex pl-2 h-full items-center">
          <img
            src={image}
            className="w-[35px] h-[35px] mr-2"
            alt="Logo"
          />
          <div>
            <div>{symbol.toUpperCase()}</div>
            <div>{id}</div>
          </div>
        </div>
        <div className='flex flex-row'>
          <div className="pr-4 h-full items-center text-center">${current_price}</div>
          {!isSelected ? (
            <FaRegStar className="hover:cursor-default" onClick={handleClick} />
          ) : (
            <FaStar onClick={handleClick} className='text-yellow-300 hover:cursor-default' />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketCoinBox;
