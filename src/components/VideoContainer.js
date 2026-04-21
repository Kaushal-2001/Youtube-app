import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVideosUrl } from "../utils/constants";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";

const SkeletonCard = () => (
  <div className="w-full animate-pulse">
    <div className="w-full aspect-video rounded-xl bg-[#272727] mb-3" />
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full bg-[#272727] flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#272727] rounded w-11/12" />
        <div className="h-3 bg-[#272727] rounded w-3/4" />
        <div className="h-3 bg-[#272727] rounded w-1/2" />
      </div>
    </div>
  </div>
);

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedCategoryId = useSelector((s) => s.app.selectedCategoryId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(getVideosUrl(selectedCategoryId))
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setVideos(json.items || []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setVideos([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId]);

  if (!loading && videos.length === 0) {
    return (
      <div className="w-full px-6 py-20 flex flex-col items-center text-center">
        <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#717171] mb-4">
          <path d="M21,6H3C1.9,6,1,6.9,1,8v8c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V8C23,6.9,22.1,6,21,6z M21,16H3V8h18V16z M10,15l5.19-3 L10,9V15z" />
        </svg>
        <h2 className="text-lg font-medium text-white mb-1">No videos here yet</h2>
        <p className="text-sm text-[#aaa]">
          Try a different category from the chips above.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
        {loading
          ? Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)
          : videos.map((video) => (
              <Link to={"/watch?v=" + video.id} key={video.id}>
                <VideoCard info={video} />
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VideoContainer;
