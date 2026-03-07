export const handler = async (event) => {
	const clientId = process.env.VITE_GITHUB_CLIENT_ID;
	const proto =
		event.headers["x-forwarded-proto"] ||
		(process.env.URL?.startsWith("https") ? "https" : "http");
	const host = event.headers["x-forwarded-host"] || event.headers.host;
	const envUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
	const baseUrl = (
		(host ? `${proto}://${host}` : envUrl) || "http://localhost:8888"
	).replace(/\/$/, "");
	const redirectUri = `${baseUrl}/.netlify/functions/auth-callback`;

	const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=gist`;

	return {
		statusCode: 302,
		headers: {
			Location: githubAuthUrl,
		},
	};
};
