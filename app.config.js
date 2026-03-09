export default {
  expo: {
    name: "satis-app",
    slug: "satis-app",
    scheme: "satis-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: ["expo-secure-store", "expo-router"],
    ios: {
      supportsTablet: true,
    },
    newArchEnabled: false,
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
      API_URL: process.env.API_URL || "http://10.20.74.104:8000",
      eas: {
        projectId: "5ff329ca-387f-4e65-a2d7-83637e2e5e1e",
      },
    },
  },
};
