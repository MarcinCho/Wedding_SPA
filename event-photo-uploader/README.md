# Event Photo Uploader

A lightweight Progressive Web App (PWA) for event attendees to capture and upload photos.

## Project Structure

- `frontend/`: Vue.js 3 + Vite + TailwindCSS application.
- `backend/`: Cloudflare Worker application with R2 binding.

## Prerequisites

- Node.js (v18+)
- `npm`

## Setup & Running

1. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

2. **Start Backend (Cloudflare Worker)**
   Open a terminal and run:
   ```bash
   cd backend
   npx wrangler dev
   ```
   This will start the worker at `http://localhost:8787`.

3. **Start Frontend**
   Open another terminal and run:
   ```bash
   cd frontend
   npm run dev
   ```
   This will start the frontend (typically at `http://localhost:5173`).

4. **Testing**
   - Open the frontend URL in your browser.
   - Use the "Take Photo" (mobile) or "Drag and Drop" (desktop) area to select an image.
   - Click "Upload Photo".
   - You should see a progress bar and a success message.
   - The file is saved to the local R2 simulation in `.wrangler/state/v3/r2/...`.

## Configuration

- **Frontend Proxy**: Configured in `frontend/vite.config.ts` to proxy `/api` requests to `http://localhost:8787`.
- **Backend Port**: Default `8787`. If changed, update `vite.config.ts`.
- **R2 Bucket**: Configured in `backend/wrangler.toml`.
