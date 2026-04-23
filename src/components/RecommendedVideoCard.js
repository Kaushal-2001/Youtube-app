import React from "react";
import { Link } from "react-router-dom";
import { getAvatarColor } from "../utils/constants";

const formatViews = (count) => {
  const n = Number(count) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
};

const getTimeAgo = (date) => {
  const diffH = Math.floor((new Date() - new Date(date)) / 3_600_000);
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

const RecommendedVideoCard = ({ info }) => {
  if (!info) return null;
  const { snippet, statistics, contentDetails } = info;
  const { thumbnails, title, channelTitle, publishedAt } = snippet;

  return (
    <Link to={"/watch?v=" + info.id}>
      <div className="flex gap-2.5 cursor-pointer group">
        <div className="relative w-[168px] flex-shrink-0">
          <img
            className="w-full rounded-xl aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            alt={title}
            src={thumbnails.medium.url}
          />
          {contentDetails?.duration && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-semibold px-1 py-0.5 rounded-md">
              {formatDuration(contentDetails.duration)}
            </span>
          )}
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-white line-clamp-2 leading-5 mb-1 group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          <div
            className="flex items-center gap-1.5 mb-0.5"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
              style={{ backgroundColor: getAvatarColor(channelTitle) }}
            >
              {channelTitle.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-white/55 truncate">{channelTitle}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            {statistics?.viewCount && (
              <span>{formatViews(statistics.viewCount)} views</span>
            )}
            {statistics?.viewCount && <span>·</span>}
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedVideoCard;
