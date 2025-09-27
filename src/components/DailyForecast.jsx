import { weatherCodeMap } from "../utils/weatherCodeMap";
const DailyForecast = ({ data, loading }) => {
   const arrDemo = [1, 2, 3, 4, 5, 6, 7];
   const formatDate = (dateString) => {
      const date = new Date(dateString);

      const options = {
         weekday: "short",
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
      return formatted;
   };
   return (
      <div className="flex gap-4 flex-wrap text-white">
         {loading ? (
            arrDemo.map((_, index) => (
               <div
                  key={index}
                  className="w-[100px] h-[160px] px-2 py-4 rounded-xl bg-[#262540] flex flex-col items-center animate-pulse">
                  
               </div>
            ))
         ) : (
            data &&
            data.time.map((date, index) => (
               <div
                  key={index}
                  className="max-w-[100px] px-2 py-4 rounded-xl bg-[#262540] flex flex-col items-center">
                  <p>{formatDate(date)}</p>
                  <img
                     src={`./images/${weatherCodeMap[data.weathercode[index]]}`}
                     alt="Weather Icon"
                  />
                  <div className="flex justify-between items-center self-start w-full text-[#D4D3D9]">
                     <span>{data.temperature_2m_max[index]}°</span>
                     <span>{data.temperature_2m_min[index]}°</span>
                  </div>
               </div>
            ))
         )}
      </div>
   );
};

export default DailyForecast;
