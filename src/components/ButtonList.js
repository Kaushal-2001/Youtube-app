import React from "react";
import Button from "./Button";

const List = [
  "All",
  "Gaming",
  "Podcasts",
  "Grandmaster chess title",
  "Manchester United F.C.",
  "One Piece",
  "Music",
  "Mixes",
  "UEFA Champions League",
  "Live",
  "Reaction videos",
  "Comedy",
  "Recently uploaded",
  "Watched",
  "New to you",
];

const ButtonList = () => {
  return (
    <div className="flex overflow-x-auto pb-2 sticky top-0 bg-[#0f0f0f] z-30 pt-3 px-6 scrollbar-hide">
      {List.map((item) => {
        return (
          <div key={item}>
            <Button name={item} />
          </div>
        );
      })}
    </div>
  );
};

export default ButtonList;
