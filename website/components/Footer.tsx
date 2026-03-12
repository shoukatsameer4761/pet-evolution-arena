import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <span className="text-xl">🐾</span>
                            </div>
                            <span className="text-lg font-bold text-text">
                                Pet Evolution <span className="text-primary">Arena</span>
                            </span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                            Hatch, evolve, and battle your pets in the ultimate evolution
                            arena. The adventure awaits!
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                            Links
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-text-muted hover:text-text transition-colors text-sm"
                            >
                                Home
                            </Link>
                            <Link
                                href="/privacy-policy"
                                className="text-text-muted hover:text-text transition-colors text-sm"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms-and-conditions"
                                className="text-text-muted hover:text-text transition-colors text-sm"
                            >
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>

                    {/* Download */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                            Get the App
                        </h3>
                        <div className="flex flex-col gap-3">
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 bg-surface-light hover:bg-surface-light/80 rounded-xl px-4 py-3 transition-colors w-fit"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 text-text"
                                    fill="currentColor"
                                >
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
                                </svg>
                                <div>
                                    <div className="text-[10px] text-text-muted leading-none">
                                        GET IT ON
                                    </div>
                                    <div className="text-sm font-semibold text-text">
                                        Google Play
                                    </div>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 bg-surface-light hover:bg-surface-light/80 rounded-xl px-4 py-3 transition-colors w-fit"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 text-text"
                                    fill="currentColor"
                                >
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div>
                                    <div className="text-[10px] text-text-muted leading-none">
                                        Download on the
                                    </div>
                                    <div className="text-sm font-semibold text-text">
                                        App Store
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="section-divider mt-10 mb-6" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-xs">
                    <p>&copy; {currentYear} Pet Evolution Arena. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-text transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms-and-conditions"
                            className="hover:text-text transition-colors"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
