import { weatherCodeMap } from "../utils/weatherCodeMap";
const DailyForecast = ({ data }) => {
   const formatDate = (dateString) => {
      const date = new Date(dateString);

      const options = {
         weekday: "short",
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
      return formatted;
   };
   return (
      <div className="flex gap-4 not-md:flex-wrap text-white">
         {data &&
            data.time.map((date, index) => (
               <div key={index} className="max-w-[120px] px-2 py-4 rounded-xl bg-[#262540] flex flex-col items-center">
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
            ))}
      </div>
   );
};

export default DailyForecast;
