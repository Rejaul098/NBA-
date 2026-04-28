# NBA Criterion 2: Outcome Based Teaching Learning

Full-stack accreditation portal for NBA Criterion 2 with:

- JWT authentication with `admin` and `teacher` roles
- Dynamic accordion forms for sections `2.1` to `2.8`
- Auto-calculated marks out of `120`
- PDF-only evidence uploads using local storage
- Admin filters, searchable reports, and PDF export

## Project structure

```text
nba-obtl/
  client/   React + Vite + Tailwind CSS
  server/   Node.js + Express + MongoDB + Mongoose
```

## Tech stack

- Frontend: `React`, `React Router`, `Tailwind CSS`, `Axios`
- Backend: `Node.js`, `Express`, `Mongoose`, `JWT`, `Multer`, `PDFKit`
- Database: `MongoDB`
- Upload storage: local filesystem (`server/uploads`)

## Criterion 2 sections covered

1. `2.1` Teaching Learning Process - `20`
2. `2.2` Capstone Projects - `25`
3. `2.3` Internship / Industrial Training - `10`
4. `2.4` Seminar / Mini Projects - `10`
5. `2.5` Case Studies / Real-Life Examples - `10`
6. `2.6` SWAYAM / NPTEL / MOOC - `10`
7. `2.7` Complex Engineering Problem Solving - `20`
8. `2.8` Industry Institute Interaction - `15`

## Scoring model

Marks are auto-calculated on the backend after every section save using:

- Number of entries
- Quality selectors such as `impactQuality`, `complexityLevel`, `collaborationQuality`
- Presence of uploaded PDF proof
- Special criteria such as:
  - prototype availability
  - sustainability integration
  - certification
  - SDG mapping
  - internship completion

The scoring engine is implemented in [server/src/utils/scoreCriterion.js](/Users/rejaulhaque/Documents/New%20project/nba-obtl/server/src/utils/scoreCriterion.js).

## Backend API overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/submissions/dashboard`
- `GET /api/submissions/current`
- `PUT /api/submissions/current/section/:sectionKey`
- `GET /api/submissions`
- `GET /api/submissions/:id`
- `POST /api/uploads/pdf`
- `GET /api/reports/:id/pdf`

## MongoDB schema

Main collections:

- `users`
  - `name`
  - `email`
  - `password`
  - `role`
  - `department`
- `criterionsubmissions`
  - `teacher`
  - `academicYear`
  - `department`
  - `status`
  - `sections.*`
  - `scores.sectionScores`
  - `scores.total`
  - `scores.completion`

Schema implementation:

- [server/src/models/User.js](/Users/rejaulhaque/Documents/New%20project/nba-obtl/server/src/models/User.js)
- [server/src/models/CriterionSubmission.js](/Users/rejaulhaque/Documents/New%20project/nba-obtl/server/src/models/CriterionSubmission.js)

## File upload flow

1. Teacher selects a PDF in any section entry.
2. React uploads the file to `POST /api/uploads/pdf`.
3. Backend validates `application/pdf` only.
4. File metadata is stored inside the section entry as `proof`.
5. Saved entries stay linked to the uploaded evidence.

If you want AWS S3 later, replace the `multer` disk storage in [server/src/routes/uploadRoutes.js](/Users/rejaulhaque/Documents/New%20project/nba-obtl/server/src/routes/uploadRoutes.js) with an S3 adapter and keep the same response shape.

## Run locally

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Set these values in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nba-obtl
JWT_SECRET=change-this-secret
CLIENT_URL=http://localhost:5173
UPLOAD_BASE_URL=http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and calls the backend at `http://localhost:5000/api`.

## Key UI areas

- Dashboard with total submissions, completion, and marks
- Accordion forms for all `2.1` to `2.8` sections
- Dynamic `Add Entry` workflow inside each section
- Searchable reports page with filters
- PDF export for full submission reports

## Notes

- Local file storage is enabled by default to keep setup simple.
- Signup currently allows both `teacher` and `admin` roles from the UI for demonstration.
- The backend calculates marks automatically; there is no manual marks entry field.
