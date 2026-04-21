import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams } from "react-router-dom";
import { YOUTUBE_VIDEOS_API } from "../utils/constants";
import RecommendedVideoCard from "./RecommendedVideoCard";
import CommentsSection from "./CommentsSection";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeMenu());
    getRecommendedVideos();
  }, [dispatch]);

  const getRecommendedVideos = async () => {
    const data = await fetch(YOUTUBE_VIDEOS_API);
    const json = await data.json();
    setRecommendedVideos(json.items);
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="flex gap-6 px-6 py-6 max-w-[1800px] mx-auto">
        {/* Main Video Section */}
        <div className="flex-1 min-w-0">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-3">
            <iframe
              className="w-full h-full"
              src={"https://www.youtube.com/embed/" + searchParams.get("v")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="text-white">
            <h1 className="text-xl font-semibold mb-3">Video Title</h1>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center text-white font-medium">
                  C
                </div>
                <div>
                  <p className="font-medium">Channel Name</p>
                  <p className="text-xs text-[#aaa]">1M subscribers</p>
                </div>
                <button className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-[#d9d9d9] transition-colors">
                  Subscribe
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-[#272727] px-4 py-2 rounded-full font-medium text-sm hover:bg-[#3f3f3f] transition-colors flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z" />
                  </svg>
                  <span>6.6K</span>
                </button>
                <button className="bg-[#272727] px-4 py-2 rounded-full font-medium text-sm hover:bg-[#3f3f3f] transition-colors">
                  Share
                </button>
                <button className="bg-[#272727] w-10 h-10 rounded-full font-medium hover:bg-[#3f3f3f] transition-colors flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-[#272727] rounded-xl p-3">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-medium">138,295 views</span>
                <span>•</span>
                <span>9 hours ago</span>
              </div>
              <p className="text-sm text-[#f1f1f1]">
                Video description goes here...
              </p>
            </div>
            <CommentsSection videoId={searchParams.get("v")} />
          </div>
        </div>

        {/* Recommendations Sidebar */}
        <div className="w-[400px] flex-shrink-0">
          <div className="sticky top-0">
            <div className="flex items-center gap-3 mb-4 overflow-x-auto scrollbar-hide pb-2">
              <button className="px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium whitespace-nowrap">
                All
              </button>
              <button className="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm font-medium hover:bg-[#3f3f3f] whitespace-nowrap">
                From GothamChess
              </button>
              <button className="px-3 py-1.5 bg-[#272727] text-white rounded-lg text-sm font-medium hover:bg-[#3f3f3f] whitespace-nowrap">
                Chess tournaments
              </button>
            </div>
            <div className="space-y-2">
              {recommendedVideos.map((video) => (
                <RecommendedVideoCard key={video.id} info={video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
