function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export { extractVideoId };

export const getYoutubeInfo = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: "YouTube URL is required" });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL" });
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return res.status(404).json({ message: "Video not found on YouTube" });
    }

    const data = await response.json();

    res.json({
      videoId,
      title: data.title || "",
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      authorName: data.author_name || "",
    });
  } catch (error) {
    console.error("YouTube info error:", error);
    res.status(500).json({ message: "Failed to fetch YouTube info", error: error.message });
  }
};
