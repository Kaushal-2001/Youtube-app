import React from "react";
import { Link } from "react-router-dom";

const RecommendedVideoCard = ({ info }) => {
  if (!info) {
    return null;
  }

  const { snippet, statistics, contentDetails } = info;
  const { thumbnails, title, channelTitle, publishedAt } = snippet;

  // Format view count
  const formatViews = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(0) + "K";
    }
    return count;
  };

  // Format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 24 * 30) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24 * 365) {
      const months = Math.floor(diffInHours / (24 * 30));
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffInHours / (24 * 365));
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  // Format duration
  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || "").replace("H", "");
    const minutes = (match[2] || "").replace("M", "");
    const seconds = (match[3] || "").replace("S", "");

    if (hours) {
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }
    return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
  };

  return (
    <Link to={"/watch?v=" + info.id}>
      <div className="flex gap-2 mb-2 cursor-pointer group">
        <div className="relative w-[168px] flex-shrink-0">
          <img
            className="w-full rounded-lg aspect-video object-cover"
            alt={title}
            src={thumbnails.medium.url}
          />
          {contentDetails && contentDetails.duration && (
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-90 text-white text-xs font-semibold px-1 py-0.5 rounded">
              {formatDuration(contentDetails.duration)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-5 mb-1">
            {title}
          </h3>
          <p className="text-xs text-[#aaa] mb-0.5">{channelTitle}</p>
          <div className="flex items-center gap-1 text-xs text-[#aaa]">
            <span>{formatViews(statistics.viewCount)} views</span>
            <span>•</span>
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedVideoCard;


