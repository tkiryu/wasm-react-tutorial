import React from "react";
import * as wasm from "wasm-react-tutorial";

const App = () => {
  wasm.greet();
  return (
    <div>wasm-react-test</div>
  );
};

export default App;