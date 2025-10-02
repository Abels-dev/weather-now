import { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import { weatherCodeMap } from "./utils/weatherCodeMap";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import { Error } from "./components/Error";
const App = () => {
   const [searchLocation, setSearchLocation] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [exactLocation, setExactLocation] = useState(null);
   const [loading, setLoading] = useState(true);
   const [searchLoading, setSearchLoading] = useState(false);
   const [error, setError] = useState(false);
   const [retry, setRetry] = useState(false);
   const [currentWeather, setCurrentWeather] = useState(null);
   const [dailyForecast, setDailyForecast] = useState(null);
   const [hourlyForecast, setHourlyForecast] = useState(null);
   const [favouriteLocations,setFavouriteLocations]=useState(localStorage.getItem("favouriteLocations") ? JSON.parse(localStorage.getItem("favouriteLocations")) : []);
   const [notFound, setNotFound] = useState(false);
   const [units, setUnits] = useState({
      temperature: "celsius",
      windspeed: "kmh",
      precipitation: "mm",
   });
   const timeoutRef = useRef(null);
   const formatDate = (dateString) => {
      const date = new Date(dateString);

      const options = {
         weekday: "long",
         year: "numeric",
         month: "short",
         day: "numeric",
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
      return formatted;
   };
   const handleUnitChange = (unitType) => {
      if (unitType === "metric") {
         setUnits({
            temperature: "celsius",
            windspeed: "kmh",
            precipitation: "mm",
         });
      } else {
         setUnits({
            temperature: "fahrenheit",
            windspeed: "mph",
            precipitation: "inch",
         });
      }
   };
   const handleRetry = () => {
      setError(false);
      setRetry(true);
   };
   const handleFavourites=()=>{
      if(!exactLocation.favourite){
            setFavouriteLocations(prev => {
            if (!exactLocation) return prev;
            const exists = prev.some(
            loc =>
               loc.latitude === exactLocation.latitude &&
               loc.longitude === exactLocation.longitude
            );
            if (exists) return prev;
            const updated = [...prev, { ...exactLocation, favourite: true }];
            localStorage.setItem("favouriteLocations", JSON.stringify(updated));
            return updated;
         })
         setExactLocation(prev => prev ? { ...prev, favourite: true } : prev);
      }else{
         setFavouriteLocations(prev => {
            if (!exactLocation) return prev;

            const updated= prev.filter(
               loc =>
                  !(loc.latitude === exactLocation.latitude &&
                  loc.longitude === exactLocation.longitude)
            );
            localStorage.setItem("favouriteLocations", JSON.stringify(updated));
            return updated;
         })
         setExactLocation(prev => prev ? { ...prev, favourite: false } : prev);
      }
   }
   const handleSelectFavourite=(location)=>{
        fetchWeatherData(location);
        fetchDailyForecast(location);
        setExactLocation(location);
   }
   const fetchSuggestions = async (query) => {
      if (!query) return;
      setSearchLoading(true);
      try {
         const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`
         );
         const data = await res.json();
         setSuggestions(data.results || []);
      } catch (error) {
         console.log("Error fetching suggestions:", error);
      } finally {
         setSearchLoading(false);
      }
   };
   const handleSearchBtn = () => {
      fetchSuggestions(searchLocation);
      if (suggestions.length === 0) {
         setNotFound(true);
      } else {
         setNotFound(false);
      }
   };
   const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchLocation(value);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
         fetchSuggestions(value);
      }, 400); // debounce 400ms
   };
   const extractCurrentWeather = (data) => {
      const currentWeatherData = { ...data.current_weather };
      const now = new Date();
      const currentHour = now.toISOString().slice(0, 13) + ":00";
      const timeArray = data.hourly.time;
      const index = timeArray.indexOf(currentHour);

      if (index !== -1) {
         currentWeatherData.currentHumidity =
            data.hourly.relative_humidity_2m[index];
         currentWeatherData.apparentTemperature =
            data.hourly.apparent_temperature[index];
         currentWeatherData.currentPrecipitation =
            data.hourly.precipitation[index];
      } else {
         console.log("Current hour not found in hourly data");
      }

      return currentWeatherData;
   };
   const fetchWeatherData = async (location) => {      
      setLoading(true);
      try {
         const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weathercode&temperature_unit=${units.temperature}&windspeed_unit=${units.windspeed}&precipitation_unit=${units.precipitation}`
         );
         const data = await res.json();
         setHourlyForecast(data.hourly);
         const extractedWeather = extractCurrentWeather(data);
         setCurrentWeather(extractedWeather);
      } catch (error) {
         console.log("Error fetching weather data:", error);
         setError(true);
      } finally {
         setLoading(false);
      }
   };
   const fetchDailyForecast = async (location) => {
      try {
         const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&temperature_unit=${units.temperature}&windspeed_unit=${units.windspeed}&precipitation_unit=${units.precipitation}`
         );
         const data = await res.json();
         setDailyForecast(data.daily);
      } catch (error) {
         console.log("Error fetching daily forecast data:", error);
         setError(true);
      }
   };
   const handleSelectSuggestion = (suggestion) => {
      const isFavourite = favouriteLocations.some(
         (loc) =>
            loc.latitude === suggestion.latitude &&
            loc.longitude === suggestion.longitude
      );
      setNotFound(false);
      setSearchLocation("");
      setSuggestions([]);
      setExactLocation({
         latitude: suggestion.latitude,
         longitude: suggestion.longitude,
         name: suggestion.name,
         country: suggestion.country,
         favourite: isFavourite,
      });
      fetchWeatherData(suggestion);
      fetchDailyForecast(suggestion);
   };

   useEffect(() => {
      const fetchIntialData = async () => {         
         let location = localStorage.getItem("defaultLocation")
            ? JSON.parse(localStorage.getItem("defaultLocation"))
            : null;
         try {
            if (!location) {
               const pos = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                     timeout: 8000,
                     maximumAge: 0,
                  });
               });    
               const coords = {
                  lat: pos.coords.latitude,
                  lon: pos.coords.longitude,
                  source: "browser",
               };               
               const locationRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`
               );
               const locationData = await locationRes.json();

               location = {
                  latitude: coords.lat,
                  longitude: coords.lon,
                  name: locationData.address.state,
                  country: locationData.address.country,
               };
               localStorage.setItem(
                  "defaultLocation",
                  JSON.stringify(location)
               );
            }
            const isFavourite = favouriteLocations.some(
               (loc) =>
                  loc.latitude === location.latitude &&
                  loc.longitude === location.longitude
            );
            setExactLocation({...location, favourite: isFavourite});
            fetchWeatherData(location);
            fetchDailyForecast(location);
         } catch (err) {
            let loc;
            if(favouriteLocations?.length>0){
                loc=favouriteLocations[0];
            }else{
               loc={ latitude: 40.7128, longitude: -74.006, name: "New York", country: "USA", favourite: false };
            }
            setExactLocation(loc);
            fetchWeatherData(loc);
            fetchDailyForecast(loc);
            console.warn("Geolocation failed:", err.message);
         }
      };

      if (!exactLocation) fetchIntialData();
      else {
         fetchWeatherData(exactLocation);
         fetchDailyForecast(exactLocation);
      }
      setRetry(false);
   }, [units.temperature, units.windspeed, units.precipitation, retry]);

   if (error) {
      return (
         <div className="w-full min-h-screen bg-[#02012C] not-dark:bg-[url('./images/light-background.jpg')]  p-6 font-bricolage">
            <NavBar />
            <Error handleRetry={handleRetry} />
         </div>
      );
   }
   return (
      <div className="w-full min-h-screen bg-[url('./images/light-background.jpg')] dark:bg-[url('')] dark:bg-[#02012C]   p-6 font-bricolage">
         <div className="max-w-[1216px] mx-auto">
            <NavBar handleUnitChange={handleUnitChange} favouriteLocations={favouriteLocations} exactLocation={exactLocation} handleSwitchToFavourite={handleSelectFavourite} />
            <section>
               <h1 className="font-bold font-bricolage text-6xl text-white not-dark:text-[#02012C] text-center my-16 leading-snug">
                  How’s the sky looking today?
               </h1>
               <div className="flex not-md:flex-col items-center gap-4 w-full max-w-2xl mx-auto">
                  <div className="flex-1 relative flex items-center gap-4 bg-[#1E1B3C] not-dark:bg-white shadow-md not-dark:text-slate-900 text-white py-4 px-6 rounded-xl w-full">
                     <img src="./images/icon-search.svg" alt="Search Icon" />
                     <input
                        type="text"
                        placeholder="Search for places..."
                        value={searchLocation}
                        onChange={(e) => {
                           handleInputChange(e);
                        }}
                        className=" w-full focus:outline-0 placeholder:text-[#D4D3D9] not-dark:placeholder:text-slate-700"
                     />
                     {suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-16 bg-[#1E1B3C] not-dark:bg-[#4C5D99] text-white py-2 px-2 rounded-xl">
                           {searchLoading ? (
                              <div className="flex items-center gap-2 py-2 px-2 mb-1 cursor-pointer hover:bg-[#302F4A] not-dark:hover:bg-[#3A4B7A] rounded-lg">
                                 <img
                                    src="./images/icon-loading.svg"
                                    alt="Loading..."
                                 />
                                 <span>Search in progress</span>
                              </div>
                           ) : (
                              suggestions.map((suggestion, index) => (
                                 <div
                                    key={suggestion.id}
                                    onClick={() =>
                                       handleSelectSuggestion(suggestion)
                                    }
                                    className={`py-2 px-2 mb-1 cursor-pointer hover:bg-[#302F4A] not-dark:hover:bg-[#3A4B7A] rounded-lg  ${
                                       index === 0
                                          ? "bg-[#302F4A] rounded-lg not-dark:bg-[#3A4B7A]"
                                          : ""
                                    }`}>
                                    {suggestion.name}, {suggestion?.admin1},{" "}
                                    {suggestion.country}
                                 </div>
                              ))
                           )}
                        </div>
                     )}
                  </div>
                  <button
                     className="px-6 py-4 bg-blue-600 hover:bg-blue-800 text-white rounded-xl not-md:w-full w-28"
                     onClick={handleSearchBtn}>
                     Search
                  </button>
               </div>
            </section>
            {notFound ? (
               <div className="font-semibold text-white text-2xl text-center mt-12">
                  No search result found!
               </div>
            ) : (
               <section className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] grid-rows-[16rem_auto_auto] gap-6">
                  <div
                     className={`col-start-1 ${
                        loading
                           ? "bg-[#262540] not-dark:bg-[#4b536b] animate-pulse"
                           : "bg-[url('/images/bg-today-small.svg')] md:bg-[url('/images/bg-today-large.svg')] bg-cover bg-center"
                     } not-md:px-2 not-md:py-6 p-4 w-full rounded-2xl flex not-md:flex-col gap-4 items-center md:justify-between text-white`}>
                     {loading ? (
                        <div className="text-lg text-[#D4D3D9] flex flex-col items-center justify-center self-center w-full h-full gap-2">
                           <img src="./images/icon-loading-dots.png" />
                           <span>Loading...</span>
                        </div>
                     ) : (
                        <>
                           <div className="w-full">
                              <div className="flex items-center gap-4">
                                 <h1 className="font-bold text-3xl not-md:text-center">
                                 {exactLocation?.name +
                                    ", " +
                                    exactLocation?.country}
                                 </h1>
                                 <button onClick={handleFavourites} className="cursor-pointer"><img src={`/images/${exactLocation?.favourite ? "favouriteFilled.png" : "favourite.png"}`} className="size-6"/></button>
                              </div>
                              <p className="text-[#D4D3D9] mt-2 not-md:text-center">
                                 {currentWeather &&
                                    formatDate(currentWeather.time)}
                              </p>
                           </div>
                           <div className="flex items-center justify-center gap-6 w-full flex-wrap">
                              <img
                                 src={`./images/${
                                    weatherCodeMap[currentWeather?.weathercode]
                                 }`}
                                 alt="Weather Icon"
                                 className="size-24 md:size-32"
                              />
                              <h2 className="font-semibold text-6xl md:text-8xl">
                                 {currentWeather?.temperature}°
                              </h2>
                           </div>
                        </>
                     )}
                  </div>

                  <div className="col-start-1 rounded w-full flex gap-3 md:gap-4 flex-wrap">
                     <div className="p-5 rounded-xl bg-[#262540]  not-dark:bg-[#4C5D99] text-white w-40 md:w-44 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Feels Like</h2>
                        <p className="text-2xl">
                           {loading
                              ? "__"
                              : currentWeather?.apparentTemperature + "°"}
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-[#262540] not-dark:bg-[#4C5D99] text-white w-40 md:w-44 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Humidity</h2>
                        <p className="text-2xl">
                           {loading
                              ? "__"
                              : currentWeather?.currentHumidity + "%"}
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-[#262540] not-dark:bg-[#4C5D99] text-white w-40 md:w-44 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Wind Speed</h2>
                        <p className="text-2xl">
                           {loading
                              ? "__"
                              : currentWeather?.windspeed +
                                " " +
                                (units.windspeed == "kmh" ? "km/h" : "mph")}
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-[#262540] not-dark:bg-[#4C5D99] text-white w-40 md:w-44 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Precipitation</h2>
                        <p className="text-2xl">
                           {loading
                              ? "__"
                              : currentWeather?.currentPrecipitation +
                                " " +
                                (units.precipitation == "mm" ? "mm" : "inch")}
                        </p>
                     </div>
                  </div>
                  <div className="col-start-1 rounded w-full pt-4">
                     <h2 className="text-lg font-semibold mb-4 text-white not-dark:text-[#02012C]">
                        Daily Forecast
                     </h2>
                     <DailyForecast data={dailyForecast} loading={loading} />
                  </div>

                  <aside className="col-start-1 lg:col-start-2 lg:row-start-1 row-span-3 bg-[#1E1B3C] not-dark:bg-[#4C5D99] text-white p-6 rounded-2xl">
                     <div className="w-full lg:w-80">
                        <HourlyForecast
                           data={hourlyForecast}
                           loading={loading}
                           currentTempUnit={units.temperature}
                        />
                     </div>
                  </aside>
               </section>
            )}
         </div>
      </div>
   );
};

export default App;
