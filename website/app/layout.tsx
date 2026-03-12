import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "Pet Evolution Arena — Evolve, Battle & Conquer",
        template: "%s | Pet Evolution Arena",
    },
    description:
        "Hatch mysterious eggs, evolve powerful creatures through 5 stages, and battle your way to legendary status. Collect dogs, dragons, aliens & tigers in the ultimate pet evolution game!",
    keywords: [
        "pet evolution game",
        "battle arena",
        "mobile game",
        "pet collection",
        "evolution game",
        "creature battle",
        "pet rpg",
    ],
    authors: [{ name: "Pet Evolution Arena" }],
    creator: "Pet Evolution Arena",
    metadataBase: new URL("https://pet-evolution-arena.vercel.app"),
    openGraph: {
        title: "Pet Evolution Arena — Evolve, Battle & Conquer",
        description:
            "Hatch mysterious eggs, evolve powerful creatures, and battle your way to legendary status.",
        url: "https://pet-evolution-arena.vercel.app",
        siteName: "Pet Evolution Arena",
        images: [
            {
                url: "/app-preview.png",
                width: 1200,
                height: 630,
                alt: "Pet Evolution Arena — Evolve, Battle & Conquer",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pet Evolution Arena — Evolve, Battle & Conquer",
        description:
            "Hatch mysterious eggs, evolve powerful creatures, and battle your way to legendary status.",
        images: ["/app-preview.png"],
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "32x32" },
            { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
        ],
        apple: "/apple-touch-icon.png",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="font-sans antialiased min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
