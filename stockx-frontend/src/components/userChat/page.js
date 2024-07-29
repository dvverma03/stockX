// "use client";
// import React, { useEffect, useState } from "react";
// import io from 'socket.io-client';
// import { IoMdArrowRoundForward } from "react-icons/io";
// import ReactTyped from "react-typed"; // Corrected import
// import { useRouter } from "next/navigation";
// const socket = io("http://localhost:8000"); // Initialize socket outside component

// export default function UserChat({ content }) { // Destructure content from props
//     const [userQuery, setUserQuery] = useState(content); // Initialize state with content
//     const [loading, setLoading] = useState(false);
//     const [responseMessage, setResponseMessage] = useState([]);
//     const [contentString, setContentString] = useState(""); // Use state for contentString
//     const router = useRouter();


//     console.log(userQuery);

//     useEffect(() => {
//         // Set up event listener for 'chat message' event from server
//         socket.on('chat message', (msg) => {
//             if (msg.content) {
//                 setContentString(prev => prev + msg.content);
//                 setResponseMessage(prev => {
//                     const lastMessage = prev[prev.length - 1];
//                     if (lastMessage && lastMessage.role === 'bot') {
//                         return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + msg.content }];
//                     } else {
//                         return [...prev, { role: 'bot', content: msg.content }];
//                     }
//                 });
//             }
//         });

//         // Clean up socket event listener when component unmounts
//         return () => {
//             socket.off('chat message');
//         };
//     }, []);


//     console.log(responseMessage)
//     useEffect(() => {
//         sendMessage();
//     }, [content.content , loading]);

//     const sendMessage = async () => {
//         try {
//             if (!userQuery) return; // Handle empty message case

//             setLoading(true);
//             const userMessage = {
//                 "role": "user",
//                 "content": userQuery,
//             };
//             console.log(userQuery, "aa rhi hai");
//             setResponseMessage(prev => [...prev, userMessage]); // Append user messager

//             const response = await fetch("http://localhost:8000/api/v1/users/getStockInfo", {
//                 method: "POST", // Adjust to POST if your logic requires it.
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     question: userQuery, // Send your question data in the body
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             setLoading(false);
//             setUserQuery(""); // Clear input field

//         } catch (error) {
//             console.error("Error sending query:", error);
//             setLoading(false); // Reset loading state on error
//         }
//     };

//     return (
//         <div className="flex flex-col justify-start items-center min-h-screen w-screen gap-4 bg-black text-white">
//             <div className="bg-hero flex flex-col justify-between items-center w-full pt-[10rem]">
//                 This is my main chat page
//                 <div>
//                     {responseMessage.map((msg, index) => (
//                         <p key={index} className={msg.role === 'bot' ? "text-green-500" : "text-blue-500"}>
//                             {msg.content}
//                         </p>
//                     ))}
//                 </div>
//                 <textarea
//                     placeholder="Enter your query here"
//                     // value={userQuery}
//                     onChange={(e) => setUserQuery(e.target.value)}
//                     className="outline-none flex-grow h-auto bg-transparent font-bold font-mono text-black resize-none"
//                     rows={1}
//                     onInput={e => {
//                         e.target.style.height = 'auto';
//                         e.target.style.height = `${e.target.scrollHeight}px`;
//                     }}
//                 />
//                 {/* <IoMdArrowRoundForward className="text-2xl text-black font-bold ml-4" onClick={sendMessage} /> */}
//             </div>
//         </div>
//     );
// }
// "use client";
// import React, { useEffect, useState } from "react";
// import io from 'socket.io-client';
// import { IoMdArrowRoundForward } from "react-icons/io";
// import ReactTyped from "react-typed"; // Corrected import


// const socket = io("http://localhost:8000"); // Initialize socket outside component

// export default function UserChat({ content }) { // Destructure content from props
//     const [userQuery, setUserQuery] = useState(content); // Initialize state with content
//     const [loading, setLoading] = useState(false);
//     const [responseMessage, setResponseMessage] = useState([]);
//     const [currentMessage, setCurrentMessage] = useState(""); // State to hold the current message



//     useEffect(() => {
//         setUserQuery(content);
//     }, [content]);

//     useEffect(() => {
//         // Set up event listener for 'chat message' event from server
//         socket.on('chat message', (msg) => {
//             setCurrentMessage(prev => prev + msg.content + ' '); // Append new chunk to current message
//         });

//         // Clean up socket event listener when component unmounts
//         return () => {
//             socket.off('chat message');
//         };
//     }, []);

//     useEffect(() => {
//         if (userQuery && !loading) {
//             sendMessage();
//         }
//     }, [userQuery, loading]); // Run useEffect when userQuery or loading state changes

//     console.log(responseMessage);
//     console.log(currentMessage);
//     const sendMessage = async () => {
//         try {
//             setLoading(true);
//             const userMessage = {
//                 "role": "user",
//                 "content": userQuery,
//             };
//             setResponseMessage(prev => [...prev, userMessage]); // Append user message to responseMessage

//             const response = await fetch("http://localhost:8000/api/v1/users/getStockInfo", {
//                 method: "POST", // Adjust to POST if your logic requires it.
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     question: userQuery, // Send your question data in the body
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             setLoading(false);
//             setUserQuery(""); // Clear input field

//         } catch (error) {
//             console.error("Error sending query:", error);
//             setLoading(false); // Reset loading state on error
//         }
//     };

//     return (
//         <div className="flex flex-col justify-start items-center min-h-screen w-screen gap-4 bg-black text-white">
//             <div className="bg-hero flex flex-col justify-between items-center w-full pt-[10rem]">
//                 This is my main chat page
//                 <div>
//                     {responseMessage.map((msg, index) => (
//                         <p key={index} className={msg.role === 'bot' ? "text-green-500" : "text-blue-500"}>
//                             {msg.content}
//                         </p>
//                     ))}
//                     {/* Display current streaming message */}
//                     <p className="text-blue-500">{currentMessage}</p>
//                 </div>
//                 <textarea
//                     placeholder="Enter your query here"
//                     value={userQuery}
//                     onChange={(e) => setUserQuery(e.target.value)}
//                     className="outline-none flex-grow h-auto bg-transparent font-bold font-mono text-black resize-none"
//                     rows={1}
//                     onInput={e => {
//                         e.target.style.height = 'auto';
//                         e.target.style.height = `${e.target.scrollHeight}px`;
//                     }}
//                 />
//                 <IoMdArrowRoundForward className="text-2xl text-black font-bold ml-4" onClick={sendMessage} />
//             </div>
//         </div>
//     );
// }
"use client";
import React, { useEffect, useState, useRef } from "react";
import io from 'socket.io-client';
import { IoMdArrowRoundForward } from "react-icons/io";
import ReactTyped from "react-typed"; // Corrected import
import { BorderBeam } from "../magicui/border-beam";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleState } from "../store/gptSlice";

export default function UserChat({ content, gpt, setContent }) { // Destructure content from props
    const [userQuery, setUserQuery] = useState(""); // Initialize state with content
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState([]);
    const [currentMessage, setCurrentMessage] = useState(""); // State to hold the current message
    const initialLoad = useRef(true); // useRef to track initial load
    const dispatch = useDispatch()

    useEffect(() => {
        if (initialLoad.current) {
            sendMessage();
            initialLoad.current = false; // Set initialLoad to false after the first call
        }
    }, []); // Empty dependency array ensures this effect runs only once

    const sendMessage = async () => {
        try {
            setLoading(true);
            let userMessage;
            const id = localStorage.getItem("user");
            if (!gpt) {
                userMessage = {
                    role: "user",
                    content: userQuery ? userQuery : content,
                };
                setResponseMessage(prev => [...prev, userMessage]); // Append user message to responseMessage
            }
        
            const url = `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/v1/users/${gpt ? `getParticularStock/${id}` : `getStockInfo/${id}`}`
            const response = await fetch(url, {
                method: "POST", // Adjust to POST if your logic requires it.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: userQuery ? userQuery : content, // Send your question data in the body
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error)
            }
            const data = await response.json();
            setLoading(false);
            const obj = {
                role: "bot",
                content: data.data,
            };
            if (gpt) {
                dispatch(toggleState())
            }
            setResponseMessage(prev => [...prev, obj]);
            setUserQuery(""); // Clear input field
            setContent("");

        } catch (error) {
            toast.error(error.message);
            setUserQuery("");
            setLoading(false); // Reset loading state on error
        }
    };


    return (
        <div className="flex flex-col justify-start md:items-center min-h-screen w-screen gap-4 bg-black text-white">
            <IoMdArrowRoundBack color="white" className="text-3xl m-3 md:hidden block" onClick={() => history.go(-1)} />
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="bg-hero flex flex-col justify-between items-center w-full p-[4rem]">

                <div className="flex w-screen flex-col gap-6 md:p-10 pl-4 pr-4">
                    {responseMessage.map((msg, index) => (
                        <p key={index} className={msg.role === 'bot' ? "text-green-400 px-2 text-wrap flex flex-row font-mono text-sm" : "text-white px-2 text-wrap flex flex-row justify-end font-mono text-l font-bold"}>
                            {msg.content}
                        </p>
                    ))}
                    {/* Display current streaming message */}

                </div>

                <div className="flex flex-col md:w-full items-center md:px-4 md:pb-4 md:pt-[10rem] p-4 w-screen">
                    <div className="relative flex md:w-[68rem] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
                        <BorderBeam size={105} duration={12} delay={9} />
                        <div className="flex flex-row justify-between items-end md:max-w-[68rem] w-full p-4 rounded-md bg-transparent">
                            {/* input box */}

                            <textarea
                                placeholder="Enter the information of the stocks here."
                                // disabled={loading}
                                className="outline-none flex-grow md:h-auto h-12 bg-transparent font-bold font-mono text-white resize-none"
                                rows={1}
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            />
                            <IoMdArrowRoundForward
                                className="text-2xl text-white font-bold ml-4 hover:cursor-pointer"
                                onClick={sendMessage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
