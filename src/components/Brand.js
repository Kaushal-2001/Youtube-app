import React from "react";

/* Pure-typographic SeamlessTV wordmark — Fraunces serif with orange "TV" */
const Brand = ({ size = 19, className = "" }) => (
  <span
    className={`font-serif text-[#F5F1EA] leading-none select-none ${className}`}
    style={{
      fontSize: size,
      letterSpacing: "-0.02em",
      fontWeight: 400,
    }}
  >
    Seamless<span style={{ color: "#FF5C2B" }}>TV</span>
  </span>
);

export default Brand;
