# Klartväg — Sweden Migration Navigator

Free, accurate, plain-language guide to Sweden's migration system.
Official sources only. Swedish, English, Arabic, Ukrainian.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Home — who are you in this system |
| `employer.html` | Employer/HR — category checker, expiry tracker, checklist |
| `asylum.html` | Asylum — full process, appeal deadline calculator |
| `newlife.html` | New resident — personnummer → BankID → FK → healthcare |
| `expat.html` | Expat/skilled worker — work permit journey |
| `family.html` | Family reunification |
| `agency.html` | Government agency staff portal |
| `reform.html` | June 2026 law change plain-language explainer |
| `style.css` | Shared styles |
| `shared.js` | Language switcher, SCB threshold, shared utils |
| `tools.js` | Interactive tools — employer category checker, appeal calculator |
| `vercel.json` | Vercel deployment config |

## Deploy to Vercel (3 steps)

**Option A — Drag and drop (fastest)**
1. Go to vercel.com → New Project
2. Drag the entire `klartvag` folder onto the deploy area
3. Done. You get a URL like `klartvag.vercel.app`

**Option B — GitHub + Vercel (recommended for updates)**
1. Create a new GitHub repo: `github.com/yourusername/klartvag`
2. Push this folder: `git init && git add . && git commit -m "initial" && git push`
3. Connect the repo in Vercel → auto-deploys on every push

## Custom domain (optional)
- Buy `klartvag.se` at one.com or domainnameshop.com (~100 SEK/year)
- Add it in Vercel → Settings → Domains

## Content updates
When Swedish law changes:
1. Update the relevant HTML file
2. Change the `last-checked` date in the affected official-source boxes
3. Push to GitHub → Vercel auto-deploys

The `outdated-warning` boxes flag content that needs review.
The `unknown-box` boxes explicitly mark what this tool cannot answer.

## Data sources
- Migrationsverket: migrationsverket.se
- SCB salary threshold: scb.se (updated quarterly)
- Government bills: regeringen.se
- ECRE/AIDA asylum data: asylumineurope.org
- informationsverige.se (plain-language official content)

## Accuracy policy
- All content links to official government URLs
- No AI-generated legal interpretation
- Plain-language summaries clearly labelled as simplified
- "Outside scope" boxes mark what the tool cannot determine
- Zero hallucination: if we don't know, we say so and link to the source

## Vinnova pitch brief
Sweden loses talent, wastes caseworker hours, and creates integration failures
because five agencies operate in silos and no common navigation layer exists.
Klartväg is a free, official-source-only, multilingual civic tool that connects
the migration journey across Migrationsverket, Skatteverket, Försäkringskassan,
Arbetsförmedlingen and Säpo — with zero ongoing government IT budget required.

Key stats:
- 40% of work permit rejections from preventable document errors
- 400-day family reunification wait with zero status communication  
- 187-day asylum processing average
- 15-20% candidate drop-off rate for employers vs Germany/Netherlands
- No free, multilingual, plain-language tool currently exists

Built by: [your name]
Contact: [your email]
