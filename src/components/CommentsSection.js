import React, { useEffect, useState } from "react";
import { getAvatarColor, getCommentsUrl } from "../utils/constants";

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(num >= 10_000 ? 0 : 1) + "K";
  return String(num);
};

const getTimeAgo = (date) => {
  const diffInHours = Math.floor(
    (new Date() - new Date(date)) / (1000 * 60 * 60)
  );
  if (diffInHours < 1) return "just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInHours < 24 * 30) {
    const d = Math.floor(diffInHours / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }
  if (diffInHours < 24 * 365) {
    const m = Math.floor(diffInHours / (24 * 30));
    return `${m} month${m > 1 ? "s" : ""} ago`;
  }
  const y = Math.floor(diffInHours / (24 * 365));
  return `${y} year${y > 1 ? "s" : ""} ago`;
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

const Avatar = ({ name, imageUrl, size = 40 }) => {
  const [broken, setBroken] = useState(false);
  const px = `${size}px`;
  if (imageUrl && !broken) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setBroken(true)}
        style={{ width: px, height: px }}
        className="rounded-full flex-shrink-0 object-cover"
      />
    );
  }
  return (
    <div
      style={{
        width: px,
        height: px,
        backgroundColor: getAvatarColor(name),
      }}
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
};

const Comment = ({ comment }) => {
  const top = comment.snippet.topLevelComment.snippet;
  const replyCount = comment.snippet.totalReplyCount || 0;
  const [showReplies, setShowReplies] = useState(false);
  const text = stripHtml(top.textDisplay);

  return (
    <div className="flex gap-3">
      <Avatar name={top.authorDisplayName} imageUrl={top.authorProfileImageUrl} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13px] font-medium text-white">
            {top.authorDisplayName}
          </span>
          <span className="text-xs text-[#aaa]">
            {getTimeAgo(top.publishedAt)}
          </span>
        </div>
        <p className="text-sm text-[#f1f1f1] whitespace-pre-wrap break-words">
          {text}
        </p>
        <div className="flex items-center gap-4 mt-2 text-[#aaa]">
          <button className="flex items-center gap-1 hover:text-white">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z" />
            </svg>
            <span className="text-xs">{formatCount(top.likeCount)}</span>
          </button>
          <button className="hover:text-white">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17,4v7l-7,0v3L3,8l7-6v2H17z M21,12v10H7v-5h1v4h12v-8h-5v1h-1v-3L21,12z" />
            </svg>
          </button>
          <button className="text-xs font-medium hover:text-white">Reply</button>
        </div>
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies((s) => !s)}
            className="mt-2 flex items-center gap-2 text-[#3ea6ff] text-sm font-medium px-2 py-1 rounded-full hover:bg-[#263850]"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 fill-current transition-transform ${
                showReplies ? "rotate-180" : ""
              }`}
            >
              <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
            </svg>
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
        {showReplies && (
          <p className="text-xs text-[#717171] mt-2 ml-2">
            Replies are not loaded in this demo.
          </p>
        )}
      </div>
    </div>
  );
};

const CommentSkeleton = () => (
  <div className="flex gap-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-[#272727] flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-[#272727] rounded w-1/4" />
      <div className="h-3 bg-[#272727] rounded w-full" />
      <div className="h-3 bg-[#272727] rounded w-3/4" />
    </div>
  </div>
);

const USER_NAME = "Kaushal";

const CommentComposer = () => {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setText("");
    setFocused(false);
  };

  return (
    <form onSubmit={submit} className="flex gap-3 mb-6">
      <Avatar name={USER_NAME} size={40} />
      <div className="flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Add a comment..."
          className="w-full bg-transparent border-b border-[#3f3f3f] focus:border-white outline-none py-2 text-sm text-white placeholder:text-[#aaa]"
        />
        {focused && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setText("");
                setFocused(false);
              }}
              className="px-3 py-1.5 text-sm rounded-full text-white hover:bg-[#272727]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-4 py-1.5 text-sm rounded-full bg-[#3ea6ff] text-black font-medium disabled:bg-[#272727] disabled:text-[#717171]"
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

const CommentsSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("top");

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
          if (reason === "commentsDisabled") {
            setError("Comments are turned off for this video.");
          } else {
            setError("Could not load comments.");
          }
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
    if (sort === "newest") {
      return [...comments].sort((a, b) => {
        const ta = new Date(a.snippet.topLevelComment.snippet.publishedAt);
        const tb = new Date(b.snippet.topLevelComment.snippet.publishedAt);
        return tb - ta;
      });
    }
    return comments;
  }, [comments, sort]);

  return (
    <div className="mt-6 text-white">
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-xl font-bold">
          {loading
            ? "Comments"
            : `${formatCount(comments.length)} Comment${
                comments.length === 1 ? "" : "s"
              }`}
        </h2>
        {!error && !loading && comments.length > 0 && (
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-medium">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M21,6H3V5h18V6z M17,11H7v1h10V11z M14,17h-4v1h4V17z" />
              </svg>
              Sort by
            </button>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-[#282828] rounded-xl shadow-lg py-2 min-w-[140px] z-10">
              <button
                onClick={() => setSort("top")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#3f3f3f] ${
                  sort === "top" ? "font-medium" : ""
                }`}
              >
                Top comments
              </button>
              <button
                onClick={() => setSort("newest")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#3f3f3f] ${
                  sort === "newest" ? "font-medium" : ""
                }`}
              >
                Newest first
              </button>
            </div>
          </div>
        )}
      </div>

      <CommentComposer />

      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-[#aaa] text-sm">{error}</p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="text-[#aaa] text-sm">No comments yet. Be the first.</p>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-5">
          {sorted.map((c) => (
            <Comment key={c.id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
