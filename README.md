# Bot Forge

React + Vite frontend with Tailwind CSS, React Router, and a minimal FastAPI backend.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build in `dist`.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

## Project Structure

- `index.html` is the HTML entry point Vite serves.
- `src/main.jsx` mounts the React app into `#root`.
- `src/App.jsx` contains the app shell with React Router, sidebar, navbar, and routed content.
- `src/index.css` imports Tailwind CSS and defines minimal global base styles.
- `src/assets/` is reserved for frontend assets.
- `src/components/` contains reusable UI components.
- `src/pages/` contains route-level placeholder pages.
- `src/routes/AppRoutes.jsx` defines application routes.
- `src/services/` contains frontend API helper modules.
- `backend/main.py` defines the FastAPI app and health check endpoint.
- `backend/requirements.txt` lists Python backend dependencies.
- `vite.config.js` configures Vite, React, and Tailwind CSS.
- `eslint.config.js` configures ESLint for JavaScript and JSX.
- `package.json` defines scripts and dependencies.
