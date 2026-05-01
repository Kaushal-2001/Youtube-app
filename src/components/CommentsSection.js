import React, { useEffect, useState } from "react";
import { ChevronDown, Heart, Reply } from "lucide-react";
import { getAvatarColor, getCommentsUrl } from "../utils/constants";

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(num >= 10_000 ? 0 : 1) + "K";
  return String(num);
};

const getTimeAgo = (date) => {
  const diffH = Math.floor(
    (new Date() - new Date(date)) / (1000 * 60 * 60)
  );
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH} hours ago`;
  if (diffH < 24 * 30) {
    const d = Math.floor(diffH / 24);
    return d === 1 ? "1 day ago" : `${d} days ago`;
  }
  if (diffH < 24 * 365) {
    const m = Math.floor(diffH / (24 * 30));
    return m === 1 ? "1 month ago" : `${m} months ago`;
  }
  const y = Math.floor(diffH / (24 * 365));
  return y === 1 ? "1 year ago" : `${y} years ago`;
};

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const Avatar = ({ name, imageUrl, size = 32 }) => {
  const [broken, setBroken] = useState(false);
  if (imageUrl && !broken) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setBroken(true)}
        style={{ width: size, height: size }}
        className="rounded-full flex-shrink-0 object-cover"
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: getAvatarColor(name),
      }}
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
    >
      <span style={{ fontSize: Math.round(size * 0.35) }}>
        {(name || "?").charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

const CommentRow = ({ comment }) => {
  const [liked, setLiked] = useState(false);
  const top = comment.snippet.topLevelComment.snippet;
  const replyCount = comment.snippet.totalReplyCount || 0;
  const text = stripHtml(top.textDisplay);
  const baseLikes = top.likeCount || 0;
  const displayLikes = baseLikes + (liked ? 1 : 0);

  return (
    <div className="flex gap-3">
      <Avatar
        name={top.authorDisplayName}
        imageUrl={top.authorProfileImageUrl}
        size={32}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="text-[13px] font-medium"
            style={{ color: "rgba(245,241,234,0.9)" }}
          >
            {top.authorDisplayName}
          </span>
          <span
            className="text-[11px]"
            style={{ color: "rgba(245,241,234,0.38)" }}
          >
            {getTimeAgo(top.publishedAt)}
          </span>
        </div>
        <p
          className="text-[14px] leading-[1.65] mb-2 whitespace-pre-wrap break-words"
          style={{ color: "rgba(245,241,234,0.8)" }}
        >
          {text}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLiked((v) => !v)}
            className="bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[11px] p-0 transition-colors"
            style={{
              color: liked ? "#FF5C2B" : "rgba(245,241,234,0.38)",
            }}
          >
            <Heart
              className="w-[13px] h-[13px]"
              strokeWidth={2}
              fill={liked ? "#FF5C2B" : "none"}
            />
            <span>{formatCount(displayLikes)}</span>
          </button>
          {replyCount > 0 && (
            <button
              className="bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[11px] p-0 transition-colors hover:text-white/70"
              style={{ color: "rgba(245,241,234,0.38)" }}
            >
              <Reply className="w-[13px] h-[13px]" strokeWidth={2} />
              <span>
                {formatCount(replyCount)}{" "}
                {replyCount === 1 ? "reply" : "replies"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSkeleton = () => (
  <div className="flex gap-3 animate-pulse">
    <div
      className="w-8 h-8 rounded-full flex-shrink-0"
      style={{ background: "rgba(245,241,234,0.04)" }}
    />
    <div className="flex-1 space-y-2">
      <div
        className="h-3 w-1/4 rounded"
        style={{ background: "rgba(245,241,234,0.04)" }}
      />
      <div
        className="h-3 w-full rounded"
        style={{ background: "rgba(245,241,234,0.04)" }}
      />
      <div
        className="h-3 w-3/4 rounded"
        style={{ background: "rgba(245,241,234,0.04)" }}
      />
    </div>
  </div>
);

const USER_NAME = "Kaushal";

const CommentComposer = () => {
  const [text, setText] = useState("");

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="flex gap-3 mb-9">
      <Avatar name={USER_NAME} size={32} />
      <textarea
        className="comment-input"
        placeholder="Add a comment…"
        rows={1}
        value={text}
        onChange={handleInput}
      />
    </div>
  );
};

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[12px]"
        style={{ color: "rgba(245,241,234,0.6)" }}
      >
        <span>Sort: {value}</span>
        <ChevronDown
          className="w-3 h-3 transition-transform"
          strokeWidth={2.5}
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-10"
          style={{
            background: "#15151A",
            border: "1px solid rgba(245,241,234,0.08)",
            minWidth: 120,
          }}
        >
          {["Top", "Newest"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[12px] cursor-pointer hover:bg-white/[0.04] transition-colors"
              style={{
                color:
                  value === opt
                    ? "#F5F1EA"
                    : "rgba(245,241,234,0.6)",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("Top");

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(getCommentsUrl(videoId, 20));
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const reason = body?.error?.errors?.[0]?.reason;
          if (cancelled) return;
          setError(
            reason === "commentsDisabled"
              ? "Comments are turned off for this video."
              : "Could not load comments."
          );
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        setComments(json.items || []);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setError("Could not load comments.");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const sorted = React.useMemo(() => {
    if (sort === "Newest") {
      return [...comments].sort((a, b) => {
        const ta = new Date(a.snippet.topLevelComment.snippet.publishedAt);
        const tb = new Date(b.snippet.topLevelComment.snippet.publishedAt);
        return tb - ta;
      });
    }
    return comments;
  }, [comments, sort]);

  return (
    <div style={{ maxWidth: 1040 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h3
          className="text-[16px] font-medium text-[#F5F1EA]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Comments{" "}
          {!loading && (
            <span
              className="text-[13px] font-normal"
              style={{ color: "rgba(245,241,234,0.36)" }}
            >
              {comments.length}
            </span>
          )}
        </h3>
        {!error && comments.length > 0 && (
          <SortDropdown value={sort} onChange={setSort} />
        )}
      </div>

      {/* Composer */}
      <CommentComposer />

      {/* List */}
      {loading && (
        <div className="flex flex-col gap-7">
          {Array.from({ length: 5 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <p
          className="text-[13px]"
          style={{ color: "rgba(245,241,234,0.5)" }}
        >
          {error}
        </p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p
          className="text-[13px]"
          style={{ color: "rgba(245,241,234,0.5)" }}
        >
          No comments yet. Be the first.
        </p>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="flex flex-col gap-7">
          {sorted.map((c) => (
            <CommentRow key={c.id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
