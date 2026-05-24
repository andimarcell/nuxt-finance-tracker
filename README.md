# 📊 FTracker - Personal Finance Tracker (Skripsi Project)

FTracker adalah aplikasi manajemen keuangan pribadi (*personal finance tracker*) berbasis *multi-tenant* sejati yang dirancang khusus untuk memantau pemasukan, pengeluaran, serta likuiditas keuangan secara dinamis dengan dukungan analitik performa periode-ke-periode.

Aplikasi ini dibangun menggunakan arsitektur modern **Nuxt 4**, sistem utilitas styling **Tailwind CSS v4**, dan ditenagai oleh **Supabase (PostgreSQL)** dengan sistem keamanan **Row-Level Security (RLS)** di tingkat basis data.

![Tech Stack](https://img.shields.io/badge/Nuxt_4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Nuxt_UI_v3](https://img.shields.io/badge/Nuxt_UI_v3-4ADE80?style=for-the-badge&logo=nuxt.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind_v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Fitur Utama (Key Features)

*   **🔐 Dual-Mode Authentication (Email-Password & Magic Link):** Mendukung login/register klasik menggunakan Email & Password serta opsi masuk instan tanpa password (*Passwordless OTP Magic Link* via SMTP Gmail).
*   **🛡️ Multi-Tenant Secure Database (PostgreSQL RLS):** Sistem keamanan ketat di mana setiap transaksi pengguna diisolasi penuh menggunakan kebijakan Row-Level Security (`auth.uid() = user_id`). Atribusi `user_id` diatur otomatis di sisi server database PostgreSQL.
*   **💰 Smart Budgeting & Real-time Validation:** Sistem validasi dinamis yang mencegah pencatatan pengeluaran melebihi total saldo aktif (*over-budget prevention*). Kalkulator saldo otomatis melakukan penyesuaian kompensasi nominal lama secara adil saat mode edit transaksi.
*   **📈 Dynamic Time-Travel Navigation & Trends:** Fitur filter waktu reaktif (Tahunan, Bulanan, Harian) untuk melihat riwayat transaksi masa lalu atau rencana masa depan, dilengkapi indikator persentase pertumbuhan (*trend indicators*) dinamis dibandingkan periode sebelumnya.
*   **📱 Responsive Hybrid Layout & Interactive Mockups:** Desain antarmuka *mobile-first* yang adaptif. Menampilkan *mockup desktop OS* di layar lebar dan *mockup smartphone* interaktif yang bisa di-scroll secara vertikal di layar HP. 
*   **🇮🇩 Full Localization & UX Polish:** Antarmuka aplikasi menggunakan Bahasa Indonesia yang ramah pengguna dengan penanganan error sistem Supabase yang telah diterjemahkan secara rapi dan representatif.

---

## 🛠️ Core Tech Stack

*   **Framework:** Nuxt 4 (Vue 3 Composition API - Struktur folder `app/`)
*   **UI Components:** Nuxt UI v3 (Kompak & Aksesibel)
*   **Styling:** Tailwind CSS v4 (Sistem utility-first yang super cepat)
*   **BaaS/Database:** Supabase (@nuxtjs/supabase dengan PostgreSQL)
*   **Schema Validation:** Zod (Validasi formulir transaksi sisi klien)
*   **Date Utility:** Date-fns (Dukungan penuh pelokalan format penanggalan Indonesia `locale: id`)

---

## 💾 Skema Database & Row-Level Security (RLS)

Aplikasi ini menggunakan tabel `transactions` pada Supabase dengan skema keamanan DDL sebagai berikut:

```sql
-- Pembuatan Tabel Transaksi
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null,
  amount numeric not null,
  type text not null, -- 'income' atau 'expense'
  user_id uuid default auth.uid() not null -- Auto-assign user_id dari auth.uid() Supabase
);

-- Mengaktifkan Kebijakan Keamanan Row-Level Security (RLS)
alter table transactions enable row level security;

-- Kebijakan RLS: Pengguna hanya dapat memanipulasi data miliknya sendiri
create policy "Users can only access their own transactions"
on transactions for all
using (auth.uid() = user_id);

---

## 📂 Struktur Proyek (Nuxt 4 Structure)

├── app/
│   ├── assets/          # Global CSS & Konfigurasi Tailwind v4
│   ├── components/      # Komponen UI Reusable (Header, Trend, Transaction, Modal)
│   ├── composables/     # Logika Bisnis Reaktif (useFetchTransactions, useCurrency)
│   ├── layouts/         # Layout Wrapper Default (px-4 aman untuk Mobile)
│   ├── middleware/      # Global Auth Route Guard
│   ├── pages/           # Halaman Utama (Index, Dashboard, Login, Confirm)
│   └── utils/           # Konstanta Aplikasi
├── public/              # Aset Statis (Favicon, Mockup Gambar Laptop & HP)
├── .env                 # Variabel Lingkungan Supabase
├── nuxt.config.ts       # Konfigurasi Modul Nuxt & Supabase
└── package.json         # Dependensi Proyek

## 🚀 Setup & Installation

1. Make sure to install dependencies before running the application:

```bash
# npm (Recommended)
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install

```

2. Install Dependencies 
Ini akan menginstal semua library utama termasuk date-fns, zod, nuxt-ui, dan supabase-module:

```bash
# Atau jika ingin menginstal manual satu per satu:
npm install @nuxt/ui date-fns zod @nuxtjs/supabase

```

## 🔐 Environment Variables
Create a .env file in the root directory and configure your Supabase credentials:
```bash
NUXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"

NUXT_PUBLIC_SUPABASE_KEY="<your_publishable_key>"

```

## 💻 Development Server
Start the development server on http://localhost:3000:
```bash
# npm (Recommended)
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev

```

## 📦 Production
Build the application for production:
```bash
# npm (Recommended)
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build

```

## Locally preview the production build:
```bash
# npm (Recommended)
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview

```

## 📂 Project Structure (Nuxt 4)

* app/composables/: Core logic (useFetchTransactions, useSelectedTimePeriod).
* app/components/: Reusable UI (Trend, TransactionModal, Transaction).
* app/utils/: Constants and shared helper functions.
* app/pages/: Main application views.