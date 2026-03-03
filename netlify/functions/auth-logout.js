export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const proto = event.headers['x-forwarded-proto'] || '';
  const isSecure = proto.includes('https') || (process.env.URL || '').startsWith('https://');
  const cookieParts = ['gh_token=', 'HttpOnly', 'SameSite=Lax', 'Path=/', 'Max-Age=0'];
  if (isSecure) {
    cookieParts.push('Secure');
  }
  const cookie = cookieParts.join('; ');
  
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': cookie,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ success: true }),
  };
};
