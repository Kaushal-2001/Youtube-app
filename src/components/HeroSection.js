import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { getAvatarColor, getBestThumbnail, getVideosUrl } from "../utils/constants";

/* ── helpers ──────────────────────────────────────────────────────── */
const formatViews = (count) => {
  const n = Number(count) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
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

const PlayGlyph = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <polygon points="4,2 14,8 4,14" fill="currentColor" />
  </svg>
);

/* Title with middle word italicised in orange */
const EditorialTitle = ({ text, className }) => {
  const words = text.split(/\s+/);
  if (words.length < 3) return <span className={className}>{text}</span>;
  const accentIdx = Math.min(2, Math.floor(words.length / 3));
  return (
    <span className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i === accentIdx ? (
            <em className="italic text-[#e8622a] not-italic-none" style={{ fontStyle: "italic" }}>
              {w}
            </em>
          ) : (
            w
          )}
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </span>
  );
};

/* ── Featured card (left) ─────────────────────────────────────────── */
const FeaturedCard = ({ video }) => {
  const { snippet, statistics, contentDetails, id } = video;
  const { title, channelTitle } = snippet;
  const [saved, setSaved] = useState(false);
  const avatarColor = getAvatarColor(channelTitle);

  return (
    <div
      className="relative rounded-[10px] overflow-hidden min-h-[320px]"
      style={{
        background:
          "linear-gradient(135deg, #3e2413 0%, #221510 30%, #14100c 60%, #0c0907 100%)",
        boxShadow:
          "0 0 60px rgba(232,98,42,0.1), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Animated subtle background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #3e2413 0%, #221510 30%, #14100c 60%, #0c0907 100%)",
          animation: "hero-scale 12s ease-in-out infinite",
          transformOrigin: "center center",
        }}
      />

      {/* Watermark "sl." */}
      <div
        aria-hidden
        className="absolute right-7 top-1/2 -translate-y-1/2 font-serif italic text-white/[0.05] leading-none select-none pointer-events-none"
        style={{ fontSize: 96, letterSpacing: "-0.04em" }}
      >
        sl.
      </div>

      {/* Bottom gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,10,0.95) 0%, transparent 55%)",
        }}
      />

      {/* Content */}
      <Link
        to={`/watch?v=${id}`}
        className="relative z-10 p-7 h-full min-h-[320px] flex flex-col justify-between outline-none"
      >
        {/* Top badges */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-[7px] py-[2.5px] rounded-[4px] bg-[#dc4a1a] text-white text-[9px] font-semibold tracking-[0.08em] uppercase">
            <span
              className="w-1.5 h-1.5 rounded-full bg-white"
              style={{ animation: "pulse-live 1.4s ease-in-out infinite" }}
            />
            Live Now
          </span>
          <span className="inline-flex items-center px-[7px] py-[2.5px] rounded-[4px] bg-white/[0.1] border border-white/[0.08] text-white/70 text-[9px] font-semibold tracking-[0.08em] uppercase">
            Documentary
          </span>
          <span className="inline-flex items-center px-[7px] py-[2.5px] rounded-[4px] bg-white/[0.1] border border-white/[0.08] text-white/70 text-[9px] font-semibold tracking-[0.08em] uppercase">
            4K HDR
          </span>
        </div>

        {/* Bottom block */}
        <div>
          <EditorialTitle
            text={title}
            className="block text-[32px] leading-[1.15] font-serif text-white font-normal mb-3 max-w-[600px]"
          />

          <div className="flex items-center gap-2.5 mb-5 text-white/80">
            <div
              className="w-[22px] h-[22px] rounded-full flex-shrink-0"
              style={{ backgroundColor: avatarColor }}
            />
            <span className="text-[12px]">{channelTitle}</span>
            <span className="text-white/35">·</span>
            <span className="text-[12px]">
              {formatViews(statistics?.viewCount)} watching
            </span>
            <span className="text-white/35">·</span>
            <span className="text-[12px]">Episode 03 of 06</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[7px] bg-[#e8622a] hover:bg-[#f27a3e] text-white text-[13px] font-medium transition-colors"
            >
              <PlayGlyph size={12} />
              Watch now
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSaved((s) => !s);
              }}
              className={`inline-flex items-center gap-[7px] px-[18px] py-2.5 rounded-[7px] text-[13px] font-medium backdrop-blur-sm border transition-colors ${
                saved
                  ? "bg-[#1d1d26] border-[#e8622a] text-[#e8622a]"
                  : "bg-white/[0.1] border-white/[0.2] text-white/90 hover:bg-white/[0.14]"
              }`}
            >
              <Bookmark className="w-3 h-3" strokeWidth={1.75} />
              {saved ? "Saved" : "Save"}
            </button>

            <div className="ml-auto text-right">
              <div className="text-[22px] font-light text-white leading-none tabular-nums" style={{ letterSpacing: "-0.02em" }}>
                {formatDuration(contentDetails?.duration) || "48:22"}
              </div>
              <div className="text-[9px] text-white/45 tracking-[0.1em] uppercase mt-[2px]">
                Run time
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

/* ── Up-next list card (right) ────────────────────────────────────── */
const UP_NEXT_META = [
  { cat: "Nature",  tag: "Featured"    },
  { cat: "Music",   tag: "New Release" },
  { cat: "Science", tag: "Trending"    },
];

const UpNextRow = ({ video, variant, isLast }) => {
  const v = UP_NEXT_META[variant % UP_NEXT_META.length];
  const { snippet, statistics, contentDetails, id } = video;
  const { title, channelTitle } = snippet;
  const thumb = getBestThumbnail(snippet.thumbnails);

  return (
    <Link
      to={`/watch?v=${id}`}
      className={`group flex gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors ${
        isLast ? "" : "border-b border-white/[0.06]"
      }`}
    >
      <div className="relative w-[80px] h-[54px] flex-shrink-0 rounded-[6px] overflow-hidden bg-white/[0.05]">
        {thumb && (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        )}
        {contentDetails?.duration && (
          <span className="absolute bottom-1 right-1 px-1 py-[1px] rounded-[3px] bg-black/85 text-white text-[9px] font-medium tabular-nums">
            {formatDuration(contentDetails.duration)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] font-semibold text-[#e8622a] tracking-[0.1em] uppercase">
            {v.cat}
          </span>
          <span className="text-white/25 text-[9px]">·</span>
          <span className="text-[9px] font-medium text-white/45 tracking-[0.08em] uppercase">
            {v.tag}
          </span>
        </div>
        <h3 className="text-[12px] text-white leading-[1.35] line-clamp-2 mb-1.5 font-medium group-hover:text-white transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-auto">
          <div
            className="w-[14px] h-[14px] rounded-full flex-shrink-0"
            style={{ backgroundColor: getAvatarColor(channelTitle) }}
          />
          <span className="truncate">{channelTitle}</span>
          {statistics?.viewCount && (
            <>
              <span className="text-white/20 flex-shrink-0">·</span>
              <span className="flex-shrink-0">
                {formatViews(statistics.viewCount)} views
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ── Skeleton ─────────────────────────────────────────────────────── */
const HeroSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
    <div className="min-h-[320px] rounded-[10px] bg-white/[0.02] animate-pulse" />
    <div className="rounded-[10px] bg-white/[0.02] animate-pulse" />
  </div>
);

/* ── HeroSection ──────────────────────────────────────────────────── */
const HeroSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getVideosUrl(null))
      .then((r) => r.json())
      .then((json) => {
        setVideos((json.items || []).slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="mb-9">
      {/* Top strip */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-10 h-px bg-white/[0.12]" />
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#dc4a1a]"
            style={{ animation: "pulse-live 1.4s ease-in-out infinite" }}
          />
          <span className="text-[9px] font-semibold text-white/45 tracking-[0.14em] uppercase">
            Now Streaming
          </span>
          <span className="text-white/20 text-[9px]">·</span>
          <span className="text-[9px] font-medium text-white/45 tracking-[0.12em] uppercase">
            Curated for you
          </span>
        </div>
      </div>

      {loading || videos.length < 4 ? (
        <HeroSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-stretch">
          <FeaturedCard video={videos[0]} />

          {/* Up next card */}
          <div className="bg-[#14141c] border border-white/[0.06] rounded-[10px] overflow-hidden flex flex-col">
            <div className="px-4 pt-3 pb-2.5 border-b border-white/[0.06]">
              <span className="text-[10px] font-medium text-white/45 tracking-[0.1em] uppercase">
                Up next
              </span>
            </div>
            {videos.slice(1, 4).map((v, i, arr) => (
              <UpNextRow
                key={v.id}
                video={v}
                variant={i}
                isLast={i === arr.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
