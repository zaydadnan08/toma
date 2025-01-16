import React, { useState } from "react";
import { Call } from "retell-sdk/resources/call.mjs";

// Define the CallResult type
interface CallResult {
  call_id: string;
  transcript: string;
  dealershipName: string;
  dealershipPhone: string;
  call_analysis?: any;
  picked_up: boolean;
}

interface CallTableProps {
    calls: CallResult[]; 
    setCallResult: React.Dispatch<React.SetStateAction<CallResult | null>>;  // Type for setCallResult
  }
  

  const CallTable: React.FC<CallTableProps> = ({ calls, setCallResult }) => {
    const [expandedCallId, setExpandedCallId] = useState<string | null>(null);

  const toggleExpand = (callId: string) => {
    setExpandedCallId((prev) => (prev === callId ? null : callId));
  };

  return (
    <div className="mt-12 w-full overflow-x-auto">
      <h1 className="text-2xl text-black font-bold md:text-5xl mb-6">Call History</h1>
      <table className="mt-6 w-full rounded-lg border border-gray-300">
        <thead className="rounded-xl">
          <tr className="bg-gray-100 rounded-lg">
            <th className="p-4 text-left text-base font-semibold text-black">Dealership Name</th>
            <th className="p-4 text-left text-base font-semibold text-black">Picked Up</th>
            <th className="p-4 text-left text-base font-semibold text-black">Call ID</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <React.Fragment key={call.call_id}>
              <tr
                className="border-t border-gray-300 text-black cursor-pointer hover:bg-gray-200"
                onClick={() => setCallResult(call)}
              >
                <td className="p-4 text-base">{call.dealershipName}</td>
                <td className="p-4 text-base">{call.picked_up ? "Yes" : "No"}</td>
                <td className="p-4 text-base">{call.call_id}</td>
              </tr>

              {/* Conditionally render expanded row
              {expandedCallId === call.call_id && (
                <tr className="transition-all duration-300 ease-in-out">
                  <td colSpan={3} className="p-6 bg-gray-50 text-base text-black">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-black">Transcript:</h3>
                      <p className="text-gray-700 break-words">{call.transcript}</p>
                      {call.call_analysis && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-black">Call Analysis:</h4>
                          <pre className="bg-gray-200 p-4 rounded text-gray-700">
                            {JSON.stringify(call.call_analysis, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )} */}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallTable;
