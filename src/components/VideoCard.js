import React from "react";
import { getBestThumbnail } from "../utils/constants";

const formatDuration = (duration) => {
  if (!duration) return "";
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] || 0);
  const mi = parseInt(m[2] || 0);
  const s = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(mi).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${mi}:${String(s).padStart(2, "0")}`;
};

const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d < 1) return "Today";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

/* YouTube serves a tiny 120x90 placeholder when the requested
   resolution is missing (common for fresh live streams). */
const PLACEHOLDER_THRESHOLD = 200;

const VideoCard = ({ info, animDelay, onLoadFail }) => {
  if (!info) return null;
  const { snippet, contentDetails } = info;
  const { title, channelTitle, publishedAt } = snippet;
  const thumb = getBestThumbnail(snippet.thumbnails);

  const animStyle =
    animDelay !== undefined
      ? { animationDelay: `${animDelay}ms` }
      : undefined;

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (
      naturalWidth < PLACEHOLDER_THRESHOLD ||
      naturalHeight < PLACEHOLDER_THRESHOLD
    ) {
      onLoadFail?.();
    }
  };

  if (!thumb) {
    /* No usable thumbnail at all — let the parent drop the card. */
    onLoadFail?.();
    return null;
  }

  return (
    <div
      className={`vcard${animDelay !== undefined ? " card-enter" : ""}`}
      style={animStyle}
    >
      <div className="thumb-shell">
        <div className="thumb-inner aspect-video bg-white/[0.04]">
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            onError={() => onLoadFail?.()}
            onLoad={handleLoad}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="pt-2.5 flex flex-col gap-1">
        <p
          className="text-[13px] font-medium text-[#F5F1EA] leading-[1.35] line-clamp-2"
          style={{ letterSpacing: "-0.005em" }}
        >
          {title}
        </p>
        <div
          className="flex flex-wrap items-center text-[11px] text-white/[0.34]"
          style={{ rowGap: 2, columnGap: 8 }}
        >
          <span className="truncate">{channelTitle}</span>
          <span>·</span>
          <span>{formatRelativeTime(publishedAt)}</span>
          {contentDetails?.duration && (
            <>
              <span>·</span>
              <span>{formatDuration(contentDetails.duration)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
