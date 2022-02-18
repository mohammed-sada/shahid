import type { NextApiRequest, NextApiResponse } from 'next';
import JWT from 'jsonwebtoken';
import validator from 'validator';
import {
  createVideoStats,
  getVideoStats,
  updateVideoStats,
} from '../../lib/hasura';

type Data = {
  data: {} | null;
  error: string | null;
};

interface ReqBody {
  videoId: string;
  favourited?: boolean;
  watched?: boolean;
}

interface JwtPayload {
  issuer: string;
}

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // Verify the user via browser cookie
    if (!req.headers.cookie)
      return res.status(401).json({ data: null, error: 'Unauthinticated!' });

    const token = req.headers.cookie.split('=')[1];
    const decodedToken = JWT.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (req.method === 'POST') {
      const { videoId, favourited, watched = true }: ReqBody = req.body;
      if (!videoId)
        return res
          .status(400)
          .json({ data: null, error: 'Video id must be provided!' });

      const videoExist = await getVideoStats(token, {
        userId: decodedToken.issuer,
        videoId,
      });

      if (videoExist) {
        // Update video statistics
        const videoStats = await updateVideoStats(token, {
          userId: decodedToken.issuer,
          videoId,
          favourited,
          watched,
        });
        if (videoStats.error)
          return res.status(400).json({ data: null, error: videoStats.error });

        return res.status(200).json({ data: videoStats, error: null });
      } else {
        // create new video statistics record
        const videoStats = await createVideoStats(token, {
          userId: decodedToken.issuer,
          videoId,
          favourited,
        });
        if (videoStats.error)
          return res.status(400).json({ data: null, error: videoStats.error });

        return res.status(200).json({ data: videoStats, error: null });
      }
    } else if (req.method === 'GET') {
      const { videoId } = req.query;
      if (!videoId)
        return res
          .status(400)
          .json({ data: null, error: 'Video id must be provided!' });

      const videoExist = await getVideoStats(token, {
        userId: decodedToken.issuer,
        videoId,
      });
      if (!videoExist)
        return res.status(404).json({ data: null, error: 'Record not found!' });

      return res.status(200).json({ data: videoExist, error: null });
    } else {
      return res.status(400).json({ data: null, error: 'Incorrect route!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      data: null,
      error: `Error with the server: ${error}`,
    });
  }
}

// stats-api-route responsiblie for shahid's users account statistics
// 1- Post requset => a user hearts a video:
//       => verify the user's token passed by the cookie
//       => if video exist previously by this user => update it
//       => if this the first time the user interact with this video => create new record in stats table
// 2- Get request => get the currunt stats for this video by the current user
