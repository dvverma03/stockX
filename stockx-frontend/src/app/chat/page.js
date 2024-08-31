"use client"
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import { ReactTyped } from "react-typed";
import { IoMdArrowRoundForward } from "react-icons/io";
import UserChat from "@/components/userChat/page";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";


const Chat = () => {
    const router = useRouter();
    const { coin, gpt } = useSelector((store) => store)
    const [user, setUser] = useState({});


    useEffect(() => {
        const key = localStorage.getItem("accessToken");
        if (key == null) {
            router.push("/login")
        }
        async function getUser() {
            const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/v1/users/getUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${key}`,
                },
            })
            const data = await res.json();
            setUser(data?.data);
        }

        getUser();
    }, []);


    useEffect(() => {
        if (gpt) {
            setContent(JSON.stringify(coin))
        }
    }, [])




    const [content, setContent] = useState("");

    const [username, setUsername] = useState('Deepak Verma')

    const [currentPage, setCurrentPage] = useState(0);
    const obj = [
        {
            id: 1,
            content: "I’m interested in investing in renewable energy stocks. What are some options?"
        },
        {
            id: 2,
            content: "Can you compare the historical performance of Amazon (AMZN) and Microsoft (MSFT)?"
        },
        {
            id: 3,
            content: "What are the top performing stocks in the technology sector?"
        },
        {
            id: 4,
            content: "Are there any recent updates on the stock market today?"
        }
    ]


    return (
        (currentPage === 0 ? (
            <div className="flex flex-col justify-start md:items-center min-h-screen w-screen gap-4 bg-black text-white">
                <IoMdArrowRoundBack color="white" className="text-3xl mt-2 md:hidden block m-2" onClick={() => history.back()} />
                <div className="bg-hero flex flex-col justify-between items-center w-full md:pt-[10rem]">
                    {/* headings */}
                    <div className="flex flex-col gap-11 mb-10 md:p-0 p-4">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold flex flex-wrap text-wrap max-w-screen-sm">Hello, {user?.username?.split('@')[0]}</h1>
                            <div className="text-4xl text-gray-700 font-bold">
                                <ReactTyped strings={["Get your customized suggestion from Stockx AI."]} typeSpeed={100} />
                            </div>
                        </div>
                        {/* suggestions */}
                        <div className="flex md:flex-row flex-col gap-3">
                            {obj.map((item, index) => (
                                <div className="bg-[#2b2b4d69] md:h-44 md:w-fit p-5 md:max-w-64 text-l font-mono rounded-md hover:cursor-pointer" key={index}>
                                    <p onClick={() => setContent(item?.content)}>{item?.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:items-center px-4 pb-4 md:pt-[10rem] pt-7">
                        <div className="flex flex-row justify-between items-end max-w-[68rem] w-full p-4 rounded-md bg-white">
                            {/* input box */}
                            <textarea
                                placeholder="Enter the information of the stocks here."
                                // disabled={loading}
                                className="outline-none flex-grow h-auto md:min-h-0 min-h-12 bg-transparent font-bold font-mono text-black resize-none"
                                rows={1}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            />
                            <IoMdArrowRoundForward
                                className="text-2xl text-black font-bold ml-4 hover:cursor-pointer"
                                onClick={() => setCurrentPage(1)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <UserChat gpt={gpt} content={content} setContent={setContent} />
        ))
    );
};

export default Chat;
