"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-surface/95 backdrop-blur-md shadow-lg shadow-black/20"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <span className="text-xl">🐾</span>
                        </div>
                        <span className="text-lg font-bold text-text hidden sm:block">
                            Pet Evolution <span className="text-primary">Arena</span>
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-text-muted hover:text-text transition-colors text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href="#download"
                            className="bg-primary hover:bg-primary-dark text-text text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                        >
                            Download
                        </a>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-text transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-text transition-all duration-300 ${mobileOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-text transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="bg-surface/95 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 text-text-muted hover:text-text hover:bg-surface-light/50 rounded-xl transition-colors text-sm font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href="#download"
                        onClick={() => setMobileOpen(false)}
                        className="block mx-4 mt-3 bg-primary hover:bg-primary-dark text-text text-sm font-bold px-5 py-3 rounded-xl text-center transition-colors"
                    >
                        Download Now
                    </a>
                </div>
            </div>
        </nav>
    );
}
