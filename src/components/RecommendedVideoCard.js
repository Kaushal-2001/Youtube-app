import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getBestThumbnail } from "../utils/constants";

const formatDuration = (duration) => {
  if (!duration) return null;
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const s = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${min}:${String(s).padStart(2, "0")}`;
};

const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d < 1) return "Today";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

const RecommendedVideoCard = ({ info }) => {
  const [hidden, setHidden] = useState(false);
  if (!info || hidden) return null;
  const { snippet, contentDetails } = info;
  const { title, channelTitle, publishedAt } = snippet;
  const thumb = getBestThumbnail(snippet.thumbnails);
  if (!thumb) return null;

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < 200 || naturalHeight < 200) setHidden(true);
  };

  return (
    <Link to={"/watch?v=" + info.id} className="upnext-card block">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "168px 1fr",
          gap: 12,
        }}
      >
        {/* Thumb */}
        <div
          className="unc-shell"
          style={{
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(245,241,234,0.07)",
            position: "relative",
            height: 94,
            flexShrink: 0,
            background: "rgba(245,241,234,0.04)",
          }}
        >
          <div className="unc-thumb absolute inset-0">
            <img
              src={thumb}
              alt={title}
              loading="lazy"
              onError={() => setHidden(true)}
              onLoad={handleLoad}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Duration badge */}
          {contentDetails?.duration && (
            <div
              className="absolute"
              style={{
                bottom: 7,
                right: 7,
                background: "rgba(10,10,11,0.75)",
                borderRadius: 4,
                padding: "2px 5px",
              }}
            >
              <span
                className="text-[10px] font-medium"
                style={{ color: "rgba(245,241,234,0.75)" }}
              >
                {formatDuration(contentDetails.duration)}
              </span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1 min-w-0 pt-[2px]">
          <p
            className="text-[13px] font-medium text-[#F5F1EA] leading-[1.35] line-clamp-2"
          >
            {title}
          </p>
          <p
            className="text-[11px]"
            style={{ color: "rgba(245,241,234,0.5)" }}
          >
            {channelTitle}
          </p>
          <p
            className="text-[11px]"
            style={{ color: "rgba(245,241,234,0.35)" }}
          >
            {formatDuration(contentDetails?.duration)} · {formatRelativeTime(publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedVideoCard;
