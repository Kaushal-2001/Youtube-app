import React from "react";

const Footer = () => (
  <div className="max-w-[1440px] mx-auto mt-20 px-7 py-7 border-t border-white/[0.05] flex items-center justify-between">
    <span className="font-serif text-[15px]" style={{ color: "rgba(245,241,234,0.2)" }}>
      Seamless<span style={{ color: "rgba(255,92,43,0.45)" }}>TV</span>
    </span>
    <span
      className="text-[11px]"
      style={{ color: "rgba(245,241,234,0.18)", letterSpacing: "0.06em" }}
    >
      Curated, not computed.
    </span>
  </div>
);

export default Footer;
