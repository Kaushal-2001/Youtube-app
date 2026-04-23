import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Play } from "lucide-react";
import { getAvatarColor, getVideosUrl } from "../utils/constants";

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

/* Render a title with a middle word italicised in amber */
const EditorialTitle = ({ text, className }) => {
  const words = text.split(/\s+/);
  if (words.length < 3) {
    return <span className={className}>{text}</span>;
  }
  const accentIdx = Math.min(2, Math.floor(words.length / 3));
  return (
    <span className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i === accentIdx ? (
            <span className="italic text-[#d8a86a] font-normal">{w}</span>
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
  const avatarColor = getAvatarColor(channelTitle);

  return (
    <Link
      to={`/watch?v=${id}`}
      className="group relative rounded-2xl overflow-hidden flex flex-col justify-between p-8 min-h-[520px] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
      style={{
        background:
          "radial-gradient(ellipse 110% 80% at 28% 38%, #5a3115 0%, #3a1c0a 32%, #1f0f07 62%, #120905 88%, #0a0503 100%)",
      }}
    >
      {/* Decorative background glyph */}
      <span
        aria-hidden
        className="absolute right-8 top-20 text-[260px] font-serif italic text-white/[0.035] leading-none select-none pointer-events-none"
      >
        sl.
      </span>

      {/* Top: badges */}
      <div className="flex items-center gap-2 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff6b3d] text-white text-[10px] font-bold tracking-[0.15em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
          Live Now
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.07] text-white/75 text-[10px] font-semibold tracking-[0.15em] uppercase">
          Documentary · 4K HDR
        </span>
      </div>

      {/* Middle: title + meta */}
      <div className="relative z-10 mt-8">
        <EditorialTitle
          text={title}
          className="block text-[54px] leading-[1.05] font-serif text-white font-normal mb-6 max-w-[620px]"
        />
        <div className="flex items-center gap-3 text-[13px] text-white/55">
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 border border-white/[0.1]"
            style={{ backgroundColor: avatarColor }}
          />
          <span className="text-white/80 font-medium">{channelTitle}</span>
          <span className="text-white/30">·</span>
          <span>{formatViews(statistics?.viewCount)} watching</span>
          <span className="text-white/30">·</span>
          <span>Episode 03 of 06</span>
        </div>
      </div>

      {/* Bottom: buttons + runtime */}
      <div className="flex items-end justify-between relative z-10 mt-8">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-black" strokeWidth={0} />
            Watch now
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-white text-[13px] font-medium hover:bg-white/[0.08] transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
            Save
          </button>
        </div>
        <div className="text-right">
          <div className="text-[42px] font-serif text-white leading-none tabular-nums">
            {formatDuration(contentDetails?.duration) || "48:22"}
          </div>
          <div className="text-[10px] text-white/30 tracking-[0.25em] font-semibold mt-1">
            RUNTIME
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ── Mini side card (right) ───────────────────────────────────────── */
const MINI_VARIANTS = [
  { cat: "Nature",  sub: "Featured" },
  { cat: "Music",   sub: "New Release" },
  { cat: "Science", sub: "Trending" },
];

const MiniHeroCard = ({ video, variant }) => {
  const v = MINI_VARIANTS[variant % MINI_VARIANTS.length];
  const { snippet, statistics, contentDetails, id } = video;
  const { title, channelTitle, thumbnails } = snippet;

  return (
    <Link
      to={`/watch?v=${id}`}
      className="group flex gap-4 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.035] hover:border-white/[0.08] transition-all flex-1"
    >
      <div className="relative w-[170px] flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-white/[0.05]">
        <img
          src={thumbnails.medium.url}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {contentDetails?.duration && (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-semibold tabular-nums">
            {formatDuration(contentDetails.duration)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-[#d8a86a] tracking-[0.18em] uppercase">
            {v.cat}
          </span>
          <span className="text-white/25">·</span>
          <span className="text-[10px] font-bold text-white/40 tracking-[0.18em] uppercase">
            {v.sub}
          </span>
        </div>
        <h3 className="text-[15px] font-serif text-white line-clamp-2 leading-snug mb-auto font-normal">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-white/40 mt-2">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: getAvatarColor(channelTitle) }}
          />
          <span className="truncate">{channelTitle}</span>
          {statistics?.viewCount && (
            <>
              <span className="text-white/25">·</span>
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
  <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
    <div className="min-h-[520px] rounded-2xl bg-white/[0.02] animate-pulse" />
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex-1 h-[130px] rounded-2xl bg-white/[0.02] animate-pulse" />
      ))}
    </div>
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
    <section className="mb-16">
      {/* Top strip */}
      <div className="flex items-center gap-2 mb-5 pl-2">
        <div className="w-8 h-px bg-white/[0.1]" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 10px rgba(52,211,153,0.7)" }} />
        <span className="text-[10px] font-semibold text-white/35 tracking-[0.25em] uppercase">
          Now Streaming · Curated for you
        </span>
      </div>

      {loading || videos.length < 4 ? (
        <HeroSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
          <FeaturedCard video={videos[0]} />
          <div className="flex flex-col gap-3">
            {videos.slice(1, 4).map((v, i) => (
              <MiniHeroCard key={v.id} video={v} variant={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
