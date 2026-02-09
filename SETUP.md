# FancyGist Setup Guide

This guide will walk you through setting up FancyGist for local development or deployment.

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create GitHub OAuth App

1. Visit: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `FancyGist Local` (or any name you prefer)
   - **Homepage URL**: `http://localhost:8888`
   - **Authorization callback URL**: `http://localhost:8888/.netlify/functions/auth-callback`
4. Click **"Register application"**
5. Copy your **Client ID**
6. Click **"Generate a new client secret"** and copy the secret

### Step 3: Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your credentials
# VITE_GITHUB_CLIENT_ID=abc123...
# GITHUB_CLIENT_SECRET=xyz789...
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## Testing Locally

Since the serverless functions need a server to work, you should use:

### Netlify CLI (Recommended)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run in dev mode (this runs both Vite and Netlify functions)
netlify dev
```

This will start the dev server with working API routes at http://localhost:8888

### Vite Only (Limited)

For quick frontend development without auth:
```bash
npm run dev
```

Note: API calls will fail without the Netlify functions running.

## Deployment to Netlify

### First-Time Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy
   ```
   
   Follow the prompts:
   - Create & configure a new site? **Yes**
   - Team? Select your team
   - Site name? **fancygist** (or your preference)
   - Publish directory? **dist**

4. **Set Environment Variables**
   
   In Netlify dashboard (https://app.netlify.com):
   - Go to Site settings → Environment variables
   - Add `VITE_GITHUB_CLIENT_ID`
   - Add `GITHUB_CLIENT_SECRET`
   
   Or via CLI:
   ```bash
   netlify env:set VITE_GITHUB_CLIENT_ID "your_client_id"
   netlify env:set GITHUB_CLIENT_SECRET "your_secret"
   ```

5. **Create Production GitHub OAuth App**
   - Go to: https://github.com/settings/developers
   - Create a **new** OAuth App (separate from local dev)
   - Use your Netlify URL:
     - Homepage: `https://your-site.netlify.app`
     - Callback: `https://your-site.netlify.app/.netlify/functions/auth-callback`

6. **Deploy to Production**
   ```bash
   netlify deploy --prod
   ```

### Subsequent Deployments

Just run:
```bash
netlify deploy --prod
```

### Alternative: Git-based Deployment

1. Push code to GitHub
2. In Netlify dashboard, click "Add new site"
3. Connect your repository
4. Netlify auto-detects settings from `netlify.toml`
5. Add environment variables
6. Deploy automatically on every push!

## Custom Domain

1. In Netlify dashboard, go to your project
2. Navigate to **Domain settings**
3. Click **Add custom domain**
4. Enter your domain (e.g., `fancygist.com`)
5. Follow DNS configuration instructions
6. Update your GitHub OAuth App with new domain

## Troubleshooting

### "Not authenticated" errors
- Ensure environment variables are set correctly
- Check that GitHub OAuth callback URL matches your domain
- Clear cookies and try logging in again

### API routes return 404
- Make sure you're using `netlify dev` instead of `npm run dev`
- Check that `netlify.toml` is properly configured
- Verify functions are in `netlify/functions/` directory

### Gist operations fail
- Verify your GitHub OAuth app has the `gist` scope
- Check that the access token is being stored in cookies
- Look at browser DevTools → Network tab for API errors

### Build fails
- Run `npm run build` to see detailed errors
- Ensure all dependencies are installed
- Check that TypeScript has no errors

## Architecture Notes

### How Auth Works
1. User clicks "Login with GitHub"
2. Redirected to `/.netlify/functions/auth-login` → GitHub OAuth
3. GitHub redirects back to `/.netlify/functions/auth-callback`
4. Backend exchanges code for access token
5. Token stored in httpOnly cookie
6. Frontend checks auth with `/.netlify/functions/auth-user`

### How Gists Work
1. **Create**: POST to `/.netlify/functions/gists-create` with content
2. **Read**: GET from `/.netlify/functions/gist-by-id` (public, no auth needed)
3. **Update**: PATCH to `/.netlify/functions/gist-by-id` (requires auth + ownership)
4. **Fork**: Editing someone else's gist → POST creates new gist

## Development Tips

- Use React DevTools to inspect component state
- Check browser console for errors
- API calls are logged in terminal when using `netlify dev`
- Test with different markdown features (tables, code blocks, etc.)
- Try opening gists from github.com/gist in FancyGist

## Questions?

Open an issue on GitHub or check the main README.md for more info!
