import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { getAvatarColor, getShortsUrl, getVideosByIdsUrl } from "../utils/constants";

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num > 0 ? String(num) : "—";
};

/* ── Skeleton ──────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="h-full w-full snap-start flex items-center justify-center">
    <div className="flex items-end gap-5">
      <div className="w-[340px] md:w-[360px] aspect-[9/16] max-h-[calc(100vh-140px)] rounded-2xl bg-white/[0.05] animate-pulse" />
      <div className="flex flex-col gap-5 pb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-white/[0.05] animate-pulse" />
            <div className="w-8 h-2.5 rounded bg-white/[0.05] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Action button ─────────────────────────────────────────────────── */
const ActionBtn = ({ icon: Icon, label }) => (
  <button className="flex flex-col items-center gap-1.5 group">
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center
        bg-white/[0.08] border border-white/[0.06]
        group-hover:bg-white/[0.14] group-hover:scale-[1.06]
        transition-all duration-150"
    >
      <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
    </div>
    <span className="text-[11px] text-white/50 font-medium">{label}</span>
  </button>
);

/* ── Single short card ─────────────────────────────────────────────── */
const ShortCard = ({ info, isActive }) => {
  const { snippet, statistics } = info;

  return (
    <div className="h-full w-full snap-start flex items-center justify-center px-4">
      <div className="flex items-end gap-4 md:gap-6">

        {/* Portrait video */}
        <div
          className="relative w-[340px] md:w-[360px] aspect-[9/16] max-h-[calc(100vh-140px)]
            rounded-2xl overflow-hidden bg-black flex-shrink-0
            shadow-[0_40px_100px_-12px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)]"
        >
          {isActive && (
            <iframe
              /*
                autoplay=1 + mute=1: browsers allow muted autoplay without user gesture.
                The viewer can unmute via the player controls.
              */
              src={`https://www.youtube.com/embed/${info.id}?autoplay=1&mute=1&rel=0&playsinline=1`}
              className="w-full h-full"
              title={snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Bottom gradient overlay */}
          <div
            className="absolute bottom-0 inset-x-0 p-4 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center
                  text-white text-[11px] font-bold flex-shrink-0"
                style={{ backgroundColor: getAvatarColor(snippet.channelTitle) }}
              >
                {snippet.channelTitle.charAt(0).toUpperCase()}
              </div>
              <span className="text-[13px] font-semibold text-white truncate">
                {snippet.channelTitle}
              </span>
            </div>
            <p className="text-[12px] text-white/80 line-clamp-2 leading-snug">
              {snippet.title}
            </p>
          </div>
        </div>

        {/* Side action buttons */}
        <div className="flex flex-col gap-5 pb-6">
          <ActionBtn icon={ThumbsUp}      label={formatCount(statistics?.likeCount)} />
          <ActionBtn icon={MessageCircle} label={formatCount(statistics?.commentCount)} />
          <ActionBtn icon={Share2}        label="Share" />
        </div>
      </div>
    </div>
  );
};

/* ── Main Shorts component ─────────────────────────────────────────── */
const Shorts = () => {
  const navigate = useNavigate();
  const [shorts, setShorts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const cardRefs     = useRef([]);
  const scrollTimer  = useRef(null);

  /* Fetch shorts */
  useEffect(() => {
    const load = async () => {
      try {
        const searchJson = await fetch(getShortsUrl(25)).then((r) => r.json());
        const ids = (searchJson.items || [])
          .map((i) => i.id?.videoId)
          .filter(Boolean);
        if (!ids.length) { setLoading(false); return; }
        const videosJson = await fetch(getVideosByIdsUrl(ids)).then((r) => r.json());
        setShorts(videosJson.items || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  /*
    Scroll detection — debounced so it fires after the snap animation settles.
    Since every card is exactly one container-height tall, the active index is
    simply round(scrollTop / clientHeight).
  */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !shorts.length) return;

    const onScroll = () => {
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        const idx = Math.round(container.scrollTop / container.clientHeight);
        setActiveIndex(Math.max(0, Math.min(idx, shorts.length - 1)));
      }, 80);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer.current);
    };
  }, [shorts.length]);

  /* Keyboard: ↑↓ or j/k */
  useEffect(() => {
    const goTo = (idx) => {
      const clamped = Math.max(0, Math.min(idx, shorts.length - 1));
      cardRefs.current[clamped]?.scrollIntoView({ behavior: "smooth" });
    };
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "j") goTo(activeIndex + 1);
      if (e.key === "ArrowUp"   || e.key === "k") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, shorts.length]);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, shorts.length - 1));
    cardRefs.current[clamped]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {/* Back button — fixed top-left below header */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-[80px] left-4 z-40 flex items-center gap-1 pl-2 pr-3 py-1.5
          rounded-full text-[13px] font-medium text-white/60 hover:text-white
          bg-white/[0.07] border border-white/[0.07] hover:bg-white/[0.12]
          backdrop-blur-xl transition-all duration-150"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        Back
      </button>

      {/* Fixed nav arrows — right edge */}
      {!loading && shorts.length > 0 && (
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-xl flex items-center justify-center
              bg-white/[0.07] border border-white/[0.07] text-white/50
              hover:text-white hover:bg-white/[0.13]
              disabled:opacity-20 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            <ChevronUp className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === shorts.length - 1}
            className="w-10 h-10 rounded-xl flex items-center justify-center
              bg-white/[0.07] border border-white/[0.07] text-white/50
              hover:text-white hover:bg-white/[0.13]
              disabled:opacity-20 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            <ChevronDown className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {/* Counter pill */}
      {!loading && shorts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
          px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.07]
          backdrop-blur-xl text-[11px] text-white/45 font-medium tabular-nums">
          {activeIndex + 1} / {shorts.length}
        </div>
      )}

      {/* Cards */}
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        : shorts.map((short, i) => (
            <div
              key={short.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="h-full w-full snap-start"
            >
              <ShortCard info={short} isActive={i === activeIndex} />
            </div>
          ))}
    </div>
  );
};

export default Shorts;
