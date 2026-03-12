const steps = [
    {
        step: "01",
        icon: "🥚",
        title: "Hatch Your Pet",
        description:
            "Choose from Dogs, Dragons, Aliens, or Tigers. Each pet starts as an egg with unique base stats waiting to be unlocked.",
        color: "primary" as const,
    },
    {
        step: "02",
        icon: "🍖",
        title: "Feed & Train",
        description:
            "Nurture your pet with food, complete training sessions, and watch their stats grow. Every action earns XP toward the next evolution.",
        color: "secondary" as const,
    },
    {
        step: "03",
        icon: "✨",
        title: "Evolve & Transform",
        description:
            "Hit evolution milestones to transform your pet from Baby to Teen, Adult, and finally Legendary — each stage with a massive power boost.",
        color: "accent" as const,
    },
    {
        step: "04",
        icon: "⚔️",
        title: "Battle & Dominate",
        description:
            "Enter the arena and battle other players' pets. Use strategic attacks, special abilities, and earned rewards to climb the ranks.",
        color: "primary" as const,
    },
];

const colorClasses = {
    primary: {
        badge: "bg-primary/10 text-primary border-primary/20",
        icon: "bg-primary/15 border-primary/20",
        line: "from-primary/50",
    },
    secondary: {
        badge: "bg-secondary/10 text-secondary border-secondary/20",
        icon: "bg-secondary/15 border-secondary/20",
        line: "from-secondary/50",
    },
    accent: {
        badge: "bg-accent/10 text-accent border-accent/20",
        icon: "bg-accent/15 border-accent/20",
        line: "from-accent/50",
    },
};

export default function HowItWorksSection() {
    return (
        <section className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                            How It Works
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Your Journey to{" "}
                        <span className="text-primary">Legendary</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        From humble egg to arena champion — here&#39;s how the adventure
                        unfolds.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => {
                            const colors = colorClasses[step.color];
                            return (
                                <div key={index} className="relative text-center group">
                                    {/* Step number badge */}
                                    <div
                                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold mb-6 ${colors.badge}`}
                                    >
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className={`w-20 h-20 ${colors.icon} border rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <span className="text-4xl">{step.icon}</span>
                                    </div>

                                    <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
