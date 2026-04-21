import React from "react";

const VideoCard = ({ info }) => {
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
    <div className="w-full cursor-pointer group">
      <div className="relative mb-2">
        <img
          className="w-full rounded-xl aspect-video object-cover"
          alt={title}
          src={thumbnails.medium.url}
        />
        {contentDetails && contentDetails.duration && (
          <span className="absolute bottom-1 right-1 bg-black bg-opacity-90 text-white text-xs font-semibold px-1 py-0.5 rounded">
            {formatDuration(contentDetails.duration)}
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#ff6b35] flex items-center justify-center text-white font-medium text-sm">
            {channelTitle.charAt(0)}
          </div>
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-5 mb-1">
            {title}
          </h3>
          <p className="text-sm text-[#aaa] hover:text-white cursor-pointer">
            {channelTitle}
          </p>
          <div className="flex items-center gap-1 text-sm text-[#aaa]">
            <span>{formatViews(statistics.viewCount)} views</span>
            <span>•</span>
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
        </div>
        <button className="absolute top-2 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
