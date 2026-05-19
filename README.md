# 📊 Nuxt 4 Finance Tracker (Skripsi Project)

A fullstack personal finance management application designed to track incomes, expenses, and financial liquidity with period-over-period analytics.

![Tech Stack](https://img.shields.io/badge/Nuxt_4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Nuxt_UI-v3-blue?style=for-the-badge&logo=nuxt.js](https://img.shields.io/badge/Nuxt_UI_v3-4ADE80?style=for-the-badge&logo=nuxt.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind_v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Key Features
**💰 Automated Accounting:** Real-time calculation of Income, Expenses, Savings, and "Cash on Hand" (All-time liquidity).
**📅 Time-Travel Navigation:** Navigate through daily, monthly, and yearly periods to manage past or future transactions.
**📈 Smart Trends:** Dynamic visual indicators (colors & icons) that compare performance against previous periods.
**🛡️ Secure Validation:** Robust form handling using **Zod** schema validation and **Nuxt UI** components.
**🔗 Real-time Backend:** Seamless synchronization with **Supabase** (PostgreSQL) for data persistence.

---

## 🛠️ Core Tech Stack
**Framework:** Nuxt 4 (Structure `app/`)
**UI Components:** Nuxt UI v3/v4 (API Modern)
**Styling:** Tailwind CSS v4 (CSS-first)
**Database:** Supabase (@nuxtjs/supabase)
**Validation:** Zod (Schema-based validation)
**Utilities:** Date-fns (Complex date manipulation)

---

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