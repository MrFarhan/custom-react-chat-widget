import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

export function ManualClose({ content }) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState([
    { from: "computer", text: "Hi, My Name is HoneyChat", type: "text" },
    { from: "me", text: "Hey there", type: "text" },
    { from: "me", audio: "Myself Ferin Patel", type: "voice" },
    {
      from: "computer",
      text: "Nice to meet you. You can send me message and i'll reply you with same message.",
      type: "text",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    setTimeout(() => {
      setMessages((old) => [...old, { from: "computer", text: data }]);
    }, 1000);
  };

  return (
    <>
      <Button onClick={onOpen}>Click me </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalContent rounded={5} mt={[0, 50]} bg="white">
          <Header />
          <ModalCloseButton />
          <ModalBody>
            <Flex
              h="90%"
              flexDir="column"
              overflowX={"scroll"}
              overflowY={"hidden"}
              maxH={"500px"}
            >
              <Messages messages={messages} />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Footer
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              setMessages={setMessages}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
