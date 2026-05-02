import React, { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import {
  getAvatarColor,
  getBestThumbnail,
  getShortsUrl,
  getVideosByIdsUrl,
} from "../utils/constants";

const CATS = [
  "All", "Nature", "Craft", "Design", "Music",
  "Travel", "Food", "Science", "Stories", "Life",
];

const CAT_TAGS = {
  Nature:  ["#Nature", "#Outdoors"],
  Craft:   ["#Craft", "#Handmade"],
  Design:  ["#Design", "#Architecture"],
  Music:   ["#Music", "#Live"],
  Travel:  ["#Travel", "#Adventure"],
  Food:    ["#Food", "#Cooking"],
  Science: ["#Science", "#Discovery"],
  Stories: ["#Stories", "#Documentary"],
  Life:    ["#LifeHack", "#Quick"],
};

const hashString = (s) => {
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h;
};

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num > 0 ? String(num) : "—";
};

const formatDuration = (duration) => {
  if (!duration) return "—";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "—";
  const h = (match[1] || "").replace("H", "");
  const m = (match[2] || "").replace("M", "");
  const s = (match[3] || "").replace("S", "");
  if (h) return `${h}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  return `${m || "0"}:${s.padStart(2, "0")}`;
};

const PlayGlyph = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <polygon points="3,2 15,8 3,14" fill="currentColor" />
  </svg>
);

const PauseGlyph = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="currentColor" aria-hidden>
    <rect x="3" y="2" width="4" height="14" rx="1" />
    <rect x="11" y="2" width="4" height="14" rx="1" />
  </svg>
);

/* ── Featured short (phone player + info panel) ──────────────────── */
const FeaturedShort = ({
  short, progress,
  liked, saved,
  onPrev, onNext, onLike, onSave,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const { snippet, statistics, contentDetails, id, _cat, _tags } = short;
  const { title, channelTitle } = snippet;

  const handleClick = (e) => {
    e.preventDefault();
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 800);
  };

  return (
    <div
      className="flex gap-7 items-start"
      style={{ animation: "fade-up 0.35s ease both" }}
    >
      {/* Phone player */}
      <div
        onClick={handleClick}
        className="relative w-[320px] flex-shrink-0 rounded-[24px] overflow-hidden aspect-[9/16] cursor-pointer bg-black"
        style={{
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <iframe
          key={id}
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=${id}&modestbranding=1`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(5,5,10,0.9) 0%, rgba(5,5,10,0.2) 40%, transparent 65%)",
          }}
        />

        {/* Top badges */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="bg-black/70 backdrop-blur-sm border border-white/[0.1] text-white/70 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-[3px] rounded">
            {_cat}
          </span>
          <span className="bg-black/70 backdrop-blur-sm border border-white/[0.1] text-white/70 text-[9px] font-medium px-2 py-[3px] rounded">
            {formatDuration(contentDetails?.duration)}
          </span>
        </div>

        {/* Spinning indicator while playing */}
        {!showOverlay && (
          <div className="absolute top-[14px] right-[60px] z-10 pointer-events-none">
            <div
              className="w-[18px] h-[18px] rounded-full border-2 border-white/[0.15] animate-spin"
              style={{ borderTopColor: "rgba(255,255,255,0.6)" }}
            />
          </div>
        )}

        {/* Play/pause overlay (decorative — clicks flash it briefly) */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/[0.15] backdrop-blur-md border border-white/[0.2] flex items-center justify-center text-white">
              <PauseGlyph size={18} />
            </div>
          </div>
        )}

        {/* Bottom info block */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-6 z-10 pointer-events-none">
          <div className="h-[3px] bg-white/[0.12] rounded-sm overflow-hidden mb-2.5">
            <div
              className="h-full bg-[#FF5C2B] rounded-sm"
              style={{
                width: `${progress * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
              style={{ backgroundColor: getAvatarColor(channelTitle) }}
            >
              {channelTitle.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-white leading-tight truncate">
                {channelTitle}
              </div>
              <div className="text-[10px] text-white/65">
                {formatCount(statistics?.viewCount)} views
              </div>
            </div>
          </div>

          <div className="text-[13px] font-medium text-white leading-[1.35] line-clamp-2 mb-1.5">
            {title}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {_tags.map((t) => (
              <span key={t} className="text-[10px] text-[#FF5C2B] font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right info panel */}
      <div className="pt-2 flex flex-col gap-7" style={{ width: 260 }}>
        <div>
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#FF5C2B] mb-2">
            {_cat}
          </div>
          <h2
            className="text-[22px] font-semibold leading-[1.2]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <div className="mt-2.5 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
              style={{ backgroundColor: getAvatarColor(channelTitle) }}
            >
              {channelTitle.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium truncate">
                {channelTitle}
              </div>
              <div className="text-[11px] text-white/40">
                {formatCount(statistics?.viewCount)} views
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <ActionButton
            icon={<Heart className="w-4 h-4" strokeWidth={1.5} fill={liked ? "#FF5C2B" : "none"} />}
            active={liked}
            activeColor="#FF5C2B"
            label="Like"
            count={formatCount(statistics?.likeCount)}
            onClick={onLike}
          />
          <ActionButton
            icon={<Bookmark className="w-4 h-4" strokeWidth={1.5} fill={saved ? "#9b59b6" : "none"} />}
            active={saved}
            activeColor="#9b59b6"
            label="Save"
            count="3.8K"
            onClick={onSave}
          />
          <ActionButton
            icon={<Share2 className="w-4 h-4" strokeWidth={1.5} />}
            active={false}
            activeColor="#3498db"
            label="Share"
            count="Share"
          />
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <NavBtn onClick={onPrev}>
            <ChevronLeft className="w-3 h-3" strokeWidth={2} /> Prev
          </NavBtn>
          <NavBtn onClick={onNext}>
            Next <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </NavBtn>
        </div>

        {/* Keyboard hints */}
        <div className="text-[10px] text-white/35 leading-[1.6]">
          <div>
            <Kbd>↑</Kbd><Kbd>↓</Kbd> navigate shorts
          </div>
          <div className="mt-1">
            <Kbd>Space</Kbd> play / pause
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, active, activeColor, label, count, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 px-3.5 py-[9px] rounded-lg text-[12px] transition-all text-left"
    style={{
      width: 160,
      background: active ? `${activeColor}18` : "#14141c",
      border: `1px solid ${active ? activeColor + "44" : "rgba(255,255,255,0.06)"}`,
      color: active ? activeColor : "rgba(255,255,255,0.6)",
      fontWeight: active ? 500 : 400,
    }}
  >
    {icon}
    <span className="flex-1">{count}</span>
    {active && (
      <span className="text-[9px] tracking-[0.06em] uppercase opacity-70">
        {label}d
      </span>
    )}
  </button>
);

const NavBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex-1 py-[9px] rounded-lg bg-[#14141c] border border-white/[0.06] text-white/55 hover:text-white hover:border-white/[0.15] text-[11px] flex items-center justify-center gap-1.5 transition-colors"
  >
    {children}
  </button>
);

const Kbd = ({ children }) => (
  <kbd className="bg-[#14141c] border border-white/[0.06] rounded text-[9px] text-white/45 px-1.5 py-[1px] mr-1 font-sans">
    {children}
  </kbd>
);

/* ── Queue card ──────────────────────────────────────────────────── */
const QueueCard = ({ short, active, onClick }) => {
  const [hov, setHov] = useState(false);
  const { snippet, statistics, contentDetails } = short;
  const { title } = snippet;
  const thumb = getBestThumbnail(snippet.thumbnails);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative cursor-pointer rounded-[10px] overflow-hidden flex-shrink-0 bg-black"
      style={{
        width: 110,
        aspectRatio: "9/16",
        outline: active
          ? "2px solid #FF5C2B"
          : hov
          ? "1px solid rgba(255,255,255,0.12)"
          : "none",
        outlineOffset: active ? 2 : 0,
        transform: hov && !active ? "scale(1.03)" : "scale(1)",
        transition: "all 0.2s ease",
        boxShadow: active ? "0 0 20px rgba(232,98,42,0.25)" : "none",
      }}
    >
      {thumb && (
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(4,4,10,0.85) 0%, transparent 50%)",
        }}
      />

      {(hov || active) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {active ? (
            <div
              className="w-2 h-2 rounded-full bg-[#FF5C2B]"
              style={{ animation: "pulse-live 1.4s ease-in-out infinite" }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/[0.15] backdrop-blur-sm flex items-center justify-center text-white">
              <PlayGlyph size={10} />
            </div>
          )}
        </div>
      )}

      <div className="absolute bottom-1.5 inset-x-1.5">
        <div className="text-[9px] font-medium text-white leading-[1.3] mb-[3px] line-clamp-2">
          {title}
        </div>
        <div className="text-[8px] text-white/50 flex items-center justify-between">
          <span>{formatDuration(contentDetails?.duration)}</span>
          <span>{formatCount(statistics?.viewCount)}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton ────────────────────────────────────────────────────── */
const ShortsSkeleton = () => (
  <div className="flex gap-7">
    <div className="w-[320px] aspect-[9/16] bg-white/[0.04] rounded-[24px] animate-pulse" />
    <div className="space-y-4" style={{ width: 260 }}>
      <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
      <div className="h-14 bg-white/[0.04] rounded animate-pulse" />
      <div className="h-9 bg-white/[0.04] rounded-lg animate-pulse" />
      <div className="h-9 bg-white/[0.04] rounded-lg animate-pulse" />
      <div className="h-9 bg-white/[0.04] rounded-lg animate-pulse" />
    </div>
  </div>
);

/* ── Main Shorts ─────────────────────────────────────────────────── */
const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0.3);
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());

  /* Fetch shorts */
  useEffect(() => {
    const load = async () => {
      try {
        const searchJson = await fetch(getShortsUrl(20)).then((r) => r.json());
        const ids = (searchJson.items || [])
          .map((i) => i.id?.videoId)
          .filter(Boolean);
        if (!ids.length) {
          setLoading(false);
          return;
        }
        const videosJson = await fetch(getVideosByIdsUrl(ids)).then((r) =>
          r.json()
        );
        setShorts(videosJson.items || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  /* Assign category + tags deterministically */
  const enriched = useMemo(() => {
    const cats = CATS.slice(1);
    return shorts.map((s) => {
      const cat = cats[hashString(s.id) % cats.length];
      return { ...s, _cat: cat, _tags: CAT_TAGS[cat] || [] };
    });
  }, [shorts]);

  const filtered = useMemo(
    () =>
      activeCat === "All"
        ? enriched
        : enriched.filter((s) => s._cat === activeCat),
    [enriched, activeCat]
  );

  const current = filtered[currentIdx] || filtered[0];
  const currentInFiltered = current
    ? filtered.findIndex((s) => s.id === current.id)
    : 0;

  const goPrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIdx((i) => Math.min(Math.max(0, filtered.length - 1), i + 1));

  /* Keyboard navigation */
  useEffect(() => {
    const max = Math.max(0, filtered.length - 1);
    const onKey = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      )
        return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setCurrentIdx((i) => Math.min(max, i + 1));
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setCurrentIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered.length]);

  /* Reset index + progress when category changes */
  useEffect(() => {
    setCurrentIdx(0);
  }, [activeCat]);

  /* Fake progress bar */
  useEffect(() => {
    setProgress(0);
    const id = setInterval(
      () => setProgress((p) => (p >= 1 ? 0 : p + 0.003)),
      300
    );
    return () => clearInterval(id);
  }, [currentIdx, activeCat]);

  const toggleSet = (setter, id) => {
    setter((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="px-7 pt-7 pb-8 min-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-6">
        <h1
          className="text-[28px] font-semibold text-white leading-tight"
          style={{ letterSpacing: "-0.025em" }}
        >
          Shorts{" "}
          <span className="font-normal text-[#FF5C2B]">— quick takes</span>
        </h1>
        {!loading && (
          <span className="text-[11px] text-white/40 tracking-[0.06em]">
            ·  {filtered.length} films
          </span>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 flex-wrap mb-8">
        {CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-[14px] py-[5px] rounded-full text-[12px] whitespace-nowrap flex-shrink-0 transition-colors duration-150 border ${
              activeCat === cat
                ? "bg-[#FF5C2B] border-transparent text-white font-medium"
                : "bg-[#14141c] border-white/[0.08] text-white/55 hover:text-white hover:border-white/[0.18]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main layout */}
      {loading ? (
        <ShortsSkeleton />
      ) : !current ? (
        <p className="text-white/45 text-sm py-12">
          No shorts available in this category.
        </p>
      ) : (
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: "auto 1fr", alignItems: "start" }}
        >
          <FeaturedShort
            key={current.id}
            short={current}
            progress={progress}
            liked={liked.has(current.id)}
            saved={saved.has(current.id)}
            onPrev={goPrev}
            onNext={goNext}
            onLike={() => toggleSet(setLiked, current.id)}
            onSave={() => toggleSet(setSaved, current.id)}
          />

          {/* Queue */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/45">
                Up next
              </span>
              <span className="text-[10px] text-white/40 tabular-nums">
                {currentInFiltered + 1} of {filtered.length}
              </span>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {filtered.map((s, i) => (
                <QueueCard
                  key={s.id}
                  short={s}
                  active={s.id === current.id}
                  onClick={() => setCurrentIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shorts;
