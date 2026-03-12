const features = [
    {
        icon: "🥚",
        title: "Hatch & Collect",
        description:
            "Start your journey by hatching mysterious eggs. Discover dogs, dragons, aliens, and tigers — each with unique stats and abilities.",
        color: "primary" as const,
    },
    {
        icon: "⬆️",
        title: "Evolve & Grow",
        description:
            "Guide your pets through 5 evolution stages — from Egg to Legendary. Each stage unlocks new powers and dramatically boosts stats.",
        color: "secondary" as const,
    },
    {
        icon: "⚔️",
        title: "Arena Battles",
        description:
            "Challenge opponents in real-time arena battles. Use strategy, timing, and your pet's unique abilities to climb the leaderboard.",
        color: "accent" as const,
    },
    {
        icon: "🎯",
        title: "Daily Quests",
        description:
            "Complete daily quests and achievements to earn coins, gems, and rare food. Keep your login streak for bonus rewards!",
        color: "primary" as const,
    },
    {
        icon: "🎨",
        title: "Unique Skins",
        description:
            "Customize your pets with exclusive skins — Gold, Shadow, Crystal, Rainbow, and more. Stand out in every battle.",
        color: "secondary" as const,
    },
    {
        icon: "🏆",
        title: "Leaderboards",
        description:
            "Rise through the arena ranks and compete for the top spot. Earn exclusive rewards and prove you're the ultimate champion.",
        color: "accent" as const,
    },
];

const colorMap = {
    primary: {
        bg: "bg-primary/10",
        border: "border-primary/20",
        text: "text-primary",
        glow: "group-hover:shadow-primary/10",
    },
    secondary: {
        bg: "bg-secondary/10",
        border: "border-secondary/20",
        text: "text-secondary",
        glow: "group-hover:shadow-secondary/10",
    },
    accent: {
        bg: "bg-accent/10",
        border: "border-accent/20",
        text: "text-accent",
        glow: "group-hover:shadow-accent/10",
    },
};

export default function FeaturesSection() {
    return (
        <section className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5">
                        <span className="text-secondary text-xs font-semibold uppercase tracking-wider">
                            Features
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Everything You Need to{" "}
                        <span className="text-secondary">Dominate</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        Pet Evolution Arena packs powerful features into an addictive
                        gameplay loop that keeps you coming back for more.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const colors = colorMap[feature.color];
                        return (
                            <div
                                key={index}
                                className={`group bg-surface border border-white/5 rounded-2xl p-6 sm:p-8 card-hover hover:border-white/10 hover:shadow-2xl ${colors.glow}`}
                            >
                                <div
                                    className={`w-14 h-14 ${colors.bg} border ${colors.border} rounded-2xl flex items-center justify-center mb-5`}
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
