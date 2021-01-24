const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new WasmPackPlugin({
        crateDirectory: path.join(__dirname, "../")
      })
    ],
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            // make file-loader ignore WASM files
            oneOf.exclude.push(/\.wasm$/);
          }
        });
      });

      return webpackConfig;
    },
  },
};
