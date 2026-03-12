# RevenueCat + Google Play Console Setup Guide

**App:** Pet Evolution Arena  
**Package Name:** `com.petevolution.arena`  
**RevenueCat Android API Key:** `goog_mvrDWkTMoCpuaoHRDAzEzOmXYCQ`

---

## Step 1: Create a Google Cloud Service Account

1. Go to **Google Play Console** → **Setup** → **API access**
2. Click **Link** to link your Google Cloud project (if not already linked)
3. Click **Create new service account**
4. You'll be taken to **Google Cloud Console**:
   - Click **+ Create Service Account**
   - Name: `revenuecat-service-account`
   - Click **Create and Continue**
   - Role: skip (no role needed here)
   - Click **Done**
5. Click on the newly created service account
6. Go to the **Keys** tab
7. Click **Add Key** → **Create new key** → **JSON** → **Create**
8. A `.json` file will download — **save this file securely**

## Step 2: Grant Permissions in Google Play Console

1. Go back to **Google Play Console** → **Setup** → **API access**
2. Find your new service account in the list
3. Click **Grant access**
4. Under **Account permissions**, enable:
   - **View app information and download bulk reports** (read-only)
   - **View financial data, orders, and cancellation survey responses**
   - **Manage orders and subscriptions**
5. Under **App permissions**:
   - Click **Add app** → Select **Pet Evolution Arena**
6. Click **Invite user** → **Send invite**

> **Note:** It can take up to 24-48 hours for the service account to fully propagate in Google Play.

## Step 3: Upload Service Account JSON to RevenueCat

1. Log in to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Go to your **Pet Evolution Arena** project
3. Navigate to **Project Settings** (gear icon in left sidebar)
4. Under **Apps**, find (or create) your **Google Play** app:
   - If not created yet: Click **+ New** → **Google Play Store**
   - **App name:** Pet Evolution Arena
   - **Package name:** `com.petevolution.arena`
5. In the Google Play app settings, find **Service Account credentials**
6. Click **Upload** and select the `.json` file you downloaded in Step 1
7. Click **Save Changes**
8. Click **Verify** to confirm the credentials work

---

## Step 4: Create Products in Google Play Console

Go to **Google Play Console** → **Pet Evolution Arena** → **Monetization**

### 4A: In-App Products (Monetization → In-app products)

Click **Create product** for each of these:

| Product ID | Name | Description | Price |
|---|---|---|---|
| `gems_small` | 50 Gems | A small pack of 50 gems | $0.99 |
| `gems_medium` | 170 Gems | 150 gems + 20 bonus gems | $2.99 |
| `gems_large` | 600 Gems | 500 gems + 100 bonus gems | $7.99 |
| `gems_mega` | 1500 Gems | 1200 gems + 300 bonus gems | $14.99 |
| `daily_special` | Daily Special Bundle | 500 coins, 50 gems, and 100 food | $4.99 |

For each product:
1. Click **Create product**
2. **Product ID:** use the exact ID from the table above
3. **Name:** use the name from the table
4. **Description:** use the description from the table
5. **Default price:** set the price from the table
6. Click **Save** → then **Activate**

### 4B: Subscription (Monetization → Subscriptions)

1. Click **Create subscription**
2. **Product ID:** `vip_monthly`
3. **Name:** VIP Pass
4. Add a **Base plan**:
   - **Base plan ID:** `vip-monthly-plan`
   - **Billing period:** 1 month
   - **Price:** $9.99
   - **Auto-renewing:** Yes
5. Click **Save** → then **Activate**

> **Important:** Products will only be available for purchase after you've uploaded at least one APK/AAB to a testing track (internal test, closed test, or production). If you've already done an EAS build and uploaded it, you're good.

---

## Step 5: Create Products in RevenueCat

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com) → **Pet Evolution Arena** project
2. Click **Products** in the left sidebar
3. Click **+ New** for each product:

| Identifier | Store | Store Product ID |
|---|---|---|
| gems_small | Google Play Store | `gems_small` |
| gems_medium | Google Play Store | `gems_medium` |
| gems_large | Google Play Store | `gems_large` |
| gems_mega | Google Play Store | `gems_mega` |
| daily_special | Google Play Store | `daily_special` |
| vip_monthly | Google Play Store | `vip_monthly:vip-monthly-plan` |

> **For subscriptions:** the Store Product ID format is `product_id:base_plan_id`

---

## Step 6: Create an Offering in RevenueCat

1. Go to **Offerings** in the left sidebar
2. You should see a **default** offering (auto-created). Click on it.
   - If not, click **+ New** → Identifier: `default`
3. Create **Packages** inside the offering:

### Package: Gem Packs

Click **+ New Package** for each:

| Package Identifier | Product |
|---|---|
| `gems_small` (custom) | gems_small |
| `gems_medium` (custom) | gems_medium |
| `gems_large` (custom) | gems_large |
| `gems_mega` (custom) | gems_mega |

### Package: VIP Subscription

| Package Identifier | Product |
|---|---|
| `$rc_monthly` (use built-in) | vip_monthly |

> Use the built-in `$rc_monthly` identifier for the subscription so RevenueCat can automatically manage it.

### Package: Daily Special

| Package Identifier | Product |
|---|---|
| `daily_special` (custom) | daily_special |

4. Click **Save** after adding all packages

---

## Step 7: Verify Package Name Match

Your app.json already has the correct package name:

```
android.package = "com.petevolution.arena"
ios.bundleIdentifier = "com.petevolution.arena"
```

Make sure RevenueCat shows the same **Package name** (`com.petevolution.arena`) under **Project Settings** → **Apps** → **Google Play Store** app.

If they don't match, purchases will silently fail.

---

## Summary Checklist

- [ ] Google Cloud service account created
- [ ] Service account JSON key downloaded
- [ ] Service account granted access in Google Play Console (with app-level permission for Pet Evolution Arena)
- [ ] Service account JSON uploaded to RevenueCat and verified
- [ ] 5 in-app products created in Google Play Console (`gems_small`, `gems_medium`, `gems_large`, `gems_mega`, `daily_special`)
- [ ] 1 subscription created in Google Play Console (`vip_monthly` with `vip-monthly-plan` base plan)
- [ ] All 6 products created in RevenueCat
- [ ] Default Offering created with all packages
- [ ] Package name matches: `com.petevolution.arena` in app.json, Google Play, and RevenueCat
- [ ] At least one AAB uploaded to a Google Play testing track

---

## Testing

After completing all steps:

1. Create a **License Testing** account in Google Play Console:
   - **Setup** → **License testing**
   - Add your Google account email
   - Set license response to **RESPOND_NORMALLY**
2. Build a dev client: `eas build --profile development --platform android`
3. Install on a device signed into the license testing Google account
4. All gem packs and VIP subscription should now appear and be purchasable (test purchases are free for license testers)
