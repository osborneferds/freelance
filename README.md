# Osborne Fernandes — Portfolio & Client Portal

A modern, high-performance portfolio website with an embedded SQLite database (WASM), in-browser Admin Panel, and Client Portal.

---

## 🚀 How to Deploy on GitHub Pages (Fix "Not working in GitHub")

If you deployed this repository to **GitHub Pages** and saw a blank page, 404 errors, or broken navigation, it is usually because GitHub Pages tried to serve the uncompiled source code (`src/main.tsx`) instead of the production build (`dist`).

Here are the two easiest ways to make it work on GitHub:

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

This repository includes a pre-configured workflow at `.github/workflows/deploy.yml`.

1. Go to your GitHub repository.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, select **"GitHub Actions"**.
4. Push any commit to your `main` branch (or go to the **Actions** tab and click **Run workflow**).
5. GitHub will automatically build the site and publish it live!

---

### Method 2: Deploy from the `/docs` folder (1-Click)

This repository already includes the compiled production build inside the `docs/` folder with `.nojekyll` enabled.

1. Go to your GitHub repository.
2. Click **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **"Deploy from a branch"**.
4. Under **Branch**, select `main` and change the folder from `/ (root)` to **`/docs`**.
5. Click **Save**. Your site will be live in 30 seconds!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 🔐 Credentials & Access

- **Admin Panel:** Navigate to `#/admin`
  - Default username: `admin`
  - Default password: `osborne2026`
- **Client Portal:** Navigate to `#/portal`
  - Demo email: `daniel@halcyon.fin`
  - Demo access code: `HALCYON-2026`
