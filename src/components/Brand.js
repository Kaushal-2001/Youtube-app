import React from "react";

/* SeamlessTV wordmark — unified Inter, weight contrast, orange "TV" */
const Brand = ({ size = 19, className = "" }) => (
  <span
    className={`text-[#F5F1EA] leading-none select-none ${className}`}
    style={{
      fontSize: size,
      letterSpacing: "-0.02em",
      fontWeight: 600,
    }}
  >
    Seamless<span style={{ color: "#FF5C2B" }}>TV</span>
  </span>
);

export default Brand;
