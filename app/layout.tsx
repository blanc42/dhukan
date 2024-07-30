import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { StoreModal } from "@/components/modals/storeModal";
import HomeComponent from "@/components/HomeComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ecms admin",
  description: "an ecommerce cms client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HomeComponent>
          <StoreModal />
          {children}
        </HomeComponent>
      </body>
    </html>
  );
}
