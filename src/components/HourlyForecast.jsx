import { useState } from "react";
import { weatherCodeMap } from "../utils/weatherCodeMap";

const DATES = [
   "Monday",
   "Tuesday",
   "Wednesday",
   "Thursday",
   "Friday",
   "Saturday",
   "Sunday",
];
const HourlyForecast = ({ data, currentTempUnit, loading }) => {
   const arrDemo = [1, 2, 3, 4, 5, 6, 7, 8];
   const [currentDay, setCurrentDay] = useState(
      formatDate(data?.time[0] || new Date())
   );
   const [showDropdown, setShowDropdown] = useState(false);
   function formatDate(dateString) {
      const date = new Date(dateString);

      const options = {
         weekday: "long",
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
      return formatted;
   }
   const handleChangeDay = (day) => {
      setCurrentDay(day);
      setShowDropdown(false);
   };
   return (
      <div>
         <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Hourly Forecast</h2>
            <div className="relative">
               <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-2 px-4 rounded-lg bg-[#3C3B5E] not-dark:bg-[#3A4B7A]">
                  {currentDay}{" "}
                  <img src="./images/icon-dropdown.svg" alt="Expand" />
               </button>
               {showDropdown && (
                  <div className="absolute top-12 z-30 right-0 bg-[#262540] not-dark:bg-[#3A4B7A] p-2 rounded-xl w-52 shadow-sm shadow-slate-900">
                     {DATES.map((day, index) => (
                        <div
                           key={index}
                           onClick={() => handleChangeDay(day)}
                           className={`p-2  mt-1 rounded-lg hover:bg-[#302F4A] not-dark:hover:bg-[#4C5D99] cursor-pointer ${
                              currentDay === day ? "bg-[#302F4A] not-dark:bg-[#4C5D99]" : ""
                           }`}>
                           {day}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
         <div>
            {loading ? (
               <>
                  {arrDemo.map((_, index) => (
                     <div
                        key={index}
                        className="flex items-center h-[55px] justify-between mt-4 px-3 pr-4 py-2 bg-[#302F4A] not-dark:bg-[#5A6B9C] rounded-lg w-full animate-pulse">
                     </div>
                  ))}
               </>
            ) : (
               data?.time &&
               data?.time.map((time, index) => {
                  if (formatDate(time) === currentDay && index % 3 === 0) {
                     const date = new Date(time);
                     const hours = date.getHours();
                     const formattedTime = hours % 12 || 12;
                     const ampm = hours >= 12 ? "PM" : "AM";
                     return (
                        <div
                           key={index}
                           className="flex items-center justify-between mt-4 px-3 pr-4 py-2 bg-[#302F4A] not-dark:bg-[#5A6B9C] rounded-lg w-full">
                           <div className="flex items-center gap-2">
                              <img
                                 src={`./images/${
                                    weatherCodeMap[data?.weathercode[index]]
                                 }`}
                                 alt="Weather Icon"
                                 className="size-10"
                              />
                              <div className="text-white text-sm">
                                 {formattedTime} {ampm}
                              </div>
                           </div>
                           <div className="text-white text-sm">
                              {data.apparent_temperature
                                 ? Math.round(data.apparent_temperature[index])
                                 : "--"}
                              °{currentTempUnit === "celsius" ? "C" : "F"}
                           </div>
                        </div>
                     );
                  }
               })
            )}
         </div>
      </div>
   );
};

export default HourlyForecast;
