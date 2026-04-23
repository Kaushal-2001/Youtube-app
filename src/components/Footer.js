import React from "react";

const Footer = () => (
  <footer className="mt-20 pt-8 pb-10 border-t border-white/[0.05]">
    <div className="flex flex-wrap items-center justify-between gap-y-3 text-[10px] tracking-[0.22em] text-white/25 font-semibold uppercase">
      <div>
        <span>Seamless </span>
        <span className="font-serif italic lowercase tracking-normal text-white/40 font-medium">tv</span>
        <span className="text-white/20 mx-2">·</span>
        <span>v2.4</span>
        <span className="text-white/20 mx-2">·</span>
        <span>2026</span>
      </div>

      <div className="flex items-center gap-3">
        <span>Curated, Never Noisy</span>
        <span className="text-white/20">·</span>
        <span className="font-serif italic lowercase tracking-normal text-white/40 font-normal">
          a calmer way to watch.
        </span>
      </div>

      <div>
        <span>English</span>
        <span className="text-white/20 mx-2">·</span>
        <span>USD</span>
        <span className="text-white/20 mx-2">·</span>
        <span>4K Ready</span>
      </div>
    </div>
  </footer>
);

export default Footer;
