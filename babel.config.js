module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {jsxImportSource: 'nativewind'}],
      'nativewind/babel',
    ],
    plugins: [
 
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],

      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            src: './src',
            lib: './src/lib',
            components: './src/components',
            '@/api': './src/api',
            '@/interface': './src/api/interface',
            '@/p138-react-common': './p138-react-common',
            "@/config/*": "./src/config/*", //与admin引入同步
            "@/utils/*": "./src/utils/*",//与admin引入同步
            "@/api/*":"./src/api/*",//与admin引入同步
            '.': './index',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        },
      ],
  
    ],
  };
};
