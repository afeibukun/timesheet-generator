import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SE Timesheet Generator",
  description: "Creating SE NG Timesheet for me speedily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
