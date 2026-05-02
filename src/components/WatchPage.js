import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Bookmark,
  ChevronDown,
  Download,
  Heart,
  Maximize,
  MoreHorizontal,
  Settings,
  Share2,
  Subtitles,
} from "lucide-react";
import { closeMenu } from "../utils/appSlice";
import {
  getBestThumbnail,
  getVideosByIdsUrl,
  YOUTUBE_VIDEOS_API,
} from "../utils/constants";
import RecommendedVideoCard from "./RecommendedVideoCard";
import CommentsSection from "./CommentsSection";
import Footer from "./Footer";

/* ── helpers ──────────────────────────────────────────────── */
const formatDuration = (iso) => {
  if (!iso) return "";
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const s = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${min}:${String(s).padStart(2, "0")}`;
};

const formatViews = (n) => {
  const num = Number(n) || 0;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${Math.round(num / 1e3)}K`;
  return `${num}`;
};

const formatLikes = (n) => formatViews(n);

const getRelativeTime = (iso) => {
  if (!iso) return "";
  const diffH = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH} hours ago`;
  const d = Math.floor(diffH / 24);
  if (d < 30) return d === 1 ? "1 day ago" : `${d} days ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return mo === 1 ? "1 month ago" : `${mo} months ago`;
  const y = Math.floor(mo / 12);
  return y === 1 ? "1 year ago" : `${y} years ago`;
};

const CATEGORY_LABEL = {
  "1": "FILM",
  "2": "AUTOS",
  "10": "MUSIC",
  "15": "PETS",
  "17": "SPORTS",
  "19": "TRAVEL",
  "20": "GAMING",
  "22": "VLOG",
  "23": "COMEDY",
  "24": "ENTERTAINMENT",
  "25": "NEWS",
  "26": "HOWTO",
  "27": "EDUCATION",
  "28": "SCIENCE",
};

/* Split a title into [title, subtitle] only when there's a clear delimiter
   and both halves are reasonably long. Otherwise return [title, null]. */
const splitTitle = (raw) => {
  if (!raw) return ["", null];
  const delims = [" — ", " – ", " | ", " · ", ": "];
  for (const d of delims) {
    const idx = raw.indexOf(d);
    if (idx > 4 && idx < raw.length - 6) {
      return [raw.slice(0, idx).trim(), raw.slice(idx + d.length).trim()];
    }
  }
  return [raw, null];
};

/* ── Player ──────────────────────────────────────────────── */
const Player = ({ videoId, snippet, contentDetails }) => {
  /* Autoplay on mount — user just navigated here intentionally */
  const [playing, setPlaying] = useState(true);
  const thumb = getBestThumbnail(snippet?.thumbnails);
  const eyebrowLabel =
    CATEGORY_LABEL[snippet?.categoryId] || "VIDEO";

  return (
    <div
      className="player-fadein relative w-full overflow-hidden cursor-pointer"
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.06)",
        aspectRatio: "16/9",
        background: "#0a0a0b",
      }}
      
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={snippet?.title || "Player"}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          {thumb && (
            <img
              src={thumb}
              alt={snippet?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Bottom gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,11,0.6) 0%, transparent 45%)",
            }}
          />

          {/* Top-left eyebrow */}
          <div
            className="absolute top-4 left-4 text-[10px] font-semibold tracking-[0.14em] uppercase pointer-events-none"
            style={{ color: "rgba(245,241,234,0.7)" }}
          >
            {eyebrowLabel}
          </div>

          {/* Top-right controls (decorative when paused) */}
          <div className="absolute top-[14px] right-[14px] flex gap-3.5 items-center pointer-events-none">
            <Subtitles
              className="w-4 h-4"
              strokeWidth={2}
              style={{ color: "rgba(245,241,234,0.7)" }}
            />
            <Settings
              className="w-4 h-4"
              strokeWidth={2}
              style={{ color: "rgba(245,241,234,0.7)" }}
            />
            <Maximize
              className="w-4 h-4"
              strokeWidth={2}
              style={{ color: "rgba(245,241,234,0.7)" }}
            />
          </div>

          {/* Centered play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(10,10,11,0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(245,241,234,0.14)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF5C2B">
                <polygon points="6 3 21 12 6 21 6 3" />
              </svg>
            </div>
          </div>

          {/* Decorative progress bar */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: 2, background: "rgba(245,241,234,0.12)" }}
          >
            <div
              className="h-full relative"
              style={{ width: "18%", background: "#FF5C2B" }}
            >
              <div
                className="absolute"
                style={{
                  right: -4,
                  top: -3,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FF5C2B",
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Action button ───────────────────────────────────────── */
const ActionBtn = ({ icon: Icon, label, active, onClick, customColor }) => (
  <button
    type="button"
    onClick={onClick}
    className="action-btn"
    style={active && customColor ? { color: customColor } : undefined}
  >
    {Icon}
    {label && <span>{label}</span>}
  </button>
);

/* ── Framing block (eyebrow + title + channel + actions) ─ */
const FramingBlock = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const { snippet, statistics, contentDetails } = video;
  const { title: rawTitle, channelTitle, publishedAt, categoryId } = snippet;
  const [titleMain, titleSub] = splitTitle(rawTitle);
  const eyebrow = CATEGORY_LABEL[categoryId] || "VIDEO";
  const titleWords = titleMain.split(" ");
  const subtitleWords = titleSub ? titleSub.split(" ") : [];

  const handleLike = () => {
    setLiked((v) => !v);
    setHeartAnim(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setHeartAnim(true))
    );
    setTimeout(() => setHeartAnim(false), 400);
  };

  const baseLikes = parseInt(statistics?.likeCount || 0);
  const displayLikes = baseLikes + (liked ? 1 : 0);

  return (
    <div style={{ maxWidth: 1040, width: "100%" }}>
      {/* Eyebrow row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[11px] font-semibold uppercase"
          style={{
            letterSpacing: "0.14em",
            color: "rgba(245,241,234,0.5)",
          }}
        >
          {eyebrow}
        </span>
        <span
          className="text-[11px]"
          style={{
            fontVariantNumeric: "tabular-nums",
            color: "rgba(245,241,234,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          {formatDuration(contentDetails?.duration)}
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-[#F5F1EA] flex flex-wrap"
        style={{
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          marginBottom: 4,
          columnGap: 10,
          rowGap: 0,
        }}
      >
        {titleWords.map((w, i) => (
          <span
            key={i}
            className="word-stagger"
            style={{
              animationDelay: `${i * 60}ms`,
              opacity: mounted ? undefined : 0,
            }}
          >
            {w}
          </span>
        ))}
      </h1>

      {/* Subtitle (when title splits cleanly) */}
      {titleSub && (
        <p
          className="flex flex-wrap"
          style={{
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.2,
            color: "rgba(245,241,234,0.65)",
            marginBottom: 18,
            columnGap: 7,
            letterSpacing: "-0.015em",
          }}
        >
          {subtitleWords.map((w, i) => (
            <span
              key={i}
              className="word-stagger"
              style={{
                animationDelay: `${(titleWords.length + i) * 60}ms`,
                opacity: mounted ? undefined : 0,
              }}
            >
              {w}
            </span>
          ))}
        </p>
      )}

      {/* Channel row */}
      <div className="flex items-center justify-between mb-1.5 mt-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "#1d1d24",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <span
              className="text-[11px] font-semibold"
              style={{ color: "#F5F1EA" }}
            >
              {channelTitle?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <span
            className="text-[14px] font-medium"
            style={{ color: "rgba(245,241,234,0.9)" }}
          >
            {channelTitle}
          </span>
        </div>
        <button
          onClick={() => setSubscribed((s) => !s)}
          className="cursor-pointer transition-all duration-200"
          style={{
            padding: "7px 18px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            border: subscribed ? "none" : "1px solid rgba(245,241,234,0.18)",
            background: subscribed ? "#FF5C2B" : "transparent",
            color: subscribed ? "#fff" : "rgba(245,241,234,0.8)",
          }}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Stats row */}
      <p
        className="text-[13px] mb-[18px]"
        style={{ color: "rgba(245,241,234,0.5)" }}
      >
        {formatViews(statistics?.viewCount)} views · {getRelativeTime(publishedAt)}
      </p>

      {/* Hairline */}
      <div
        className="mb-4"
        style={{ height: 1, background: "rgba(245,241,234,0.08)" }}
      />

      {/* Action row */}
      <div className="flex items-center gap-7">
        <button
          type="button"
          onClick={handleLike}
          className="action-btn"
          style={liked ? { color: "#FF5C2B" } : undefined}
        >
          <span className={heartAnim ? "heart-pop inline-flex" : "inline-flex"}>
            <Heart
              className="w-4 h-4"
              strokeWidth={2}
              fill={liked ? "#FF5C2B" : "none"}
            />
          </span>
          <span>{formatLikes(displayLikes)}</span>
        </button>

        <ActionBtn
          icon={<Share2 className="w-4 h-4" strokeWidth={2} />}
          label="Share"
        />

        <ActionBtn
          icon={
            <Bookmark
              className="w-4 h-4"
              strokeWidth={2}
              fill={saved ? "#F5F1EA" : "none"}
            />
          }
          label={saved ? "Saved" : "Save"}
          onClick={() => setSaved((s) => !s)}
        />

        <ActionBtn
          icon={<Download className="w-4 h-4" strokeWidth={2} />}
          label="Download"
        />

        <button type="button" className="action-btn ml-auto">
          <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

/* ── Description card with chips ─────────────────────────── */
const DescriptionCard = ({ video }) => {
  const [expanded, setExpanded] = useState(false);
  const { snippet, statistics } = video;
  const { description, channelTitle, categoryId } = snippet;

  /* Build chips from real data: tags (if available) + category + channel */
  const chips = React.useMemo(() => {
    const out = [];
    if (CATEGORY_LABEL[categoryId]) {
      out.push(
        CATEGORY_LABEL[categoryId].charAt(0) +
          CATEGORY_LABEL[categoryId].slice(1).toLowerCase()
      );
    }
    if (channelTitle) out.push(channelTitle);
    if (Array.isArray(snippet.tags)) {
      for (const t of snippet.tags) {
        if (out.length >= 6) break;
        if (t.length > 1 && t.length < 22 && !out.includes(t)) out.push(t);
      }
    }
    if (statistics?.viewCount) {
      out.push(`${formatViews(statistics.viewCount)} views`);
    }
    return out.slice(0, 6);
  }, [snippet, statistics, channelTitle, categoryId]);

  if (!description) return null;

  return (
    <div
      style={{
        background: "#15151A",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: 24,
        maxWidth: 1040,
      }}
    >
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {chips.map((chip, i) => (
            <span
              key={`${chip}-${i}`}
              className="cursor-pointer transition-colors"
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                border: "1px solid rgba(245,241,234,0.15)",
                fontSize: 11,
                color: "rgba(245,241,234,0.65)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(245,241,234,0.32)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(245,241,234,0.15)")
              }
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <div
        className="overflow-hidden"
        style={{ maxHeight: expanded ? "none" : "5.6em" }}
      >
        {description.split("\n").map((line, i) => (
          <p
            key={i}
            className="text-[14px]"
            style={{
              color: "rgba(245,241,234,0.7)",
              lineHeight: 1.7,
              marginBottom: i < description.split("\n").length - 1 ? 12 : 0,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="bg-transparent border-none cursor-pointer flex items-center gap-1 mt-2.5 p-0"
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(245,241,234,0.65)",
          }}
        >
          {expanded ? "Show less" : "Show more"}
        </span>
        <span
          className="flex transition-transform duration-200"
          style={{
            transform: expanded ? "rotate(180deg)" : "none",
            color: "rgba(245,241,234,0.4)",
          }}
        >
          <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
        </span>
      </button>
    </div>
  );
};

/* ── Up Next rail ────────────────────────────────────────── */
const UpNextRail = ({ videos, currentId }) => {
  const filtered = (videos || [])
    .filter((v) => v.id !== currentId)
    .slice(0, 6);

  return (
    <aside
      className="right-col rail-slidein"
      style={{ width: 340, flexShrink: 0 }}
    >
      <div className="mb-1.5">
        <h3
          className="text-[16px] font-semibold text-[#F5F1EA]"
          style={{ letterSpacing: "-0.015em" }}
        >
          Up{" "}
          <span
            className="font-semibold"
            style={{ color: "#FF5C2B" }}
          >
            next
          </span>
        </h3>
      </div>

      <p
        className="mb-5"
        style={{
          fontWeight: 400,
          fontSize: 12,
          color: "rgba(245,241,234,0.5)",
          lineHeight: 1.5,
        }}
      >
        From the channels and themes around this story
      </p>

      <div className="upnext-cards-vertical flex flex-col gap-3.5">
        {filtered.map((v) => (
          <RecommendedVideoCard key={v.id} info={v} />
        ))}
      </div>

      <div
        className="mt-5 pt-4"
        style={{ borderTop: "1px solid rgba(245,241,234,0.06)" }}
      >
        <span
          className="inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          style={{
            fontWeight: 500,
            fontSize: 13,
            color: "rgba(245,241,234,0.6)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(245,241,234,0.88)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(245,241,234,0.6)")
          }
        >
          More like this →
        </span>
      </div>
    </aside>
  );
};

/* ── Skeleton ────────────────────────────────────────────── */
const PlayerSkeleton = () => (
  <div
    className="w-full animate-pulse"
    style={{
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.06)",
      aspectRatio: "16/9",
      background: "rgba(245,241,234,0.04)",
    }}
  />
);

const FramingSkeleton = () => (
  <div className="space-y-4 animate-pulse" style={{ maxWidth: 1040 }}>
    <div
      className="h-3 w-24 rounded"
      style={{ background: "rgba(245,241,234,0.05)" }}
    />
    <div
      className="h-10 w-2/3 rounded"
      style={{ background: "rgba(245,241,234,0.05)" }}
    />
    <div
      className="h-6 w-1/3 rounded"
      style={{ background: "rgba(245,241,234,0.05)" }}
    />
  </div>
);

/* ── Main WatchPage ──────────────────────────────────────── */
const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const [videoInfo, setVideoInfo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  /* Recommendations — fetched once */
  useEffect(() => {
    fetch(YOUTUBE_VIDEOS_API)
      .then((r) => r.json())
      .then((json) => setRecommended(json.items || []))
      .catch(() => {});
  }, []);

  /* Current video info */
  useEffect(() => {
    if (!videoId) return;
    setVideoInfo(null);
    fetch(getVideosByIdsUrl([videoId]))
      .then((r) => r.json())
      .then((json) => setVideoInfo(json.items?.[0] || null))
      .catch(() => {});
  }, [videoId]);

  return (
    <div className="w-full min-h-[calc(100vh-60px)]">
      <div
        className="mx-auto"
        style={{ maxWidth: 1440, padding: "28px 28px 0" }}
      >
        <div
          className="watch-layout flex items-start"
          style={{ gap: 32 }}
        >
          {/* Left column */}
          <div
            className="left-col flex-1 min-w-0 flex flex-col"
            style={{ gap: 28 }}
          >
            {videoInfo ? (
              <>
                <Player
                  videoId={videoId}
                  snippet={videoInfo.snippet}
                  contentDetails={videoInfo.contentDetails}
                />
                <FramingBlock video={videoInfo} />
                <DescriptionCard video={videoInfo} />
              </>
            ) : (
              <>
                <PlayerSkeleton />
                <FramingSkeleton />
              </>
            )}
            <CommentsSection videoId={videoId} />
          </div>

          {/* Up Next rail */}
          <UpNextRail videos={recommended} currentId={videoId} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WatchPage;
