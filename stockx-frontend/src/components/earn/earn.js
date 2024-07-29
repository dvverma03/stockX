import React from "react";

export default function Earn() {
    return (
        <div className="flex flex-col justify-center text-center items-center bg-buySell bg-no-repeat w-screen h-full p-12 text-white gap-y-8">
            <div className="md:w-[792px] flex flex-col justify-center items-center gap-y-8">
                <div className="font-bold text-3xl text-center overflow-ellipsis w-72">
                    Earn more money when you shop.
                </div>
                <div className="font-thin">
                    <p>Earn bonus investments by shopping at thousand of top brands - including ones you likely shop at anyway.</p>
                </div>
            </div>
            <div className="h-full">
                <img src="/assets/images/earn/buySell.svg"/>
            </div>
        </div>
    )
}