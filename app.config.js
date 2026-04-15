export default {
  expo: {
    name: "satis-app",
    slug: "satis-app",
    scheme: "satisapp",
    version: "1.0.4(beta)",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: ["expo-secure-store", ["expo-router"]],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.danyxtu.satisapp",
    },
    android: {
      package: "com.danyxtu.satisapp",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_URL || "https://satis-bshs-sa.me",
      eas: {
        projectId: "5ff329ca-387f-4e65-a2d7-83637e2e5e1e",
      },
    },
    updates: {
      url: "https://u.expo.dev/5ff329ca-387f-4e65-a2d7-83637e2e5e1e",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
