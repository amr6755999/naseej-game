# Android build guide

## Build environment

- Node.js 22 or newer.
- Android Studio 2025.2.1 or newer.
- Android SDK Tools and at least one Android SDK Platform at API 24 or newer.
- Android Studio installs the JDK used by its Gradle configuration.

## First debug build

From the project root:

```bash
npm install
npm run build
npx cap add android
node ./scripts/lock-portrait.mjs
npx cap sync android
```

Open the native project:

```bash
npx cap open android
```

Then use Android Studio's **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

For a terminal debug build after the native project has been created:

```bash
cd android
./gradlew assembleDebug
```

Windows:

```bat
cd android
gradlew.bat assembleDebug
```

APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Automated helper

Linux/macOS:

```bash
npm run android:debug
```

Windows:

```bat
scripts\build-android.bat
```

The helper installs npm packages, builds the web assets, creates the Android platform if it is missing, patches portrait orientation, syncs Capacitor, and runs the debug Gradle build.

## Release APK

Create a signing key and configure signing for the `release` build type in Android Studio. Do not share or commit the private keystore or passwords. Then build the signed APK using Android Studio's Generate Signed Bundle / APK flow.

## App icon

Use `resources/icon-1024.png` with Android Studio's Image Asset Studio to generate the launcher icon resources after adding the Android platform.
