import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { CATEGORIES } from "../utils/constants";
import { setCategory } from "../utils/appSlice";

const ButtonList = () => {
  const dispatch = useDispatch();
  const selectedCategoryId = useSelector((s) => s.app.selectedCategoryId);

  return (
    <div className="sticky top-0 bg-[#0f0f0f] z-30 pt-3 pb-2 px-6">
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide gap-3">
          {CATEGORIES.map(({ label, id }) => (
            <Button
              key={label}
              name={label}
              isActive={selectedCategoryId === id}
              onClick={() => dispatch(setCategory(id))}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[#0f0f0f] to-transparent" />
      </div>
    </div>
  );
};

export default ButtonList;
