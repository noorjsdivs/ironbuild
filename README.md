# IRONBUILD

Gym-equipment store app for iOS and Android, built from the **IRONBUILD App v2** Claude Design handoff. It includes the animated intro and onboarding, auth, the full storefront, checkout and live order tracking, a Training Journal (blog) with bookmarks and shoppable articles, account management, and an owner admin console.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Expo SDK 57 · React Native 0.86 (New Architecture) · React 19 + React Compiler |
| Navigation | Expo Router (typed routes): native stack, form sheets, and headless `expo-router/ui` tabs with a custom glass tab bar |
| Animation | Reanimated 4 + Worklets (layout entrances, springs, fly-to-cart, intro timeline) |
| Gestures | react-native-gesture-handler (onboarding swipe, price slider) |
| State | Zustand 5 with `persist` → AsyncStorage (cart, wishlist, account, prefs, catalog) |
| UI | expo-image (disk cache), expo-blur (glass), expo-linear-gradient, react-native-svg, expo-haptics |
| Type | Barlow Condensed / DM Sans / JetBrains Mono via `@expo-google-fonts`; Material Symbols Rounded subset bundled locally |

## Getting started

```bash
npm install
npx expo start
```

The app uses native modules that aren't all in Expo Go, so use a development build:

```bash
npx expo run:ios      # or: npx expo run:android
```

Before shipping a change, run these checks:

```bash
npm run typecheck && npm run lint && npx expo-doctor
```

## Project layout

```
src/
  app/                    Routes (Expo Router)
    _layout.tsx           Fonts, hydration, theme, root stack, toast + fly-to-cart overlays
    welcome.tsx           Animated intro → 3-slide onboarding (first launch)
    (auth)/               login · register · forgot-password · verify (modal stack)
    (tabs)/               Home · Shop · Wishlist · Cart · Profile
    product/[id].tsx      Product detail
    filters.tsx           Native form sheet
    checkout.tsx · order-placed.tsx · track/[no].tsx
    journal/              Training Journal (blog): index with category/saved filters, article pages
    account/              edit-profile · orders · addresses · payments · notifications · help
    admin/                Owner console (guarded by Stack.Protected)
      (tabs)/             Dashboard · Orders · Products · Inventory · More
      order/[no] · product/[id] · categories · customers · customer/[id]
      discounts · shipping · reports · settings
  components/             Design-system components (glass, buttons, controls, cards, tab bar…)
  theme/                  Tokens (dark/light × volt/ember/ice), typography, motion presets
  store/                  Zustand app store (persisted) + UI store (toast, fly, browse state)
  services/api.ts         Backend seam: auth + orders (simulated latency)
  data/                   Seed catalog, customers, orders, journal articles, reviews + types
  lib/                    Formatting, pricing, status helpers
```

## Design fidelity notes

- **Tokens**: every color, radius and type size comes from the prototype's semantic variables (`src/theme/tokens.ts`). The theme switches between dark and light, plus three accents. Profile → Appearance exposes all of these.
- **Motion**: every section enters with the prototype's stagger (60ms + 55ms × index, `cubic-bezier(.2,.8,.2,1)`). Toggles, tab pills and badges use the `--ease-spring` curve. Turning on **Reduce motion**, in the app or at the OS level, turns all of this off.
- **Glass**: iOS uses a native blur tinted with the token color. Android uses a denser translucent fill, because a live backdrop blur there needs a dedicated blur target.
- **Icons**: Material Symbols Rounded, outline and filled at weight 500, subset to the 51 glyphs in use. To add an icon, re-download both fonts with the new name in the Google Fonts `icon_names` list and add its codepoint to `src/components/icon.tsx`.
- **Photography** uses the Unsplash URLs from the v2 prototype. The courier map is bundled as `assets/images/map.png`.

## Home screen sections

Hero carousel → perks strip → shop by category → Deal of the day (live countdown to midnight) → trending grid → Just landed rail → Recently viewed (tracked on product views) → Training Journal (featured story + rail) → customer reviews → newsletter sign-up → footer.

Journal articles are block-based (`src/data/journal.ts`): paragraphs, headings, numbered lists, coach tips, pull quotes and embedded products with quick add. Swap the array for a CMS feed in production.

## Product detail page

Gallery with thumbnails and counter → name, SKU, savings and pay-in-4 → stock meter (low-stock urgency) → option chips with per-option prices and size guide (apparel) → quantity → delivery estimate (business days, assembly, returns) → Overview / Specs / Reviews tabs (highlights, in the box, full spec table, rating breakdown) → shipping, returns, warranty and care accordions → frequently bought together (add all) → "You might also like". A glass header with the product name fades in on scroll; the rating chip jumps to Reviews. Long-form content lives in `src/data/product-details.ts`.

## What's simulated

`src/services/api.ts` is the integration point for a real backend. Auth (email, Apple, Google, OTP) and order placement run against local state, with realistic delays. The UI already handles loading and error states, so you can swap in real calls there. "Add card" adds a demo card; in production, card entry belongs in the payment provider's secure sheet (e.g. Stripe PaymentSheet). Photo pickers show a toast placeholder.
