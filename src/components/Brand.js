import React from "react";
import { Play } from "lucide-react";

export const BrandLogo = ({ size = 36 }) => (
  <div
    className="rounded-[11px] flex items-center justify-center flex-shrink-0"
    style={{
      width: size,
      height: size,
      background:
        "linear-gradient(135deg, #ff8c4c 0%, #f97316 55%, #e85d04 100%)",
      boxShadow:
        "0 8px 24px -8px rgba(249,115,22,0.7), inset 0 1px 0 rgba(255,255,255,0.25)",
    }}
  >
    <Play
      className="text-white fill-white ml-0.5"
      style={{ width: size * 0.38, height: size * 0.38 }}
      strokeWidth={0}
    />
  </div>
);

const Brand = ({ size = 36, className = "" }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <BrandLogo size={size} />
    <span
      className="text-white leading-none"
      style={{ fontSize: size * 0.56 }}
    >
      <span className="font-serif italic font-normal">Seamless</span>
      <span className="font-serif font-bold tracking-tight">TV</span>
    </span>
  </div>
);

export default Brand;
