# visn0.github.io/portfolio

The personal site of **Anton Chernysh** — Site Reliability Engineer, Zurich. Static pages, no build
step, no framework, no CDN dependency: what is in this repository is what is served.

Live: <https://visn0.github.io/portfolio/>

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — hero, profile panel, selected work (with the recorded demo), experience ledger, toolkit, recognition, education, contact |
| `projects.html` | Seven repository write-ups (Rust/WebAssembly protein analyser, Chess, path-finding visualiser, goBinance, UniversityHack, Cell Block, NN from scratch), each with its last-commit date and media. |
| `presentation.html` | Ten-slide deck about the reliability practice and the projects. Arrow keys navigate, `N` toggles speaker notes, `F` fullscreen, `P` print |
| `resume.html` | The CV data as a print-ready page — `Ctrl/Cmd + P` gives a two-page A4 PDF |
| `404.html` | Not-found page |

## Structure

```
assets/css/site.css      the whole design system — tokens, layout, print styles
assets/css/fonts.css     @font-face rules for the fonts below
assets/fonts/*.woff2     Space Grotesk, Inter, JetBrains Mono (OFL), self-hosted
assets/js/site.js        theme toggle, mobile nav, scroll reveal, deck, copy-email
assets/img/              favicon, social card, project stills, Kaggle certificate
assets/video/            the featured project walkthrough (mp4 + webm)
```

There is deliberately no analytics, no tracker and no runtime dependency on a third-party host.

## Editing

- **Colours and type**: everything is a CSS custom property at the top of `assets/css/site.css`.
  The light palette is the `[data-theme="light"]` block; the dark palette is the default.
- **Content**: hand-written HTML. Each page repeats the header and footer — there is no templating,
  on purpose, so the site works from the filesystem as well as from Pages.
- **The CV as a PDF** comes from `resume.html`: open it in a browser and print to PDF with the default
  (CSS page size) settings. No PDF is committed — the page holds the data, and it stays current because
  there is only one copy of it.
- **The demo video** is a screen recording of the deployed protein analyser; it is copied here
  rather than embedded from another host so the page has no third-party request.

## Deploying

`.github/workflows/pages.yml` runs on every push to `main`: it checks the expected files are
present, stages them into `_site` (excluding `.git` and `.github`), and deploys that directory to
GitHub Pages. Pages must be enabled with **Settings → Pages → Source: GitHub Actions**.

No secrets are required.

## Licence

Content © Anton Chernysh Kornishuk. The webfonts are under the SIL Open Font Licence.
