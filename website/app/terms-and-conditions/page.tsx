import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Terms and Conditions for the Pet Evolution Arena mobile application.",
};

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5">
                        <span className="text-secondary text-xs font-semibold uppercase tracking-wider">
                            Legal
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        Terms & Conditions
                    </h1>
                    <p className="text-text-muted">Last updated: July 8, 2025</p>
                </div>

                {/* Content */}
                <div className="space-y-10">
                    <section className="space-y-4">
                        <p className="text-text-muted leading-relaxed">
                            Welcome to Pet Evolution Arena. By downloading, installing, or
                            using our mobile application, you agree to be bound by these Terms
                            and Conditions. If you do not agree, please do not use the app.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                                1
                            </span>
                            Terms of Use
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                By accessing or using Pet Evolution Arena, you acknowledge that
                                you have read, understood, and agree to these terms. The app is
                                provided for personal, non-commercial entertainment purposes.
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        You must be at least 13 years old to use this application.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        The app does not require account creation. All game data is
                                        stored locally on your device.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        We reserve the right to modify, suspend, or discontinue the
                                        app at any time without prior notice.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-sm">
                                2
                            </span>
                            User Responsibilities
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                As a user of Pet Evolution Arena, you agree to the following:
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        You will not use the app for any unlawful or prohibited
                                        purpose.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        You will not attempt to exploit, hack, reverse-engineer, or
                                        manipulate the app or its systems.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        You will not use bots, scripts, or automated tools to
                                        interact with the application.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        You will not attempt to manipulate or tamper with local game
                                        data to gain an unfair advantage.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-sm">
                                3
                            </span>
                            Intellectual Property
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                All content within Pet Evolution Arena — including but not
                                limited to graphics, designs, text, characters, animations,
                                sound effects, game mechanics, and software code — is the
                                exclusive property of Pet Evolution Arena and is protected by
                                applicable intellectual property laws.
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span>
                                        You may not copy, modify, distribute, sell, or create
                                        derivative works based on any part of the application.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span>
                                        All trademarks, logos, and service marks displayed in the
                                        app are our registered or unregistered trademarks.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span>
                                        Your use of the app does not grant you any ownership rights
                                        to any content or intellectual property.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                                4
                            </span>
                            In-App Purchases
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                Pet Evolution Arena offers optional in-app purchases including
                                virtual currencies (coins and gems), food items, pet skins, and
                                a VIP subscription.
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        All purchases are processed through Google Play or the Apple
                                        App Store and are subject to their respective terms.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        In-app purchases are non-refundable unless required by
                                        applicable law. Refund requests should be directed to the
                                        respective app store.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        Virtual currencies and items have no real-world monetary
                                        value and cannot be exchanged, transferred, or redeemed for
                                        real currency.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        VIP subscriptions renew automatically unless cancelled
                                        before the renewal date through your app store account
                                        settings.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-sm">
                                5
                            </span>
                            Local Data & Data Loss
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                All game progress, pets, inventory, and settings are stored
                                locally on your device. We do not maintain cloud backups or
                                remote copies of your game data.
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        Uninstalling the app or clearing app data will permanently
                                        delete your game progress.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        We are not responsible for data loss due to device failure,
                                        app uninstallation, or any other cause.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        Previously purchased items may be restored through the app
                                        store&apos;s purchase restoration feature where supported.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-sm">
                                6
                            </span>
                            Limitation of Liability
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5">
                            <p className="text-text-muted leading-relaxed">
                                To the fullest extent permitted by applicable law, Pet Evolution
                                Arena and its developers, officers, employees, and affiliates
                                shall not be liable for any indirect, incidental, special,
                                consequential, or punitive damages arising from your use of the
                                app, including but not limited to loss of data, loss of virtual
                                items, or interruption of service. The app is provided &quot;as
                                is&quot; and &quot;as available&quot; without warranties of any
                                kind, either express or implied.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                                7
                            </span>
                            Changes to Terms
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5">
                            <p className="text-text-muted leading-relaxed">
                                We reserve the right to update or modify these Terms and
                                Conditions at any time. Changes will be effective immediately
                                upon posting. Your continued use of the app after changes are
                                posted constitutes your acceptance of the updated terms. We
                                encourage you to review these terms periodically.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-sm">
                                8
                            </span>
                            Contact Us
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5">
                            <p className="text-text-muted leading-relaxed">
                                If you have any questions about these Terms and Conditions,
                                please contact us:
                            </p>
                            <div className="mt-4 p-4 bg-surface-light rounded-xl">
                                <p className="text-text font-semibold">Pet Evolution Arena</p>
                                <p className="text-text-muted text-sm mt-1">
                                    Email: ik8052218@gmail.com
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
