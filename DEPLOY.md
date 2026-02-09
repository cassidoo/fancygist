# Quick Deployment Guide for Netlify

## Method 1: Netlify CLI (Fastest)

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy to draft URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Method 2: GitHub Integration (Recommended for CD)

1. Push your code to GitHub
2. Go to https://app.netlify.com
3. Click **"Add new site"** → **"Import an existing project"**
4. Select **GitHub** and authorize
5. Choose your `fancygist` repository
6. Netlify will auto-detect settings from `netlify.toml`
7. Click **"Deploy site"**

### Configure Environment Variables

After site is created:
1. Go to **Site settings** → **Environment variables**
2. Add these variables:
   - `VITE_GITHUB_CLIENT_ID` = `your_github_oauth_client_id`
   - `GITHUB_CLIENT_SECRET` = `your_github_oauth_secret`
3. Click **"Trigger deploy"** to rebuild with env vars

### Update GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Find your OAuth App
3. Update URLs:
   - Homepage: `https://your-site-name.netlify.app`
   - Callback: `https://your-site-name.netlify.app/.netlify/functions/auth-callback`

## Custom Domain (Optional)

1. In Netlify dashboard → **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `fancygist.com`)
4. Configure DNS as instructed
5. Update GitHub OAuth App URLs to use your custom domain

## Auto-Deploy on Git Push

Once connected via GitHub, Netlify automatically deploys when you push to your main branch!

## Troubleshooting

**Build fails?**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

**Functions not working?**
- Verify environment variables are set
- Check function logs in Netlify dashboard
- Ensure `netlify.toml` is in root directory

**Auth not working?**
- Double-check GitHub OAuth callback URL
- Verify env vars are correctly named
- Clear cookies and try again
