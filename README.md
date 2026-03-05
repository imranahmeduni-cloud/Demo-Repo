# BARTAR Demo App

React Native + Expo barcode scanner demo that shows mock retailer price comparisons.

## Tech stack

- Expo SDK 54
- React Native 0.81
- React Navigation (stack)
- `expo-camera` for barcode scanning

## Project structure

```text
.
├── App.js                  # App entry and navigator
├── src/
│   ├── ScannerScreen.js    # Camera scanner UI + permission flow
│   ├── ResultsScreen.js    # Price results list UI
│   └── mockPrices.js       # Deterministic mock pricing data
├── assets/                 # App icons/splash images
├── app.json                # Expo app config
├── babel.config.js         # Babel config for Expo
└── eas.json                # EAS build profiles
```

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start Expo:
   ```bash
   npm start
   ```
3. Run on a target:
   - Press `w` for web
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS)
   - Or scan the QR code with Expo Go

## Build with EAS

```bash
npm install -g eas-cli
eas login
eas build --platform android
```

Use `--platform ios` for iOS builds.

## GitHub readiness checklist

- Keep feature code inside `src/`
- Do not commit local artifacts (`node_modules`, `.expo`, logs, `.env`)
- Update this README when app flows or setup commands change
- Add screenshots to `docs/` before sharing publicly (optional)
