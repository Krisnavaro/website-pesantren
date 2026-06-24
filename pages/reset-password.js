"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import {
  FaLock,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function StatusModal({ modal, closeModal, router }) {
  const isSuccess = modal.type === "success";
  const style = isSuccess
    ? {
        iconBox: "bg-emerald-400/15 text-emerald-300 border-emerald-300/20",
        title: "text-emerald-200",
        button: "bg-emerald-400 hover:bg-emerald-300 text-emerald-950",
      }
    : {
        iconBox: "bg-red-500/15 text-red-300 border-red-400/20",
        title: "text-red-200",
        button: "bg-red-500 hover:bg-red-400 text-white",
      };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#041b15] via-[#0b3b2e] to-[#14532d] text-center text-white shadow-2xl p-7 sm:p-8"
      >
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border text-4xl ${style.iconBox}`}
        >
          {isSuccess ? <FaCheckCircle /> : <FaExclamationTriangle />}
        </div>
        <h2 className={`text-2xl font-black ${style.title}`}>{modal.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-emerald-50">
          {modal.message}
        </p>
        <button
          onClick={() => {
            closeModal();
            if (isSuccess) router.push("/login");
          }}
          className={`mt-6 w-full rounded-2xl px-6 py-3 font-black transition ${style.button}`}
        >
          {isSuccess ? "Pergi ke Login" : "Tutup"}
        </button>
      </motion.div>
    </div>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!token) {
      setModal({
        show: true,
        type: "error",
        title: "Token Tidak Valid",
        message: "Tautan reset password tidak lengkap atau tidak valid.",
      });
    }
  }, [token]);

  const submitReset = async () => {
    if (!newPassword || !confirmPassword) {
      setModal({
        show: true,
        type: "error",
        title: "Data Belum Lengkap",
        message: "Kedua kolom password wajib diisi.",
      });
      return;
    }
    if (newPassword.length < 6) {
      setModal({
        show: true,
        type: "error",
        title: "Password Lemah",
        message: "Password baru harus memiliki minimal 6 karakter.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setModal({
        show: true,
        type: "error",
        title: "Password Tidak Cocok",
        message: "Konfirmasi password tidak sama dengan password baru.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Gagal mereset password.");

      setModal({
        show: true,
        type: "success",
        title: "Reset Berhasil!",
        message:
          "Password Anda telah berhasil diubah. Silakan masuk kembali menggunakan password baru Anda.",
      });
    } catch (err) {
      setModal({
        show: true,
        type: "error",
        title: "Reset Gagal",
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null; // Wait for useEffect

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#041b15] text-white">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-b from-[#041b15]/95 via-[#062d22]/92 to-[#041b15]" />

      <section className="relative z-10 flex min-h-[100dvh] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-400/20 text-emerald-300">
              <FaLock className="text-2xl" />
            </div>
            <h2 className="text-3xl font-black text-white">
              Buat Password Baru
            </h2>
            <p className="mt-2 text-sm text-emerald-100">
              Masukkan kata sandi baru untuk akun Anda.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-emerald-100">
                Password Baru
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition focus:border-yellow-300/60 focus:bg-white/15 focus:ring-4 focus:ring-yellow-300/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-emerald-100">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-sm font-semibold text-white outline-none backdrop-blur-xl transition focus:border-yellow-300/60 focus:bg-white/15 focus:ring-4 focus:ring-yellow-300/10"
                />
              </div>
            </div>

            <button
              onClick={submitReset}
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-yellow-400 px-6 py-4 font-black text-emerald-950 transition hover:-translate-y-1 hover:bg-yellow-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
              {!loading && (
                <FaArrowRight className="transition group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {modal.show && (
        <StatusModal
          modal={modal}
          closeModal={() => setModal({ ...modal, show: false })}
          router={router}
        />
      )}
    </main>
  );
}
