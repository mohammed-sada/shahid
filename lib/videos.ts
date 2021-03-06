import { Videos } from '../types';
import videosData from '../data/videos.json';
import { getMyListVideos, getWachedVideos } from '../lib/hasura';

const isDev = process.env.DEVELOPMNET;
const baseUrl = 'youtube.googleapis.com/youtube/v3';

async function fetchVideos(URL: string) {
  const res = await fetch(
    `https://${baseUrl}/${URL}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`
  );

  return await res.json();
}
async function getCommonVideos(URL: string) {
  try {
    const data = isDev ? videosData : await fetchVideos(URL);
    if (data?.error) {
      console.error(data.error);
      return [];
    }

    const { items: videos } = data;

    return videos.map((video: any) => {
      const snippet = video.snippet;
      const id = video.id?.videoId || video.id;
      return {
        id,
        title: snippet.title,
        description: snippet.description,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        channelTitle: snippet.channelTitle,
        viewCount: video.statistics ? video.statistics.viewCount : 0,
        publishedAt: snippet.publishedAt,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVideos(query = 'sci-fi trailers') {
  const URL = `search?part=snippet&q=${query}`;
  return await getCommonVideos(URL);
}

export async function getPopularVideos() {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`;
  return await getCommonVideos(URL);
}
export async function getVideoById(videoId: string) {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return await getCommonVideos(URL);
}

export async function formatVideos(
  token: string,
  { userId }: { userId: string },
  type: string
) {
  const videoIds =
    type === 'watched'
      ? await getWachedVideos(token, { userId })
      : await getMyListVideos(token, { userId });

  return videoIds.map((item: { videoId: string }) => {
    return {
      id: item.videoId,
      imgUrl: `https://i.ytimg.com/vi/${item.videoId}/maxresdefault.jpg`,
    };
  });
}
