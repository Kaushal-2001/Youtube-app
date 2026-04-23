import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORIES } from "../utils/constants";
import { setCategory } from "../utils/appSlice";

const ButtonList = () => {
  const dispatch = useDispatch();
  const selectedCategoryId = useSelector((s) => s.app.selectedCategoryId);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {CATEGORIES.map(({ label, id }) => {
        const isActive = selectedCategoryId === id;
        return (
          <button
            key={label}
            onClick={() => dispatch(setCategory(id))}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap flex-shrink-0 transition-all duration-150 ${
              isActive
                ? "bg-white text-black"
                : "bg-white/[0.025] border border-white/[0.08] text-white/65 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.14]"
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
