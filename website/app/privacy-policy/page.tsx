import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy Policy for the Pet Evolution Arena mobile application.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                            Legal
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
                    <p className="text-text-muted">Last updated: July 8, 2025</p>
                </div>

                {/* Content */}
                <div className="space-y-10">
                    <section className="space-y-4">
                        <p className="text-text-muted leading-relaxed">
                            Pet Evolution Arena (&quot;we,&quot; &quot;us,&quot; or
                            &quot;our&quot;) is committed to protecting the privacy of our
                            users. This Privacy Policy explains what information is collected
                            when you use our mobile application and how it is handled.
                        </p>
                        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
                            <p className="text-secondary font-semibold mb-2">
                                Privacy-First Design
                            </p>
                            <p className="text-text-muted leading-relaxed text-sm">
                                Pet Evolution Arena does not require account creation, does not
                                collect personal information, and stores all game data locally
                                on your device. We do not operate servers that store your data.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                                1
                            </span>
                            Information We Do Not Collect
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                Pet Evolution Arena is designed with minimal data collection.
                                We do <strong className="text-text">not</strong> collect:
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">✓</span>
                                    <span>
                                        Names, email addresses, or any personal contact information
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">✓</span>
                                    <span>
                                        Usernames, passwords, or account credentials (no accounts
                                        exist)
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">✓</span>
                                    <span>Location data or GPS coordinates</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">✓</span>
                                    <span>
                                        Photos, contacts, or other device content
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
                            Local Data Storage
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                All game data — including your pets, progress, currency
                                balances, achievements, and settings — is stored locally on
                                your device using AsyncStorage. This data:
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Never leaves your device or is uploaded to our servers</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>
                                        Is deleted if you uninstall the app or clear app data
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Cannot be recovered by us if lost</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-sm">
                                3
                            </span>
                            Third-Party Services
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                The app uses the following third-party services which may
                                collect limited data as described:
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span>
                                        <strong className="text-text">
                                            RevenueCat
                                        </strong>{" "}
                                        — manages in-app purchases and subscriptions. RevenueCat
                                        collects an anonymous device identifier to track purchase
                                        entitlements. No personal information is shared. See the{" "}
                                        <a
                                            href="https://www.revenuecat.com/privacy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-secondary underline"
                                        >
                                            RevenueCat Privacy Policy
                                        </a>
                                        .
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span>
                                        <strong className="text-text">
                                            Google Play / Apple App Store
                                        </strong>{" "}
                                        — handle app distribution and payment processing for in-app
                                        purchases. These platforms have their own privacy policies
                                        governing purchase transactions.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-accent mt-1">•</span>
                                    <span>
                                        <strong className="text-text">
                                            Content Delivery Network (CDN)
                                        </strong>{" "}
                                        — pet images and game assets are loaded from a remote CDN.
                                        When loading these images, your device&apos;s IP address is
                                        visible to the CDN provider as part of standard internet
                                        communication. No personal data is transmitted.
                                    </span>
                                </li>
                            </ul>
                            <p className="text-text-muted leading-relaxed">
                                We do not use any analytics services, advertising networks, or
                                tracking technologies.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                                4
                            </span>
                            Device Permissions
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                Pet Evolution Arena requests the following device permissions:
                            </p>
                            <ul className="space-y-3 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong className="text-text">Internet Access</strong> —
                                        required to load game images from the CDN and process in-app
                                        purchases.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong className="text-text">Vibration</strong> — used for
                                        haptic feedback during gameplay (battles, evolutions).
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        <strong className="text-text">Billing</strong> — required
                                        for processing in-app purchases through the platform store.
                                    </span>
                                </li>
                            </ul>
                            <p className="text-text-muted leading-relaxed">
                                The app does not request access to your camera, microphone,
                                contacts, location, or any other sensitive device features.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-sm">
                                5
                            </span>
                            In-App Purchases
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                Pet Evolution Arena offers optional in-app purchases including
                                virtual currency (coins and gems), food items, pet skins, and a
                                VIP subscription. All payments are processed entirely through
                                Google Play or the Apple App Store — we never see or store your
                                payment details, credit card information, or billing address.
                            </p>
                            <p className="text-text-muted leading-relaxed">
                                Purchase entitlements are managed by RevenueCat using an
                                anonymous device identifier. Your purchase history is associated
                                with your platform store account (Google or Apple), not with any
                                data we collect.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-sm">
                                6
                            </span>
                            Children&apos;s Privacy
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
                            <p className="text-text-muted leading-relaxed">
                                Pet Evolution Arena does not knowingly collect personal
                                information from anyone, including children under the age of 13.
                                Since the app does not require account creation and stores all
                                data locally on the device, no personal information is
                                transmitted to us.
                            </p>
                            <p className="text-text-muted leading-relaxed">
                                Parents should be aware that the app contains optional in-app
                                purchases. We recommend enabling parental controls on your
                                device to manage purchase permissions.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-text flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                                7
                            </span>
                            Changes to This Policy
                        </h2>
                        <div className="bg-surface rounded-2xl p-6 border border-white/5">
                            <p className="text-text-muted leading-relaxed">
                                We may update this Privacy Policy from time to time. Any changes
                                will be posted on this page with an updated revision date. Your
                                continued use of the app after changes are posted constitutes
                                acceptance of the updated policy.
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
                                If you have any questions or concerns about this Privacy Policy,
                                please contact us at:
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
