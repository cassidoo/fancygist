exports.handler = async (event) => {
  const pathParts = event.path.split('/');
  const id = pathParts[pathParts.length - 1];

  if (event.httpMethod === 'GET') {
    // Fetch gist by ID (public, no auth needed)
    try {
      const response = await fetch(`https://api.github.com/gists/${id}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Gist not found' }),
          };
        }
        throw new Error('Failed to fetch gist');
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
      console.error('Get gist error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch gist' }),
      };
    }
  } else if (event.httpMethod === 'PATCH') {
    // Update existing gist (requires auth)
    const cookies = event.headers.cookie || '';
    const tokenMatch = cookies.match(/gh_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Not authenticated' }),
      };
    }

    try {
      const { description, files } = JSON.parse(event.body || '{}');

      const response = await fetch(`https://api.github.com/gists/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          files,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update gist');
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
      console.error('Update gist error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message || 'Failed to update gist' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};
