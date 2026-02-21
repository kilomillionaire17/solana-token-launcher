# Complete Step-by-Step Deployment Guide for Solana Token Launcher

This guide will walk you through deploying your Solana Token Launcher to **Render** with detailed instructions for every step.

---

## Table of Contents

1. [Part 1: Create a GitHub Account](#part-1-create-a-github-account)
2. [Part 2: Create a GitHub Repository](#part-2-create-a-github-repository)
3. [Part 3: Push Your Code to GitHub](#part-3-push-your-code-to-github)
4. [Part 4: Create a Render Account](#part-4-create-a-render-account)
5. [Part 5: Deploy to Render](#part-5-deploy-to-render)
6. [Part 6: Verify Your Live Website](#part-6-verify-your-live-website)
7. [Part 7: Custom Domain (Optional)](#part-7-custom-domain-optional)

---

## Part 1: Create a GitHub Account

### Step 1.1: Go to GitHub

1. Open your web browser
2. Navigate to **https://github.com**
3. You should see the GitHub homepage

### Step 1.2: Sign Up

1. Click the **Sign up** button (top right corner)
2. Enter your email address
3. Create a password (make it strong!)
4. Choose a username (this will be visible in your repository URL)
   - Example: `john-doe` → your repos will be at `github.com/john-doe/...`
5. Click **Create account**

### Step 1.3: Verify Your Email

1. GitHub will send you a verification email
2. Check your email inbox
3. Click the verification link
4. Your account is now active!

---

## Part 2: Create a GitHub Repository

### Step 2.1: Start Creating a New Repository

1. Log in to GitHub (if not already logged in)
2. Click the **+** icon in the top right corner
3. Select **New repository**

### Step 2.2: Configure Your Repository

You'll see a form with several fields:

**Repository name:**
- Enter: `solana-token-launcher`
- This will be part of your repository URL

**Description (Optional):**
- Enter: `Solana Token Launcher - Create and deploy memecoins on Solana`

**Visibility:**
- Select **Public** (so Render can access it)
- Private also works, but requires additional setup

**Initialize this repository with:**
- **DO NOT** check any of these boxes
- Leave them all unchecked (we already have these files)

### Step 2.3: Create the Repository

1. Click **Create repository**
2. You'll be taken to your new empty repository page
3. You should see a page with instructions like "Quick setup — if you've done this kind of thing before"

### Step 2.4: Copy Your Repository URL

1. Look for a green **Code** button
2. Click it
3. Copy the HTTPS URL (should look like: `https://github.com/YOUR_USERNAME/solana-token-launcher.git`)
4. Save this URL - you'll need it in the next section

---

## Part 3: Push Your Code to GitHub

This section assumes you have Git installed on your computer. If you don't, download it from **https://git-scm.com/download**.

### Step 3.1: Open Your Terminal/Command Prompt

**On Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- Or search for "Command Prompt" in Start Menu

**On Mac:**
- Press `Cmd + Space`
- Type `terminal` and press Enter

**On Linux:**
- Open your terminal application

### Step 3.2: Navigate to Your Project Folder

In your terminal, type:

```bash
cd path/to/solana-token-launcher
```

Replace `path/to/solana-token-launcher` with the actual path where you extracted the project.

**Example on Windows:**
```bash
cd C:\Users\YourName\Downloads\solana-token-launcher
```

**Example on Mac/Linux:**
```bash
cd ~/Downloads/solana-token-launcher
```

### Step 3.3: Configure Git (First Time Only)

If you haven't used Git before, configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

### Step 3.4: Initialize Git Repository

```bash
git init
```

This creates a `.git` folder (hidden) in your project directory.

### Step 3.5: Add All Files

```bash
git add .
```

This stages all your project files for commit.

### Step 3.6: Create Your First Commit

```bash
git commit -m "Initial commit: Solana Token Launcher with Creator Info and Social Links"
```

You should see output showing all the files that were committed.

### Step 3.7: Rename Branch to Main (if needed)

```bash
git branch -M main
```

This ensures your default branch is named `main` (GitHub's standard).

### Step 3.8: Add Remote Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/solana-token-launcher.git
```

### Step 3.9: Push Your Code to GitHub

```bash
git push -u origin main
```

You'll be prompted to log in to GitHub. Use your GitHub username and password (or personal access token if you have 2FA enabled).

**If you have 2FA enabled:**
1. You'll need to create a Personal Access Token instead of using your password
2. Go to GitHub Settings → Developer settings → Personal access tokens
3. Create a new token with `repo` scope
4. Use this token as your password when prompted

### Step 3.10: Verify Your Code is on GitHub

1. Go to **https://github.com/YOUR_USERNAME/solana-token-launcher**
2. You should see all your project files listed
3. You should see your commit message in the commit history

---

## Part 4: Create a Render Account

### Step 4.1: Go to Render

1. Open your web browser
2. Navigate to **https://render.com**
3. Click **Get Started** or **Sign Up**

### Step 4.2: Choose Sign-Up Method

You can sign up with:
- **GitHub** (Recommended - easiest for deployment)
- **Google**
- **Email**

**If using GitHub (Recommended):**
1. Click **Continue with GitHub**
2. You'll be redirected to GitHub to authorize Render
3. Click **Authorize render-oss**
4. You'll be redirected back to Render

**If using Email:**
1. Enter your email
2. Create a password
3. Verify your email

### Step 4.3: Complete Your Profile

1. Enter your name
2. Choose your role (select "Developer" or "Student")
3. Click **Continue**

### Step 4.4: Verify Your Email

1. Check your email for a verification link from Render
2. Click the link to verify
3. Your Render account is now active!

---

## Part 5: Deploy to Render

### Step 5.1: Go to Your Render Dashboard

1. Log in to **https://dashboard.render.com**
2. You should see your dashboard

### Step 5.2: Create a New Web Service

1. Click the **New +** button (top right)
2. Select **Web Service**

### Step 5.3: Connect Your GitHub Repository

1. You'll see "Deploy an existing repository from GitHub"
2. Click **Connect account** (if not already connected)
3. Authorize Render to access your GitHub repositories
4. Search for `solana-token-launcher`
5. Click **Connect** next to your repository

### Step 5.4: Configure Your Service

You'll see a configuration form. Fill it out as follows:

**Name:**
- Should be auto-filled as: `solana-token-launcher`
- You can change this if you want

**Environment:**
- Select **Node**

**Region:**
- Select a region close to you (or leave as default)

**Branch:**
- Should be: `main`

**Build Command:**
- Should be auto-filled: `pnpm install --frozen-lockfile && pnpm build`
- If not, paste this command

**Start Command:**
- Should be auto-filled: `pnpm start`
- If not, paste this command

**Plan:**
- Select **Free** (this is perfect for testing and hobby projects)

### Step 5.5: Add Environment Variables (Optional)

Scroll down to **Environment** section:

1. Click **Add Environment Variable**
2. Add the following:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 3000 |

These are usually auto-configured, but it's good to verify.

### Step 5.6: Deploy

1. Scroll to the bottom
2. Click **Create Web Service**
3. Render will start building your application
4. You'll see a real-time build log
5. Wait for the build to complete (usually 5-10 minutes)

### Step 5.7: Monitor the Build

You'll see output like:

```
Building...
Installing dependencies...
Building application...
✓ Build successful
Starting server...
✓ Server running
```

Once you see "Server running", your app is live!

---

## Part 6: Verify Your Live Website

### Step 6.1: Get Your Render URL

1. After deployment completes, you'll see a URL at the top of the page
2. It will look like: `https://solana-token-launcher.onrender.com`
3. This is your permanent website URL!

### Step 6.2: Test Your Website

1. Click the URL or copy it into your browser
2. You should see your Solana Token Launcher homepage
3. Click **Create Token** to test the form
4. Toggle **Creator's Info** - you should see input fields appear
5. Toggle **Social Links & Tags** - you should see social media input fields appear

### Step 6.3: Share Your Website

Your website is now live and permanent! You can share the URL with anyone:

```
https://solana-token-launcher.onrender.com
```

---

## Part 7: Custom Domain (Optional)

If you want to use a custom domain like `mytoken.com` instead of `onrender.com`:

### Step 7.1: Purchase a Domain

1. Buy a domain from a registrar like:
   - GoDaddy
   - Namecheap
   - Google Domains
   - Cloudflare

### Step 7.2: Add Custom Domain to Render

1. Go to your Render dashboard
2. Click on your `solana-token-launcher` service
3. Click **Settings** (in the left sidebar)
4. Scroll to **Custom Domain**
5. Enter your domain (e.g., `mytoken.com`)
6. Click **Add Custom Domain**

### Step 7.3: Update DNS Records

1. Render will give you DNS records to add
2. Go to your domain registrar's DNS settings
3. Add the DNS records provided by Render
4. Wait 24-48 hours for DNS to propagate
5. Your custom domain will now point to your Render app!

---

## Troubleshooting

### Build Failed - "pnpm not found"

**Solution:**
1. Go to your service settings
2. Update the Build Command to:
   ```bash
   npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build
   ```

### Website Shows "Service Unavailable"

**Solution:**
1. Check the deployment logs in Render
2. Look for error messages
3. Common causes:
   - Port not configured correctly (should be 3000)
   - Missing dependencies
   - Build command failed

### Static Files Not Loading

**Solution:**
1. This is usually already fixed in the project
2. If images/CSS don't load, check the `server/index.ts` file
3. Ensure it's serving from `dist/public`

### How to Update Your Website

After deployment, if you make changes:

1. Edit your files locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```
3. Render automatically detects the push
4. Your website redeploys automatically (5-10 minutes)

---

## Summary

You now have:

✅ A GitHub repository with your code
✅ A Render account with automatic deployment
✅ A live website at `https://solana-token-launcher.onrender.com`
✅ Automatic updates when you push to GitHub
✅ A free, permanent hosting solution

**Your website is now live and will stay online permanently!**

---

## Need Help?

- **Render Support:** https://render.com/docs
- **GitHub Help:** https://docs.github.com
- **Git Documentation:** https://git-scm.com/doc

---

**Congratulations! Your Solana Token Launcher is now live on the internet! 🚀**
