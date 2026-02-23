# How to Update Your Solana Token Launcher Website

This guide provides a comprehensive walkthrough for updating your website, from making local changes to deploying them to your live Render site.

---

## Table of Contents

1.  [Part 1: Setting Up Your Local Development Environment](#part-1-setting-up-your-local-development-environment)
2.  [Part 2: Making Changes to Your Website](#part-2-making-changes-to-your-website)
3.  [Part 3: Deploying Your Updates to Render](#part-3-deploying-your-updates-to-render)

---

## Part 1: Setting Up Your Local Development Environment

Before you can make changes, you need to set up a local environment to run the website on your computer.

### Step 1.1: Install Prerequisites

-   **Node.js & npm:** Download and install from [https://nodejs.org](https://nodejs.org)
-   **pnpm:** Open your terminal and run: `npm install -g pnpm`
-   **Git:** Download and install from [https://git-scm.com](https://git-scm.com)
-   **A code editor:** We recommend **Visual Studio Code** ([https://code.visualstudio.com](https://code.visualstudio.com))

### Step 1.2: Download and Unzip Your Project

1.  Download the `solana-token-launcher-final.zip` file I provided.
2.  Unzip it to a folder on your computer (e.g., `C:\Projects\solana-launcher`).

### Step 1.3: Install Dependencies

1.  Open your terminal/command prompt.
2.  Navigate to your project folder:
    ```bash
    cd path/to/solana-token-launcher
    ```
3.  Install all project dependencies:
    ```bash
    pnpm install
    ```

### Step 1.4: Run the Development Server

1.  In your terminal, run:
    ```bash
    pnpm dev
    ```
2.  Your website is now running locally at **http://localhost:3000** (or the next available port).
3.  Open this URL in your browser to see your local version of the site.

**Key Feature:** The development server has **hot-reloading**. Any changes you save in your code editor will automatically update in your browser!

---

## Part 2: Making Changes to Your Website

Now that your local environment is running, you can start making changes. All the files you need to edit are in the `client/src` directory.

### How to Change Text Content

Most of the text on your website is located in the `CreateToken.tsx` and `Home.tsx` files.

**Example: Changing the Main Headline on the Homepage**

1.  Open `client/src/pages/Home.tsx` in your code editor.
2.  Find the following code (around line 40):
    ```jsx
    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
      Launch your <span className="text-gradient">$Solana Token</span> <br /> Take it to the Moon! 🌙
    </h1>
    ```
3.  Change the text to whatever you want:
    ```jsx
    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
      Create Your <span className="text-gradient">Crypto Empire</span> <br /> Launch on Solana! 🚀
    </h1>
    ```
4.  Save the file. Your browser will automatically refresh to show the new headline.

### How to Change Styles and Colors

Your website uses **Tailwind CSS** for styling. You can change colors, sizes, and more by editing the class names.

-   **Global Styles:** `client/src/styles/globals.css`
-   **Tailwind Config:** `tailwind.config.js` (for defining custom colors, fonts, etc.)

**Example: Changing the Main Button Color**

1.  The gradient is defined in `globals.css`.
2.  Open `client/src/styles/globals.css`.
3.  Find the `.btn-gradient` class:
    ```css
    .btn-gradient {
      background-image: linear-gradient(to right, #9945FF, #14F195);
    }
    ```
4.  Change the hex codes to your desired colors:
    ```css
    .btn-gradient {
      background-image: linear-gradient(to right, #FF5733, #FFC300);
    }
    ```
5.  Save the file. All buttons with this gradient will now have your new colors.

### How to Change Images

1.  Place your new images in the `client/public` directory.
2.  In your code, update the `src` attribute of the `<img>` tag to point to your new image file.

**Example: Changing the Logo**

1.  The logo is in `client/src/components/Navbar.tsx`.
2.  Find the `<img>` tag for the logo.
3.  Update the `src` to your new logo file (e.g., `/new-logo.png`).

### How to Add a New Page

1.  Create a new file in `client/src/pages` (e.g., `About.tsx`).
2.  Add your page content (you can copy the structure from `Home.tsx`).
3.  Update the router in `client/src/main.tsx` to include your new page:
    ```jsx
    import About from "./pages/About";

    // ... inside the <Router> component
    <Route path="/about" component={About} />
    ```
4.  Add a link to your new page in the `Navbar.tsx` component.

---

## Part 3: Deploying Your Updates to Render

Once you are happy with your local changes, you can deploy them to your live website on Render.

### Step 3.1: Commit Your Changes

1.  In your terminal, stop the development server by pressing `Ctrl + C`.
2.  Stage all your changes:
    ```bash
    git add .
    ```
3.  Commit your changes with a descriptive message:
    ```bash
    git commit -m "Update homepage headline and button colors"
    ```

### Step 3.2: Push Your Changes to GitHub

1.  Push your committed changes to your GitHub repository:
    ```bash
    git push origin main
    ```

### Step 3.3: Automatic Redeployment on Render

That's it! Render is configured to **automatically detect** when you push new changes to your `main` branch on GitHub.

1.  Go to your Render Dashboard: **https://dashboard.render.com**
2.  Click on your `solana-token-launcher` service.
3.  You will see a new deployment in progress, triggered by your latest commit.
4.  Wait for the deployment to complete (usually 5-10 minutes).

### Step 3.4: Verify Your Live Website

1.  Once the deployment is complete, visit your live URL:
    `https://solana-token-launcher.onrender.com`
2.  You should see all your new changes live on the internet!

---

## Summary of the Update Workflow

1.  **Develop Locally:** Run `pnpm dev` and make changes in your code editor.
2.  **Test Locally:** Verify your changes at `http://localhost:3000`.
3.  **Commit Changes:** Use `git add .` and `git commit`.
4.  **Push to GitHub:** Use `git push origin main`.
5.  **Auto-Deploy:** Render automatically builds and deploys your updates.
6.  **Verify Live:** Check your live URL to see the changes.

This workflow makes it easy to keep your website up-to-date with new features and content. If you have any questions, feel free to ask!
