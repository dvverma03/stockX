"use client";
import React, { use, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { useState } from "react";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import ReactFlagsSelect from "react-flags-select";
import { useRouter } from "next/navigation";
import { CiLogin } from "react-icons/ci";
export default function Profile() {
  const [email, setEmail] = useState();
  const [newEmail, setNewEmail] = useState();
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [address, setAddress] = useState();
  const [zipcode, setZipCode] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [fullName, setFullName] = useState();
  const [username, setUsername] = useState();
  const [dob, setDob] = useState();
  const router = useRouter();
  const [key,setKey]=useState()

  console.log(country);
  const obj = {
    email,
    newEmail,
    password,
    newPassword,
    address: address || "",
    zipcode: zipcode || "",
    city: city || "",
    country: country || "",
    fullName: fullName || "",
    username: username || "",
    dob: dob || "",
  };
  function submit() {
    console.log("submit is called");
  }
  const handleSubmit = async () => {
    try {
      const key=localStorage.getItem("user");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/v1/users/profile/${key}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      }
      console.log(data);
    } catch (err) {
      toast.error("Something went wrong!!");
    }
  };

  function handleClick() {
    router.push("/home");
  }

  useEffect(()=>{
    const key=localStorage.getItem("accessToken")
    setKey(key)
    if(key==null){
      router.push("/login")
    }
  },[key])

  const LogoutHandler =()=>{
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login")
  }

  return (
    <div className="md:flex md:flex-row justify-center bg-[#1D2939] w-screen h-full">
      {/* sidebar componet */}
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        {/* top bar */}
        <div className="flex flex-row justify-between items-center w-screen p-4">
          {/* name */}
          <div className="flex flex-row gap-5 justify-center items-center">
            <div className="h-[25px] w-[25px] md:w-14 md:h-14">
              <img
                src="https://imgs.search.brave.com/oZMjDiGSkwe4JfBU1rseEt5PxeELbQWHhff9qEHJVbA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHVtYW5zZWN1cml0/eS5jb20vaHViZnMv/SHVtYW5fSG9tZXBh/Z2VfQWNjb3VudHMt/bWluLmpwZw"
                alt="user image"
                className="h-[25px] w-[25px] md:w-14 md:h-14 object-fill rounded-md"
              />
            </div>
            <div className=" md:text-[32px] text-white font-semibold">
              John Johnson
            </div>
          </div>
          {/* search and alert */}
          <div className="flex md:flex-row md:justify-center md:items-center gap-6">
            <div className="flex justify-between items-center hover:cursor-pointer border border-solid-2px border-[#475467] p-2 rounded-md">
              <IoIosNotifications className="text-white" />
            </div>
            <button className="bg-[#613DE4] text-white font-bold flex rounded-md gap-2 w-fit h-fit p-2" onClick={LogoutHandler}><span className="mt-1">{<CiLogin color="white" />}</span> Logout</button>
          </div>
        </div>
        <div className="h-1 w-screen bg-[#475467] items-center justify-center flex"></div>
        {/* 1st row */}
        <div className="p-4 md:flex md:flex-row justify-between gap-36">
          <div className="flex pb-4 md:pb-0 flex-col justify-start items-start gap-1 text-white md:w-1/2">
            <h2 className="text-[16px] 2xl:text-2xl font-bold">
              Add your email
            </h2>
            <p className="text-[12px] md:text-[16px]">
              This info needs to be accurate with your ID document.
            </p>
            <p className="text-[12px] md:text-[16px] pt-4 2xl:pt-0">Email</p>
            <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
              <input
                type="text"
                required="true"
                placeholder="user@gmail.com"
                className="outline-none bg-inherit text-white w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-1 text-white md:w-1/2">
            <h2 className="text-[16px] md:text-2xl font-bold">Change email</h2>
            <p className="text-[12px] md:text-[16px]">
              The confirmation code has been sent to your new email
            </p>
            <p className="text-[12px] md:text-[16px] pt-4 md:pt-0">New Email</p>
            <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
              <input
                type="text"
                required="true"
                placeholder="user@gmail.com"
                className="outline-none bg-inherit text-white w-full"
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* 2nd row */}
        <div className="p-4 md:flex md:flex-row justify-between gap-36">
          <div className="flex flex-col justify-start items-start gap-1 text-white md:w-1/2">
            <h2 className="text-[16px] md:text-2xl font-bold w-full">
              Change password
            </h2>
            <p className="text-[12px] md:text-[16px] pt-4 md:pt-0">
              Сurrent password
            </p>
            <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
              <input
                type="text"
                required="true"
                placeholder="**********"
                className="outline-none bg-inherit text-white w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end items-start gap-1 text-white md:w-1/2">
            <p className="text-[12px] md:text-[16px] pt-4 2xl:pt-0">
              New Password
            </p>
            <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
              <input
                type="text"
                required="true"
                placeholder="**********"
                className="outline-none bg-inherit text-white w-full"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* 3rd row */}
        <div className="p-4 2xl:flex md:flex-row justify-between gap-36">
          <div className="flex flex-col justify-center items-start md:w-1/2 gap-2">
            <div className="flex flex-row justify-center items-end gap-16 w-full">
              <div className="flex flex-col justify-start items-start gap-1 text-white w-full">
                <h2 className="text-[16px] 2xl:text-2xl font-bold">
                  Home Address
                </h2>
                <p className="text-[12px] 2xl:text-[16px] pt-4 2xl:pt-0">
                  Address Line
                </p>
                <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
                  <input
                    type="text"
                    placeholder="House number and street name"
                    className="outline-none bg-inherit text-white w-full"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1 text-white w-1/2">
                <p className="text-[12px] md:text-[16px] pt-4 2xl:pt-0">
                  Postcode
                </p>
                <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
                  <input
                    type="text"
                    placeholder="Ex: 0000"
                    className="outline-none bg-inherit text-white w-full"
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-1 text-white w-full">
              <p className="text-[12px] md:text-[16px] pt-4 2xl:pt-0">City</p>
              <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
                <input
                  type="text"
                  placeholder="City, State"
                  className="outline-none bg-inherit text-white w-full"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start gap-1 w-1/2">
            <p className="text-white text-[12px] md:text-[16px]">
              Country of residence
            </p>
            {/* <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full"> */}
            {/* {country && (
                                <div style={{ marginTop: 20 }}>
                                    <h3>{country.official}</h3>
                                    <img
                                        src={country.flag}
                                        alt={`Flag of ${country.official}`}
                                        style={{ width: 50 }}
                                    />
                                </div>
                            )}
                            <Select
                                options={onlyCountries}
                                value={country}
                                onChange={handleChange}
                                className="outline-none bg-inherit w-full text-black"
                                placeholder="Select a country"
                            /> */}
            {/* <input type="text" placeholder="USA"  onChange={(e) => setCountry(e.target.value)} /> */}
            <ReactFlagsSelect
              className="bg-transparent w-full text-black border-none outline-none flag"
              selected={country}
              onSelect={(code) => setCountry(code)}
              searchable
              searchPlaceholder="Search Countries"
            />

            {/* </div> */}
          </div>
        </div>
        {/* 4th row */}
        <div className="p-4 md:flex md:flex-row justify-between gap-36">
          <div className="flex flex-col justify-center items-start md:w-1/2 gap-2">
            <div className="flex flex-row justify-center items-end gap-16 w-full">
              <div className="flex flex-col justify-start items-start gap-1 text-white w-full">
                <h2 className="text-[16px] md:text-2xl font-bold">
                  Add your personal info
                </h2>
                <p className="text-[12px] md:text-[16px]">Full Name</p>
                <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full">
                  <input
                    type="text"
                    placeholder="Mr. John Doe"
                    className="outline-none bg-inherit text-white w-full"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-1 text-white w-full">
              <p className="text-[12px] md:text-[16px]">Username</p>
              <div className="flex flex-row justify-between items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full gap-2">
                <input
                  type="text"
                  placeholder="username"
                  className="outline-none bg-inherit text-white w-full"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start gap-1 text-white w-1/2">
            <p className="text-[12px] md:text-[16px]">Date of birth</p>
            <div className="flex flex-row justify-center items-center border border-solid-2px border-[#475467] p-1 rounded-md w-full gap-3">
              <SlCalender className="text-white" />
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                className="outline-none bg-inherit text-white w-full"
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="text-white font-bold gap-8 pr-8 flex justify-end items-center text-center p-4">
          <button
            className="p-2 border border-solid-[2px] border-[#613DE4] rounded-md"
            onClick={handleClick}
          >
            Return to Home Screen
          </button>
          <button
            className="pt-2 pb-2 pl-4 pr-4 bg-[#613DE4] rounded-md"
            type="submit"
            onClick={handleSubmit}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
