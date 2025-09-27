export const Error = ({ handleRetry }) => {
   return (
      <div className="text-white text-center flex items-center flex-col gap-6 mt-16">
         <img
            src="./images/icon-error.svg"
            alt="Error Icon"
            className="size-12"
         />
         <h1 className="font-bold text-4xl">Something Went Wrong</h1>
         <p className="text-lg text-[#D4D3D9] max-w-[500px]">
            We couldn’t connect to the server (API error). Please try again in a
            few moments.
         </p>
         <button
            className="flex items-center gap-3 bg-[#262540] px-4 py-2 rounded-lg"
            onClick={handleRetry}>
            <img src="./images/icon-retry.svg" alt="retry" />
            Retry
         </button>
      </div>
   );
};
