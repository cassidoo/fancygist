export const handler = async (event) => {
  const clientId = process.env.VITE_GITHUB_CLIENT_ID;
  const origin = event.headers.origin || event.headers.referer || 'http://localhost:8888';
  const baseUrl = origin.replace(/\/$/, '');
  const redirectUri = `${baseUrl}/.netlify/functions/auth-callback`;
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=gist`;
  
  return {
    statusCode: 302,
    headers: {
      Location: githubAuthUrl,
    },
  };
};
