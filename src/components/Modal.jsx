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
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

export function ManualClose({ content }) {
  const url = "http://localhost:4000/";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState([
    {
      from: "computer",
      text: "Hi there ! Please select from below options",
      type: "text",
      isInitialMessage: true,
      quickReplies: [
        "Our Services",
        "Estimates / Quotes",
        "Our Company",
        "Resources",
        "Contact Us",
        "Location",
        "Service Requests",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const apiCall = () => {
    const lastMessage = messages[messages?.length - 1];
    if (lastMessage?.isQuickReply && !lastMessage?.isInitialMessage) {
      return axios
        .get(url, { params: { text: lastMessage?.text } })
        .then((result) => {
          const text = result?.data?.data?.fulfillmentText;
          const quickReplies = result?.data?.data.fulfillmentMessages.filter(
            (item) => item.quickReplies
          )?.[0]?.quickReplies?.quickReplies;
          return setMessages((old) => [
            ...old,
            { from: "computer", text: text, quickReplies: quickReplies },
          ]);
        })
        .catch((err) => {
          setMessages((old) => [
            ...old,
            { from: "computer", text: "Sorry i am currently offline" },
          ]);
        });
    }
  };

  useEffect(() => {
    apiCall();
  }, [messages?.length]);

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    axios
      .get(url, { params: { text: data } })
      .then((result) => {
        const text = result?.data?.data?.fulfillmentText;
        const quickReplies = result?.data?.data.fulfillmentMessages.filter(
          (item) => item.quickReplies
        )?.[0]?.quickReplies?.quickReplies;
        setMessages((old) => [
          ...old,
          { from: "computer", text: text, quickReplies: quickReplies },
        ]);
      })
      .catch((err) => {
        setMessages((old) => [
          ...old,
          { from: "computer", text: "Sorry i am currently offline" },
        ]);
      });
  };

  return (
    <>
      <Button onClick={onOpen}>Click me </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalContent rounded={5} mt={[0, 50]} bg="white">
          <Header />
          <ModalCloseButton padding={"20px"} />
          <ModalBody>
            <Flex
              h="90%"
              flexDir="column"
              overflowX={"scroll"}
              overflowY={"hidden"}
              maxH={"500px"}
            >
              <Messages
                messages={messages}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                setMessages={setMessages}
              />
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
