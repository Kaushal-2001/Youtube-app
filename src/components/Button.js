import React from "react";

const Button = ({ name, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-1.5 px-3 rounded-lg whitespace-nowrap text-sm font-medium transition-colors duration-150 flex-shrink-0 ${
        isActive
          ? "bg-white text-black hover:bg-[#f1f1f1]"
          : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
      }`}
    >
      {name}
    </button>
  );
};

export default Button;
