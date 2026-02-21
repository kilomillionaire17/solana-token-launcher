# Deployment Guide for Solana Token Launcher

This guide will walk you through deploying the Solana Token Launcher to **Render** for a permanent, always-on website.

## Prerequisites

1. A GitHub account (to host your repository)
2. A Render account (free tier available at https://render.com)
3. Git installed locally

## Step 1: Push Your Project to GitHub

### 1.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com/new) and create a new repository
2. Name it something like `solana-token-launcher`
3. Choose **Public** or **Private** (your preference)
4. Do NOT initialize with README, .gitignore, or license (we already have these)

### 1.2 Push Your Code

From your local project directory, run:

```bash
git init
git add .
git commit -m "Initial commit: Solana Token Launcher with Creator Info and Social Links"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/solana-token-launcher.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Deploy to Render

### 2.1 Connect Render to Your GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Select **Deploy an existing repository from GitHub**
4. Click **Connect account** if prompted, and authorize Render to access your GitHub
5. Find and select your `solana-token-launcher` repository
6. Click **Connect**

### 2.2 Configure the Deployment

Render will auto-detect the `render.yaml` file. You should see:

- **Name**: `solana-token-launcher` (auto-filled)
- **Runtime**: `Node` (auto-filled)
- **Build Command**: `pnpm install --frozen-lockfile && pnpm build` (auto-filled)
- **Start Command**: `pnpm start` (auto-filled)
- **Plan**: `Free` (recommended for testing)

### 2.3 Set Environment Variables (Optional)

If you need to add any environment variables:

1. Scroll down to **Environment**
2. Add any custom variables (e.g., `VITE_ANALYTICS_WEBSITE_ID`)
3. The `NODE_ENV` and `PORT` are already set in `render.yaml`

### 2.4 Deploy

1. Click **Create Web Service**
2. Render will start building your application
3. You'll see a build log in real-time
4. Once complete, you'll get a public URL like: `https://solana-token-launcher.onrender.com`

## Step 3: Verify Your Deployment

Once the deployment is complete:

1. Visit your Render URL
2. Test the Create Token form
3. Verify that the Creator's Info and Social Links toggles work correctly
4. Check that the form fields appear/disappear when toggled

## Step 4: Custom Domain (Optional)

To use a custom domain like `yourdomain.com`:

1. In your Render dashboard, go to your service
2. Click **Settings** → **Custom Domain**
3. Enter your domain
4. Follow the DNS configuration instructions
5. Point your domain's DNS records to Render's servers

## Troubleshooting

### Build Fails with "pnpm not found"

Render should auto-detect `pnpm` from `package.json`. If it doesn't:

1. Go to **Settings** → **Build & Deploy**
2. Set **Build Command** to: `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build`

### Port Issues

The app runs on port `3000` by default. Render automatically assigns the correct port via the `PORT` environment variable, which is already configured in `render.yaml`.

### Static Files Not Loading

Ensure the `server/index.ts` is correctly serving static files from `dist/public`. This is already configured in the project.

## Updating Your Site

To deploy new changes:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Render will automatically detect the push and redeploy your site
4. Check the deployment logs in your Render dashboard

## Support

For Render-specific issues, visit [Render Docs](https://render.com/docs)

For project-specific issues, check the project's README or contact the development team.

---

**Your Render URL will be live within 5-10 minutes after deployment starts!**
