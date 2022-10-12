import { ChakraProvider, theme } from "@chakra-ui/react";
import { Chatbot } from "pages/Chatbot";

import "./style.css";

function App() {
  return (
    // Chakra Provider for chakra ui theme usage
    <ChakraProvider theme={theme}>
      <div className="app">
        <div className="chat-widget-opener">
          <Chatbot context={<></>} /> {/* { main chatbot component} */}
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
