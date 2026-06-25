/**
 * @file publicRoutes.js
 * @description Menyediakan endpoint publik (tidak memerlukan autentikasi) untuk mendapatkan data
 * konten statis/dinamis yang digunakan oleh halaman utama website seperti home, program, pendidikan,
 * fasilitas, dan konfigurasi umum lainnya.
 * @module routes/publicRoutes
 */
import express from "express";
import { supabase } from "../config/supabase.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/* =========================================================
   HOME PAGE DATA
========================================================= */

const homeData = {
  hero: {
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    badge: "Pondok Pesantren Al-Furqon",
    title: "Mondok bukan sekadar sekolah.",
    highlight: "Ini perjalanan hidup.",
    desc: "Santri datang membawa harapan. Di Al-Furqon, harapan itu diproses melalui ilmu, ibadah, adab, kemandirian, dan pembinaan yang terarah.",
    image: "/hero-santri.jpg",
  },

  profil: {
    pendahuluan:
      "Pondok Pesantren Al Qur'an Al Furqon berdiri pada tahun 1976 yang berlokasi di Cilendek Barat Kota Bogor oleh Abah KH. Abdurrochman, lalu bertambah perkembangannya dengan membangun kembali pada tahun 1992 di daerah Cimulang-Rancabungur, yang sampai saat ini perkembangannya masih tetap eksis. Terlebih pada tahun 2004 telah dibuka Pendidikan Formal berupa Madrasah Tsanawiyah (MTs) Al Furqon dan pada tahun 2015 dibuka juga Sekolah Menengah Kejuruan (SMK) Al Furqon. Kedua lembaga formal ini dalam operasionalnya memadukan antara Kurikulum Kementrian Agama dan Kurikulum Pendidikan Nasional, sehingga dapat diharapkan mencetak generasi Qur'ani dengan mengembangkan daya fikir dan dzikir.",

    visi:
      "Membentuk Generasi Qur'ani yang berdaya Fikir dan Dzikir.",

    misi: [
      "Memahami dan mendalami Qo'idah-Qo'idah bacaan Al Qur'an.",
      "Mengkaji, memahami dan mengamalkan isi kandungan Al Qur'an.",
      "Menjadikan Al Qur'an sebagai pedoman hidup sepanjang hayat."
    ],

    landasan: [
      "Al Qur'an surat An-Nisa ayat 9, yang artinya: 'Dan hendaklah takut kepada Allah, orang-orang yang seandainya meninggalkan dibelakang mereka anak-anak yang lemah, yang mereka khawatir terhadap (kesejahteraan) mereka. Oleh sebab itu hendaklah mereka bertaqwa kepada Allah dan hendaklah berbicara dengan tutur kata yang benar.'",
    ]
  },

  heroStats: [
    { value: "100+", label: "Santri" },
    { value: "6", label: "Program" },
    { value: "3", label: "Jenjang" },
  ],

  programs: [
    {
      title: "Tahfidzul Qur'an",
      iconKey: "quran",
      desc: "Program menghafal Al-Qur'an dengan target hafalan dan muroja'ah yang terstruktur.",
    },
    {
      title: "Muhadhoroh",
      iconKey: "teacher",
      desc: "Melatih keberanian, kemampuan berbicara, dan penyampaian dakwah di depan umum.",
    },
    {
      title: "Kaligrafi",
      iconKey: "book",
      desc: "Pembelajaran seni tulis Arab untuk mengembangkan kreativitas dan kecintaan terhadap Al-Qur'an.",
    },
    {
      title: "Majelis Ta'lim",
      iconKey: "mosque",
      desc: "Kajian rutin untuk memperdalam pemahaman agama dan meningkatkan keimanan santri.",
    },
    {
      title: "Kitab Kuning",
      iconKey: "book",
      desc: "Pembelajaran kitab-kitab turats sebagai dasar pemahaman ilmu syar'i.",
    },
    {
      title: "Olahraga",
      iconKey: "star",
      desc: "Kegiatan olahraga untuk menjaga kesehatan, kebugaran, dan kekompakan santri.",
    },
  ],

  values: [
    {
      iconKey: "mosque",
      title: "Ibadah",
      desc: "Pembiasaan shalat berjamaah, dzikir, kajian, dan kedisiplinan spiritual.",
    },
    {
      iconKey: "book",
      title: "Ilmu",
      desc: "Pendidikan umum dan agama berjalan seimbang untuk masa depan santri.",
    },
    {
      iconKey: "heart",
      title: "Adab",
      desc: "Pembentukan akhlak dan karakter menjadi dasar utama pendidikan.",
    },
    {
      iconKey: "shield",
      title: "Aman",
      desc: "Lingkungan pesantren terarah, terpantau, dan mendukung perkembangan santri.",
    },
  ],

  pembina: [
    {
      iconKey: "book",
      name: "Umi Hj Siti Aisya binti H Ahmad Amir",
      role: "Pendiri Pondok Pesantren",
      image: "/Umi Hj Siti Aisya binti H Ahmad Amir.png",
      focus:
        "Membimbing pembelajaran formal, kedisiplinan belajar, dan perkembangan akademik santri.",
      badge: "Pendiri",
    },
    {
      iconKey: "quran",
      name: "Abi Kh Dadun Abdurrohim bin Kh Abdurrahman",
      role: "Pendiri Pondok Pesantren",
      image: "/Abi Kh Dadun Abdurrohim bin Kh Abdurrahman.png",
      focus: "Membimbing hafalan, tahsin, tajwid, dan murojaah harian.",
      badge: "Pendiri",
    },
  ],
};

/* =========================================================
   PROGRAM PAGE DATA
========================================================= */

const programPageData = {
  hero: {
    badge: "Program Unggulan Pesantren",
    title: "Mondok bukan sekadar sekolah.",
    highlight: "Ini perjalanan hidup.",
    desc: "Program pembinaan Al-Furqon dirancang untuk mengembangkan spiritual, karakter, kreativitas, keberanian, dan kemampuan sosial santri secara seimbang.",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    source: "QS. At-Talaq : 2",
    image: "/hero-santri.jpg",
  },

  programs: [

    {
      title: "Tahfidzul Qur'an",
      subtitle: "Hafalan & Murajaah",
      iconKey: "quran",
      image: "/tahfidz.jpg",
      desc: "Program pembinaan hafalan Al-Qur'an secara bertahap dan terarah.",
      longDesc:
        "Santri dibimbing untuk menghafal, menjaga hafalan, memperbaiki bacaan, dan membangun kedekatan dengan Al-Qur'an melalui setoran serta murajaah rutin.",
      features: ["Hafalan", "Murajaah", "Setoran", "Tajwid"],
    },
    {
      title: "Muhadhoroh",
      subtitle: "Public Speaking Islami",
      iconKey: "users",
      image: "/muhadhoroh.jpg",
      desc: "Melatih keberanian berbicara di depan umum dengan adab Islami.",
      longDesc:
        "Santri dilatih menyampaikan pidato, ceramah, kultum, dan presentasi sehingga memiliki kemampuan komunikasi yang baik dan percaya diri.",
      features: ["Pidato", "Ceramah", "Public Speaking", "Percaya Diri"],
    },
    {
      title: "Kaligrafi",
      subtitle: "Seni Tulis Islami",
      iconKey: "star",
      image: "/kaligrafi.jpg",
      desc: "Mengembangkan kreativitas santri melalui seni kaligrafi Islam.",
      longDesc:
        "Program ini melatih keterampilan menulis huruf Arab dengan kaidah yang benar serta mengembangkan jiwa seni dan ketelitian santri.",
      features: ["Kaligrafi", "Seni", "Kreativitas", "Ketelitian"],
    },
    {
      title: "Majelis Ta'lim",
      subtitle: "Kajian Keislaman",
      iconKey: "book",
      image: "/majelis.jpg",
      desc: "Pembinaan ilmu agama melalui kajian rutin dan diskusi keislaman.",
      longDesc:
        "Santri mengikuti kajian keislaman yang membahas aqidah, fiqih, akhlak, dan kehidupan sehari-hari sesuai tuntunan Islam.",
      features: ["Aqidah", "Fiqih", "Akhlak", "Kajian"],
    },
    {
      title: "Kitab Kuning",
      subtitle: "Kajian Turats",
      iconKey: "book",
      image: "/kitab-kuning.jpg",
      desc: "Mempelajari kitab-kitab klasik sebagai dasar keilmuan pesantren.",
      longDesc:
        "Santri mempelajari berbagai kitab kuning seperti Ta'lim Muta'allim, Jurumiyah, Safinatun Najah, dan kitab lainnya secara bertahap.",
      features: ["Ta'lim", "Jurumiyah", "Safinah", "Turats"],
    },
    {
      title: "Olahraga",
      subtitle: "Kesehatan & Kebugaran",
      iconKey: "campground",
      image: "/olahraga.jpg",
      desc: "Menjaga kesehatan jasmani melalui olahraga dan senam pagi.",
      longDesc:
        "Santri dibiasakan hidup sehat dengan kegiatan olahraga rutin yang meningkatkan kebugaran, disiplin, dan kerja sama.",
      features: ["Senam", "Kebugaran", "Sehat", "Disiplin"],
    },
  ],

  stats: [
    { value: "100+", label: "Santri", iconKey: "users" },
    { value: "6", label: "Program", iconKey: "book" },
    { value: "3", label: "Jenjang", iconKey: "award" },
    { value: "50+", label: "Pembimbing", iconKey: "hands" },
  ],

  timeline: [
    {
      number: "01",
      title: "Pengenalan Minat",
      desc: "Santri diarahkan mengenali potensi dan minat melalui kegiatan awal.",
    },
    {
      number: "02",
      title: "Latihan Terjadwal",
      desc: "Pembinaan dilakukan rutin agar kemampuan berkembang konsisten.",
    },
    {
      number: "03",
      title: "Evaluasi",
      desc: "Pembimbing mengevaluasi perkembangan santri dan memberi arahan.",
    },
    {
      number: "04",
      title: "Berprestasi",
      desc: "Santri diberi ruang untuk tampil dan membangun percaya diri.",
    },
  ],

  gallery: [
    "/doa.png",
    "/lulus.png",
    "/eid.png",
  ],

  advantages: [
    {
      iconKey: "shield",
      title: "Membentuk Disiplin",
      desc: "Santri terbiasa mengikuti jadwal, aturan, arahan, dan tanggung jawab.",
    },
    {
      iconKey: "star",
      title: "Mengasah Potensi",
      desc: "Minat dan bakat santri diberi ruang agar berkembang secara positif.",
    },
    {
      iconKey: "graduate",
      title: "Menyiapkan Masa Depan",
      desc: "Santri dilatih agar percaya diri, aktif, dan siap menghadapi tantangan.",
    },
  ],

  faq: [
    {
      q: "Apakah semua santri wajib mengikuti program?",
      a: "Santri diarahkan mengikuti program sesuai minat, bakat, dan kebutuhan pembinaan. Beberapa kegiatan dapat bersifat wajib sesuai aturan pesantren.",
    },
    {
      q: "Apakah program dibimbing langsung oleh pembina?",
      a: "Ya, setiap program memiliki pembimbing agar latihan lebih terarah, disiplin, dan sesuai tujuan pembinaan.",
    },
    {
      q: "Apakah santri bisa mengikuti lebih dari satu program?",
      a: "Bisa, selama tidak bertabrakan dengan jadwal utama dan tetap mengikuti arahan pembina.",
    },
  ],
};

/* =========================================================
   PENDIDIKAN PAGE DATA
========================================================= */

const pendidikanPageData = {
  hero: {
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    badge: "Islamic Education Journey",
    title: "Journey of",
    highlight: "Santri Education.",
    desc: "Perjalanan pendidikan islami modern yang membentuk akhlak, spiritualitas, ilmu pengetahuan, keterampilan hidup, dan masa depan santri dalam satu sistem pembinaan terpadu.",
    image: "/smk.jpg",
  },

  stats: [
    { number: "3", label: "Jenjang Pendidikan" },
    { number: "24 Jam", label: "Pembinaan Karakter" },
    { number: "100+", label: "Program Pembiasaan" },
  ],

  values: [
    {
      iconKey: "mosque",
      title: "Ibadah",
      desc: "Rutinitas santri dibangun dengan shalat berjamaah, dzikir, dan pembiasaan ibadah harian.",
    },
    {
      iconKey: "book",
      title: "Ilmu",
      desc: "Pendidikan umum dan agama berjalan seimbang agar santri siap menghadapi masa depan.",
    },
    {
      iconKey: "heart",
      title: "Adab",
      desc: "Pembinaan karakter menjadi dasar utama sebelum santri mengejar prestasi akademik.",
    },
    {
      iconKey: "shield",
      title: "Disiplin",
      desc: "Lingkungan pesantren membentuk kebiasaan hidup teratur, mandiri, dan bertanggung jawab.",
    },
  ],

  education: [
    {
      level: "01",
      title: "MTs Setara",
      shortTitle: "MTS",
      iconKey: "graduate",
      bgImage: "/icon_mts.png",
      fallbackImage: "/smk.jpg",
      color: "from-emerald-400 via-green-500 to-emerald-800",
      subtitle: "Fondasi karakter & adab sebelum ilmu tinggi",
      arabic: "الأدب قبل العلم",
      quote: "Adab sebelum ilmu, karakter sebelum prestasi.",
      story:
        "Tahap awal pembentukan karakter santri melalui disiplin, ibadah, pembiasaan adab, dan keseimbangan antara pendidikan umum serta agama.",
      focus: [
        "Kurikulum umum & agama",
        "Tahsin & hafalan dasar",
        "Pembentukan adab",
        "Disiplin & ibadah harian",
      ],
      impact: "Fondasi karakter kuat untuk masa depan",
    },
    {
      level: "02",
      title: "SMK",
      shortTitle: "SMK",
      iconKey: "laptop",
      bgImage: "/icon_smk.png",
      fallbackImage: "/smk.jpg",
      color: "from-yellow-300 via-amber-400 to-orange-500",
      subtitle: "Skill modern & kemandirian santri",
      arabic: "العلم والعمل",
      quote: "Ilmu agama berjalan bersama keterampilan masa depan.",
      story:
        "Santri diarahkan menuju dunia nyata melalui entrepreneurship, dan project industri modern.",
      focus: [
        "Programming & multimedia",
        "Digital entrepreneurship",
        "Project industri",
        "Soft skill & teamwork",
      ],
      impact: "Mandiri secara ekonomi & siap dunia kerja",
    },
    {
      level: "03",
      title: "Takhossus",
      shortTitle: "Takhossus",
      iconKey: "quran",
      bgImage: "/icon_takhassus.png",
      fallbackImage: "/hero-santri.jpg",
      color: "from-emerald-600 via-green-800 to-black",
      subtitle: "Puncak pendalaman Al-Qur’an",
      arabic: "حَمَلَةُ الْقُرْآن",
      quote: "Mendalami Al-Qur’an untuk menjadi cahaya bagi umat.",
      story:
        "Tahap pembinaan tertinggi untuk mencetak hafidz Qur’an, dai, dan calon ulama dengan pemahaman ilmu syar’i mendalam.",
      focus: [
        "Tahfidz 30 Juz",
        "Tafsir & Hadits",
        "Kitab turats klasik",
        "Bahasa Arab intensif",
      ],
      impact: "Lahirnya hafidz Qur’an & calon ulama",
    },
  ],
};

/* =========================================================
   FASILITAS PAGE DATA
========================================================= */

const fasilitasPageData = {
  hero: {
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    badge: "Fasilitas Pesantren",
    title: "Lingkungan nyaman",
    highlight: "untuk tumbuhnya santri.",
    desc: "Fasilitas pesantren dirancang untuk mendukung ibadah, pendidikan, pembinaan akhlak, kemandirian, keamanan, dan kehidupan santri selama 24 jam.",
    image: "/hero-santri.jpg",
  },

  stats: [
    { value: "10+", label: "Fasilitas" },
    { value: "24/7", label: "Keamanan" },
    { value: "Islami", label: "Lingkungan" },
    { value: "Nyaman", label: "Asrama" },
  ],

  featuredInfo: {
    badge: "Featured Facility",
    title: "Pusat kegiatan spiritual santri",
    desc: "Masjid menjadi ruang utama pembentukan ibadah, kajian, dzikir, dan pembiasaan akhlak harian.",
  },

  featuredCards: [
    {
      iconKey: "mosque",
      title: "Ibadah Harian",
      desc: "Shalat berjamaah, dzikir, dan pembiasaan ibadah.",
    },
    {
      iconKey: "quran",
      title: "Kajian Qur’an",
      desc: "Tahsin, tilawah, murojaah, dan pembinaan rohani.",
    },
    {
      iconKey: "users",
      title: "Kebersamaan",
      desc: "Santri belajar disiplin dan adab bersama.",
    },
    {
      iconKey: "shield",
      title: "Terarah",
      desc: "Kegiatan dibimbing oleh pembina pesantren.",
    },
  ],

  qualities: ["Nyaman", "Aman", "Terarah", "Islami"],

  facilities: [
    {
      id: 1,
      name: "Masjid Al Furqon",
      desc: "Pusat ibadah, kajian, dzikir, shalat berjamaah, dan pembinaan spiritual santri setiap hari.",
      detail:
        "Masjid menjadi pusat kehidupan pesantren. Santri dibiasakan menjaga ibadah, mengikuti kajian, dan membangun kedekatan dengan Al-Qur’an dalam suasana yang nyaman.",
      iconKey: "mosque",
      img: "/masjid.png",
      category: "Ibadah",
      featured: true,
    },
    {
      id: 2,
      name: "Asrama Putra",
      desc: "Lingkungan asrama yang nyaman, terarah, dan berada dalam pengawasan pembina.",
      detail:
        "Asrama dirancang untuk membentuk kemandirian, kedisiplinan, kebersihan, dan tanggung jawab santri dalam kehidupan sehari-hari.",
      iconKey: "bed",
      img: "Asrama-Putra.jpeg",
      category: "Asrama",
      featured: false,
    },
    {
      id: 3,
      name: "Asrama Putri",
      desc: "Asrama aman dan tertata untuk kenyamanan santri putri selama proses pendidikan.",
      detail:
        "Asrama putri dilengkapi dengan pendampingan dan suasana yang mendukung pembinaan adab, kebiasaan baik, serta kedisiplinan.",
      iconKey: "bed",
      img: "Assrama-putri.jpg",
      category: "Asrama",
      featured: false,
    },
    {
      id: 4,
      name: "Ruang Kelas",
      desc: "Ruang belajar interaktif untuk mendukung pendidikan formal dan agama.",
      detail:
        "Kelas menjadi ruang santri mengembangkan ilmu akademik, berdiskusi, belajar bersama guru, dan membangun kemampuan berpikir.",
      iconKey: "book",
      img: "Ruang-kelas.jpeg",
      category: "Pendidikan",
      featured: false,
    },
    {
      id: 5,
      name: "Lapangan Olahraga",
      desc: "Tempat kegiatan olahraga, latihan fisik, dan aktivitas kebersamaan santri.",
      detail:
        "Lapangan menjadi ruang santri menjaga kesehatan, membangun kerja sama, sportivitas, dan keseimbangan antara belajar dan aktivitas fisik.",
      iconKey: "sport",
      img: "Lapangan-olahraga.jpeg",
      category: "Aktivitas",
      featured: false,
    },
    {
      id: 6,
      name: "Aula Serbaguna",
      desc: "Ruang pertemuan besar untuk berbagai acara pesantren.",
      detail:
        "Aula digunakan untuk acara resmi, pertemuan wali santri, seminar, dan kegiatan besar lainnya yang membutuhkan kapasitas ruangan yang luas.",
      iconKey: "users",
      img: "Aula.jpg",
      category: "Aktivitas",
      featured: false,
    },
    {
      id: 7,
      name: "Majelis Ta'lim",
      desc: "Tempat khusus untuk kajian kitab dan diskusi keislaman.",
      detail:
        "Majelis menjadi pusat pendalaman ilmu agama, tempat santri mengikuti pengajian rutin dan kajian kitab kuning bersama para ustadz.",
      iconKey: "quran",
      img: "Majelis.jpg",
      category: "Ibadah",
      featured: false,
    },
    {
      id: 8,
      name: "Perpustakaan",
      desc: "Pusat literasi dan referensi buku-buku agama maupun umum.",
      detail:
        "Perpustakaan menyediakan berbagai macam buku referensi, kitab kuning, buku pelajaran, dan literatur umum untuk menunjang kegiatan belajar.",
      iconKey: "book",
      img: "Perpustakaan.jpg",
      category: "Pendidikan",
      featured: false,
    },
    {
      id: 9,
      name: "Laboratorium Komputer",
      desc: "Fasilitas praktik IT dan pengembangan skill digital santri.",
      detail:
        "Dilengkapi dengan perangkat komputer untuk mendukung pembelajaran teknologi informasi, multimedia, dan keterampilan digital.",
      iconKey: "laptop",
      img: "Lab-komputer.jpg",
      category: "Pendidikan",
      featured: false,
    },
  ],
};

/* =========================================================
   PUBLIC ROUTES
========================================================= */

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Express.js Al-Furqon aktif",
    endpoints: [
      "/api/health",
      "/api/home",
      "/api/program",
      "/api/pendidikan",
      "/api/fasilitas",
      "/api/pendaftaran",
    ],
  });
});

router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "online",
    message: "Backend aktif",
  });
});

router.get("/home", (req, res) => {
  res.json({
    success: true,
    page: "home",
    data: homeData,
  });
});

router.get("/program", (req, res) => {
  res.json({
    success: true,
    page: "program",
    data: programPageData,
  });
});

router.get("/pendidikan", (req, res) => {
  res.json({
    success: true,
    page: "pendidikan",
    data: pendidikanPageData,
  });
});

router.get("/fasilitas", (req, res) => {
  res.json({
    success: true,
    page: "fasilitas",
    data: fasilitasPageData,
  });
});

router.get("/jurusan", async (req, res) => {
  try {
    const jurusanPath = path.join(__dirname, "../data/jurusan.json");
    if (!fs.existsSync(jurusanPath)) {
      return res.json({ success: true, data: [] });
    }
    const data = JSON.parse(fs.readFileSync(jurusanPath, "utf8"));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;