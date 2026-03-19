import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Image, Plus, Trash2, Info } from "lucide-react";

export default function AdminBanners() {
    const { dark } = useContext(ThemeContext);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", linkTo: "", file: null });

    const token = localStorage.getItem("token");

    const loadBanners = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/banners`);
            const data = await res.json();
            if (data.success) setBanners(data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadBanners(); }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!form.file || !form.title) return setError("Title and image are required");
        setUploading(true); setError("");
        try {
            const fd = new FormData();
            fd.append("image", form.file);
            fd.append("title", form.title);
            if (form.linkTo) fd.append("linkTo", form.linkTo);
            const res = await fetch(`${API_BASE}/api/banners`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || "Upload failed");
            setForm({ title: "", linkTo: "", file: null });
            document.getElementById("banner-file").value = "";
            loadBanners();
        } catch (err) { setError(err.message); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this banner?")) return;
        try {
            await fetch(`${API_BASE}/api/banners/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` }
            });
            loadBanners();
        } catch (err) { setError(err.message); }
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:bg-white";

    return (
        <AdminLayout>
            <h1 className={`text-xl font-bold mb-6 ${dark ? "text-white" : "text-gray-900"}`}>Banner Management</h1>

            {/* Upload form */}
            <div className={`rounded-2xl p-6 mb-6 ${card}`}>
                <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Upload New Banner</h3>
                <div className={`rounded-xl p-3 mb-4 flex items-start gap-2 ${dark ? "bg-blue-500/5 border border-blue-500/20" : "bg-blue-50 border border-blue-100"}`}>
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className={`text-xs ${dark ? "text-blue-300" : "text-blue-600"}`}>
                        Banners are uploaded to Cloudinary. Make sure your backend <code className="font-mono">CLOUDINARY_*</code> env vars are set.
                        Recommended size: <strong>1200 × 400px</strong>
                    </p>
                </div>
                {error && <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}
                <form onSubmit={handleUpload} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Title *</label>
                            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required
                                placeholder="e.g. Holi Special 20% Off"
                                className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all ${input}`} />
                        </div>
                        <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Link To (optional)</label>
                            <input value={form.linkTo} onChange={e => setForm(f => ({...f, linkTo: e.target.value}))}
                                placeholder="/plans or /register"
                                className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all ${input}`} />
                        </div>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Image File *</label>
                        <input id="banner-file" type="file" accept="image/*"
                            onChange={e => setForm(f => ({...f, file: e.target.files[0]}))}
                            className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white ${input}`} />
                    </div>
                    <button type="submit" disabled={uploading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-60 transition-colors">
                        <Plus className="w-4 h-4" />{uploading ? "Uploading..." : "Upload Banner"}
                    </button>
                </form>
            </div>

            {/* Banners list */}
            <h3 className={`text-sm font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Active Banners ({banners.length})</h3>
            {loading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>
            ) : banners.length === 0 ? (
                <div className={`rounded-2xl p-10 text-center ${card}`}>
                    <Image className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No banners uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.map(banner => (
                        <div key={banner._id} className={`rounded-2xl overflow-hidden ${card}`}>
                            <img src={banner.imageUrl} alt={banner.title}
                                className="w-full h-32 object-cover" onError={e => e.target.style.display="none"} />
                            <div className="p-4 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{banner.title}</p>
                                    {banner.linkTo && <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>→ {banner.linkTo}</p>}
                                </div>
                                <button onClick={() => handleDelete(banner._id)}
                                    className={`p-2 rounded-xl flex-shrink-0 transition-colors ${dark ? "hover:bg-red-500/10 text-gray-500 hover:text-red-400" : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="h-8" />
        </AdminLayout>
    );
}