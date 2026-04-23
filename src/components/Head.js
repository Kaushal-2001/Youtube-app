import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, MessageSquare, Search } from "lucide-react";
import Brand from "./Brand";

const USER_NAME = "Kaushal";

const NAV_ITEMS = [
  { label: "Discover",      to: "/"       },
  { label: "Live",          disabled: true },
  { label: "Shorts",        to: "/shorts" },
  { label: "Library",       disabled: true },
  { label: "Subscriptions", disabled: true },
  { label: "Studio",        disabled: true },
];

/* Nav link with orange active dot underneath */
const NavItem = ({ to, active, disabled, children }) => {
  const base =
    "relative py-1 text-[14px] font-medium transition-colors duration-150 outline-none";
  const state = active
    ? "text-white"
    : disabled
    ? "text-white/35 cursor-default"
    : "text-white/45 hover:text-white/85";

  const inner = (
    <>
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-1 h-1 rounded-full bg-[#f97316]"
          style={{ boxShadow: "0 0 12px 1px rgba(249,115,22,0.7)" }}
        />
      )}
    </>
  );

  if (disabled || !to) {
    return <span className={`${base} ${state}`}>{inner}</span>;
  }
  return (
    <Link to={to} className={`${base} ${state}`}>
      {inner}
    </Link>
  );
};

const Head = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search_query") || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(searchParams.get("search_query") || "");
  }, [searchParams]);

  /* ⌘K / "/" focuses search */
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
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-[#09090f]/95 backdrop-blur-xl border-b border-white/[0.03]">
      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center gap-8">

        {/* Brand */}
        <Link
          to="/"
          aria-label="SeamlessTV home"
          className="flex-shrink-0 outline-none"
        >
          <Brand size={36} />
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.to &&
              (item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to));
            return (
              <NavItem
                key={item.label}
                to={item.to}
                active={isActive}
                disabled={item.disabled}
              >
                {item.label}
              </NavItem>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">

          {/* Search pill */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="group flex items-center h-9 w-[280px] rounded-full border border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.04] transition-colors px-3 gap-2 focus-within:border-white/[0.12]">
              <Search className="w-[14px] h-[14px] text-white/35 flex-shrink-0" strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="flex-1 min-w-0 bg-transparent text-[13px] text-white placeholder-white/30 outline-none"
              />
              <kbd className="hidden md:flex items-center gap-0.5 h-5 px-1.5 rounded-md border border-white/[0.08] text-[10px] text-white/30 font-mono flex-shrink-0">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            </div>
          </form>

          {/* Notifications */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                title="Notifications"
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.05] transition-all outline-none"
              >
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#f97316]" style={{ boxShadow: "0 0 8px 1px rgba(249,115,22,0.8)" }} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="z-[60] min-w-[320px] rounded-2xl p-1.5 text-white border border-white/[0.07] bg-[#0c0c13]/98 backdrop-blur-2xl shadow-[0_28px_80px_-12px_rgba(0,0,0,0.95)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              >
                <div className="px-3 pt-2.5 pb-2 flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold">Notifications</h3>
                  <button className="text-[11px] text-[#f97316] hover:text-[#ff8c4c] transition-colors">
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

          {/* Messages */}
          <button
            type="button"
            title="Messages"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.05] transition-all outline-none"
          >
            <MessageSquare className="w-[17px] h-[17px]" strokeWidth={1.75} />
          </button>

          {/* Avatar */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                title={USER_NAME}
                className="ml-1 w-9 h-9 flex-shrink-0 rounded-full text-white text-[14px] font-semibold flex items-center justify-center hover:scale-[1.06] active:scale-[0.96] transition-transform duration-150 outline-none"
                style={{
                  background: "linear-gradient(135deg, #ff8c4c 0%, #f97316 55%, #e85d04 100%)",
                  boxShadow: "0 4px 16px -4px rgba(249,115,22,0.6)",
                }}
              >
                {USER_NAME.charAt(0).toUpperCase()}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="z-[60] min-w-[220px] rounded-2xl p-1.5 text-white border border-white/[0.07] bg-[#0c0c13]/98 backdrop-blur-2xl shadow-[0_28px_80px_-12px_rgba(0,0,0,0.95)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              >
                <div className="px-4 py-4 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-[16px]"
                    style={{
                      background: "linear-gradient(135deg, #ff8c4c 0%, #f97316 55%, #e85d04 100%)",
                    }}
                  >
                    {USER_NAME.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-white leading-tight truncate">
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
      </div>
    </header>
  );
};

export default Head;
