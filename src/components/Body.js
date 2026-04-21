import React from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

const Body = ({ children }) => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  return (
    <div className="flex bg-[#0f0f0f] pt-14 h-screen overflow-hidden">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-200 overflow-x-hidden ${
          isMenuOpen ? "ml-60" : "ml-[72px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Body;
