const GOOGLE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const YOUTUBE_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=AU&key=" +
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

export const getCommentsUrl = (videoId, maxResults = 20) =>
  `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${GOOGLE_API_KEY}`;

export const CATEGORIES = [
  { label: "All", id: null },
  { label: "Music", id: "10" },
  { label: "Gaming", id: "20" },
  { label: "Sports", id: "17" },
  { label: "Film & Animation", id: "1" },
  { label: "Comedy", id: "23" },
  { label: "Entertainment", id: "24" },
  { label: "News", id: "25" },
  { label: "Education", id: "27" },
  { label: "Science & Tech", id: "28" },
  { label: "Howto & Style", id: "26" },
  { label: "People & Blogs", id: "22" },
  { label: "Autos", id: "2" },
  { label: "Pets & Animals", id: "15" },
  { label: "Travel", id: "19" },
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

export const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
