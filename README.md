# FancyGist

A beautiful, minimal markdown editor backed by GitHub Gists. Write, share, and edit markdown documents with a clean interface and the power of GitHub's gist platform.

## Features

- 🎨 **Clean Editor**: Minimal, distraction-free writing experience
- 🔐 **GitHub Integration**: Save documents as GitHub Gists
- 🔗 **Shareable URLs**: Share docs at `fancygist.com/@username/gist-id`
- 📝 **GitHub Flavored Markdown**: Full support for tables, code blocks, task lists, and more
- 🎯 **Syntax Highlighting**: Beautiful code highlighting in previews
- 🍴 **Fork on Edit**: Edit someone else's gist? It creates a fork automatically when you save it.
- ⌨️ **Keyboard Shortcuts**: `Ctrl/Cmd+S` to save, `Ctrl/Cmd+N` for new.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A GitHub account
- GitHub OAuth App credentials

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fancygist.git
   cd fancygist
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a GitHub OAuth App**
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: `FancyGist` (or your preferred name)
     - Homepage URL: `http://localhost:8888` (for development)
     - Authorization callback URL: `http://localhost:8888/.netlify/functions/auth-callback`
   - Click "Register application"
   - Copy the Client ID and generate a Client Secret

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your GitHub OAuth credentials:

   ```
   VITE_GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Or with Netlify CLI for full API support:

   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8888` (Netlify) or `http://localhost:5173` (Vite only)

## Usage

1. **Anonymous Writing**: Just start typing - no login required for editing
2. **Save to GitHub**: Click "Login with GitHub" and then "Save" to store your document
3. **Share**: After saving, copy the shareable link to send to others
4. **Edit Others' Gists**: Click "Edit" on any shared gist, make changes, and save (creates a fork)

## Deployment

### Deploy to Netlify

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

   For production:

   ```bash
   netlify deploy --prod
   ```

4. **Configure environment variables** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`

5. **Update GitHub OAuth App**
   - Add production URLs to your GitHub OAuth App:
     - Homepage URL: `https://your-site.netlify.app`
     - Callback URL: `https://your-site.netlify.app/.netlify/functions/auth-callback`

### Alternative: Deploy via Git

1. Push your code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Add environment variables in site settings
7. Deploy!

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + @tailwindcss/typography
- **Editor**: CodeMirror 6
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Routing**: React Router
- **Backend**: Netlify Functions
- **API**: GitHub Gists API via Octokit

## Project Structure

```
fancygist/
├── netlify/
│   └── functions/         # Netlify serverless functions
│       ├── auth-*.js      # GitHub OAuth handlers
│       └── gist*.js       # Gist CRUD operations
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── public/                # Static assets
```

## Contributing

Contributions are welcome:

- Make sure there's an Issue first
- Use tabs instead of spaces
- Follow existing code style
- If you're going to use AI, please review the generated code carefully before submitting, don't keep unnecessary comments, and use your brain.

## Acknowledgments

- Inspired by [Stashpad Docs](https://www.youtube.com/watch?v=9miuaDK0uF8) and [iA Writer](https://ia.net/writer)
- Built with ❤️ using GitHub's amazing Gist API
