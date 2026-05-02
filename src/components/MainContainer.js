import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CATEGORIES,
  getBestThumbnail,
  getShortsUrl,
  getVideosByIdsUrl,
  getVideosUrl,
} from "../utils/constants";
import VideoCard from "./VideoCard";
import LongReadCard from "./LongReadCard";
import Footer from "./Footer";

/* ── helpers ──────────────────────────────────────────── */
const parseDurationSeconds = (iso) => {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (
    parseInt(m[1] || 0) * 3600 +
    parseInt(m[2] || 0) * 60 +
    parseInt(m[3] || 0)
  );
};

const formatDuration = (iso) => {
  const t = parseDurationSeconds(iso);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

/* ── useValidatedVideos ───────────────────────────────────
   Probe every video's best-quality thumbnail with `new Image()`.
   YouTube serves a 120×90 grey placeholder when the requested
   resolution doesn't actually exist (common for fresh live streams),
   so we also reject anything under 200×200.
   The browser cache means the real <img> tags will load instantly
   afterward — the probe doesn't double-fetch.
*/
const PLACEHOLDER_THRESHOLD = 200;
const PROBE_TIMEOUT_MS = 5000;

const probeThumb = (video) =>
  new Promise((resolve) => {
    const url = getBestThumbnail(video?.snippet?.thumbnails);
    if (!url) {
      resolve(null);
      return;
    }
    let done = false;
    const finish = (val) => {
      if (done) return;
      done = true;
      resolve(val);
    };
    const img = new Image();
    img.onload = () => {
      if (
        img.naturalWidth >= PLACEHOLDER_THRESHOLD &&
        img.naturalHeight >= PLACEHOLDER_THRESHOLD
      ) {
        finish(video);
      } else {
        finish(null);
      }
    };
    img.onerror = () => finish(null);
    img.src = url;
    setTimeout(() => finish(null), PROBE_TIMEOUT_MS);
  });

const useValidatedVideos = (videos) => {
  const [state, setState] = useState({ ready: false, items: [] });

  useEffect(() => {
    let cancelled = false;
    if (!videos || videos.length === 0) {
      setState({ ready: true, items: [] });
      return;
    }
    setState({ ready: false, items: [] });
    Promise.all(videos.map(probeThumb)).then((results) => {
      if (cancelled) return;
      setState({ ready: true, items: results.filter(Boolean) });
    });
    return () => {
      cancelled = true;
    };
  }, [videos]);

  return state;
};

/* ── useInView (one-shot reveal) ──────────────────────── */
const useInView = (ref, margin = "-40px") => {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, margin]);
  return seen;
};

/* ── Section title (Inter, accent word in orange + line draw) ─ */
const SectionTitle = ({ number, plain, italic }) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className="flex items-baseline gap-3.5 mb-7"
    >
      <span
        className="text-[10px] font-semibold tracking-[0.14em] text-white/[0.26] flex-shrink-0"
      >
        {number}
      </span>
      <h2
        className="text-[22px] font-medium text-[#F5F1EA] relative leading-[1.1]"
        style={{ letterSpacing: "-0.022em" }}
      >
        {plain}
        <span
          className="font-normal"
          style={{ color: "#FF5C2B" }}
        >
          {italic}
        </span>
        <span
          className={`s-line ${inView ? "drawn" : ""}`}
          style={{ position: "absolute", bottom: -6, left: 0, right: 0 }}
        />
      </h2>
    </div>
  );
};

/* ── Sticky category rail with sliding pill indicator ── */
const CategoryRail = ({ active, onChange }) => {
  const railRef = useRef(null);
  const btnRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const rail = railRef.current;
    const btn = btnRefs.current[active];
    if (!rail || !btn) return;
    const ro = rail.getBoundingClientRect();
    const bo = btn.getBoundingClientRect();
    setIndicator({
      left: bo.left - ro.left + rail.scrollLeft,
      width: bo.width,
      opacity: 1,
    });
  }, [active]);

  return (
    <div
      className="sticky z-[150] border-b border-white/[0.05]"
      style={{
        top: 60,
        background: "rgba(10,10,11,0.94)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-7">
        <div
          ref={railRef}
          className="no-bar relative flex gap-[6px] overflow-x-auto py-[11px]"
        >
          {/* Sliding pill */}
          <div
            className="absolute pointer-events-none rounded-full bg-[#F5F1EA] z-0"
            style={{
              top: 11,
              height: "calc(100% - 22px)",
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
              transition:
                "left 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {CATEGORIES.map((cat) => {
            const on = active === cat.label;
            return (
              <button
                key={cat.label}
                ref={(el) => (btnRefs.current[cat.label] = el)}
                onClick={() => onChange(cat.label)}
                className="relative px-[17px] py-[6px] rounded-full border border-white/[0.07] bg-transparent text-[12px] font-medium whitespace-nowrap flex-shrink-0 z-[1]"
                style={{
                  color: on ? "#0A0A0B" : "rgba(245,241,234,0.48)",
                  transition: "color 200ms",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Quick-cuts shorts rail ───────────────────────────── */
const ShortCard = ({ video }) => {
  const [hidden, setHidden] = useState(false);
  const { snippet, contentDetails } = video;
  const thumb = getBestThumbnail(snippet.thumbnails);

  if (hidden || !thumb) return null;

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < 200 || naturalHeight < 200) setHidden(true);
  };

  return (
    <Link
      to={`/shorts`}
      className="vcard flex-shrink-0"
      style={{ width: 148, scrollSnapAlign: "start" }}
    >
      <div
        className="thumb-shell relative"
        style={{ borderRadius: 12, height: 264 }}
      >
        <div
          className="thumb-inner absolute inset-0 bg-white/[0.04]"
          style={{ borderRadius: 12, overflow: "hidden" }}
        >
          <img
            src={thumb}
            alt={snippet.title}
            loading="lazy"
            onError={() => setHidden(true)}
            onLoad={handleLoad}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute left-0 right-0 bottom-0 p-[14px_10px]"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,11,0.92), transparent)",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <p
            className="text-[11px] font-medium text-[#F5F1EA] leading-[1.35] line-clamp-3"
          >
            {snippet.title}
          </p>
        </div>
        {contentDetails?.duration && (
          <div
            className="absolute top-[9px] right-[9px] rounded px-[6px] py-[2px]"
            style={{ background: "rgba(10,10,11,0.72)" }}
          >
            <span className="text-[10px] text-white/70 font-medium">
              {formatDuration(contentDetails.duration)}
            </span>
          </div>
        )}
      </div>
      <div className="pt-[7px]">
        <p className="text-[11px] text-white/[0.32]">{snippet.channelTitle}</p>
      </div>
    </Link>
  );
};

const ShortsRail = ({ shorts }) => (
  <div
    className="no-bar flex gap-3 overflow-x-auto pb-1"
    style={{
      scrollSnapType: "x mandatory",
      maskImage: "linear-gradient(to right, black 90%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to right, black 90%, transparent 100%)",
    }}
  >
    {shorts.map((s) => (
      <ShortCard key={s.id} video={s} />
    ))}
  </div>
);

/* ── Skeleton tiles ───────────────────────────────────── */
const GridSkeleton = ({ count = 8 }) => (
  <div className="vgrid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="vcard">
        <div
          className="thumb-shell aspect-video bg-white/[0.04] animate-pulse"
          style={{ borderRadius: 12 }}
        />
        <div className="pt-2.5 space-y-2">
          <div className="h-3 bg-white/[0.04] rounded animate-pulse w-4/5" />
          <div className="h-2 bg-white/[0.04] rounded animate-pulse w-2/5" />
        </div>
      </div>
    ))}
  </div>
);

/* ── Wrap a card in a Link (so VideoCard remains pure) ── */
const LinkedCard = ({ video, animDelay }) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <Link to={`/watch?v=${video.id}`} className="block">
      <VideoCard
        info={video}
        animDelay={animDelay}
        onLoadFail={() => setHidden(true)}
      />
    </Link>
  );
};

/* ── Main composer ─────────────────────────────────────── */
const MainContainer = () => {
  const [active, setActive] = useState("For You");
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const activeId = useMemo(() => {
    const c = CATEGORIES.find((c) => c.label === active);
    return c ? c.id : null;
  }, [active]);

  /* Fetch main grid videos for the active category */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(getVideosUrl(activeId))
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setVideos(json.items || []);
      })
      .catch(() => {
        if (!cancelled) setVideos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  /* Shorts rail — fetched once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const searchJson = await fetch(getShortsUrl(8)).then((r) => r.json());
        const ids = (searchJson.items || [])
          .map((i) => i.id?.videoId)
          .filter(Boolean);
        if (!ids.length || cancelled) return;
        const v = await fetch(getVideosByIdsUrl(ids)).then((r) => r.json());
        if (cancelled) return;
        setShorts(v.items || []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Pre-validate thumbnails so the grid never has gaps */
  const { ready: videosReady, items: validVideos } = useValidatedVideos(videos);
  const { items: validShorts } = useValidatedVideos(shorts);

  const showLoading = loading || !videosReady;

  /* Slice the validated response into editorial sections */
  const lead = validVideos.slice(0, 16);
  const more = validVideos.slice(16, 24);

  /* Pick the longest videos for "Long reads" — fall back to last few */
  const longReads = useMemo(() => {
    const long = validVideos
      .filter((v) => parseDurationSeconds(v.contentDetails?.duration) >= 1500)
      .slice(0, 4);
    if (long.length >= 2) return long;
    return validVideos.slice(24, 28);
  }, [validVideos]);

  return (
    <>
      <CategoryRail active={active} onChange={setActive} />

      <main className="max-w-[1440px] mx-auto px-7 pt-7">
        {/* Lead grid */}
        {showLoading ? (
          <GridSkeleton count={16} />
        ) : (
          <section>
            <div className="vgrid" key={`lead-${active}`}>
              {lead.map((v, i) => (
                <LinkedCard
                  key={v.id}
                  video={v}
                  animDelay={mounted ? i * 60 : undefined}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Quick cuts (shorts rail) */}
      {validShorts.length > 0 && (
        <div className="max-w-[1440px] mx-auto mt-[88px] px-7">
          <SectionTitle number="— 01" plain="Quick " italic="cuts" />
          <ShortsRail shorts={validShorts} />
        </div>
      )}

      {/* More to explore */}
      {!showLoading && more.length > 0 && (
        <div className="max-w-[1440px] mx-auto mt-[88px] px-7">
          <SectionTitle number="— 02" plain="More " italic="to explore" />
          <div className="vgrid">
            {more.map((v, i) => (
              <LinkedCard key={v.id} video={v} animDelay={i * 60} />
            ))}
          </div>
        </div>
      )}

      {/* Long reads */}
      {!showLoading && longReads.length > 0 && (
        <div className="max-w-[1440px] mx-auto mt-[88px] px-7">
          <SectionTitle number="— 03" plain="Long " italic="reads" />
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            {longReads.map((v) => (
              <LongReadCard key={v.id} info={v} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MainContainer;
