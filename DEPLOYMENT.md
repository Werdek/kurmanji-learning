# Deploying to GitHub Pages

This app is a fully static Next.js site. `npm run build` writes the complete
website to `out/`, and the workflow in `.github/workflows/deploy-pages.yml`
publishes that folder to GitHub Pages for you.

You only push source code. Do **not** commit `out/`, `.next/`, or
`node_modules/` — the workflow builds the site on GitHub.

## One-time setup

1. Create a new repository on GitHub (for example `kurmanji-learning`).
2. Open the repository on GitHub, then go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push this project to the `main` branch (see the commands below).
5. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish.

If you pushed before enabling Pages and the workflow failed, enable Pages and
re-run the failed workflow from the **Actions** tab.

The workflow sets the base path automatically:

| Repository name                | Site URL                                      | Base path                     |
| ------------------------------ | --------------------------------------------- | ----------------------------- |
| `kurmanji-learning`            | `https://<user>.github.io/kurmanji-learning/` | `/kurmanji-learning`          |
| `<user>.github.io`             | `https://<user>.github.io/`                   | none                          |
| Any repository + custom domain | `https://your-domain.com/`                    | none (set the variable below) |

### First push

This folder is not a Git repository yet. Run these commands once, replacing the
remote URL with the one GitHub shows for your new repository:

```bash
cd "/path/to/Kurmanji Learning Platform"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<user>/<repo-name>.git
git push -u origin main
```

With GitHub Desktop, choose **File → Add local repository**, create the
repository, then click **Publish repository**.

Use a lowercase repository name without spaces (for example
`kurmanji-learning`) so the generated URLs and base path match exactly.

### Custom domain

If you add a custom domain in **Settings → Pages**, also create a repository
variable named `NEXT_PUBLIC_BASE_PATH` with the value `/` under **Settings →
Secrets and variables → Actions → Variables**. This tells the build to generate
root-relative URLs instead of `/<repo>/` URLs.

## Publishing updates

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Actions rebuilds and redeploys automatically on every push to `main`.
With GitHub Desktop, use **Commit to main** and then **Push origin**.

## Preview the production build locally

```bash
npm run build
npx serve@latest out
```

Then open the URL printed by `serve` (usually `http://localhost:3000`).
`npm start` runs the same command.

## Troubleshooting

- **The site is blank or `_next/...` files return 404** — the base path does not
  match the URL. Project pages need `/<repo-name>`; user pages and custom
  domains need an empty base path. The workflow handles this automatically
  unless a custom domain is used (see above).
- **The deploy job says the Pages site could not be found** — set
  **Settings → Pages → Source** to **GitHub Actions** first.
- **Deep links work on the homepage but 404 when opened directly** — make sure
  deployments go through the workflow. `trailingSlash: true` makes Next.js emit
  `route/index.html`, which GitHub Pages serves correctly.
- **Private repository** — GitHub Pages is available for private repositories
  only on paid GitHub plans. Otherwise make the repository public.
- **Default branch is not `main`** — change `branches: [main]` in
  `.github/workflows/deploy-pages.yml` to your branch name.
