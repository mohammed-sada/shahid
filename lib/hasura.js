export async function getVideoStats(token, { userId, videoId }) {
  const operationsDoc = `
  query getVideoStats($userId:String!,$videoId:String!){
    stats(where: {userId: {_eq:$userId }, videoId: {_eq: $videoId}}) {
      id
      favourited
      watched
    }
  }
`;
  const result = await fetchGraphQL(operationsDoc, "getVideoStats", { userId, videoId }, token);
  console.log(result);
  return result.data?.stats.length > 0 ? result.data?.stats[0] : null;
}


export async function createVideoStats(token, {
  userId,
  videoId,
  favourited,
}) {
  const operationsDoc = `
    mutation createVideoStats($userId:String!,$videoId:String!,$favourited:Boolean) {
    insert_stats_one(object: {userId: $userId, videoId: $videoId,favourited: $favourited, watched: true}) {
      id
      favourited
      watched
    }
  }
`;
  const result = await fetchGraphQL(operationsDoc, "createVideoStats", {
    userId,
    videoId,
    favourited,
  }, token);

  if (result.errors) return { error: result.errors[0].message };
  return result.data?.insert_stats_one;
}

export async function updateVideoStats(token, {
  userId,
  videoId,
  favourited,
  watched
}) {
  let operationsDoc = `
mutation updateVideoStats($userId:String!,$videoId:String!,$favourited:Boolean,$watched:Boolean) {
  update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {favourited: $favourited, watched: $watched}) {
    returning {
      id
      favourited
      watched
    }
  }
}
`;
  if (favourited === undefined) operationsDoc = `
mutation updateVideoStats($userId:String!,$videoId:String!,$watched:Boolean) {
  update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {watched: $watched}) {
    returning {
      id
      favourited
      watched
    }
  }
}
`;
  const result = await fetchGraphQL(operationsDoc, "updateVideoStats", {
    userId,
    videoId,
    favourited,
    watched
  }, token);

  if (result.errors) return { error: result.errors[0].message };
  return result.data?.update_stats.returning[0];
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer:String!) {
    users_by_pk(issuer: $issuer) {
      email
    }
  }
`;

  const result = await fetchGraphQL(operationsDoc, "isNewUser", { issuer }, token);
  return result.data?.users_by_pk;
}

export async function createNewUser(token, metaData) {
  const operationsDoc = `
  mutation createNewUser($email:String!, $issuer:String!,$publicAddress:String!) {
    insert_users_one(object: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      email
    }
  }
`;
  const { issuer, publicAddress, email } = metaData;
  const variables = {
    issuer,
    publicAddress,
    email
  };
  const result = await fetchGraphQL(operationsDoc, "createNewUser", { ...variables }, token);
  return result.data?.insert_users_one;
}

export async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(
    process.env.NEXT_PUBLIC_HASURA_API_URL,
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        operationName,
        variables,
      }),
      headers: {
        Authorization: `Bearer ${token}`
        // "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
      }
    }
  );

  return await result.json();
}
