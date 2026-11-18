# CaloLens 🥗📸

> **Next-Gen AI Food & Nutrition Estimator**  
> Snap or upload any meal photo to get instant, AI-powered nutritional estimates, portion sizes, calories, and macronutrient breakdowns in a warm, premium visual experience.

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini Vision](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?style=flat&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ⚠️ Important Nutritional & Medical Disclaimer

**All calorie and nutrient values provided by CaloLens are visual approximations.**  
- Computer vision analysis cannot detect exact cooking oils, hidden sodium, specific brand recipes, or interior portion density.
- **CaloLens is NOT medical advice** and must not be used for medical dietary planning, clinical treatment, or managing critical medical conditions.

---

## 🎨 Distinctive Visual Design System

CaloLens features an authoritative, appetizing visual identity crafted with warm orange, ivory, and deep-red tones, paired with bold condensed display typography:

### Color Palette Tokens
| Token | Hex | Role |
|---|---|---|
| **Cream Background** | `#FFF8EC` | Primary page canvas |
| **Warm Ivory** | `#FFF3DF` | Elevated card surfaces and containers |
| **Main Warm Orange** | `#FF990F` | Brand badges, primary highlights, and energy accents |
| **Bright Orange** | `#FFA82F` | Hover accents and gradient highlights |
| **Light Orange** | `#FFE1AC` | Soft container borders and dividers |
| **Deep Burnt Red** | `#8D240D` | Headlines, titles, and key metrics |
| **Primary Strong Red** | `#B30D08` | Primary CTA buttons and high-priority actions |
| **Golden Yellow** | `#FFC84B` | Secondary indicators, macro bars, and tags |
| **Primary Text** | `#65230F` | Warm dark-brown body text |
| **Secondary Text** | `#8E513F` | Muted descriptions and secondary labels |

### Typography & Component Styling
- **Display Typography**: **Barlow Condensed** (with Oswald / Impact fallbacks) — bold, condensed, uppercase tracking for headlines and numerical metrics.
- **Body Font**: **Plus Jakarta Sans** — warm, clean, readable sans-serif for descriptions and controls.
- **Card Anatomy**: Generously rounded corners (`rounded-3xl` and `rounded-2xl`), subtle borders (`#FFE1AC`), and soft warm elevation shadows (`shadow-warm`).
- **Pill Controls**: Soft pill buttons (`rounded-full`) for high-contrast primary actions (`#B30D08`) and warm secondary actions.

---

## ✨ Features

- 📸 **Live AI Food & Plate Scanning**: Take a live photo on mobile or upload an image on desktop with automatic client-side canvas compression.
- ⚡ **Resilient Gemini Vision Cascade**: Server-side multimodal vision powered primarily by `gemini-2.5-flash-lite`, with automatic fallback to `gemini-3.8-flash` and `gemini-flash-latest`.
- ✏️ **Manual Meal & Portion Adjuster**: In-line editing to rename meals, adjust ingredient portions, add missing sides, or delete items — with **real-time automatic recalculation** of total calories and macronutrients.
- 🎯 **Daily Nutrition Goals Tracker**: Interactive daily progress bar comparing consumed calories against personal targets, with real-time remaining calorie alerts and macro bars (Protein, Carbs, Fat).
- 🏷️ **Meal Categorization**: Auto-suggests and allows manual tagging for **Breakfast**, **Lunch**, **Dinner**, and **Snack**.
- 📅 **Date-Grouped Meal History**: Chronological log organized under **Today**, **Yesterday**, and calendar dates, with daily cumulative calorie headers and personal notes editing.
- 🔬 **USDA FoodData Central Integration**: Automatically cross-references detected food items with USDA reference standards (per 100g values) for grounded nutritional accuracy.
- 📱 **Mobile & Desktop Responsive**: Native mobile camera capture (`capture="environment"`), floating bottom mobile navigation bar, and multi-column desktop layout.
- 🧪 **Offline Sample Mode**: Toggle sample data anytime to test the complete estimation and saving flow without consuming API quota.
- 📊 **In-App Data Sources Registry**: Collapsible transparency panel mapping active and benchmark data sources directly from [`SOURCES.md`](SOURCES.md).

---

## 🚀 Quickstart & Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20+` or `v24` recommended)
- **npm** (or `pnpm` / `yarn`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/prathamesh55-MAV239/CaloLens.git
cd CaloLens
npm install
```
*(On Windows PowerShell, use `npm.cmd install` if script execution policy is restricted).*

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
# Google Gemini API Key for Server-Side AI Vision Analysis
# Obtain your key from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key

# (Optional) USDA FoodData Central API Key for nutritional cross-referencing
# Obtain your key from: https://fdc.nal.usda.gov/api-key-signup.html
USDA_API_KEY=your_usda_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security Note:** `.env.local` is gitignored. Never commit real API keys to version control. Set environment variables directly in your hosting provider's dashboard (e.g., Vercel, Netlify).

### 3. Run Development Server
```bash
npm run dev
# or on Windows PowerShell:
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Development & Release Workflow

CaloLens follows a disciplined, thin end-to-end iteration loop:

```
Make a small change ➔ Test locally ➔ Open a PR ➔ Preview deployment ➔ Merge to main ➔ Check live app
```

1. **Feature Branches**: Create a branch for each change (`git checkout -b feature/<name>`).
2. **Local Verification**: Run linting and production build checks:
   ```bash
   npm run lint
   npm run build
   ```
3. **Pull Request & Preview**: Open a PR on GitHub to trigger automated preview deployments on Vercel/Netlify.
4. **Merge & Live Smoke Check**: Merge to `main`, verify production deployment, and confirm photo upload, live estimation, editing, and history persistence.

---

## 📂 Project Architecture

```
CaloLens/
├── SOURCES.md                         # Data source & license registry
├── src/
│   ├── app/
│   │   ├── api/analyze-meal/route.ts  # Server-side Gemini Vision + USDA API route
│   │   ├── globals.css                # Warm palette, typography, and utility styling
│   │   ├── layout.tsx                 # Root layout with Google font preloads & metadata
│   │   └── page.tsx                   # Main orchestrator (hero, scan, history, mobile nav)
│   ├── components/
│   │   ├── DailyGoalTracker.tsx       # Daily calorie & macro target card with modal editor
│   │   ├── DataSourcesBadge.tsx       # Collapsible data source attribution panel
│   │   ├── DisclaimerBanner.tsx       # Non-medical advice disclaimer banners
│   │   ├── ImageUploader.tsx          # Camera capture, file upload, & sample mode
│   │   ├── MealHistory.tsx            # Date-grouped meal timeline, notes modal & filters
│   │   ├── MealNutritionCard.tsx      # Calories, macro bars, in-line editor & USDA badges
│   │   └── Navbar.tsx                 # Warm ivory sticky header with pill navigation
│   ├── lib/
│   │   ├── dataSources.ts             # Registry mapping models from SOURCES.md
│   │   ├── mockData.ts                # Offline sample dish dataset
│   │   ├── storage.ts                 # Local storage persistence & daily statistics
│   │   └── usda.ts                    # USDA FoodData Central API client
│   └── types/
│       └── meal.ts                    # TypeScript domain definitions
├── .env.example                       # Environment template
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Custom Envato design system tokens & fonts
└── README.md                          # Documentation
```

---

## 🔬 Data Sources & Models Registry

CaloLens maintains a strict source and license registry in [`SOURCES.md`](SOURCES.md).

### Active in Production

| Source | Role | Status |
|---|---|---|
| **Google Gemini Vision** (`gemini-2.5-flash-lite`, `gemini-3.8-flash`) | Multimodal food identification, portion estimation, and macronutrient breakdown | ✅ Active |
| **USDA FoodData Central** | Standard government reference database for per-100g calorie and nutrient cross-referencing | ✅ Active (Approved) |

### Evaluation & Benchmark Catalog

| Source | Role | Status |
|---|---|---|
| **Food-101** | Dish recognition baseline dataset (101 categories) | 🔬 Evaluation |
| **UECFood-256** | Japanese dish recognition benchmark (256 categories) | 🔬 Evaluation |
| **Nutrition5k** | Calorie and macronutrient estimation benchmark | 🔬 Evaluation |
| **Open Food Facts** | OCR and layout experiments for packaged food labels | 🔬 Evaluation |
| **January/food-vision-v1** | Baseline food vision model for benchmark comparison | 🔬 Evaluation |
| **AI4Food-NutritionDB, OmniFood8K, FooDD** | Future evaluation references | ⏸️ Hold |

> For licensing terms, commercial-use determinations, and legal requirements, consult [`SOURCES.md`](SOURCES.md).

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
