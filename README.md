# 📊 Nuxt 4 Finance Tracker (Skripsi Project)

A fullstack personal finance management application designed to track incomes, expenses, and financial trends dynamically. Built with a modern tech stack focusing on performance, clean architecture, and seamless user experience.

![Tech Stack](https://img.shields.io/badge/Nuxt_4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind_v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Key Features
* **💰 Transaction Management:** Add, Read, and Delete transactions with Supabase backend. Transactions are automatically grouped by date with calculated daily totals.
* **📈 Dynamic Analytics:** Visual trend indicators showing percentage comparisons between current and previous periods (Daily, Weekly, Monthly, Yearly).
* **🎨 Modern UI/UX:** Built with CSS-first Tailwind v4 architecture, featuring interactive loading spinners, toast notifications, and centralized modal forms with built-in validation.

---

## 🚀 Setup & Installation

Make sure to install dependencies before running the application:

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

## 🔐 Environment Variables
Create a .env file in the root directory and configure your Supabase credentials:
```bash
SUPABASE_URL="your-supabase-project-url"

SUPABASE_KEY="your-supabase-anon-key"

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