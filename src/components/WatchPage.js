import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  YOUTUBE_VIDEOS_API,
  getVideosByIdsUrl,
  getAvatarColor,
} from "../utils/constants";
import RecommendedVideoCard from "./RecommendedVideoCard";
import CommentsSection from "./CommentsSection";

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

const InfoSkeleton = () => (
  <div className="animate-pulse space-y-3 mb-4">
    <div className="h-5 bg-white/5 rounded w-4/5" />
    <div className="h-5 bg-white/5 rounded w-2/5" />
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-full bg-white/5" />
      <div className="space-y-1.5">
        <div className="h-3 bg-white/5 rounded w-32" />
        <div className="h-3 bg-white/5 rounded w-20" />
      </div>
    </div>
  </div>
);

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [videoInfo, setVideoInfo] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const videoId = searchParams.get("v");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    fetch(YOUTUBE_VIDEOS_API)
      .then((r) => r.json())
      .then((json) => setRecommendedVideos(json.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!videoId) return;
    setVideoInfo(null);
    fetch(getVideosByIdsUrl([videoId]))
      .then((r) => r.json())
      .then((json) => setVideoInfo(json.items?.[0] || null))
      .catch(() => {});
  }, [videoId]);

  const snippet = videoInfo?.snippet;
  const stats = videoInfo?.statistics;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)]">
      <div className="flex gap-6 px-6 py-6 max-w-[1800px] mx-auto">
        {/* Main video column */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 pl-2 pr-3 py-1.5 mb-4 rounded-full
              text-[13px] font-medium text-white/60 hover:text-white
              bg-white/[0.06] border border-white/[0.07] hover:bg-white/[0.11]
              transition-all duration-150"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            Back
          </button>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-4">
            <iframe
              className="w-full h-full"
              src={"https://www.youtube.com/embed/" + videoId}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {!videoInfo ? (
            <InfoSkeleton />
          ) : snippet ? (
            <>
              <h1 className="text-[17px] font-semibold text-white leading-snug mb-3">
                {snippet.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ backgroundColor: getAvatarColor(snippet.channelTitle) }}
                  >
                    {snippet.channelTitle.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-white">
                    {snippet.channelTitle}
                  </p>
                  <button className="ml-1 px-4 py-1.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium bg-white/[0.07] border border-white/10 text-white hover:bg-white/[0.12] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z" />
                    </svg>
                    {stats?.likeCount ? formatViews(stats.likeCount) : "Like"}
                  </button>
                  <button className="px-4 py-1.5 rounded-full text-[13px] font-medium bg-white/[0.07] border border-white/10 text-white hover:bg-white/[0.12] transition-colors">
                    Share
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.07] border border-white/10 text-white hover:bg-white/[0.12] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 cursor-pointer"
                onClick={() => setDescExpanded((v) => !v)}
              >
                <div className="flex items-center gap-2 text-[13px] text-white/55 mb-2">
                  {stats?.viewCount && (
                    <span>{formatViews(stats.viewCount)} views</span>
                  )}
                  <span>·</span>
                  <span>{getTimeAgo(snippet.publishedAt)}</span>
                </div>
                <p
                  className={`text-sm text-white/80 whitespace-pre-line ${
                    descExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  {snippet.description || "No description."}
                </p>
                <button className="text-[13px] font-medium text-white mt-2">
                  {descExpanded ? "Show less" : "Show more"}
                </button>
              </div>
            </>
          ) : null}

          <CommentsSection videoId={videoId} />
        </div>

        {/* Recommendations sidebar */}
        <div className="w-[380px] flex-shrink-0 hidden lg:block">
          <div className="space-y-2">
            {recommendedVideos.map((video) => (
              <RecommendedVideoCard key={video.id} info={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
