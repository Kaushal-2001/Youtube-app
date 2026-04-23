const GOOGLE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const YOUTUBE_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&key=" +
  GOOGLE_API_KEY;

export const getVideosUrl = (categoryId) => {
  const base =
    "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US";
  const withCategory = categoryId ? `${base}&videoCategoryId=${categoryId}` : base;
  return `${withCategory}&key=${GOOGLE_API_KEY}`;
};

export const getSearchUrl = (query) =>
  `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=30&q=${encodeURIComponent(
    query
  )}&key=${GOOGLE_API_KEY}`;

export const getVideosByIdsUrl = (ids) =>
  `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${ids.join(
    ","
  )}&key=${GOOGLE_API_KEY}`;

export const getShortsUrl = (maxResults = 25) =>
  `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&maxResults=${maxResults}&q=%23shorts&regionCode=US&key=${GOOGLE_API_KEY}`;

export const getCommentsUrl = (videoId, maxResults = 20) =>
  `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${GOOGLE_API_KEY}`;

export const CATEGORIES = [
  { label: "All",             id: null },
  { label: "Cinema",          id: "1"  },
  { label: "Music Live",      id: "10" },
  { label: "Design & Craft",  id: "26" },
  { label: "Tech Deep-dives", id: "28" },
  { label: "Late Night",      id: "23" },
  { label: "Cooking",         id: "22" },
  { label: "Photography",     id: "24" },
  { label: "Essays",          id: "27" },
  { label: "Ambient",         id: "20" },
  { label: "Podcasts",        id: "25" },
  { label: "Sport Shorts",    id: "17" },
];

const AVATAR_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#DCE775",
  "#FFD54F",
  "#FFB74D",
  "#FF8A65",
  "#A1887F",
  "#90A4AE",
];

/* Pick the highest-resolution thumbnail YouTube returns, with graceful fallback.
   maxres = 1280x720, standard = 640x480, high = 480x360, medium = 320x180 */
export const getBestThumbnail = (thumbnails) => {
  if (!thumbnails) return null;
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    null
  );
};

export const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
