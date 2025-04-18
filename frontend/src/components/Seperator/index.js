import React from "react";

const Seperator = ({ text }) => {
  return (
    <div className="w-full flex items-center justify-center relative mb-7 mt-7">
      <span className="bg-white px-4 text-gray-700 z-10 ">
        <h1 className="text-[20px] font-[500] ">{text}</h1>
      </span>
      <div className="absolute w-full h-[4px] bg-gray-300 rounded-[100px]"></div>
    </div>
  );
};

export default Seperator;
