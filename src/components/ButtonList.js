import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORIES } from "../utils/constants";
import { setCategory } from "../utils/appSlice";

const ButtonList = () => {
  const dispatch = useDispatch();
  const selectedCategoryId = useSelector((s) => s.app.selectedCategoryId);

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {CATEGORIES.map(({ label, id }) => {
        const isActive = selectedCategoryId === id;
        return (
          <button
            key={label}
            onClick={() => dispatch(setCategory(id))}
            className={`px-[14px] py-[6px] rounded-full text-[12px] whitespace-nowrap flex-shrink-0 transition-colors duration-150 border ${
              isActive
                ? "bg-[#e8622a] border-transparent text-white font-medium"
                : "bg-[#14141c] border-white/[0.08] text-white/55 hover:text-white hover:border-white/[0.18]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonList;
