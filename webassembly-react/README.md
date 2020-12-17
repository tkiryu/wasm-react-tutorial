# React App with WebAssembly
This setup is referring to 
https://koala42.com/using-webassembly-in-your-reactjs-app/.


## 1. Create CRA project
```
npx create-react-app webassembly-react --template typescript
```

## 2. Install CRACO and wasm-loader
This project uses CRACO instead of react-app-wired to override create-react-app configuration to enable load WASM.
```
cd webassembly-react
yarn add -D @craco/craco wasm-loader
```

### 3. Configure craco.config.js
Create `craco.config.js` and configure as follow.
```
const path = require('path');

module.exports = {
  webpack: {
    // https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file
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
```

## 4. Install WASM package
Add WASM package to dependencies in package.json
```
  "dependencies": {
    ...
    "wasm-react-tutorial": "file:../pkg",
    ...
  },
```

Then, install it.
```
yarn install
```

## 5. Import WASM into App.tsx
Need to import asynchronously.
```
function App() {
  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasm = await import('wasm-react-tutorial');
        wasm.greet();
      } catch (e) {
        console.error(`Unexpected error in loadWasm. [Message: ${e.message}]`);
      }
    };
    loadWasm(); 
  }, [])
...
```

## 6. Change npm scripts in package.json
```
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  },
```

## 7. Run!
```
yarn start
```
