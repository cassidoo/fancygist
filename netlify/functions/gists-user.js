export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

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
    const response = await fetch('https://api.github.com/gists', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch gists');
    }

    const allGists = await response.json();
    
    // Filter to only include gists with markdown files
    const markdownGists = allGists.filter(gist => {
      return Object.values(gist.files).some(file => 
        file.filename.endsWith('.md') || file.filename.endsWith('.markdown')
      );
    });

    // GitHub already returns gists sorted by updated_at descending
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(markdownGists),
    };
  } catch (error) {
    console.error('Fetch user gists error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch gists' }),
    };
  }
};
