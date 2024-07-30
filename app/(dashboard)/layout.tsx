import HomeComponent from "@/components/HomeComponent";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Authentication - ECMS Admin",
    description: "Sign up or log in to ECMS Admin",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
           <div className="px-2 md:px-[10%] w-full">
            {children}
           </div>
        </>
    );
}