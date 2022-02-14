export async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
        process.env.NEXT_PUBLIC_HASURA_API_URL,
        {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                operationName: operationName,
                variables: variables,
            }),
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJhaG1lZCJ9fQ.PfbL4ym_5UWcRUcYZea65NaHAuGyUBxTk_f42amcyr0'
                // "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
            }
        }
    );

    return await result.json();
}



export async function startFetchMyQuery() {
    const operationsDoc = `
    query MyQuery {
      users {
        email
      }
    }
  `;
    const { errors, data } = await fetchGraphQL(operationsDoc, "MyQuery", {});

    if (errors) {
        console.error(errors);
    }
    console.log(data);
}
