const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 1. 找到 assetExts 和 sourceExts
const { assetExts, sourceExts } = config.resolver;

// 2. 配置 transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// 3. 配置 resolver
config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter(ext => ext !== "svg"),
  sourceExts: [...sourceExts, "svg"],
  extraNodeModules: {
    "react-native-svg": require.resolve("react-native-svg"),
    'react-native-svg/css': require.resolve('react-native-svg'),
    "expo-router": require.resolve("expo-router"),
  },
  resolverMainFields: ["browser", "main", "module"],
  alias: {
    'src': './src',
    'lib': './src/lib',
    'components': './src/components',
    '@/api': './src/api',
    '@/interface': './src/api/interface',
    '@/p138-react-common': './p138-react-common'
  },
  
};


module.exports = withNativeWind(config, { input: "./global.css" });
