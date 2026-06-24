import express from "express";
import { supabase } from "../config/supabase.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

// Email transporter configuration
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    const cleanEmail = String(email).trim();
    const cleanPassword = String(password).trim();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", cleanEmail)
      .eq("password", cleanPassword)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    if (!["admin", "owner", "santri"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Role akun tidak dikenali.",
      });
    }

    let santriData = null;

    if (user.role === "santri") {
      const { data: santri, error: santriError } = await supabase
        .from("santri")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (santriError || !santri) {
        return res.status(404).json({
          success: false,
          type: "not_found",
          message: "Data santri tidak ditemukan.",
        });
      }

      if (santri.status === "ditolak") {
        return res.status(403).json({
          success: false,
          type: "rejected",
          message:
            "Mohon maaf, pendaftaran kamu ditolak oleh admin Pondok Pesantren Al-Furqon. Silakan hubungi admin untuk informasi lebih lanjut.",
        });
      }

      if (santri.status === "pending" || santri.status !== "aktif") {
        return res.status(403).json({
          success: false,
          type: "pending",
          message:
            "Akun kamu masih dalam proses verifikasi oleh admin Pondok Pesantren Al-Furqon. Silakan tunggu hingga akun diaktifkan.",
        });
      }

      santriData = santri;
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      nama: user.nama || null,
    };

    let redirectTo = "/login";

    if (user.role === "admin") {
      redirectTo = "/admin/dashboard";
    }

    if (user.role === "owner") {
      redirectTo = "/owner/dashboard";
    }

    if (user.role === "santri") {
      redirectTo = "/santri/dashboard";
    }

    return res.json({
      success: true,
      message: "Login berhasil.",
      redirectTo,
      data: {
        user: safeUser,
        santri: santriData,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat login.",
      error: error.message,
    });
  }
});

/* =========================================================
   SEND OTP FOR REGISTRATION
========================================================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email wajib diisi." });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim())
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar. Silakan gunakan email lain.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a temporary token valid for 10 minutes
    const token = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: "10m" });

    // Send Email
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Sistem Pesantren Al-Furqon" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Kode Verifikasi Pendaftaran Santri",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #064E3B; text-align: center;">Verifikasi Email Anda</h2>
          <p>Assalamu'alaikum,</p>
          <p>Anda menerima email ini karena sedang melakukan pendaftaran santri di <strong>Pondok Pesantren Al-Furqon</strong>.</p>
          <p>Berikut adalah kode verifikasi OTP Anda:</p>
          <div style="background-color: #fef08a; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; color: #064E3B; margin: 20px 0;">
            ${otp}
          </div>
          <p>Kode ini hanya berlaku selama <strong>10 menit</strong>.</p>
          <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
          <p>Wassalamu'alaikum,<br>Admin Pesantren Al-Furqon</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP berhasil dikirim ke email.",
      token, // Frontend stores this token, and sends it back during registration submission
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengirim OTP. Detail: " + (error.message || ""),
    });
  }
});

/* =========================================================
   FORGOT PASSWORD - REQUEST RESET LINK
========================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email wajib diisi." });
    }

    // Find user
    const { data: user } = await supabase
      .from("users")
      .select("id, email, nama")
      .eq("email", email.trim())
      .single();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email tidak ditemukan di sistem kami.",
      });
    }

    // Generate token valid for 15 minutes
    const token = jwt.sign({ user_id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    // Reset Link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // Send Email
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Sistem Pesantren Al-Furqon" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Permintaan Reset Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #064E3B; text-align: center;">Reset Password Anda</h2>
          <p>Assalamu'alaikum ${user.nama || "Santri"},</p>
          <p>Kami menerima permintaan untuk melakukan pengaturan ulang (*reset*) password untuk akun Anda di sistem <strong>Pondok Pesantren Al-Furqon</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #064E3B; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">Reset Password Sekarang</a>
          </div>
          <p>Tautan ini hanya berlaku selama <strong>15 menit</strong>.</p>
          <p>Jika Anda tidak meminta pergantian password, abaikan email ini. Akun Anda akan tetap aman.</p>
          <p>Wassalamu'alaikum,<br>Admin Pesantren Al-Furqon</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "Tautan reset password telah dikirim ke email Anda.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat meminta reset password. Detail: " + (error.message || ""),
    });
  }
});

/* =========================================================
   RESET PASSWORD - APPLY NEW PASSWORD
========================================================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token dan password baru wajib diisi.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password baru minimal 6 karakter.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Tautan sudah kadaluarsa atau tidak valid.",
      });
    }

    const { user_id } = decoded;

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("id", user_id);

    if (updateError) {
      throw updateError;
    }

    return res.json({
      success: true,
      message: "Password berhasil diubah. Silakan login dengan password baru.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mereset password.",
    });
  }
});

export default router;