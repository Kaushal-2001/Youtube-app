import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  // Mini sidebar for closed state
  if (!isMenuOpen) {
    return (
      <div className="fixed left-0 top-14 bottom-0 w-[72px] bg-[#0f0f0f] overflow-y-auto pt-1 z-40">
        <Link to="/">
          <div className="flex flex-col items-center py-4 px-1 cursor-pointer hover:bg-[#272727] rounded-lg mx-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M12,4.33l7,6.12V20H15V14H9v6H5V10.45l7-6.12M12,3,4,10V21h6V15h4v6h6V10L12,3Z" />
            </svg>
            <span className="text-[10px] mt-1.5">Home</span>
          </div>
        </Link>
        <div className="flex flex-col items-center py-4 px-1 cursor-pointer hover:bg-[#272727] rounded-lg mx-1">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-3.5-6.62L6,6.94a3.74,3.74,0,0,0,.23,6.74l1.2.49L6,14.93a3.75,3.75,0,0,0,3.5,6.63l8.5-4.5a3.74,3.74,0,0,0-.23-6.74Z" />
          </svg>
          <span className="text-[10px] mt-1.5">Shorts</span>
        </div>
        <div className="flex flex-col items-center py-4 px-1 cursor-pointer hover:bg-[#272727] rounded-lg mx-1 relative">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z" />
          </svg>
          <span className="text-[10px] mt-1.5">Subscriptions</span>
          <span className="absolute top-3 right-5 w-1.5 h-1.5 bg-[#3ea6ff] rounded-full"></span>
        </div>
        <div className="flex flex-col items-center py-4 px-1 cursor-pointer hover:bg-[#272727] rounded-lg mx-1">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M11,7l-3.2,9h1.9l.7-2h3.2l.7,2h1.9L13,7H11z M12,12.43L12.62,10.6h0.76L12,12.43z M22,3v13.67l-7,4.67V18H4c-0.55,0-1-0.45-1-1V3 c0-0.55,0.45-1,1-1h17C21.55,2,22,2.45,22,3z M21,3H4v14h12l0,0v2.5l5-3.33V3z" />
          </svg>
          <span className="text-[10px] mt-1.5">You</span>
        </div>
        <div className="flex flex-col items-center py-4 px-1 cursor-pointer hover:bg-[#272727] rounded-lg mx-1">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z" />
          </svg>
          <span className="text-[10px] mt-1.5">History</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-14 bottom-0 w-60 bg-[#0f0f0f] overflow-y-auto pt-3 z-40">
      <div className="px-3">
        <Link to="/">
          <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg bg-[#272727]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M4,10V21h6V15h4v6h6V10L12,3Z" />
            </svg>
            <span className="text-sm font-medium">Home</span>
          </div>
        </Link>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-3.5-6.62L6,6.94a3.74,3.74,0,0,0,.23,6.74l1.2.49L6,14.93a3.75,3.75,0,0,0,3.5,6.63l8.5-4.5a3.74,3.74,0,0,0-.23-6.74Z" />
          </svg>
          <span className="text-sm font-medium">Shorts</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg relative">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z" />
          </svg>
          <span className="text-sm font-medium">Subscriptions</span>
          <span className="absolute left-5 top-2 w-1.5 h-1.5 bg-[#3ea6ff] rounded-full"></span>
        </div>
      </div>

      <div className="border-t border-[#3f3f3f] my-3"></div>

      <div className="px-3">
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <g>
              <path d="M11,7l-3.2,9h1.9l.7-2h3.2l.7,2h1.9L13,7H11z M12,12.43L12.62,10.6h0.76L12,12.43z" />
              <path d="M22,3v13.67l-7,4.67V18H4c-0.55,0-1-0.45-1-1V3c0-0.55,0.45-1,1-1h17C21.55,2,22,2.45,22,3z M21,3H4v14h12l0,0v2.5 l5-3.33V3z" />
            </g>
          </svg>
          <span className="text-sm font-medium">You</span>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-auto">
            <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
          </svg>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z" />
          </svg>
          <span className="text-sm font-medium">History</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4 C22,2.9,21.1,2,20,2z M20,16H8V4h12V16z M12,14.5v-9l6,4.5L12,14.5z" />
          </svg>
          <span className="text-sm font-medium">Playlists</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M18.4,5.6L12,12l6.4,6.4l1.2-1.2L14.8,12l4.8-4.8L18.4,5.6z M12.4,5.6L6,12l6.4,6.4l1.2-1.2L8.8,12l4.8-4.8L12.4,5.6z" />
          </svg>
          <span className="text-sm font-medium">Your videos</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M22,12c0,5.51-4.49,10-10,10S2,17.51,2,12h1c0,4.96,4.04,9,9,9 s9-4.04,9-9s-4.04-9-9-9C8.81,3,5.92,4.64,4.28,7.38C4.17,7.56,4.06,7.75,3.97,7.94C3.96,7.96,3.95,7.98,3.94,8H8v1H1.96V3h1v4.74 C3,7.65,3.03,7.57,3.07,7.49C3.18,7.27,3.3,7.07,3.42,6.86C5.22,3.86,8.51,2,12,2C17.51,2,22,6.49,22,12z" />
          </svg>
          <span className="text-sm font-medium">Watch Later</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z" />
          </svg>
          <span className="text-sm font-medium">Liked videos</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z" />
          </svg>
          <span className="text-sm font-medium">Downloads</span>
        </div>
      </div>

      <div className="border-t border-[#3f3f3f] my-3"></div>

      <div className="px-3">
        <div className="px-3 py-2 mb-1">
          <h3 className="text-sm font-medium">Subscriptions</h3>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            LJ
          </div>
          <span className="text-sm truncate">Learn Japanese...</span>
        </div>
        <div className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg">
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            1U
          </div>
          <span className="text-sm truncate">1Up Gaming</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
