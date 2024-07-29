import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";

const SideBar = ({page,handleVisible}) => {
  return (
    <aside className="w-64 h-screen bg-black opacity-100 z-50 p-5">
      <div className="flex items-center mb-5">
        <a href="/home" className="text-2xl font-bold bg-violet-600 p-2 rounded-sm">
          Up
        </a>
        <div onClick={handleVisible} className="ml-auto text-sm border border-gray-200 cursor-pointer text-gray-400"><AiOutlineClose size={30} /></div>
      </div>
      <nav>
        <ul>
          <li className={`mb-5 ${page === 'home' ? 'bg-violet-600' : ''} px-4 py-[12px] rounded-sm my-0`}>
            <a href="/home" className="flex items-center text-lg text-white">
              <IoHomeOutline />
              <span className="ml-3">Home</span>
            </a>
          </li>
          <li className={`mb-5 ${page === 'market' ? 'bg-violet-600' : ''} px-4 py-[12px] rounded-sm my-0`}>
            <a href="/market" className="flex items-center text-lg text-white">
              <FiTool />
              <span className="ml-3">Market</span>
            </a>
          </li>
          <li className={`mb-5 ${page === 'profile' ? 'bg-violet-600' : ''} px-4 py-[12px] rounded-sm`}>
            <a
              href="/profile"
              className="flex items-center text-lg text-white"
            >
              <CiCalendar />
              <span className="ml-3">Profile</span>
            </a>
          </li>
          <li className={`mb-5 ${page === 'gpt' ? 'bg-violet-600' : ''} px-4 py-[8px] rounded-sm`}>
            <a
              href="/chat"
              className="flex items-center text-lg text-white"
            >
              <IoBookOutline />
              <span className="ml-3">Ask GPT</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
