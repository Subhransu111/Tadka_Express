import { useState, useEffect } from "react";
import { MapPin, X, CheckCircle2, AlertTriangle } from "lucide-react";

// ── Delivery coverage: pincodes or city names we serve ──
// Add more pincodes as coverage expands
const COVERED_PINCODES = [
  "751001", "751002", "751003", "751004", "751005",
  "751006", "751007", "751008", "751009", "751010",
  "751011", "751012", "751013", "751014", "751015",
  "751016", "751017", "751018", "751019", "751020",
  "751021", "751022", "751023", "751024", "751025",
  "751030", "751031",
];
const COVERED_CITY = "bhubaneswar";

// Check if coords are roughly in Bhubaneswar
// (lat: 20.2961, lng: 85.8245 — within ~25km radius)
function isInBhubaneswar(lat, lng) {
  const centerLat = 20.2961;
  const centerLng = 85.8245;
  const R = 6371; // km
  const dLat = ((lat - centerLat) * Math.PI) / 180;
  const dLng = ((lng - centerLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((centerLat * Math.PI) / 180) *
    Math.cos((lat * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance <= 25; // within 25km
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return {
      city: (data.address?.city || data.address?.town || data.address?.village || "").toLowerCase(),
      pincode: data.address?.postcode || "",
      display: data.display_name || "",
    };
  } catch {
    return { city: "", pincode: "", display: "" };
  }
}

export default function LocationGuard({ children }) {
  const [status, setStatus] = useState("idle"); // idle | asking | checking | covered | not_covered | denied | error
  const [locationInfo, setLocationInfo] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already decided this session
    const cached = sessionStorage.getItem("location_status");
    if (cached) {
      setStatus(cached);
      return;
    }

    // Small delay so page loads first
    const timer = setTimeout(() => {
      if ("geolocation" in navigator) {
        setStatus("asking");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = () => {
    setStatus("checking");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeocode(latitude, longitude);
        const covered =
          isInBhubaneswar(latitude, longitude) ||
          geo.city.includes(COVERED_CITY) ||
          COVERED_PINCODES.includes(geo.pincode);

        setLocationInfo(geo);
        const result = covered ? "covered" : "not_covered";
        setStatus(result);
        sessionStorage.setItem("location_status", result);
      },
      (err) => {
        setStatus("denied");
        sessionStorage.setItem("location_status", "denied");
      },
      { timeout: 10000 }
    );
  };

  const handleDeny = () => {
    setStatus("denied");
    sessionStorage.setItem("location_status", "denied");
  };

  const handleDismiss = () => setDismissed(true);

  // Show modal overlay for asking / checking
  const showModal = status === "asking" || status === "checking";

  // Show banner for result
  const showBanner = !dismissed && (status === "covered" || status === "not_covered");

  return (
    <>
      {children}

      {/* ── Location Permission Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 text-center mb-2">
              Enable Location Access
            </h3>
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
              We'd like to check if we deliver to your area. Currently serving{" "}
              <strong className="text-orange-500">Bhubaneswar, Odisha</strong>.
            </p>

            {status === "checking" ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Checking your location...</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleDeny}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Not Now
                </button>
                <button onClick={handleAllow}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/25">
                  Allow Access
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Result Banner ── */}
      {showBanner && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[998] w-full max-w-sm mx-auto px-4`}>
          <div className={`rounded-2xl px-5 py-4 shadow-2xl flex items-start gap-3
            ${status === "covered"
              ? "bg-emerald-500 text-white"
              : "bg-[#1a1a1a] text-white"
            }`}>
            <div className="flex-shrink-0 mt-0.5">
              {status === "covered"
                ? <CheckCircle2 className="w-5 h-5 text-white" />
                : <AlertTriangle className="w-5 h-5 text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              {status === "covered" ? (
                <>
                  <p className="text-sm font-bold">We deliver to your area! 🎉</p>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {locationInfo?.city ? `${locationInfo.city.charAt(0).toUpperCase() + locationInfo.city.slice(1)} is covered.` : "Your location is covered."} Order now!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-amber-400">Not available in your area yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    We currently serve Bhubaneswar. Coming soon to more cities!
                  </p>
                </>
              )}
            </div>
            <button onClick={handleDismiss} className="flex-shrink-0 p-1 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}