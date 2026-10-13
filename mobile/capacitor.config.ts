/**
 * Sentriq AI - Capacitor Mobile Configuration
 */
export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    url?: string;
    cleartext?: boolean;
    androidScheme?: string;
  };
  plugins?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: "ai.sentriq.app",
  appName: "Sentriq AI",
  webDir: "../frontend/out",
  bundledWebRuntime: false,
  server: {
    // When testing on Android Emulator, optionally point to local dev server:
    // url: "http://10.0.2.2:3000",
    cleartext: true,
    androidScheme: "https"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#F6F4EE",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
