import React from "react";

const Button = ({ name, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full whitespace-nowrap text-[13px] font-medium transition-all duration-200 flex-shrink-0 ${
      isActive
        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-[0_6px_20px_-6px_rgba(34,211,238,0.6)]"
        : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
    }`}
  >
    {name}
  </button>
);

export default Button;
