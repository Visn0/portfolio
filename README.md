# visn0.github.io/portfolio

The personal site of **Anton Chernysh** — Site Reliability Engineer, Zurich. Static pages, no build
step, no framework, no CDN dependency: what is in this repository is what is served.

Live: <https://visn0.github.io/portfolio/>

## Deploying

`.github/workflows/pages.yml` runs on every push to `main`: it checks the expected files are
present, stages them into `_site` (excluding `.git` and `.github`), and deploys that directory to
GitHub Pages. Pages must be enabled with **Settings → Pages → Source: GitHub Actions**.

No secrets are required.

## Licence

Content © Anton Chernysh Kornishuk. The webfonts are under the SIL Open Font Licence.
