# Resume update handoff

The portfolio now reflects the supplied Product Resume: four Park+ internships,
team-attributed insurance growth, product and engineering skills, certifications,
education, and the two featured AI projects. The existing visual design and Pages
workflow are retained. Anush confirmed Jan–Feb 2024 for Onboarding & Foundations.

## Remaining owner actions

1. **Correct the custom domain DNS.** On 7 September 2026, a public Google DNS
   lookup returned `127.0.0.1` for `anushgupta.tech`. This points visitors to their
   own machine. In your domain provider, replace that apex (`@`) A record with
   GitHub Pages' four A records: `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, and `185.199.111.153`. Keep `anushgupta.tech` configured in
   this repository's Settings → Pages. If using `www`, its CNAME should point to
   `solmyst.github.io`. Recheck DNS and enable Enforce HTTPS when available.
   [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
2. **Correct the source resume date.** The website uses the confirmed 2024 date;
   the downloaded PDF is the original supplied file and still says 2023. Replace
   `public/Anush-Gupta-Product-Resume.pdf` once the source resume is corrected.
3. **Schedule dependency maintenance.** The existing dependency tree reports nine
   npm audit findings (eight high, one low), including Next.js and lint/build
   dependencies. Audit remediation proposes a major Next.js upgrade. This content
   update does not change dependencies. Upgrade and regression-test separately;
   a successful static build does not mean the dependency audit is clean.

## Verification

- `npm run build`: static production export, TypeScript and lint checks.
- `npm run lint`: no warnings or errors.
- Browser checks cover resume content and corrected dates, mobile navigation,
  theme switching, section layout, local asset links, and exact PDF file integrity.
- The production site is a static export; it has no portfolio backend to run.
