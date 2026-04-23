import React from "react";
import { getAvatarColor } from "../utils/constants";

const formatViews = (count) => {
  const n = Number(count) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
};

const getTimeAgo = (date) => {
  const diffH = Math.floor((new Date() - new Date(date)) / 3_600_000);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  const d = Math.floor(diffH / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
};

const formatDuration = (duration) => {
  if (!duration) return null;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return null;
  const h = (match[1] || "").replace("H", "");
  const m = (match[2] || "").replace("M", "");
  const s = (match[3] || "").replace("S", "");
  if (h) return `${h}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  return `${m || "0"}:${s.padStart(2, "0")}`;
};

/* Editorial badge rotation — deterministic from video id */
const BADGES = [
  { label: "EDITOR'S PICK", star: true },
  { label: "4K HDR" },
  { label: "LIVE", dot: true },
  { label: "SERIES" },
  { label: "NEW" },
  { label: "DOC" },
  { label: "TRENDING" },
  { label: "INTERVIEW" },
];

const pickBadge = (id) => {
  if (!id) return BADGES[0];
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) & 0x7fffffff;
  }
  return BADGES[h % BADGES.length];
};

const VideoCard = ({ info }) => {
  if (!info) return null;
  const { snippet, statistics, contentDetails, id } = info;
  const { thumbnails, title, channelTitle, publishedAt } = snippet;
  const badge = pickBadge(id);
  const avatarColor = getAvatarColor(channelTitle);

  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative mb-3 overflow-hidden rounded-xl bg-white/[0.04] aspect-video border border-white/[0.04]">
        <img
          src={thumbnails.high.url}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Editorial badge top-left */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.12em]">
          {badge.dot && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b3d]" />
          )}
          {badge.star && (
            <span className="text-[#d8a86a] leading-none">✦</span>
          )}
          {badge.label}
        </span>

        {/* Duration bottom-right */}
        {contentDetails?.duration && (
          <span className="absolute bottom-3 right-3 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-semibold tabular-nums">
            {formatDuration(contentDetails.duration)}
          </span>
        )}
      </div>

      {/* Info row */}
      <div className="flex gap-3">
        <div
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[13px] font-semibold"
          style={{ backgroundColor: avatarColor }}
        >
          {channelTitle.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-serif text-white leading-snug line-clamp-2 mb-1 font-normal group-hover:text-[#d8a86a] transition-colors">
            {title}
          </h3>
          <p className="text-[12px] text-white/45 truncate">{channelTitle}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-white/30 mt-0.5">
            {statistics?.viewCount && (
              <>
                <span>{formatViews(statistics.viewCount)}</span>
                <span>·</span>
              </>
            )}
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
