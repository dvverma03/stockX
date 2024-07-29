"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar() {
    const router = useRouter();
    let getToken;
    if (typeof window !== 'undefined') {
        getToken = localStorage.getItem("accessToken");
    }
    function submit() {
        if (getToken) {
            router.push("/profile");
        }
    }
    return (
        <div className="flex flex-row justify-between items-center w-screen pt-3 pl-6 pr-6 bg-[#101828]">
            <div className="">
                <Image src={"/assets/images/navbar/Logo.svg"} width={100} height={40} />
            </div>
            <div className="md:flex md:flex-row space-x-6 text-white text-[14px] hidden">
                <Link href="/home"><p>About</p></Link>
                <Link href="/"><p>Earn</p></Link>
                <Link href="/"><p>Prices</p></Link>
                <Link href="/"><p>Join the team</p></Link>
            </div>
            <div className="flex flex-row font-bold text-[16px] text-white gap-5">
                <Link href={`${getToken ? '/profile' : '/login'}`}><button className="border border-solid-[8px] rounded-md w-fit h-fit p-2 border-[#613DE4]">Sign In</button></Link>
                <button className="bg-[#613DE4] rounded-md w-fit h-fit p-2" onClick={submit}>Get started</button>
            </div>
        </div>
    )
}