import { useEffect, useState } from "react";

const NavBar = ({ handleUnitChange, favouriteLocations, exactLocation, handleSwitchToFavourite }) => {
   const UNITS = [
      { Temperature: ["Celsius (°C)", "Fahrenheit (°F)"] },
      { Wind: ["km/h", "mph"] },
      { Precipitation: ["millimeters (mm)", "inches (in)"] },
   ];
   const [selectedUnit, setSelectedUnit] = useState("metric");
   const [showUnits, setShowUnits] = useState(false);
   const [showFavourites, setShowFavourites] = useState(false);
   const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [mobileFavOpen, setMobileFavOpen] = useState(false);
   const [mobileUnitsOpen, setMobileUnitsOpen] = useState(false);
   const handleSwitchUnit = () => {
      setSelectedUnit(selectedUnit === "metric" ? "imperial" : "metric");
      setShowUnits(false);
      handleUnitChange(selectedUnit === "metric" ? "imperial" : "metric");
   };
   const handleSelectFavourite = (location) => {            
      setShowFavourites(false);
      handleSwitchToFavourite(location);
   };
   const handleThemeChange = () => {
      if (isDarkMode) {
         document.querySelector("html").classList.remove("dark");
         localStorage.setItem("theme", "light");
         setIsDarkMode(false);
      } else {
         document.querySelector("html").classList.add("dark");
         localStorage.setItem("theme", "dark");
         setIsDarkMode(true);
      }
   };
   useEffect(()=>{
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme || savedTheme === "dark") {
         document.documentElement.classList.add("dark");
         if (!savedTheme) {
         localStorage.setItem("theme", "dark");
         }
         setIsDarkMode(true);
      }
   },[])
   return (
      <nav className="flex items-center justify-between relative">
         <div>
            <img src="./images/logo.svg" alt="logo" className="not-md:w-36" />
         </div>
         {/* Desktop menu */}
         <div className="hidden md:flex items-center gap-4 md:gap-6">
            <div className="relative">
               <button
                  className="flex items-center gap-2 p-2 px-3 md:p-3 md:px-4 text-white bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg cursor-pointer focus:ring-1 focus:ring-amber-50"
                  onClick={() => setShowFavourites(!showFavourites)}>
                  <img src="./images/favouriteFilled.png" alt="favourites" className="size-4"/>
                  <span>Favourites</span>
                  <img
                     src="./images/icon-dropdown.svg"
                     alt="drop-down"
                  />
               </button>
               {showFavourites && (
                  <div className="absolute z-30 right-0 w-52 p-2 bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg mt-2">
                     {favouriteLocations?.length > 0 ? (
                        favouriteLocations.map((location, index) => (
                           <div
                              key={index}
                              onClick={() => handleSelectFavourite(location)}
                              className={`text-white p-2 flex items-center justify-between hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] rounded-lg mb-1 
                            ${
                               exactLocation?.name === location.name
                                  ? "bg-[#302F4A] not-dark:bg-[#5A6B9C] rounded-lg"
                                  : ""
                            }`}>
                              {location.name}
                              {exactLocation?.name === location.name && (
                                 <img
                                    src="./images/icon-checkmark.svg"
                                    alt="check"
                                 />
                              )}
                           </div>
                        ))
                     ) : (
                        <p className="text-white p-3">No favourite locations</p>
                     )}
                  </div>
               )}
            </div>
            <div className="relative">
               <button
                  className="flex items-center p-2 px-3 md:p-3 md:px-4 gap-2 focus:ring-1 focus:ring-amber-50 bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg cursor-pointer"
                  onClick={() => setShowUnits(!showUnits)}>
                  <img src="./images/icon-units.svg" alt="menu"/>
                  <span className="text-white">Units</span>
                  <img
                     src="./images/icon-dropdown.svg"
                     alt="drop-down"/>
               </button>
               {showUnits && (
                  <div className="absolute z-30 right-0 w-52 p-3 bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg mt-2">
                     <button
                        className="text-white mb-4 cursor-pointer hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] rounded-lg p-2 w-full text-start focus:ring-1 focus:ring-amber-50"
                        onClick={handleSwitchUnit}>
                        Switch to{" "}
                        {selectedUnit === "metric" ? "Imperial" : "Metric"}
                     </button>
                     <div>
                        {UNITS.map((unit, index) => {
                           const key = Object.keys(unit)[0];
                           return (
                              <div
                                 key={index}
                                 className={`${
                                    index !== 2
                                       ? "border-b border-b-[#3C3B5E] not-dark:border-gray-300 mb-2"
                                       : ""
                                 }`}>
                                 <h4 className="text-[#ACACB7] text-sm">
                                    {key === "Wind" ? "Wind Speed" : key}
                                 </h4>
                                 <ul className="my-1">
                                    {unit[key].map((value, i) => (
                                       <li
                                          key={i}
                                          className={`text-white p-1 py-2 flex items-center justify-between hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] rounded-lg mb-1 ${
                                             (i == 1 &&
                                                selectedUnit === "imperial") ||
                                             (i == 0 &&
                                                selectedUnit === "metric")
                                                ? "bg-[#302F4A] not-dark:bg-[#5A6B9C] rounded-lg"
                                                : ""
                                          }`}>
                                          {value}
                                          {((i == 1 &&
                                             selectedUnit === "imperial") ||
                                             (i == 0 &&
                                                selectedUnit === "metric")) && (
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
            <button onClick={handleThemeChange} className="flex items-center gap-2 p-2 px-3 md:p-3 md:px-4 text-white bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg cursor-pointer">
               <img
                  src={isDarkMode ? "./images/icon-sun.png" : "./images/icon-dark.png"}
                  alt={isDarkMode ? "Light mode" : "Dark mode"}
                  className="size-5"
               /> <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
            </button>
         </div>
         {/* Burger menu for mobile */}
         <button
            className="md:hidden flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
         >
            <svg className="w-7 h-7 text-white not-dark:text-[#262540]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
         </button>
         {/* Mobile dropdown menu below navbar */}
         {mobileMenuOpen && (
            <div className="absolute left-0 right-0 top-full z-50 bg-[#262540] not-dark:bg-[#4C5D99] text-white rounded-md shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden animate-fadeInDown">
               {/* Favourites collapsible */}
               <div>
                  <button
                     className="w-full flex items-center justify-between font-semibold py-2 px-2 rounded hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] focus:outline-none"
                     onClick={() => setMobileFavOpen((v) => !v)}
                  >
                     <span>Favourites</span>
                     <svg className={`w-5 h-5 transform transition-transform ${mobileFavOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                     </svg>
                  </button>
                  {mobileFavOpen && (
                     <div className="mt-2 bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg p-2">
                        {favouriteLocations?.length > 0 ? (
                           favouriteLocations.map((location, index) => (
                              <div
                                 key={index}
                                 onClick={() => { handleSelectFavourite(location); setMobileMenuOpen(false); }}
                                 className={`text-white p-2 flex items-center justify-between hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] rounded-lg mb-1 ${exactLocation?.name === location.name ? "bg-[#302F4A] not-dark:bg-[#5A6B9C] rounded-lg" : ""}`}
                              >
                                 {location.name}
                                 {exactLocation?.name === location.name && (
                                    <img src="./images/icon-checkmark.svg" alt="check" />
                                 )}
                              </div>
                           ))
                        ) : (
                           <p className="text-white p-3">No favourite locations</p>
                        )}
                     </div>
                  )}
               </div>
               {/* Units collapsible */}
               <div>
                  <button
                     className="w-full flex items-center justify-between font-semibold py-2 px-2 rounded hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] focus:outline-none"
                     onClick={() => setMobileUnitsOpen((v) => !v)}
                  >
                     <span>Units</span>
                     <svg className={`w-5 h-5 transform transition-transform ${mobileUnitsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                     </svg>
                  </button>
                  {mobileUnitsOpen && (
                     <div className="mt-2 bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg p-2">
                        <button
                           className="text-white mb-4 cursor-pointer hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] rounded-lg p-2 w-full text-start"
                           onClick={() => { handleSwitchUnit(); setMobileMenuOpen(false); }}
                        >
                           Switch to {selectedUnit === "metric" ? "Imperial" : "Metric"}
                        </button>
                        <div>
                           {UNITS.map((unit, index) => {
                              const key = Object.keys(unit)[0];
                              return (
                                 <div key={index} className={`${index !== 2 ? "border-b border-b-[#3C3B5E] not-dark:border-gray-300 mb-2" : ""}`}>
                                    <h4 className="text-[#ACACB7] text-sm">{key === "Wind" ? "Wind Speed" : key}</h4>
                                    <ul className="my-1">
                                       {unit[key].map((value, i) => (
                                          <li
                                             key={i}
                                             className={`text-white p-1 py-2 flex items-center justify-between hover:bg-[#302F4A] not-dark:hover:bg-[#5A6B9C] rounded-lg mb-1 ${(i == 1 && selectedUnit === "imperial") || (i == 0 && selectedUnit === "metric") ? "bg-[#302F4A] not-dark:bg-[#5A6B9C] rounded-lg" : ""}`}
                                          >
                                             {value}
                                             {((i == 1 && selectedUnit === "imperial") || (i == 0 && selectedUnit === "metric")) && (
                                                <img src="./images/icon-checkmark.svg" alt="check" />
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
               {/* Theme toggle always visible */}
               <button onClick={() => { handleThemeChange(); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 px-3 text-white bg-[#262540] not-dark:bg-[#4C5D99] rounded-lg cursor-pointer">
                  <img
                     src={isDarkMode ? "./images/icon-sun.png" : "./images/icon-dark.png"}
                     alt={isDarkMode ? "Light mode" : "Dark mode"}
                     className="size-5"
                  /> <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
               </button>
            </div>
         )}
      </nav>
   );
};

export default NavBar;
