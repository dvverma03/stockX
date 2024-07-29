"use client"
import React from "react";
import { useRouter } from "next/navigation";
export default function Paisa() {
    const router = useRouter();
    let getToken;
    if (typeof window !== 'undefined') {
        getToken = localStorage.getItem("accessToken");
    }

    const apiCall = async () => {
        const url =`https://dev-openapi.5paisa.com/WebVendorLogin/VLogin/Index?VendorKey=${getToken}&ResponseURL=${"http://localhost:3001/profile"}`;
        router.push(url);
        console.log(res)
    }


    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <button className="p-2 border border-solid-[2px] border-x-teal-500 text-center" onClick={apiCall}>Connect your account (5Paisa)</button>
        </div>
    )
}