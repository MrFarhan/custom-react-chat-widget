import { ChakraProvider, theme } from "@chakra-ui/react";
import Recording from "components/RTCClass";
import RTCRecorder from "components/RTCRecorder";
import SpeechToTextHook from "components/SpeechToTextHook";

import { ManualClose } from "./components/Modal";
import "./style.css";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="app">
        <div className="chat-widget-opener">
          <ManualClose context={<></>} />
          {/* <Recording /> */}
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
