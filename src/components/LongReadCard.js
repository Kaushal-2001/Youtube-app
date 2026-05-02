import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { getBestThumbnail } from "../utils/constants";

const formatDuration = (duration) => {
  if (!duration) return "";
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] || 0);
  const mi = parseInt(m[2] || 0);
  const s = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(mi).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${mi}:${String(s).padStart(2, "0")}`;
};

const formatViews = (count) => {
  const n = parseInt(count) || 0;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M views`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K views`;
  return `${n} views`;
};

const LongReadCard = ({ info }) => {
  const [hidden, setHidden] = useState(false);
  if (!info || hidden) return null;
  const { snippet, statistics, contentDetails, id } = info;
  const { title, channelTitle, description } = snippet;
  const thumb = getBestThumbnail(snippet.thumbnails);
  if (!thumb) return null;

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < 200 || naturalHeight < 200) setHidden(true);
  };

  return (
    <Link
      to={`/watch?v=${id}`}
      className="vcard rounded-[14px] overflow-hidden border border-white/[0.06] bg-[#15151A] block hover:border-white/[0.12] transition-colors"
    >
      <div className="overflow-hidden">
        <div className="thumb-inner bg-white/[0.04]" style={{ aspectRatio: "16/7" }}>
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            onError={() => setHidden(true)}
            onLoad={handleLoad}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-[22px] py-[22px] flex flex-col gap-[7px]">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-semibold tracking-[0.1em] text-[#FF5C2B]"
          >
            LONG READ
          </span>
          <span className="text-[10px] text-white/20">·</span>
          <span className="text-[10px] text-white/[0.32] flex items-center gap-1">
            <Clock className="w-[10px] h-[10px]" strokeWidth={2} />
            {formatDuration(contentDetails?.duration)}
          </span>
        </div>

        <h3
          className="text-[20px] font-semibold text-[#F5F1EA] leading-[1.22]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-[13px] text-white/[0.44] leading-[1.6] line-clamp-2"
          >
            {description}
          </p>
        )}

        <div className="flex gap-2 text-[11px] text-white/[0.26] mt-1">
          <span className="truncate">{channelTitle}</span>
          {statistics?.viewCount && (
            <>
              <span>·</span>
              <span>{formatViews(statistics.viewCount)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LongReadCard;
