module.exports = function (api) {
  // Cache the Babel config result for faster repeated builds.
  api.cache(true);

  return {
    // Expo preset + worklets plugin needed by react-native-reanimated/worklets.
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
