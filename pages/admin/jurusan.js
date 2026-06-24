"use client";

import { useEffect, useState } from "react";
import SidebarAdmin from "./sidebar";
import useAuthGuard from "../../hooks/useAuthGuard";
import AuthLoading from "../../components/AuthLoading";
import { FaGraduationCap, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminJurusan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [jurusanList, setJurusanList] = useState([]);
  const [newJurusan, setNewJurusan] = useState("");

  useEffect(() => {
    fetchJurusan();
  }, []);

  const fetchJurusan = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/jurusan`);
      const result = await res.json();
      
      if (result.success) {
        setJurusanList(result.data || []);
      }
    } catch (error) {
      console.error("Fetch jurusan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJurusan = async (e) => {
    e.preventDefault();
    if (!newJurusan.trim()) return;

    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/admin/jurusan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama_jurusan: newJurusan.trim() }),
      });

      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menambah jurusan");
      }

      setNewJurusan("");
      fetchJurusan();
    } catch (error) {
      alert(error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteJurusan = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus jurusan "${nama}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/admin/jurusan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus jurusan");
      }

      fetchJurusan();
    } catch (error) {
      alert(error.message);
    }
  };

  const isAuth = useAuthGuard();
  if (!isAuth) return <AuthLoading />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <SidebarAdmin
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-[92px]" : "md:ml-[270px]"
        }`}
      >
        <div className="p-6 md:p-10 max-w-5xl mx-auto mt-16 md:mt-0">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <FaGraduationCap className="text-yellow-500" />
                Manajemen Jurusan SMK
              </h1>
              <p className="text-slate-500 mt-2">
                Kelola daftar jurusan SMK yang tersedia di formulir pendaftaran.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Tambah Jurusan Baru</h2>
            
            <form onSubmit={handleAddJurusan} className="flex gap-4 mb-10">
              <input
                type="text"
                placeholder="Nama Jurusan (Contoh: Rekayasa Perangkat Lunak)"
                value={newJurusan}
                onChange={(e) => setNewJurusan(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20"
                required
              />
              <button
                type="submit"
                disabled={adding || !newJurusan.trim()}
                className="bg-yellow-400 text-slate-900 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                Simpan
              </button>
            </form>

            <h2 className="text-lg font-bold text-slate-700 mb-4">Daftar Jurusan</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <FaSpinner className="animate-spin text-3xl text-yellow-400" />
              </div>
            ) : jurusanList.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                Belum ada data jurusan.
              </div>
            ) : (
              <div className="grid gap-4">
                {jurusanList.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-5 rounded-2xl border border-slate-200 hover:border-yellow-400 transition-colors bg-white shadow-sm"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{item.nama_jurusan}</h3>
                      <p className="text-xs text-slate-400 mt-1">ID: {item.id}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteJurusan(item.id, item.nama_jurusan)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus Jurusan"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
