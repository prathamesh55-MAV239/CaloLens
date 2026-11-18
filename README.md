# CaloLens 🥗📸

> **AI-Powered Meal & Nutrition Estimator**  
> Snap a photo of your meal to get instant, AI-generated estimates of food items, portion sizes, calories, and macronutrient breakdowns.

---

## ⚠️ Important Nutritional & Medical Disclaimer

**All calorie and nutrient values provided by CaloLens are visual approximations.**  
- Computer vision analysis cannot detect exact cooking oils, hidden sodium, specific brand recipes, or interior portion density.
- **CaloLens is NOT medical advice** and must not be used for medical dietary planning, clinical treatment, or managing critical medical conditions.

---

## ✨ Features (MVP)

- 📸 **Smart Image & Camera Capture**: Upload or take live food photos on mobile or desktop with automatic client-side image compression.
- 🧪 **Sample Testing Mode**: Test the complete estimation, saving, and history workflow instantly without consuming API credits.
- ⚡ **AI Vision Analysis**: Identifies dishes, portion estimates, calorie approximations, and macronutrients (Protein, Carbs, Fat, Fiber) powered by Google Gemini Vision.
- ✏️ **Manual Meal & Portion Editing**: Tweak identified dish titles, add or remove ingredients, and adjust calories/macros before saving with automatic total recalculation.
- 🎯 **Daily Nutrition Goals Tracker**: Set personal daily targets for calories, protein, carbs, and fat with real-time remaining calorie indicators.
- 🏷️ **Meal Categorization**: Categorize entries into Breakfast, Lunch, Dinner, and Snack with date-grouped timeline views.
- 🔬 **USDA Cross-Reference**: Optionally cross-checks AI estimates against USDA FoodData Central nutritional reference data (per 100g values) for grounded accuracy.
- 💾 **Local-First Meal History**: Save meals and review a chronological log of past dishes, nutritional breakdowns, personal notes, and timestamps.
- 📱 **Responsive Mobile-First UI**: Optimized for phones and desktops alike with quick navigation tabs and full item details.
- 📊 **Data Sources Transparency**: In-app collapsible panel showing all active models and data sources, with links to full source registry.

---

## 🚀 Quickstart & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ / v24 recommended)
- **npm** (or pnpm / yarn)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/prathamesh55-MAV239/CaloLens.git
cd CaloLens
npm install
```
*(On Windows PowerShell, use `npm.cmd install` if execution policy is restricted).*

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Get your Gemini API key from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key

# (Optional) USDA FoodData Central API key for cross-referencing nutrition data
# Get your key from: https://fdc.nal.usda.gov/api-key-signup.html
USDA_API_KEY=your_usda_api_key
```

> **Security Note:** Never commit `.env.local` or real API keys to Git. Keep real secrets in your deployment hosting provider's settings (e.g., Vercel, Netlify).

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

1. **Feature Branches**: Create a dedicated branch for each change (`git checkout -b feature/<name>`).
2. **Local Verification**: Run type-checks, lint, and build:
   ```bash
   npm run lint
   npm run build
   ```
3. **Pull Request & Preview**: Open a PR on GitHub. Test the automated preview deployment URL on both mobile and desktop.
4. **Merge & Live Smoke Check**: Merge to `main`, verify production deployment, and confirm photo upload, nutrition display, and history persistence.

---

## 📂 Project Structure

```
CaloLens/
├── SOURCES.md                         # Data source & license registry
├── src/
│   ├── app/
│   │   ├── api/analyze-meal/route.ts  # Server-side Gemini Vision + USDA API route
│   │   ├── globals.css                # Tailwind styling
│   │   ├── layout.tsx                 # Root layout with metadata
│   │   └── page.tsx                   # Main page orchestrating scan & history
│   ├── components/
│   │   ├── DataSourcesBadge.tsx       # Collapsible data source attribution panel
│   │   ├── DisclaimerBanner.tsx       # Mandatory non-medical advice banners
│   │   ├── ImageUploader.tsx          # Camera / photo upload & sample mode
│   │   ├── MealHistory.tsx            # Meal log, details modal & deletion
│   │   ├── MealNutritionCard.tsx      # Calories, macro bars, USDA refs & ingredient table
│   │   └── Navbar.tsx                 # Sticky navigation header
│   ├── lib/
│   │   ├── dataSources.ts             # All models & datasets from SOURCES.md
│   │   ├── mockData.ts                # Offline sample meal dataset
│   │   ├── storage.ts                 # Local storage persistence
│   │   └── usda.ts                    # USDA FoodData Central API client
│   └── types/
│       └── meal.ts                    # TypeScript domain definitions
├── .env.example                       # Environment template
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind configuration
└── README.md                          # Documentation
```

---

## 🔬 Data Sources & Models

CaloLens uses a structured source registry ([`SOURCES.md`](SOURCES.md)) to track all models, datasets, and data providers. Each source has a documented license status and MVP approval decision.

### Active in MVP

| Source | Role | Status |
|---|---|---|
| **Google Gemini Vision** (`gemini-1.5-flash`) | Primary AI model for food recognition, portion estimation, and nutritional breakdown | ✅ Active |
| **USDA FoodData Central** | Government nutrition reference database for cross-referencing calorie and macronutrient estimates | ✅ Active (Approved) |

### Evaluation & Future Sources

| Source | Role | Status |
|---|---|---|
| Food-101 | Dish recognition baseline (101 categories) | 🔬 Evaluation |
| UECFood-256 | Japanese dish recognition benchmark (256 categories) | 🔬 Evaluation |
| Nutrition5k | Calorie/macronutrient benchmark | 🔬 Evaluation |
| Open Food Facts | OCR/layout experiments for packaged food labels | 🔬 Evaluation |
| January/food-vision-v1 | Baseline food vision model | 🔬 Evaluation |
| AI4Food-NutritionDB, OmniFood8K, FooDD | Future benchmarks | ⏸️ Hold |

> See [`SOURCES.md`](SOURCES.md) for the full registry with links, license terms, and legal review requirements.

---

## 📄 License
MIT License - see [LICENSE](LICENSE) for details.
