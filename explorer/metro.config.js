const extraNodeModules = require('node-libs-browser');

module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    extraNodeModules,
  },
};
