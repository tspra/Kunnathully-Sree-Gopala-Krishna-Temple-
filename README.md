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
