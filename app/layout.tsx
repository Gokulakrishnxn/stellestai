import type { Metadata } from "next";
import { DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stellest — Myopia Progression Intelligence",
  description: "Clinical decision support for myopia progression tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", dmSans.variable, "font-sans", geist.variable)}>
      <body className="h-full font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
