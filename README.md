# Portfolio Template

Portfolio template built with Vue 3 and Vite.

## Requirements
- Node.js (recommended LTS)
- npm
- Docker (optional)

## Quick start
```bash
npm install
```

Copy `.env.example` to `.env.local` and adjust values:
```bash
cp .env.example .env.local
```

Run the dev server:
```bash
npm run dev
```

## Environment
Vite embeds `VITE_*` variables at build time. Make sure they are set before `npm run build`.

- `VITE_API_BASE_URL`: Base URL for the contact endpoint.
- `VITE_CONTACT_PATH`: Contact API path (default in code is `/contact`).
- `VITE_RECAPTCHA_SITE_KEY`: Required for the contact form to submit.
- `VITE_PORTFOLIO_TEMPLATE_URL`: Optional footer link to your template repo.

Notes:
- Set `VITE_PORTFOLIO_TEMPLATE_URL` to your GitHub template URL (McVogel-Portfolio-Template-v2) to display it in the footer.
- If you distribute this template, keep the footer link pointing to the template repo.

## Content
Update the copy in:
- `src/locales/en.json`
- `src/locales/de.json`

## Scripts
```bash
npm run dev
npm run type-check
npm run lint
npm run build
npm run preview
```

## Docker
Build and run the production image:
```bash
docker compose up -d --build
```

The app is served on `http://localhost:8085`.

If you need custom API settings, add build args in `docker-compose.yml` for
`VITE_API_BASE_URL` and `VITE_CONTACT_PATH`.

## License
MIT
