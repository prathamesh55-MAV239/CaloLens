import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaloLens | AI Meal & Nutrition Estimator",
  description: "Snap a photo of your meal to get instant, AI-powered nutritional estimates, portion sizes, and calorie breakdowns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
