import React from "react";

export default function Join() {
    return (
        <div className="bg-[#1D2939] h-fit flex flex-col justify-center items-center p-10 w-screen">
            <div className="md:w-[1194px] h-fit flex flex-col items-center space-y-8">
                <div className="flex flex-col gap-y-3 text-white text-center w-[326px]">
                    <p className="text-3xl font-bold">Join Our Team</p>
                    <p className="font-thin">Each author receives dividents from StockAI and subscribers</p>
                </div>
                <div className="bg-[#613DE4] flex md:flex-row flex-col gap-x-7 w-full md:p-0 pt-4">
                    <div className="md:w-1/2 flex flex-col justify-center items-center">
                        <div className="w-[250px] overflow-ellipsis text-white space-y-6">
                            <p className="text-3xl font-bold tracking-wider">Our authors use all StockAI tools for Free</p>
                            <p className="font-thin text-xl"> Send your resume right now and our managers will contact you.</p>
                            <button className="p-2 border border-white border-solid-[2px] rounded-md">Send a Request</button>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <img src="/assets/images/join/join.svg" />
                    </div>
                </div>
            </div>
        </div>
    )
}