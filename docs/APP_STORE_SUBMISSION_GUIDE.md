# Pet Evolution Arena — App Store Submission Guide

> First-time upload guide for Apple App Store (iOS) and Google Play Store (Android).

---

## Financial Features Declaration

### What to Select

**Select: "My app doesn't provide any financial features"**

### Why

Pet Evolution Arena is a standard mobile game with optional in-app purchases of virtual items. It does **not** provide any regulated financial services:

| Category | Applies? | Reason |
|---|---|---|
| Banking and loans | ❌ No | No banking, lending, or credit services |
| Payments and transfers | ❌ No | No digital wallet, no money transfers. IAPs are processed entirely by Apple/Google — not by the app |
| Purchase agreements (BNPL, rewards) | ❌ No | Virtual currencies (coins, gems) have no real-world monetary value, cannot be cashed out, and are not "rewards points" in the financial sense |
| Trading and funds (crypto, NFT, stocks) | ❌ No | No cryptocurrency, NFTs, stock trading, or crowdfunding |
| Support services (credit, insurance) | ❌ No | No credit monitoring, financial advice, or insurance |

### What the App Actually Does

- Sells **virtual game currency** (gems) and a **VIP subscription** via RevenueCat → App Store / Google Play native billing
- Virtual currencies (coins, gems, food) are **non-transferable**, have **no real-world value**, and **cannot be exchanged for real money**
- No peer-to-peer economy or user-to-user transfers exist
- All payment processing is handled by Apple/Google — the app never touches payment details

This is the same model used by games like Candy Crush, Clash of Clans, and Pokémon GO.

---

## Apple App Store (iOS) — Submission Checklist

### App Store Connect Setup

1. **App Information**
   - App Name: `Pet Evolution Arena`
   - Subtitle: `Evolve, Battle & Conquer`
   - Primary Language: English (U.S.)
   - Bundle ID: Match your `app.json` → `ios.bundleIdentifier`
   - SKU: `pet-evolution-arena` (any unique string)
   - Primary Category: **Games**
   - Secondary Category: **Simulation** or **Strategy**

2. **Age Rating Questionnaire**
   - Cartoon or Fantasy Violence: **Infrequent/Mild** (arena battles are stylized, no blood/gore)
   - Simulated Gambling: **None** (egg hatching is not gambling — no real money wagered on random outcomes for real-value items)
   - Unrestricted Web Access: **No**
   - All other categories: **None**
   - Expected rating: **4+** or **9+** (depending on Apple's assessment of battle violence)

3. **Pricing & In-App Purchases**
   - Price: **Free**
   - In-App Purchases: Yes — configure all products in App Store Connect:
     - Gem packs (consumable)
     - VIP Membership (auto-renewable subscription)
     - Daily Special bundles (consumable)
   - IAP Review Information: Provide a test flow description (e.g., "Tap Shop tab → Select gem pack → Purchase dialog appears")

4. **Privacy Declarations (App Privacy / Nutrition Labels)**

   **Data Not Collected** — select this option. Justification:

   - The app does not create user accounts
   - All game data is stored locally on-device (AsyncStorage)
   - No analytics, no ad networks, no tracking
   - RevenueCat collects an anonymous device identifier for purchase management — however, this is handled by the SDK at the platform level and is linked to the App Store account, not collected by *your* app

   If Apple requires you to declare RevenueCat's data collection:
   - Data Type: **Identifiers → Device ID**
   - Usage: **App Functionality** (purchase validation)
   - Linked to User: **No**
   - Tracking: **No**

5. **Content Rights**
   - You own or have rights to all content: **Yes**
   - Third-party content: Pet images loaded from CDN (you control)

6. **Export Compliance**
   - Does your app use encryption? **Yes** (HTTPS for CDN image loading and IAP communication)
   - Is it exempt? **Yes** — standard HTTPS/TLS only (no custom encryption)
   - Select: Uses standard encryption exempt from EAR

7. **Review Notes (for Apple Reviewer)**
   ```
   Pet Evolution Arena is a single-player pet simulation game. Players hatch 
   virtual pets, feed and train them, evolve them through 5 stages, and battle 
   AI opponents in an arena.
   
   - No account creation required — tap "Start" to begin playing immediately
   - In-app purchases are optional virtual currency (gems) and a VIP subscription
   - All game data is stored locally on the device
   - No multiplayer/social features
   - No real-money output — virtual currencies cannot be cashed out
   ```

8. **Required Screenshots**
   - 6.7" (iPhone 15 Pro Max): 1290 × 2796 px — at least 3 screenshots
   - 6.5" (iPhone 14 Plus): 1284 × 2778 px
   - 5.5" (iPhone 8 Plus): 1242 × 2208 px (if supporting older devices)
   - 12.9" iPad Pro: 2048 × 2732 px (if supporting iPad)

9. **App Icon**
   - 1024 × 1024 px, no alpha/transparency, no rounded corners (Apple applies them)

---

## Google Play Store (Android) — Submission Checklist

### Google Play Console Setup

1. **App Details**
   - App Name: `Pet Evolution Arena`
   - Short Description (80 chars): `Hatch, evolve, and battle legendary pets in the ultimate arena!`
   - Full Description (4000 chars): Feature-rich description covering hatching, evolution, battles, skins, shop, VIP
   - Category: **Game → Simulation** or **Game → Casual**
   - Tags: `pets`, `evolution`, `battle`, `simulation`, `idle`

2. **Content Rating (IARC Questionnaire)**
   - Violence: **Cartoon/Fantasy** (mild, stylized battles)
   - In-app purchases: **Yes**
   - User-generated content: **No**
   - Location sharing: **No**
   - Real gambling: **No**
   - Expected rating: **Everyone** or **Everyone 10+**

3. **Financial Features Declaration**
   - **Select: "My app doesn't provide any financial features"**
   - The in-app purchases are standard Play Store billing for virtual game items

4. **Data Safety Section**

   | Question | Answer |
   |---|---|
   | Does your app collect or share user data? | **No** (with caveat below) |
   | Does your app use encryption? | Yes — standard HTTPS |

   If Google requires SDK-level declarations:
   - RevenueCat SDK:
     - Data Type: Device ID (anonymous)
     - Purpose: App functionality (purchase management)
     - Collected: Yes (by SDK, not by developer)
     - Shared: No
     - Encrypted in transit: Yes

5. **Ads Declaration**
   - Contains ads: **No**

6. **Target Audience & Content**
   - Target age: **Not specifically targeted at children** (general audience)
   - Appeals to children: The app contains colorful pets and cartoon-style graphics. If Google flags this:
     - Confirm the app is **not** designed for children
     - In-app purchases are present (not COPPA-compliant as a kids app)
     - No ad SDKs present

7. **App Access**
   - All functionality is available without login
   - No special access needed for reviewers

8. **In-App Products Setup** (Google Play Console → Monetization)
   - Create managed products for gem packs (one-time)
   - Create subscription for VIP Membership
   - Match product IDs to your RevenueCat configuration

9. **Required Graphics**
   - Feature Graphic: 1024 × 500 px (landscape banner for store listing)
   - App Icon: 512 × 512 px
   - Screenshots: min 2, max 8 per device type (phone, tablet)
     - Phone: 16:9 or 9:16 aspect ratio, min 320px, max 3840px per side
   - Optional: Promo video (YouTube link)

10. **Store Listing Experiments**
    - Consider A/B testing different screenshots and descriptions after initial launch

---

## Permissions Justification

Both stores may ask why your app needs certain permissions:

| Permission | Why |
|---|---|
| `INTERNET` | Required to load pet images from CDN and process in-app purchases |
| `VIBRATE` | Haptic feedback during battles and evolutions |
| `BILLING` | In-app purchase processing through platform store |

The app does **not** request: camera, microphone, contacts, location, storage (beyond app sandbox), phone state, or any other sensitive permissions.

---

## Common Rejection Reasons & How to Avoid Them

### Apple

| Rejection Reason | Prevention |
|---|---|
| **Incomplete metadata** | Fill in ALL fields — description, screenshots, privacy URL, support URL |
| **Broken links** | Ensure privacy policy URL (website) is live before submission |
| **IAP not working** | Test purchases in sandbox environment; ensure RevenueCat products match App Store Connect |
| **Missing restore purchases** | Implement "Restore Purchases" button in settings/shop (required by Apple) |
| **Guideline 4.0 - Design** | Ensure app doesn't crash, all buttons work, no placeholder content |

### Google Play

| Rejection Reason | Prevention |
|---|---|
| **Data safety form incomplete** | Complete the data safety section fully |
| **Financial features mismatch** | Select "no financial features" — virtual game currency is not a financial product |
| **Target audience** | If your app has colorful/cartoon content, be clear it's not a kids-only app |
| **IAP issues** | Verify product IDs match between Play Console and RevenueCat |

---

## Pre-Submission Checklist

- [ ] App builds and runs without crashes on physical devices
- [ ] All in-app purchases work in sandbox/test mode
- [ ] "Restore Purchases" functionality works (required by Apple)
- [ ] Privacy Policy page is live at your website URL
- [ ] Terms & Conditions page is live at your website URL
- [ ] App icon is correct size (1024×1024 for iOS, 512×512 for Play)
- [ ] Screenshots prepared for all required device sizes
- [ ] App description written (short + full)
- [ ] Support email is valid and monitored (support@petevolutionarena.com)
- [ ] RevenueCat product IDs match store product IDs
- [ ] No placeholder text or "lorem ipsum" anywhere in the app
- [ ] No references to other platforms ("Download on iOS" shown on Android, or vice versa)
- [ ] Export compliance questionnaire completed (iOS)
- [ ] Content rating questionnaire completed (both stores)
- [ ] Financial features: "My app doesn't provide any financial features" selected
