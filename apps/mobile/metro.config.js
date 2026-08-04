const { getDefaultConfig } = require('expo/metro-config');

// Expo SDK 54+ detects npm workspaces automatically. Keeping the default config
// ensures Metro and Expo autolinking resolve the same mobile dependency set.
module.exports = getDefaultConfig(__dirname);
