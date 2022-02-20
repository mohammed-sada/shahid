import type { NextApiRequest, NextApiResponse } from 'next';
import { mAdmin } from '../../lib/magic';
import { clearCookie } from '../../lib/cookie';
import { decodeToken } from '../../lib/utils';

type Data = {
  data: {} | null;
  error: string | null;
};

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET')
    return { data: null, error: 'This is a get route!' };

  if (!req.cookies.token)
    return res.status(401).json({ data: null, error: 'User is not logged in' });

  try {
    const { token } = req.cookies;
    const { issuer } = decodeToken(token);

    await mAdmin.users.logoutByIssuer(issuer);

    return res
      .status(200)
      .setHeader('Set-Cookie', clearCookie('token'))
      .json({ data: 'Logged out successfuly', error: null });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      data: null,
      error: `Error logging out with the server: ${error}`,
    });
  }
}
