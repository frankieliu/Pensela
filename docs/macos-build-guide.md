# macOS Build Guide

This document describes the steps required to build and run Pensela on macOS.

## Prerequisites

- Node.js and npm
- macOS 10.14 or later

## Installation

### 1. Install Dependencies

If you encounter network issues downloading Electron from GitHub, use the npmmirror:

```bash
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" npm install
```

Otherwise, standard install works:

```bash
npm install
```

### 2. Upgrade electron-builder (if needed)

The original electron-builder version (22.11.7) requires Python 2 (`/usr/bin/python`) for DMG creation, which doesn't exist on modern macOS. Upgrade to a newer version:

```bash
npm install electron-builder@latest --save-dev
```

This was upgraded from 22.11.7 to 26.7.0.

## Building for macOS

### Build the App

```bash
npm run _private:build:macos
```

Or build specific targets:

```bash
# Build DMG only
npx electron-builder build -m dmg --publish never --config ./electron-builder.json

# Build ZIP only
npx electron-builder build -m zip --publish never --config ./electron-builder.json

# Build app directory only (no installer)
npx electron-builder build -m --dir --publish never --config ./electron-builder.json
```

### Build Output

Built packages are located in the `build/` directory:

- `build/mac-arm64/Pensela.app` - The application bundle
- `build/Pensela-1.2.5-arm64.dmg` - DMG installer
- `build/Pensela-1.2.5-arm64-mac.zip` - ZIP archive

## Troubleshooting

### Code Signature Issues

If the app crashes on launch with an error like:

```
Library not loaded: @rpath/Electron Framework.framework/Electron Framework
Reason: code signature ... not valid for use in process: mapping process and mapped file (non-platform) have different Team IDs
```

Re-sign the app bundle with a consistent ad-hoc signature:

```bash
codesign --force --deep --sign - build/mac-arm64/Pensela.app
```

Verify the signature:

```bash
codesign --verify --deep --strict build/mac-arm64/Pensela.app
```

Remove quarantine attributes (if downloaded or moved):

```bash
xattr -cr build/mac-arm64/Pensela.app
```

### Network Issues During Build

If electron-builder fails to download components from GitHub, you may need to:

1. Check your network/VPN connection
2. Retry the build (transient failures are common)
3. Use mirror URLs where available

### Gatekeeper Warnings

Since the app is ad-hoc signed (no Apple Developer ID), users will see a Gatekeeper warning on first launch. To open:

1. Right-click the app
2. Select "Open"
3. Click "Open" in the dialog

## Running in Development

To run the app without building:

```bash
npm start
```

This runs `electron .` directly.

### Sandbox Errors on Modern macOS

If you see "sandbox initialization failed: Operation not permitted" errors when running `npm start`, the app now includes `--no-sandbox` flag by default. This is required for Electron on macOS 26.x and later.

## Notes

- The app is ad-hoc signed, not notarized (requires Apple Developer credentials)
- Electron version: 40.4.1
- electron-builder version: 26.7.0
