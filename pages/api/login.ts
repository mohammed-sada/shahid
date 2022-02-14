// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import JWT from 'jsonwebtoken';
import { mAdmin } from '../../lib/magic';

// client invoke login serverless(pass magic didtoken)-1
// extract metadata from didtoken and make a jwt token from this data-2
// hasura graphql server will check if the user exist-3
//    if exist send token to client-3.1
//    if not exist add this user to DB and send token to client-3.2

type Data = {
  data: {} | null;
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST')
    return res.status(400).json({ data: null, error: 'This is a post route!' });
  try {
    const didToken = req.headers.authorization?.split('Bearer ')[1];
    const metaData = await mAdmin.users.getMetadataByToken(didToken!);
    const token = JWT.sign(
      {
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'admin'],
          'x-hasura-default-role': 'user',
          'x-hasura-role': 'user',
          'x-hasura-user-id': metaData.issuer,
        },
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );
    return res.status(200).send({ data: token, error: '' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ data: null, error: 'Error logging in with the server' });
  }
}
