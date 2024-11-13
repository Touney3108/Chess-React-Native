const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// Get the default config from Metro
const defaultConfig = getDefaultConfig(__dirname);

// Extract `sourceExts` and `assetExts` to modify them
const {
  resolver: { sourceExts, assetExts }
} = defaultConfig;

// Customize the Metro configuration
const config = {
  transformer: {
    // Set the transformer path for SVG handling
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    // Additional transformation options
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Remove 'svg' from asset extensions so that SVGs are not treated as static assets
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    // Add 'svg' to source extensions so that SVGs can be imported as React components
    sourceExts: [...sourceExts, 'svg'],
  },
};

// Merge the custom config with the default Expo configuration
module.exports = mergeConfig(defaultConfig, config);
