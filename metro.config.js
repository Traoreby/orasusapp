const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add mjs for lucide-react-native
config.resolver.sourceExts.push('mjs');

module.exports = config;
