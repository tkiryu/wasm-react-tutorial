const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const wasmExtensionRegExp = /\.wasm$/;

      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            // make file-loader ignore WASM files
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      // add a dedicated loader for WASM
      webpackConfig.module.rules.push({
        test: wasmExtensionRegExp,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: require.resolve('wasm-loader'), options: {} }],
      });

      return webpackConfig;
    },
  },
};
