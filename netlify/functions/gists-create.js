export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        Allow: 'POST, PUT, PATCH, OPTIONS',
      },
    };
  }

  if (!['POST', 'PUT', 'PATCH'].includes(event.httpMethod || '')) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed for ${event.path}` }),
    };
  }

  const multiCookies =
    event.multiValueHeaders?.cookie ||
    event.multiValueHeaders?.Cookie ||
    [];
  const cookies =
    event.headers.cookie ||
    event.headers.Cookie ||
    (Array.isArray(event.cookies) ? event.cookies.join('; ') : '') ||
    (Array.isArray(multiCookies) ? multiCookies.join('; ') : '');
  const tokenMatch = cookies.match(/gh_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  try {
    const { description, files, public: isPublic } = JSON.parse(event.body || '{}');

    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: description || 'Created with FancyGist',
        public: isPublic !== false,
        files,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create gist');
    }

    const gist = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gist),
    };
  } catch (error) {
    console.error('Create gist error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to create gist' }),
    };
  }
};
