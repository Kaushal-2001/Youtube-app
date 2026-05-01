import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Search } from "lucide-react";
import Brand from "./Brand";

const USER_NAME = "Kaushal";

/* Only routes that actually exist in the app */
const NAV_ITEMS = [
  { label: "Discover", to: "/"       },
  { label: "Shorts",   to: "/shorts" },
];

const NavItem = ({ to, active, children }) => (
  <Link
    to={to}
    className="text-[13px] font-medium tracking-[-0.01em] transition-colors duration-150 outline-none nav-link"
    style={{
      color: active ? "#F5F1EA" : "rgba(245,241,234,0.36)",
    }}
  >
    {children}
  </Link>
);

const Head = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search_query") || "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(searchParams.get("search_query") || "");
  }, [searchParams]);

  /* "/" or ⌘K focuses search */
  useEffect(() => {
    const onKey = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isSlash =
        e.key === "/" &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA";
      if (isCmdK || isSlash) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/results?search_query=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-[200] h-[60px] border-b border-white/[0.05]"
      style={{
        background: "rgba(10,10,11,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="h-full px-7 flex items-center">
        {/* Brand */}
        <Link
          to="/"
          aria-label="SeamlessTV home"
          className="flex-shrink-0 mr-9 outline-none"
        >
          <Brand size={19} />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <NavItem key={item.label} to={item.to} active={active}>
                {item.label}
              </NavItem>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className={`search-wrap${focused ? " focused" : ""} relative mr-4`}
        >
          <span className="absolute left-[11px] top-1/2 -translate-y-1/2 flex pointer-events-none text-white/30">
            <Search className="w-[14px] h-[14px]" strokeWidth={2} />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search subjects, channels, moods…"
            className="w-full h-9 rounded-lg bg-[#15151A] border border-white/[0.07] pl-[33px] pr-3 text-[13px] text-[#F5F1EA] placeholder-white/[0.28]"
          />
        </form>

        {/* Bell */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              title="Notifications"
              className="bg-transparent border-none cursor-pointer p-1 mr-2 flex text-white/35 hover:text-[#F5F1EA] transition-colors duration-150 outline-none"
            >
              <Bell className="w-[17px] h-[17px]" strokeWidth={2} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={12}
              className="z-[300] min-w-[320px] rounded-xl p-1.5 text-[#F5F1EA] border border-white/[0.07] bg-[#0c0c10]/96 backdrop-blur-2xl shadow-[0_28px_80px_-12px_rgba(0,0,0,0.95)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            >
              <div className="px-3 pt-2.5 pb-2 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold">Notifications</h3>
                <button className="text-[11px] text-[#FF5C2B] hover:opacity-80 transition-opacity">
                  Mark all read
                </button>
              </div>
              <div className="h-px bg-white/[0.06] my-1" />
              <div className="px-6 py-10 text-center">
                <div className="w-11 h-11 mx-auto mb-3 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white/20" strokeWidth={1.5} />
                </div>
                <p className="text-[13px] text-white/55 font-medium">
                  You&apos;re all caught up
                </p>
                <p className="text-[11px] text-white/25 mt-1">
                  New notifications will appear here.
                </p>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Avatar */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              title={USER_NAME}
              className="w-[30px] h-[30px] flex-shrink-0 rounded-full bg-[#1d1d24] border border-white/[0.09] flex items-center justify-center text-[11px] font-semibold text-[#F5F1EA] hover:border-white/[0.18] active:scale-95 transition-all outline-none"
            >
              {USER_NAME.charAt(0).toUpperCase()}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={12}
              className="z-[300] min-w-[220px] rounded-xl p-1.5 text-[#F5F1EA] border border-white/[0.07] bg-[#0c0c10]/96 backdrop-blur-2xl shadow-[0_28px_80px_-12px_rgba(0,0,0,0.95)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            >
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1d1d24] border border-white/[0.09] flex items-center justify-center text-[15px] font-semibold flex-shrink-0">
                  {USER_NAME.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold leading-tight truncate">
                    {USER_NAME}
                  </p>
                  <p className="text-[12px] text-white/35 truncate mt-0.5">
                    @kaushal
                  </p>
                </div>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

export default Head;
