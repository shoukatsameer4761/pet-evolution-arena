export default function CTASection() {
    return (
        <section className="py-20 sm:py-28 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-surface border border-white/5 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-tl-full" />

                    <div className="relative space-y-6">
                        <div className="flex justify-center gap-2 text-4xl">
                            <span className="animate-float" style={{ animationDelay: "0s" }}>
                                🐲
                            </span>
                            <span
                                className="animate-float"
                                style={{ animationDelay: "0.3s" }}
                            >
                                🐕
                            </span>
                            <span
                                className="animate-float"
                                style={{ animationDelay: "0.6s" }}
                            >
                                👽
                            </span>
                            <span
                                className="animate-float"
                                style={{ animationDelay: "0.9s" }}
                            >
                                🐯
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                            Ready to Begin Your{" "}
                            <span className="gradient-text">Evolution?</span>
                        </h2>

                        <p className="text-text-muted text-lg max-w-xl mx-auto">
                            Join thousands of trainers already battling in the arena. Your
                            legendary pet is waiting to be hatched!
                        </p>

                        {/* Download buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <a
                                href="#"
                                className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-text font-bold px-10 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 animate-pulse-glow"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    fill="currentColor"
                                >
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
                                </svg>
                                Download for Android
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center justify-center gap-3 bg-surface-light hover:bg-surface-light/80 border border-white/10 text-text font-bold px-10 py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    fill="currentColor"
                                >
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                Download for iOS
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
