export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const cookie = 'gh_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
  
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': cookie,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ success: true }),
  };
};
