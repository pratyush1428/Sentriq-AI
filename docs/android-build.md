# Sentriq AI — Android APK Build & Share Intent Guide

## 1. Prerequisites
- Android Studio Ladybug or newer
- Android SDK Platform 34 (API Level 34)
- JDK 17 or JDK 21
- Node.js 20+

## 2. Preparing the Frontend for Static Export / Capacitor
In `frontend/next.config.ts`, ensure `output: "export"` is enabled when packaging for a purely offline native bundle, or point `capacitor.config.ts` to your deployed FastAPI backend URL.

```bash
cd frontend
npm run build
```

## 3. Adding Capacitor Android Platform
```bash
cd mobile
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
```

## 4. Native Share-to-Sentriq Workflow
The Android Manifest in `mobile/AndroidManifest.xml` includes the `android.intent.action.SEND` filter for `text/plain` and `image/*`.

When a user in WhatsApp or SMS taps **Share** -> selects **Sentriq AI**:
1. Android starts `MainActivity`.
2. Capacitor receives the shared string or URI.
3. The scanner input field is automatically populated.
4. The user taps **Check for scam** to receive an instant risk verdict.

## 5. Building the Debug APK
```bash
cd mobile/android
./gradlew assembleDebug
```
The output APK is generated at:
`mobile/android/app/build/outputs/apk/debug/app-debug.apk`
