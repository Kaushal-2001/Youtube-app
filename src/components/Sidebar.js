import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAvatarColor } from "../utils/constants";
import { setCategory } from "../utils/appSlice";

const iconPaths = {
  home: "M12,4.33l7,6.12V20H15V14H9v6H5V10.45l7-6.12M12,3,4,10V21h6V15h4v6h6V10L12,3Z",
  homeFilled: "M4,10V21h6V15h4v6h6V10L12,3Z",
  shorts:
    "M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-3.5-6.62L6,6.94a3.74,3.74,0,0,0,.23,6.74l1.2.49L6,14.93a3.75,3.75,0,0,0,3.5,6.63l8.5-4.5a3.74,3.74,0,0,0-.23-6.74Z",
  subs: "M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z",
  you: "M11,7l-3.2,9h1.9l.7-2h3.2l.7,2h1.9L13,7H11z M12,12.43L12.62,10.6h0.76L12,12.43z M22,3v13.67l-7,4.67V18H4c-0.55,0-1-0.45-1-1V3 c0-0.55,0.45-1,1-1h17C21.55,2,22,2.45,22,3z M21,3H4v14h12l0,0v2.5l5-3.33V3z",
  history:
    "M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z",
  playlists:
    "M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4 C22,2.9,21.1,2,20,2z M20,16H8V4h12V16z M12,14.5v-9l6,4.5L12,14.5z",
  yourVideos:
    "M18.4,5.6L12,12l6.4,6.4l1.2-1.2L14.8,12l4.8-4.8L18.4,5.6z M12.4,5.6L6,12l6.4,6.4l1.2-1.2L8.8,12l4.8-4.8L12.4,5.6z",
  watchLater:
    "M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M22,12c0,5.51-4.49,10-10,10S2,17.51,2,12h1c0,4.96,4.04,9,9,9 s9-4.04,9-9s-4.04-9-9-9C8.81,3,5.92,4.64,4.28,7.38C4.17,7.56,4.06,7.75,3.97,7.94C3.96,7.96,3.95,7.98,3.94,8H8v1H1.96V3h1v4.74 C3,7.65,3.03,7.57,3.07,7.49C3.18,7.27,3.3,7.07,3.42,6.86C5.22,3.86,8.51,2,12,2C17.51,2,22,6.49,22,12z",
  liked:
    "M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z",
  downloads: "M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z",
  trending:
    "M10,4H4v6l2.24-2.24l4.24,4.24l3.54-3.54l5.46,5.46L21,12.66l-7-7l-3.54,3.54L7.76,5.76L10,4z",
  music:
    "M12,3v10.55c-0.59-0.34-1.27-0.55-2-0.55c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4V7h4V3H12z",
  gaming:
    "M21,6H3C1.9,6,1,6.9,1,8v8c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V8C23,6.9,22.1,6,21,6z M21,16H3V8h18V16z M6,15h2v-2h2v-2H8V9H6v2 H4v2h2V15z M14.5,14c0.83,0,1.5-0.67,1.5-1.5S15.33,11,14.5,11S13,11.67,13,12.5S13.67,14,14.5,14z M18.5,12c0.83,0,1.5-0.67,1.5-1.5 S19.33,9,18.5,9S17,9.67,17,10.5S17.67,12,18.5,12z",
  news: "M22,3H2v18h20V3z M20,19H4V5h16V19z M6,7h12v2H6V7z M6,11h12v2H6V11z M6,15h8v2H6V15z",
  sports:
    "M15.54,15.54l-1.41-1.41C12.41,15.78,10,15.78,8.28,14.12l-1.41,1.41C9.3,17.85,13.15,17.83,15.54,15.54z M8.47,8.46 L7.06,7.05C4.79,9.32,4.75,13.17,6.89,15.54l1.41-1.41C6.82,12.41,6.82,10,8.47,8.46z M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10 s10-4.49,10-10S17.51,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z",
};

const Icon = ({ d, className = "w-6 h-6 fill-white" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d={d} />
  </svg>
);

const miniItems = [
  { label: "Home", icon: iconPaths.home, to: "/" },
  { label: "Shorts", icon: iconPaths.shorts },
  { label: "Subscriptions", icon: iconPaths.subs, badge: true },
  { label: "You", icon: iconPaths.you },
  { label: "History", icon: iconPaths.history },
];

const youItems = [
  { label: "History", icon: iconPaths.history },
  { label: "Playlists", icon: iconPaths.playlists },
  { label: "Your videos", icon: iconPaths.yourVideos },
  { label: "Watch Later", icon: iconPaths.watchLater },
  { label: "Liked videos", icon: iconPaths.liked },
  { label: "Downloads", icon: iconPaths.downloads },
];

const exploreItems = [
  { label: "Trending", icon: iconPaths.trending, categoryId: null },
  { label: "Music", icon: iconPaths.music, categoryId: "10" },
  { label: "Gaming", icon: iconPaths.gaming, categoryId: "20" },
  { label: "News", icon: iconPaths.news, categoryId: "25" },
  { label: "Sports", icon: iconPaths.sports, categoryId: "17" },
];

const subscriptions = [
  "Learn Japanese Pod",
  "1Up Gaming",
  "Fireship",
  "Marques Brownlee",
  "Veritasium",
  "Linus Tech Tips",
];

const MenuRow = ({ label, icon, active, badge, trailingChevron, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-6 px-3 py-2.5 cursor-pointer rounded-lg transition-colors duration-150 relative ${
      active ? "bg-[#272727]" : "hover:bg-[#272727]"
    }`}
  >
    <Icon d={icon} />
    <span className="text-sm font-medium flex-1 truncate">{label}</span>
    {badge && (
      <span className="absolute left-[22px] top-2 w-1.5 h-1.5 bg-[#3ea6ff] rounded-full"></span>
    )}
    {trailingChevron && (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
      </svg>
    )}
  </div>
);

const MiniRow = ({ label, icon, badge, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center py-4 px-1 cursor-pointer rounded-lg mx-1 transition-colors duration-150 relative ${
      active ? "bg-[#272727]" : "hover:bg-[#272727]"
    }`}
  >
    <Icon d={icon} />
    <span className="text-[10px] mt-1.5">{label}</span>
    {badge && (
      <span className="absolute top-3 right-5 w-1.5 h-1.5 bg-[#3ea6ff] rounded-full"></span>
    )}
  </div>
);

const SectionDivider = () => <div className="border-t border-[#3f3f3f] my-3"></div>;

const SubscriptionRow = ({ name, onClick }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-6 px-3 py-2.5 cursor-pointer hover:bg-[#272727] rounded-lg transition-colors duration-150"
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-white"
        style={{ backgroundColor: getAvatarColor(name) }}
      >
        {initials}
      </div>
      <span className="text-sm truncate">{name}</span>
    </div>
  );
};

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const selectedCategoryId = useSelector((s) => s.app.selectedCategoryId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goHome = () => {
    dispatch(setCategory(null));
    navigate("/");
  };

  const pickCategory = (id) => {
    dispatch(setCategory(id));
    navigate("/");
  };

  const searchFor = (query) => {
    navigate(`/results?search_query=${encodeURIComponent(query)}`);
  };

  if (!isMenuOpen) {
    return (
      <div className="fixed left-0 top-14 bottom-0 w-[72px] bg-[#0f0f0f] overflow-y-auto pt-1 z-40 scrollbar-hide">
        <MiniRow
          label="Home"
          icon={iconPaths.home}
          active={selectedCategoryId === null}
          onClick={goHome}
        />
        {miniItems.slice(1).map((item) => (
          <MiniRow key={item.label} {...item} />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-14 bottom-0 w-60 bg-[#0f0f0f] overflow-y-auto pt-3 pb-6 z-40 scrollbar-hide">
      <div className="px-3">
        <MenuRow
          label="Home"
          icon={iconPaths.homeFilled}
          active={selectedCategoryId === null}
          onClick={goHome}
        />
        <MenuRow label="Shorts" icon={iconPaths.shorts} />
        <MenuRow label="Subscriptions" icon={iconPaths.subs} badge />
      </div>

      <SectionDivider />

      <div className="px-3">
        <MenuRow label="You" icon={iconPaths.you} trailingChevron />
        {youItems.map((item) => (
          <MenuRow key={item.label} {...item} />
        ))}
      </div>

      <SectionDivider />

      <div className="px-3">
        <div className="px-3 py-2 mb-1">
          <h3 className="text-sm font-medium">Subscriptions</h3>
        </div>
        {subscriptions.map((name) => (
          <SubscriptionRow
            key={name}
            name={name}
            onClick={() => searchFor(name)}
          />
        ))}
      </div>

      <SectionDivider />

      <div className="px-3">
        <div className="px-3 py-2 mb-1">
          <h3 className="text-sm font-medium">Explore</h3>
        </div>
        {exploreItems.map((item) => (
          <MenuRow
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={selectedCategoryId === item.categoryId}
            onClick={() => pickCategory(item.categoryId)}
          />
        ))}
      </div>

      <SectionDivider />

      <div className="px-6 text-xs text-[#717171] space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:text-white cursor-pointer">About</span>
          <span className="hover:text-white cursor-pointer">Press</span>
          <span className="hover:text-white cursor-pointer">Copyright</span>
          <span className="hover:text-white cursor-pointer">Contact us</span>
          <span className="hover:text-white cursor-pointer">Creators</span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Policy &amp; Safety</span>
        </div>
        <div className="pt-2 text-[#717171]">&copy; 2025 YouTube Clone</div>
      </div>
    </div>
  );
};

export default Sidebar;
