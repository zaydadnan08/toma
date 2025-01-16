"use client";
import React, { useState, useEffect } from "react";
import { makePhoneCall, getCall } from "./retellapi/request";
import { IoCall } from "react-icons/io5";
import CallTable from "./components/callTable";
import calldata from './calls/calls.json'

interface Dealership {
  dealershipName: string;
  phone: string;
  carType: string;
  year: string;
}

interface CallResult {
  call_id: string;
  transcript: string;
  dealershipName: string;
  dealershipPhone: string;
  call_analysis?: any;
  picked_up: boolean;
}

const agents = [
  {
    name: "Myra",
    agentId: 'agent_44a6ad13b3985625b2cdfe4a86'
  }, {
    name: "Adrian",
    agentId: 'agent_665660cbbbb9dfd6e10722f434'

  }
];

const Dashboard: React.FC = () => {
  const [callId, setCallId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string>(agents[0].agentId);
  const [dealership, setDealership] = useState<Dealership>({
    dealershipName: "",
    phone: "",
    carType: "",
    year: "",
  });


  const [callResult, setCallResult] = useState<CallResult | null>(null);

  const dealershipsList = [
    { dealershipName: "Dixie Toyota", phone: "+19052386000" },
    { dealershipName: "Erin Park Toyota", phone: "+19058287711" },
    { dealershipName: "Missisauga Toyota", phone: "+19056253420" },
    { dealershipName: "Classic Honda", phone: "+19054541434" },
    { dealershipName: "OpenRoad Honda", phone: "+19055954500" },
    { dealershipName: "Ideal Honda", phone: "+19052383480" },
    { dealershipName: "Meadowvale Honda", phone: "+18333893046" },
    { dealershipName: "Zayd Dealership", phone: "+16477108070" },
    { dealershipName: "Planet Ford", phone: "+19058406000" },
    { dealershipName: "Classic Honda", phone: "+19054567444", },
    { dealershipName: "Attrell Hyundai", phone: "+19054546767", },
    { dealershipName: "Kia of Brampton", phone: "+19054501880", },
    { dealershipName: "Mazda of Brampton", phone: "+19054599299", },
    { dealershipName: "Brampton Mitsubishi", phone: "+19054568011", },
    { dealershipName: "Brampton North Nissan", phone: "+19054957755", },
    { dealershipName: "Attrell Toyota", phone: "+19054562300", },
    { dealershipName: "AutoPark Mississauga", phone: "+19058966133", },
    { dealershipName: "Al-Hadid Motors Inc", phone: "+16479397262", },
    { dealershipName: "Mississauga Auto Centre", phone: "+19058235535", },
    { dealershipName: "Car Emporium", phone: "+16476272726", },
    { dealershipName: "401 Dixie Nissan", phone: "+18339440869", }
  ];


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


  const terminateCall = () => {
    setCallId(null);
    setCallResult(null);
    console.log("Call terminated");
  }

  // Function to make the phone call
  const callDealership = async () => {
    try {
      setCallId(null);
      setCallResult(null);
      const result = await makePhoneCall(
        agentId,
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
        } else if (response.call_status === "ended" && response.call_analysis !== undefined) {

          const finalResult: CallResult = {
            call_id: callId,
            dealershipName: dealership.dealershipName,
            dealershipPhone: dealership.phone,
            transcript: response.transcript ?? "",
            call_analysis: response.call_analysis,
            picked_up: response.call_analysis?.call_successful ?? false,
          }
          console.log("Final Result:", finalResult);

          setCallResult(finalResult);
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

  // Function to populate input fields based on selected dealership
  const handleDealershipSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDealership = dealershipsList.find(
      (dealer) => dealer.dealershipName === event.target.value
    );
    if (selectedDealership) {
      setDealership({
        ...selectedDealership,
        carType: "",
        year: "",
      });
    }
  };

  const handleAgentSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAgent = agents.find(
      (agent) => agent.agentId === event.target.value
    );
    if (selectedAgent) {
      setAgentId(selectedAgent.agentId);
    }
  };


  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 lg:px-24 py-36 bg-white">
        <h1 className="text-2xl text-black font-bold md:text-5xl">Caller Information</h1>

        {/* Dealership Dropdown */}

        <div className="flex gap-10 mt-5">
          {/* Dealership Information Box */}
          <div className="w-1/2 border border-gray-400 rounded-xl p-5">
            <div className="flex justify-between flex-row ">
              <h2 className="text-xl text-gray-700 font-semibold mb-4">Dealership</h2>
              <div className="">
                <select
                  id="dealershipSelect"
                  onChange={handleDealershipSelect}
                  className="w-full border text-black border-gray-400 rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-400"
                >
                  <option value="">Select a dealership</option>
                  {dealershipsList.map((dealer) => (
                    <option key={dealer.phone} value={dealer.dealershipName}>
                      {dealer.dealershipName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={callId ? terminateCall : callDealership}
            className={

              `${callId ? 'bg-red-500 hover:bg-red-700' : `bg-black hover:bg-gray-600`} mt-4 text-white font-semibold rounded-lg p-3 transition duration-200 flex flex-row items-center justify-center`}
          >
            <IoCall className="mr-1 text-white h-6 w-6" />
            <div className="text-xl font-bold text-white">
              {callId ? "Terminate Call" : "Call Dealership"}</div>
          </button>
          <div className="">
            <select
              id="agentSelect"
              onChange={handleAgentSelect}
              className="w-full border text-black border-gray-400 rounded-lg p-4 focus:outline-none mt-4 focus:ring focus:ring-gray-400"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.name} value={agent.agentId}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transcript Section */}
        <div className=" mt-12 w-full">
          <h1 className="text-2xl text-black font-bold md:text-5xl">Transcript</h1>
          {callResult && callResult.call_analysis && (
            <div className="flex flex-row gap-4 mt-4">
              <div className="rounded-lg bg-gray-200 text-black px-4 py-2 items-center">
                <span className="font-bold">Earliest Availability: </span>
                {callResult.call_analysis.custom_analysis_data.earliest_availability ?? ""}
              </div>
              <div className="rounded-lg bg-gray-200 text-black px-4 py-2">
                <span className="font-bold">Cost of oil change: </span>
                {callResult.call_analysis.custom_analysis_data.cost_oil_change ?
                  `$${callResult.call_analysis.custom_analysis_data.cost_oil_change}` :
                  ""}
              </div>
              <div className="rounded-lg bg-gray-200 text-black px-4 py-2">
                <span className="font-bold">Hold time: </span>
                {callResult.call_analysis.custom_analysis_data.hold_time ?? ""}
              </div>
              <div className="rounded-lg bg-gray-200 text-black px-4 py-2">
                <span className="font-bold">Data Collected: </span>
                {callResult.call_analysis.custom_analysis_data.information_collected ? "Yes" : "No"}
              </div>
              <div className={`rounded-lg bg-gray-200 text-white font-bold px-4 py-2
                ${callResult.call_analysis.call_successful ? 'bg-green-500' : 'bg-red-500'}`}>
                <span className="font-bold">Picked Up: </span>
                {callResult.call_analysis.call_successful ? "Yes" : "No"}
              </div>
            </div>
          )}
          <div className="border border-gray-400 rounded-xl p-5 mt-4 w-full text-black">
            {callResult ? (
              <div>
                <Transcript transcript={callResult.transcript} />
                              </div>
            ) : callId ? (
              <p>Waiting for call to complete...</p>
            ) : <p>No call made. </p>
            }
          </div>
        </div>

        {/* Call History */}
        <div className=" mt-12 w-full">
          <CallTable calls={calldata} setCallResult={setCallResult} />
        </div>


      </div>

    </section>
  );
};

export default Dashboard;

interface TranscriptProps {
  transcript: string;
}

const Transcript: React.FC<TranscriptProps> = ({ transcript }) => {
  // Split the transcript into lines by newline or `Agent:`/`User:` markers
  const lines = transcript.split(/(?=Agent:|User:)/g);

  return (
    <div className="space-y-2 p-4 rounded-lg">
      {lines.map((line, index) => (
        <div
          key={index}
          className={`p-2 rounded-lg ${line.startsWith("Agent:")
              ? "bg-gray-100 text-gray-800"
              : "bg-green-100 text-green-800"
            }`}
        >
          {line.trim()}
        </div>
      ))}
    </div>
  );
};
