import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BannerSlider() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/banners`)
            .then(r => r.json())
            .then(d => { if (d.success && d.data?.length) setBanners(d.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (loading || banners.length === 0) return null;

    const banner = banners[current];

    return (
        <section className={`relative overflow-hidden ${dark ? "bg-[#0a0a0a]" : "bg-[#f5f9f0]"} py-4 px-4`}>
            <div className="max-w-7xl mx-auto">
                <div
                    onClick={() => banner.linkTo && navigate(banner.linkTo)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group
                        ${banner.linkTo ? "cursor-pointer" : "cursor-default"}`}
                    style={{ aspectRatio: "3/1", maxHeight: "180px" }}>
                    <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ maxHeight: "180px" }}
                    />
                    {/* Overlay with title */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent flex items-center px-6">
                        <h3 className="text-white font-extrabold text-lg md:text-2xl drop-shadow-lg">
                            {banner.title}
                        </h3>
                    </div>
                    {/* Nav arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + banners.length) % banners.length); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % banners.length); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {/* Dots */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {banners.map((_, i) => (
                                <button key={i}
                                    onClick={e => { e.stopPropagation(); setCurrent(i); }}
                                    className={`rounded-full transition-all ${i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}