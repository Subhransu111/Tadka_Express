// ─────────────────────────────────────────────────────────────
//  Tadka Express — Central Cloudinary Image Config
//
//  HOW TO USE:
//  1. Sign up at cloudinary.com (free tier is enough)
//  2. Go to Settings → API Keys → copy your Cloud Name
//  3. Add to Vercel env vars: VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//  4. Upload each image to Cloudinary Media Library
//  5. Use the exact public_id paths listed below when uploading
//
//  FALLBACK: If Cloudinary is not configured, Unsplash URLs are used
//  so the site always works even before you upload anything.
// ─────────────────────────────────────────────────────────────

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Build a Cloudinary delivery URL with auto format + quality
function cldUrl(publicId, transforms = "q_auto,f_auto") {
    if (!CLOUD) return null;
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${publicId}`;
}

// ── Image registry ────────────────────────────────────────────
// key → { publicId, fallback, transforms }
// publicId: the path you use when uploading to Cloudinary
// fallback: shown if Cloudinary not configured yet
const IMAGES = {

    // ── Auth pages (Login + Register background) ──────────────
    BG_AUTH: {
        publicId: "tadka_express/bg-auth",
        transforms: "q_auto,f_auto,w_1920",
        fallback: "/Login_Page.jpg",
    },

    // ── Landing page — Hero section ───────────────────────────
    HERO_BOWL: {
        publicId: "tadka_express/hero/bowl",
        transforms: "q_auto,f_auto,w_800",
        fallback: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    },
    HERO_FLOAT_1: {
        publicId: "tadka_express/hero/float-dal",
        transforms: "q_auto,f_auto,w_200",
        fallback: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200&auto=format&fit=crop",
    },
    HERO_FLOAT_2: {
        publicId: "tadka_express/hero/float-biryani",
        transforms: "q_auto,f_auto,w_200",
        fallback: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=200&auto=format&fit=crop",
    },
    HERO_FLOAT_3: {
        publicId: "tadka_express/hero/float-curry",
        transforms: "q_auto,f_auto,w_200",
        fallback: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=200&auto=format&fit=crop",
    },

    // ── About Us section ──────────────────────────────────────
    ABOUT_KITCHEN: {
        publicId: "tadka_express/about/kitchen",
        transforms: "q_auto,f_auto,w_800",
        fallback: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
    },

    // ── User Dashboard ────────────────────────────────────────
    DASHBOARD_WELCOME_BG: {
        publicId: "tadka_express/dashboard/welcome-bg",
        transforms: "q_auto,f_auto,w_2000",
        fallback: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2000&auto=format&fit=crop",
    },
    DASHBOARD_SUBSCRIPTION_BG: {
        publicId: "tadka_express/dashboard/subscription-bg",
        transforms: "q_auto,f_auto,w_600",
        fallback: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop",
    },

    // ── Dashboard quick action cards ─────────────────────────
    ACTION_UPCOMING_MEAL: {
        publicId: "tadka_express/actions/upcoming-meal",
        transforms: "q_auto,f_auto,w_400",
        fallback: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=400&auto=format&fit=crop",
    },
    ACTION_MY_ORDERS: {
        publicId: "tadka_express/actions/my-orders",
        transforms: "q_auto,f_auto,w_400",
        fallback: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop",
    },
    ACTION_MENU: {
        publicId: "tadka_express/actions/menu",
        transforms: "q_auto,f_auto,w_400",
        fallback: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
    },
    ACTION_REFER: {
        publicId: "tadka_express/actions/refer",
        transforms: "q_auto,f_auto,w_400",
        fallback: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
    },
};

export function img(key) {
    const entry = IMAGES[key];
    if (!entry) return "";
    const url = cldUrl(entry.publicId, entry.transforms);
    return url || entry.fallback;
}

// For inline CSS background-image
export function imgUrl(key) {
    return `url('${img(key)}')`;
}

export default IMAGES;