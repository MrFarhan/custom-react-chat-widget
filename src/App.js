import { ChakraProvider, theme } from "@chakra-ui/react";

import { ManualClose } from "./components/Modal";
import "./style.css";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="app">
        <div className="chat-widget-opener">
          <ManualClose context={<></>} />
        </div>
        {/* <Chat /> */}
      </div>
    </ChakraProvider>
  );
}

export default App;
