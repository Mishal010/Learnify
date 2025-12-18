// import React, { useState, useEffect } from "react";
// import { getCurrenciesApi } from "../api/currencyApi";

// const CurrencySelector = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const { currency, setCurrency } = useCurrencyStore();

//   // Map currencies to country codes for flag images
//   const flagMap = {
//     INR: "in",
//     USD: "us",
//     EUR: "eu",
//     GBP: "gb",
//     AUD: "au",
//     CAD: "ca",
//     SGD: "sg",
//     AED: "ae",
//     SAR: "sa",
//   };

//   useEffect(() => {
//     const fetchCurrencies = async () => {
//       try {
//         const response = await getCurrenciesApi();
//         if (response.success) {
//           setCurrencies(response.currencies);
//         }
//       } catch (error) {
//         console.error("Failed to load currencies:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrencies();
//   }, []);

//   const selected = currencies[0]; // Default to the first currency if available
//   const flagUrl = selected
//     ? `https://flagcdn.com/h-20/${flagMap[selected.code]}.png`
//     : null;

//   return (
//     <div className="relative inline-block">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-full hover:border-blue-500 transition duration-200 shadow-sm hover:shadow-md"
//       >
//         {flagUrl && (
//           <img
//             src={flagUrl}
//             alt={selected?.code}
//             className="w-5 h-4 rounded"
//             onError={(e) => (e.target.style.display = "none")}
//           />
//         )}
//         <span className="font-semibold text-gray-700 text-sm">
//           {selected?.code || "Currency"}
//         </span>
//         <svg
//           className={`w-3 h-3 text-gray-600 transition transform ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 14l-7 7m0 0l-7-7m7 7V3"
//           />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50">
//           <div className="p-3 max-h-72 overflow-y-auto">
//             {loading ? (
//               <div className="p-4 text-center text-gray-500 text-sm">
//                 Loading...
//               </div>
//             ) : currencies.length === 0 ? (
//               <div className="p-4 text-center text-gray-500 text-sm">
//                 No currencies available
//               </div>
//             ) : (
//               currencies.map((curr) => (
//                 <button
//                   key={curr.code}
//                   onClick={() => {
//                     setCurrency(curr.code);
//                     setIsOpen(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition mb-1 ${
//                     currency === curr.code
//                       ? "bg-blue-100 border-l-4 border-blue-600"
//                       : ""
//                   }`}
//                 >
//                   <img
//                     src={`https://flagcdn.com/h-20/${flagMap[curr.code]}.png`}
//                     alt={curr.code}
//                     className="w-6 h-5 rounded"
//                     onError={(e) => (e.target.style.display = "none")}
//                   />
//                   <div className="flex-1 text-left">
//                     <div className="font-semibold text-gray-900 text-sm">
//                       {curr.symbol} {curr.code}
//                     </div>
//                     <div className="text-xs text-gray-500">{curr.name}</div>
//                   </div>
//                   {currency === curr.code && (
//                     <svg
//                       className="w-4 h-4 text-blue-600"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CurrencySelector;
