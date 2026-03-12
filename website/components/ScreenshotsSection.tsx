const screenshots = [
    {
        title: "Home Dashboard",
        description: "Manage your pet, track stats, and access daily quests",
        emoji: "🏠",
        preview: {
            petName: "Thunder Tiger",
            stage: "Adult",
            level: 15,
            stats: { hp: 85, atk: 75, spd: 90, def: 70 },
        },
    },
    {
        title: "Evolution Screen",
        description: "Watch your pet transform through 5 epic stages",
        emoji: "✨",
        preview: {
            petName: "Crystal Alien",
            stage: "Legendary",
            level: 30,
            stats: { hp: 95, atk: 90, spd: 100, def: 80 },
        },
    },
    {
        title: "Battle Arena",
        description: "Intense PvP battles with strategic combat mechanics",
        emoji: "⚔️",
        preview: {
            petName: "Flame Dragon",
            stage: "Adult",
            level: 20,
            stats: { hp: 100, atk: 95, spd: 60, def: 85 },
        },
    },
    {
        title: "Item Shop",
        description: "Collect skins, food packs, and gem bundles",
        emoji: "🛒",
        preview: {
            petName: "Royal Dog",
            stage: "Teen",
            level: 10,
            stats: { hp: 70, atk: 55, spd: 65, def: 60 },
        },
    },
];

const statColors: Record<string, string> = {
    hp: "bg-success",
    atk: "bg-primary",
    spd: "bg-secondary",
    def: "bg-accent",
};

export default function ScreenshotsSection() {
    return (
        <section className="py-20 sm:py-28 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 left-0 right-0 section-divider" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 -left-48 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-48 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5">
                        <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                            Screenshots
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        See the <span className="text-accent">Action</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        Get a glimpse of the epic gameplay that awaits you. Every screen is
                        designed for maximum immersion.
                    </p>
                </div>

                {/* Screenshots grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {screenshots.map((screen, index) => (
                        <div key={index} className="group card-hover">
                            {/* Phone frame */}
                            <div className="phone-mockup rounded-[1.8rem] p-2">
                                <div className="bg-background rounded-[1.5rem] overflow-hidden aspect-[9/16] flex flex-col items-center justify-center p-4 space-y-4">
                                    {/* Top bar */}
                                    <div className="w-full flex items-center justify-between">
                                        <span className="text-[9px] text-text-muted font-medium">
                                            {screen.title}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px]">🪙 1,250</span>
                                            <span className="text-[9px]">💎 85</span>
                                        </div>
                                    </div>

                                    {/* Pet display */}
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-3xl">{screen.emoji}</span>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-1">
                                        <h4 className="font-bold text-sm">
                                            {screen.preview.petName}
                                        </h4>
                                        <div className="flex items-center gap-1.5 justify-center">
                                            <span className="bg-accent/20 text-accent text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                                {screen.preview.stage}
                                            </span>
                                            <span className="text-text-muted text-[9px]">
                                                Lv. {screen.preview.level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="w-full space-y-2">
                                        {Object.entries(screen.preview.stats).map(
                                            ([key, value]) => (
                                                <div key={key} className="flex items-center gap-1.5">
                                                    <span className="text-[8px] text-text-muted w-6 font-semibold uppercase">
                                                        {key}
                                                    </span>
                                                    <div className="flex-1 h-1 bg-surface-light rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${statColors[key]} rounded-full transition-all duration-500`}
                                                            style={{ width: `${value}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Bottom nav mockup */}
                                    <div className="w-full mt-auto flex justify-around pt-2 border-t border-white/5">
                                        {["🏠", "🐾", "⚔️", "🛒"].map((icon, i) => (
                                            <span
                                                key={i}
                                                className={`text-sm ${i === index ? "opacity-100" : "opacity-30"}`}
                                            >
                                                {icon}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="mt-4 text-center">
                                <h3 className="font-bold text-sm">{screen.title}</h3>
                                <p className="text-text-muted text-xs mt-1">
                                    {screen.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 section-divider" />
        </section>
    );
}
