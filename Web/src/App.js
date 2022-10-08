import { ChakraProvider, theme } from "@chakra-ui/react";
import { Chatbot } from "pages/Chatbot";

import "./style.css";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="app">
        <div className="chat-widget-opener">
          <Chatbot context={<></>} />
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
