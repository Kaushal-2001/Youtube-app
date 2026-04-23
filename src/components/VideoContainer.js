import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getVideosUrl } from "../utils/constants";
import VideoCard from "./VideoCard";

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-video rounded-xl bg-white/[0.04] mb-3 border border-white/[0.04]" />
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full bg-white/[0.04] flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-white/[0.04] rounded w-full" />
        <div className="h-3 bg-white/[0.04] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-1/3" />
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="py-20 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white/40">
        <path d="M21,6H3C1.9,6,1,6.9,1,8v8c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V8C23,6.9,22.1,6,21,6z M21,16H3V8h18V16z M10,15l5.19-3 L10,9V15z" />
      </svg>
    </div>
    <h3 className="text-base font-serif text-white mb-1">Nothing on this channel</h3>
    <p className="text-sm text-white/40">Try a different mood from above.</p>
  </div>
);

const MIX_CATEGORIES = ["10", "20", "24", "28", "23", "17", "25"];

const interleave = (arrays) => {
  const result = [];
  const max = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < max; i++) {
    arrays.forEach((arr) => {
      if (arr[i]) result.push(arr[i]);
    });
  }
  return result;
};

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedCategoryId = useSelector((s) => s.app.selectedCategoryId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        if (selectedCategoryId === null) {
          const results = await Promise.all(
            MIX_CATEGORIES.map((id) =>
              fetch(getVideosUrl(id))
                .then((r) => r.json())
                .then((json) => (json.items || []).slice(0, 10))
                .catch(() => [])
            )
          );
          if (cancelled) return;
          setVideos(interleave(results));
        } else {
          const json = await fetch(getVideosUrl(selectedCategoryId)).then((r) =>
            r.json()
          );
          if (cancelled) return;
          setVideos(json.items || []);
        }
      } catch {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId]);

  if (!loading && videos.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : videos.map((video) => (
            <Link to={`/watch?v=${video.id}`} key={video.id}>
              <VideoCard info={video} />
            </Link>
          ))}
    </div>
  );
};

export default VideoContainer;
