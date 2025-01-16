"use client";
import React, { useState, useEffect } from "react";
import { makePhoneCall, getCall } from "./retellapi/request";
import { IoCall } from "react-icons/io5";

interface Dealership {
  dealershipName: string;
  phone: string;
  carType: string;
  year: string;
}

const Dashboard: React.FC = () => {
  const [callId, setCallId] = useState<string | null>(null);
  const [dealership, setDealership] = useState<Dealership>({
    dealershipName: "",
    phone: "",
    carType: "",
    year: "",
  });
  const [callResult, setCallResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "year" && value && !/^\d*$/.test(value)) {
      return;
    }
    if (name === "phone" && value && !/^\+?[0-9]*$/.test(value)) {
      return;
    }
    setDealership((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to make the phone call
  const callDealership = async () => {
    try {
      const result = await makePhoneCall(
        dealership.phone,
        dealership.carType,
        dealership.year,
        dealership.dealershipName
      );
      setCallId(result.call_id);
      console.log("Call response:", result);
    } catch (err) {
      console.error("Failed to make the call:", err);
      console.log("Failed to make the phone call. Please check the console for details.");
    }
  };

  // Effect to poll for the status of the callId every 5 seconds
  useEffect(() => {
    if (!callId) return;
    const checkCallStatus = async () => {
      try {
        const response = await getCall(callId);
        // Call "ongoing" or "registered", retry in 5s
        if (!response || response.call_status === "ongoing" || response.call_status === "registered") { 
          console.log("Call is ongoing or response is invalid, retrying...");
          return;
        } else if (response.call_status === "ended") { 
          setCallResult(response);
          setCallId(null);
          console.log("Call completed successfully:", response);  
        }

      } catch (error) {
        console.error("Error checking call status:", error);
      }
    };
    const interval = setInterval(checkCallStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [callId]);

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 lg:px-24 py-36 bg-white">
        <h1 className="text-2xl text-black font-bold md:text-5xl">Caller Information</h1>
        <div className="flex gap-10 mt-5">
          {/* Dealership Information Box */}
          <div className="w-1/2 border border-gray-400 rounded-xl p-5">
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Dealership</h2>
            <form className="flex flex-col gap-5">
              {/* Dealership Name */}
              <div>
                <label
                  htmlFor="dealershipName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Dealership Name
                </label>
                <input
                  type="text"
                  id="dealershipName"
                  name="dealershipName"
                  placeholder="Enter dealership name"
                  className="w-full border text-black border-gray-400 rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-400"
                  value={dealership.dealershipName}
                  onChange={handleInputChange}
                />
              </div>
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  className="w-full border text-black border-gray-400 rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-400"
                  value={dealership.phone}
                  onChange={handleInputChange}
                  pattern="\+?[0-9]*"
                />
              </div>
            </form>
          </div>

          {/* Car Information Box */}
          <div className="w-1/2 border border-gray-400 rounded-xl p-5">
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Car Details</h2>
            <form className="flex flex-col gap-5">
              {/* Car Type */}
              <div>
                <label
                  htmlFor="carType"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Car Type
                </label>
                <input
                  type="text"
                  id="carType"
                  name="carType"
                  placeholder="Enter car type"
                  className="w-full border text-black border-gray-400 rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-400"
                  value={dealership.carType}
                  onChange={handleInputChange}
                />
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="year"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Year
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  placeholder="Enter year"
                  className="w-full border text-black border-gray-400 rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-400"
                  value={dealership.year}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Call Button */}
        <button
          type="button"
          onClick={callDealership}
          className="mt-4 text-white font-semibold rounded-lg p-3 bg-black hover:bg-gray-600 transition duration-200 flex flex-row items-center justify-center"
        >
          <IoCall className="mr-1 text-white h-6 w-6" />
          <div className="text-xl font-bold text-white">Call Dealership</div>
        </button>

        {/* Transcript Section */}
        <div className="p-5 mt-10 h-64 w-full">
          <h1 className="text-2xl text-black font-bold md:text-5xl">Transcript</h1>
          <div className="border border-gray-400 rounded-xl p-5 mt-4 h-64 w-full">
            {callResult ? (
              <div>
                <p>Call result: {JSON.stringify(callResult)}</p>
              </div>
            ) : (
              <p>Waiting for call to complete...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
