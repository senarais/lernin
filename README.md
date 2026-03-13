# 🚀 Lernin - Integrated E-Learning & CBT Platform

Lernin adalah sebuah platform bimbingan belajar (*e-learning*) terintegrasi yang dirancang khusus untuk membantu siswa SMA memaksimalkan potensi akademik mereka dan menembus Perguruan Tinggi Negeri (PTN) impian. Platform ini menghadirkan ekosistem studi *all-in-one* yang menggabungkan modul video pembelajaran, kuis interaktif, sistem *Tryout* berbasis CBT (*Computer-Based Test*), hingga layanan *Live Class* eksklusif.

---

## ✨ Fitur Utama

### 🎓 Untuk User (Siswa)
- **Autentikasi Aman:** Login/Register via Email & Password atau **Google OAuth**.
- **User Profile:** Manajemen data diri dan pelacakan status *membership*.
- **E-Learning Area:** Akses Course (UTBK, SMA IPA/IPS), Mata Pelajaran, dan Modul Video dengan sistem pelacakan progres (Ceklis otomatis).
- **Interactive Quiz:** Kuis latihan per modul dengan rekap nilai riwayat pengerjaan.
- **CBT Tryout Engine:** Simulasi ujian realistis dengan sistem waktu (timer), navigasi soal dinamis, *auto-submit*, dan fitur *Review* (Pembahasan).
- **Live Class Ticketing:** Pembelian tiket kelas interaktif (terintegrasi dengan Midtrans) dan akses tautan rahasia (Zoom/WhatsApp).

### 🛡️ Untuk Admin (Dashboard Workspace)
- **Role-Based Access Control (RBAC):** Proteksi ganda (Frontend & Backend) untuk area Admin.
- **Manajemen E-Learning:** CRUD Master Course, Subject, Modul (URL Video), dan Kuis secara hierarkis dengan perlindungan `ON DELETE CASCADE`.
- **Manajemen Tryout:** Membuat Master Tryout, mengatur Sub-tes (durasi per mapel), dan input Bank Soal beserta kunci jawaban & pembahasan.
- **Manajemen Live Class:** Mengatur jadwal kelas, instruktur, harga tiket, gambar *banner*, dan tautan *meeting*.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router)
- React.js
- Tailwind CSS
- Lucide React (Icons)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- Cookie-parser & CORS

**Database, Auth & Services:**
- [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth)
- [Midtrans](https://midtrans.com/) (Payment Gateway)

---

## ⚙️ Prasyarat (Prerequisites)

Sebelum memulai instalasi, pastikan sistem Anda telah terinstal perangkat lunak berikut:
1. **Node.js** (Disarankan v18.x atau versi LTS terbaru).
2. **Git** (Untuk *cloning repository*).
3. Akun **Supabase** (Untuk *Database* & *Authentication*).
4. Akun **Midtrans** (Untuk *testing payment gateway* menggunakan mode Sandbox).

---

## 🚀 Panduan Instalasi & Menjalankan Project (Local Setup)

Ikuti langkah-langkah di bawah ini secara berurutan untuk menjalankan Lernin di komputer lokal Anda.

### Tahap 1: Clone Repository
Buka terminal/CMD Anda, lalu jalankan perintah berikut:
```bash
git clone [https://github.com/username-anda/lernin.git](https://github.com/username-anda/lernin.git)
cd lernin

```

### Tahap 2: Setup Database (Supabase)

1. Buat project baru di [Supabase Dashboard](https://www.google.com/search?q=https://supabase.com/dashboard).
2. Masuk ke menu **SQL Editor** dan jalankan *query* pembuatan tabel (Tabel `users`, `courses`, `subjects`, `modules`, `quizzes`, `tryouts`, `live_classes`, dll).
3. Buat satu *user* secara manual lewat halaman Register web (setelah web berjalan nanti), lalu ubah *role*-nya menjadi Admin melalui SQL Editor:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'email_anda@gmail.com';

```



### Tahap 3: Setup & Run Backend (Express.js)

Buka terminal baru, navigasi ke folder backend, dan instal dependensi:

```bash
cd backend
npm install

```

Buat file bernama `.env` di *root* folder `backend` dan isi dengan konfigurasi berikut (sesuaikan *value*-nya dengan *project* Anda):

```env
PORT=5000
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni... 

# Midtrans Configuration (Gunakan kunci Sandbox untuk testing)
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_IS_PRODUCTION=false

```

Jalankan server backend:

```bash
npm run dev

```

*(Pastikan terminal menampilkan pesan bahwa server telah berjalan di port 5000)*. Biarkan terminal ini tetap menyala.

### Tahap 4: Setup & Run Frontend (Next.js)

Buka terminal baru lagi (biarkan terminal backend tetap berjalan), navigasi ke folder frontend, dan instal dependensi:

```bash
cd frontend
npm install

```

Buat file bernama `.env.local` di *root* folder `frontend` dan isi dengan konfigurasi berikut:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

```

Jalankan server frontend:

```bash
npm run dev

```

### Tahap 5: Akses Aplikasi

Jika kedua server (Frontend & Backend) sudah berjalan tanpa *error*, buka *browser* Anda dan kunjungi:

* **Halaman Utama (User):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **Halaman Admin Dashboard:** [http://localhost:3000/admin](https://www.google.com/search?q=http://localhost:3000/admin) *(Pastikan Anda sudah login menggunakan akun dengan role 'admin')*

---

## 📂 Struktur Direktori Utama

```text
lernin/
├── backend/                  # Server API Express.js
│   ├── controller/           # Logika bisnis untuk setiap endpoint
│   ├── middleware/           # Proteksi Auth & Admin, Error Handling
│   ├── routes/               # Definisi RESTful API endpoints
│   ├── services/             # Fungsi interaksi langsung ke Supabase
│   └── index.js              # Entry point server backend
│
└── frontend/                 # UI Next.js (App Router)
    ├── app/
    │   ├── admin/            # Halaman Dashboard khusus Admin
    │   ├── components/       # Reusable UI components (Navbar, Video Player, dll)
    │   ├── course/           # Halaman E-learning, Modul, dan Kuis
    │   ├── tryout/           # Halaman CBT Tryout Engine & Review
    │   └── live-class/       # Halaman Katalog & Pembelian Live Class
    └── lib/                  # Konfigurasi utility (API config)

```

---