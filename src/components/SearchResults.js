import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getAvatarColor,
  getSearchUrl,
  getVideosByIdsUrl,
} from "../utils/constants";

const formatViews = (count) => {
  const n = Number(count);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n;
};

const getTimeAgo = (date) => {
  const diffInHours = Math.floor(
    (new Date() - new Date(date)) / (1000 * 60 * 60)
  );
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 24 * 30) {
    const d = Math.floor(diffInHours / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }
  if (diffInHours < 24 * 365) {
    const m = Math.floor(diffInHours / (24 * 30));
    return `${m} month${m > 1 ? "s" : ""} ago`;
  }
  const y = Math.floor(diffInHours / (24 * 365));
  return `${y} year${y > 1 ? "s" : ""} ago`;
};

const formatDuration = (duration) => {
  if (!duration) return null;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return null;
  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");
  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
};

const ResultRow = ({ video }) => {
  const { snippet, statistics, contentDetails, id } = video;
  const { title, channelTitle, thumbnails, publishedAt, description } = snippet;
  return (
    <Link to={`/watch?v=${id}`} className="block">
      <div className="flex gap-4 cursor-pointer group">
        <div className="relative w-[360px] flex-shrink-0">
          <img
            src={thumbnails.medium.url}
            alt={title}
            className="w-full aspect-video object-cover rounded-xl"
          />
          {contentDetails?.duration && (
            <span className="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
              {formatDuration(contentDetails.duration)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-white line-clamp-2 mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-[#aaa] mb-2">
            {statistics?.viewCount && (
              <>
                <span>{formatViews(statistics.viewCount)} views</span>
                <span>•</span>
              </>
            )}
            <span>{getTimeAgo(publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
              style={{ backgroundColor: getAvatarColor(channelTitle) }}
            >
              {channelTitle.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[#aaa] hover:text-white">
              {channelTitle}
            </span>
          </div>
          <p className="text-xs text-[#aaa] line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const SkeletonRow = () => (
  <div className="flex gap-4 animate-pulse">
    <div className="w-[360px] aspect-video rounded-xl bg-[#272727] flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-[#272727] rounded w-4/5" />
      <div className="h-3 bg-[#272727] rounded w-1/3" />
      <div className="h-3 bg-[#272727] rounded w-1/4" />
      <div className="h-3 bg-[#272727] rounded w-full mt-3" />
      <div className="h-3 bg-[#272727] rounded w-5/6" />
    </div>
  </div>
);

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search_query") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setVideos([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const searchRes = await fetch(getSearchUrl(query));
        const searchJson = await searchRes.json();
        const ids = (searchJson.items || [])
          .map((i) => i.id?.videoId)
          .filter(Boolean);
        if (ids.length === 0) {
          if (!cancelled) {
            setVideos([]);
            setLoading(false);
          }
          return;
        }
        const videosRes = await fetch(getVideosByIdsUrl(ids));
        const videosJson = await videosRes.json();
        if (cancelled) return;
        setVideos(videosJson.items || []);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError("Something went wrong. Try again.");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-6">
      <div className="max-w-[1100px] mx-auto space-y-4">
        {!query && (
          <p className="text-[#aaa] text-sm">Enter a search term above.</p>
        )}
        {query && loading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        {query && !loading && error && (
          <p className="text-[#aaa] text-sm">{error}</p>
        )}
        {query && !loading && !error && videos.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-lg text-white mb-1">
              No results found for &ldquo;{query}&rdquo;
            </h2>
            <p className="text-sm text-[#aaa]">Try different keywords.</p>
          </div>
        )}
        {query && !loading && !error &&
          videos.map((v) => <ResultRow key={v.id} video={v} />)}
      </div>
    </div>
  );
};

export default SearchResults;
