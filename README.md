# visn0.github.io/portfolio

The personal site of **Anton Chernysh** — Site Reliability Engineer, Zurich. Static pages, no build
step, no framework, no CDN dependency: what is in this repository is what is served.

Live: <https://visn0.github.io/portfolio/>

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — hero, projects carousel, experience ledger, competitions, education, toolkit, contact |
| `404.html` | Not-found page |

## Structure

```
assets/css/site.css      the whole design system — tokens, layout, print styles
assets/css/fonts.css     @font-face rules for the fonts below
assets/fonts/*.woff2     Space Grotesk, Inter, JetBrains Mono (OFL), self-hosted
assets/js/site.js        theme toggle, mobile nav, scroll reveal, carousel, image lightbox, video facades
assets/img/              favicon, social card, project stills, competition evidence
assets/video/            the featured project walkthrough, the sumo round and the humanoid robot (mp4 + webm)
```

## Deploying

`.github/workflows/pages.yml` runs on every push to `main`: it checks the expected files are
present, stages them into `_site` (excluding `.git` and `.github`), and deploys that directory to
GitHub Pages. Pages must be enabled with **Settings → Pages → Source: GitHub Actions**.

No secrets are required.

## Analytics

Cloudflare Web Analytics in both pages: a cookieless beacon, no consent banner, no personal data.
It counts page views and real-user Core Web Vitals; there are no custom events. Dashboard:
Cloudflare → Web Analytics → `visn0.github.io`. The site token in the markup is public by design.

## Licence

Content © Anton Chernysh Kornishuk. The webfonts are under the SIL Open Font Licence.
