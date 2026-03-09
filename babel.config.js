module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@styles": "./styles",
            "@assets": "./assets",
            "@context": "./src/context",
            "@components": "./src/components",
            "@screens": "./src/screens",
          },
        },
      ],
    ],
  };
};
