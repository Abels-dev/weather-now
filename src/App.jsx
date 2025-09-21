import { useRef, useState } from "react";
import NavBar from "./components/NavBar";
import Loading from "./components/Loading";
import { weatherCodeMap } from "./utils/weatherCodeMap";
const App = () => {
   const [searchLocation, setSearchLocation] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [loading, setLoading] = useState(false);
   const [location, setLocation] = useState(null);
   const [currentWeather, setCurrentWeather] = useState(null);
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
   const fetchSuggestions = async (query) => {
      if (!query) return;
      try {
         const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`
         );
         const data = await res.json();
         setSuggestions(data.results || []);
         console.log("Fetched suggestions:", data);
      } catch (error) {
         console.log("Error fetching suggestions:", error);
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
         console.log("Extracted current weather data:", currentWeatherData);
      } else {
         console.log("Current hour not found in hourly data");
         console.log(currentWeatherData);
      }

      return currentWeatherData;
   };
   const fetchWeatherData = async (location) => {
      setLoading(true);
      try {
         const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m`
         );
         const data = await res.json();
         console.log("Fetched weather data:", data);

         const extractedWeather = extractCurrentWeather(data);
         console.log("Extracted weather data:", extractedWeather);
         setCurrentWeather(extractedWeather);
         const locationName = location.name + ", " + location.country;
         setLocation(locationName);
      } catch (error) {
         console.log("Error fetching weather data:", error);
      } finally {
         setLoading(false);
      }
   };
   const handleSelectSuggestion = (suggestion) => {
      setSearchLocation("");
      setSuggestions([]);
      console.log("Selected suggestion:", suggestion);
      fetchWeatherData(suggestion);
   };
   return (
      <div className="w-full min-h-screen bg-[#02012C] p-6">
         <div className="max-w-[1216px] mx-auto">
            <NavBar />
            <section>
               <h1 className="font-bold text-5xl text-white text-center my-16">
                  How’s the sky looking today?
               </h1>
               <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
                  <div className="flex-1 relative flex items-center gap-4 bg-[#1E1B3C] text-white py-4 px-6 rounded-xl">
                     <img src="./images/icon-search.svg" alt="Search Icon" />
                     <input
                        type="text"
                        placeholder="Search for places..."
                        value={searchLocation}
                        onChange={(e) => {
                           handleInputChange(e);
                        }}
                        className=" w-full focus:outline-0 placeholder:text-[#D4D3D9]"
                     />
                     {suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-16 bg-[#1E1B3C] text-white py-2 px-2 rounded-xl">
                           {suggestions.map((suggestion, index) => (
                              <div
                                 key={suggestion.id}
                                 onClick={() =>
                                    handleSelectSuggestion(suggestion)
                                 }
                                 className={`py-2 px-2 mb-1 cursor-pointer hover:bg-[#302F4A] rounded-lg  ${
                                    index === 0 ? "bg-[#302F4A] rounded-lg" : ""
                                 }`}>
                                 {suggestion.name}, {suggestion?.admin1},{" "}
                                 {suggestion.country}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                  <button className="px-6 py-4 bg-blue-600 text-white rounded-xl w-28">
                     Search
                  </button>
               </div>
            </section>
            {loading ? (
               <Loading />
            ) : (
               <section className="mt-12 grid grid-cols-[1fr_auto] grid-rows-[18rem_auto_auto] gap-6">
                  <div className="col-start-1 bg-[url('/images/bg-today-large.svg')] bg-cover bg-center p-4 h-72 w-full rounded-2xl flex items-center justify-between text-white">
                     <div>
                        <h1 className="font-bold text-3xl">{location}</h1>
                        <p className="text-[#D4D3D9] mt-2">
                           {currentWeather && formatDate(currentWeather.time)}
                        </p>
                     </div>
                     <div className="flex items-center gap-6">
                        <img
                           src={`./images/${
                              weatherCodeMap[currentWeather?.weathercode]
                           }`}
                           alt="Weather Icon"
                           className="size-32"
                        />
                        <h2 className="font-semibold text-8xl">
                           {currentWeather?.temperature}°
                        </h2>
                     </div>
                  </div>

                  <div className="col-start-1 rounded shadow w-full flex gap-5">
                     <div className="p-5 rounded-xl bg-[#262540] text-white w-48 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Feels Like</h2>
                        <p className="text-3xl">
                           {currentWeather?.apparentTemperature}°
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-[#262540] text-white w-48 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Humidity</h2>
                        <p className="text-3xl">
                           {currentWeather?.currentHumidity}%
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-[#262540] text-white w-48 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Wind Speed</h2>
                        <p className="text-3xl">
                           {currentWeather?.windspeed} km/h
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-[#262540] text-white w-48 h-28">
                        <h2 className="text-[#D4D3D9] mb-4">Precipitation</h2>
                        <p className="text-3xl">
                           {currentWeather?.currentPrecipitation} mm/h
                        </p>
                     </div>
                  </div>
                  <div className="col-start-1 bg-[#1E1B3C] p-4 rounded shadow w-full"></div>

                  <aside className="col-start-1 md:col-start-2 md:row-start-1 row-span-3 bg-[#1E1B3C] text-white p-4 rounded-2xl">
                     <div className="w-80">hello</div>
                  </aside>
               </section>
            )}
         </div>
      </div>
   );
};

export default App;
