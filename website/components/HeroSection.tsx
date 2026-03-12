export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Text content */}
                    <div className="text-center lg:text-left space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                                Available Now
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                            Evolve, Battle &{" "}
                            <span className="gradient-text">Conquer</span>
                        </h1>

                        <p className="text-text-muted text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Hatch mysterious eggs, evolve powerful creatures, and battle your
                            way through the arena. Collect legendary pets and become the
                            ultimate champion!
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-accent">
                                    4+
                                </div>
                                <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                                    Pet Types
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-secondary">
                                    5
                                </div>
                                <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                                    Evolution Stages
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-primary">
                                    ∞
                                </div>
                                <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                                    Arena Battles
                                </div>
                            </div>
                        </div>

                        {/* Download buttons */}
                        <div
                            id="download"
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <a
                                href="#"
                                className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-text font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    fill="currentColor"
                                >
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
                                </svg>
                                Google Play
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center justify-center gap-3 bg-surface-light hover:bg-surface-light/80 border border-white/10 text-text font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    fill="currentColor"
                                >
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                App Store
                            </a>
                        </div>
                    </div>

                    {/* Hero visual - Phone mockup */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Glow ring */}
                            <div className="absolute inset-0 -m-8 bg-primary/10 rounded-full blur-2xl animate-pulse" />

                            {/* Phone frame */}
                            <div className="relative phone-mockup rounded-[2.5rem] p-3 w-[280px] sm:w-[300px]">
                                {/* Screen */}
                                <div className="bg-background rounded-[2rem] overflow-hidden aspect-[9/19.5] flex flex-col items-center justify-center p-6 space-y-6">
                                    {/* Mini app preview */}
                                    <div className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center animate-float">
                                        <span className="text-5xl">🐲</span>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="font-bold text-lg">Shadow Dragon</h3>
                                        <div className="flex items-center gap-2 justify-center">
                                            <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                                                Legendary
                                            </span>
                                            <span className="text-text-muted text-xs">Lv. 30</span>
                                        </div>
                                    </div>

                                    {/* Stats preview */}
                                    <div className="w-full space-y-3">
                                        {[
                                            {
                                                label: "HP",
                                                value: 240,
                                                max: 240,
                                                color: "bg-success",
                                            },
                                            {
                                                label: "ATK",
                                                value: 40,
                                                max: 50,
                                                color: "bg-primary",
                                            },
                                            {
                                                label: "SPD",
                                                value: 16,
                                                max: 30,
                                                color: "bg-secondary",
                                            },
                                            {
                                                label: "DEF",
                                                value: 30,
                                                max: 40,
                                                color: "bg-accent",
                                            },
                                        ].map((stat) => (
                                            <div key={stat.label} className="flex items-center gap-2">
                                                <span className="text-[10px] text-text-muted w-8 font-semibold">
                                                    {stat.label}
                                                </span>
                                                <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${stat.color} rounded-full`}
                                                        style={{
                                                            width: `${(stat.value / stat.max) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-text-muted w-8 text-right">
                                                    {stat.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 w-full">
                                        <div className="flex-1 bg-primary/20 text-primary text-[10px] font-bold rounded-lg py-2 text-center">
                                            ⚔️ Battle
                                        </div>
                                        <div className="flex-1 bg-secondary/20 text-secondary text-[10px] font-bold rounded-lg py-2 text-center">
                                            🍖 Feed
                                        </div>
                                        <div className="flex-1 bg-accent/20 text-accent text-[10px] font-bold rounded-lg py-2 text-center">
                                            ⬆️ Train
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
