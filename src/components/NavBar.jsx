import { useState } from "react";

const NavBar = ({handleUnitChange}) => {
   const UNITS = [
      { Temperature: ["Celsius (°C)", "Fahrenheit (°F)"] },
      { Wind: ["km/h", "mph"] },
      { Precipitation: ["millimeters (mm)", "inches (in)"] },
   ];
   const [selectedUnit, setSelectedUnit] = useState("metric");
   const [showUnits, setShowUnits] = useState(false);

   const handleSwitchUnit = () => {
      setSelectedUnit(selectedUnit === "metric" ? "imperial" : "metric");
      setShowUnits(false);
      handleUnitChange(selectedUnit === "metric" ? "imperial" : "metric");
   }
   return (
      <nav className="flex items-center justify-between">
         <div>
            <img src="./images/logo.svg" alt="logo" className="not-md:w-36" />
         </div>
         <div className="relative">
            <button className="flex items-center p-2 px-3 md:p-3 md:px-4 gap-2 bg-[#262540] rounded-lg cursor-pointer"
               onClick={() => setShowUnits(!showUnits)}>
               <img src="./images/icon-units.svg" alt="menu" className="" />
               <span className="text-white">Units</span>
               <img
                  src="./images/icon-dropdown.svg"
                  alt="drop-down"
                  className=""
               />
            </button>
            {showUnits && (
               <div className="absolute z-30 right-0 w-52 p-3 bg-[#262540] rounded-lg mt-2">
                  <button className="text-white mb-4 cursor-pointer" onClick={handleSwitchUnit}>Switch to {selectedUnit === "metric" ? "Imperial" : "Metric"}</button>
                  <div>
                     {UNITS.map((unit, index) => {
                        const key = Object.keys(unit)[0];
                        return (
                           <div
                              key={index}
                              className={`${
                                 (index !== 2)
                                    ? "border-b border-b-[#3C3B5E] mb-2"
                                    : ""
                              }`}>
                              <h4 className="text-[#ACACB7] text-sm">
                                 {key === "Wind" ? "Wind Speed" : key}
                              </h4>
                              <ul className="my-1">
                                 {unit[key].map((value, i) => (
                                    <li
                                       key={i}
                                       className={`text-white p-1 py-2 flex items-center justify-between hover:bg-[#302F4A] rounded-lg mb-1 ${
                                          i == 1 && selectedUnit === "imperial"|| (i == 0 && selectedUnit === "metric")
                                             ? "bg-[#302F4A] rounded-lg"
                                             : ""
                                       }`}>
                                       {value}
                                       {((i == 1 && selectedUnit === "imperial") || (i == 0 && selectedUnit === "metric")) && (
                                          <img
                                             src="./images/icon-checkmark.svg"
                                             alt="check"
                                          />
                                       )}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
};

export default NavBar;
