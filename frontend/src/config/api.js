// Central API config
// Dev:  VITE_API_URL=http://localhost:5000  (from frontend/.env)
// Prod: VITE_API_URL=https://your-ec2-domain (from Vercel env vars)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE;