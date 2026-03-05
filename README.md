# Demo-Repo

This repository contains a simple React Native app intended to run with Expo. The source files have been moved into `src/` and the project has an `app.json` and `package.json` configured for Expo.

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Start Expo:
   ```bash
   npm start
   # or
   expo start
   ```
3. Scan the QR code with Expo Go or run on a simulator.

## EAS Builds

To build standalone binaries using Expo Application Services (EAS), you need an
`eas.json` configuration and appropriate credentials. A minimal `eas.json` has
been added to this repo with development/preview/production profiles.

### Quick start

```bash
npm install -g eas-cli
# then in project root:

eas build:configure  # regenerates eas.json if you want custom settings

eas build --platform android   # or ios, or both
```

The first time you run an EAS build it will ask to manage credentials; for GitHub
builds you can also configure them on the Expo dashboard.

BARTAR DEMO
