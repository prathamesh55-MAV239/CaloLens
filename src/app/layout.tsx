import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaloLens | AI-Powered Food & Nutrition Estimator",
  description:
    "Snap a photo of your meal to get instant, AI-powered nutritional estimates, portion sizes, calories, and macronutrient breakdowns in a warm, premium experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF8EC] text-[#65230F] antialiased selection:bg-[#B30D08] selection:text-white">
        {children}
      </body>
    </html>
  );
}
