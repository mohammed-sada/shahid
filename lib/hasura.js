export async function isNewUser(token, issuer) {
    const operationsDoc = `
  query isNewUser($issuer:String!) {
    users_by_pk(issuer: $issuer) {
      email
    }
  }
`;

    const result = await fetchGraphQL(operationsDoc, "isNewUser", { issuer }, token);
    return result.data.users_by_pk;
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
    return result.data.insert_users_one;
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
