import { useRef, useState } from "react";
import NavBar from "./components/NavBar";

const App = () => {
   const [searchLocation, setSearchLocation] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const timeoutRef = useRef(null);

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
                                 className={`py-2 px-2 mb-1 hover:bg-[#302F4A] rounded-lg ${
                                    index === 0 ? "bg-[#302F4A] rounded-lg" : ""
                                 }`}>
                                 {suggestion.name}, {suggestion.admin1},{" "}
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
            <section className="mt-12 grid grid-cols-[1fr_auto] grid-rows-3 gap-6">
               <div className="col-start-1 bg-[url('/images/bg-today-large.svg')] bg-cover bg-center p-4 h-72 w-full rounded-2xl flex items-center justify-between text-white">
                  <div>
                     <h1 className="font-bold text-3xl">Berlin , Germany</h1>
                     <p className="text-[#D4D3D9] mt-2">Tuesday, Aug 5, 2023</p>
                  </div>
                  <div className="flex items-center gap-6">
                     <img
                        src="./images/icon-sunny.webp"
                        alt="Sun Icon"
                        className="size-32"
                     />
                     <h2 className="font-semibold text-8xl">20°</h2>
                  </div>
               </div>

               <div className="col-start-1 bg-[#1E1B3C] p-4 rounded shadow w-full"></div>
               <div className="col-start-1 bg-[#1E1B3C] p-4 rounded shadow w-full"></div>

               <aside className="col-start-1 md:col-start-2 md:row-start-1 row-span-3 bg-[#1E1B3C] text-white p-4 rounded">
                  <div className="w-80">hello</div>
               </aside>
            </section>
         </div>
      </div>
   );
};

export default App;
