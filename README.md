# Temple Website Template

This workspace contains a professional temple website template with an Angular frontend and an ASP.NET Core Web API backend.

## Projects

- `temple-web`: Angular 16 frontend with a polished landing page for temple information, daily worship schedule, events, donations, and visitor details.
- `TempleApi`: ASP.NET Core 9 Web API that serves structured homepage content at `/api/temple-content`.

## What Is Included

- Temple-focused homepage design with responsive sections for hero content, pooja timings, services, events, gallery, donations, and contact details.
- Angular service integration with API-backed content.
- Frontend fallback content if the backend is temporarily unavailable.
- Development proxy from Angular to the ASP.NET Core API.

## Run The Projects

### Backend

```powershell
dotnet run --project TempleApi
```

The API listens on `http://localhost:5242` and exposes:

```text
GET /api/temple-content
```

### Frontend

```powershell
Set-Location temple-web
npm install
npm start
```

The Angular development server runs on `http://localhost:4200` and proxies `/api` requests to the backend.

## Build Validation

### Backend

```powershell
dotnet build TempleApi
```

### Frontend

```powershell
Set-Location temple-web
npm run build
```

## Customization Notes

- Replace placeholder contact information, dates, and donation tiers with real temple data.
- The API content is currently hard-coded in the controller and can be moved to a database or admin CMS later.
- The gallery section uses styled placeholders instead of image assets so the template stays lightweight.

## Free Hosting Deployment

This project is now prepared for low-traffic free hosting with:

- Angular frontend on Cloudflare Pages
- ASP.NET Core API on Render Web Service
- Free Postgres on Neon (or Supabase)

### 1. Deploy the API (Render)

Create a new Render Web Service from this repository and configure:

- Root directory: `TempleApi`
- Build command: `dotnet build -c Release`
- Start command: `dotnet TempleApi.dll`

Set Render environment variables:

- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__TempleContent=<your neon postgres connection string>`
- `Jwt__Issuer=TempleApi`
- `Jwt__Audience=TempleWeb`
- `Jwt__Key=<strong random secret>`
- `Cors__AllowedOrigins=https://<your-cloudflare-site>.pages.dev`

Notes:

- The API auto-detects provider by connection string.
- Postgres strings (Host/Username) use Npgsql.
- Local `Data Source=...` strings continue using SQLite.

### 2. Deploy the frontend (Cloudflare Pages)

Create a Cloudflare Pages project from this repository and configure:

- Project directory: `temple-web`
- Build command: `npm run build`
- Build output directory: `dist/temple-web`

Before deployment, set the production API URL in:

- `temple-web/src/environments/environment.prod.ts`

Replace:

- `https://your-api-service.onrender.com`

with your real Render API URL.

### 3. Verify end-to-end

- Open your Cloudflare Pages URL.
- Confirm home/content APIs load.
- Test register/login and pooja booking.
- Confirm CORS allows only your frontend domain.

### 4. Free-tier behavior to expect

- Render free service may sleep after inactivity.
- First request after idle can take time to wake up.
- Free databases have storage and connection limits.
