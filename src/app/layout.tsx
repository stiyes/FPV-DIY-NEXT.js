import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FPV穿越机部件数据库 | FPV Component Database",
  description: "专业的FPV穿越机部件数据库与装机配置平台 - 机架、电机、飞控、图传等全品类部件数据",
  keywords: ["FPV", "穿越机", "无人机", "机架", "电机", "飞控", "图传", "RC", "航模"],
  authors: [{ name: "FPV Database" }],
  openGraph: {
    title: "FPV穿越机部件数据库",
    description: "专业的FPV穿越机部件数据库与装机配置平台",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-[#e0e0e0] min-h-screen`}
      >
        {/* Background effects */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
        <div className="fixed inset-0 bg-binary pointer-events-none z-0 opacity-50" />
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
