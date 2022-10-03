import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";
import chatbotIcon from "../assets/chaticon.png";
import { keyframes } from "@chakra-ui/react";
import { motion } from "framer-motion";

export function ManualClose({ content }) {
  const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 10%; }
  25% { transform: scale(1.2) rotate(0); border-radius: 12%; }
  50% { transform: scale(1.2) border-radius: 20%; }
  75% { transform: scale(1)  border-radius: 30%; }
  100% { transform: scale(1) rotate(0); border-radius: 40%; }
`;

  const animation = `${animationKeyframes} 2s ease-in-out infinite`;
  const url = "http://localhost:4001/";
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
        .post(url, { body: { text: lastMessage?.text } })
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
      .post(url, { body: { text: data } })
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
      <img 
        src={chatbotIcon}
        className="chatIcon"
        onClick={onOpen}
        alt="chat icon"
        as={motion.div}
        animation={animation}
        cursor={"pointer"}  
      />

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalContent rounded={5} mt={[0, 50]} bg="white">
          <Header />
          {/* <ModalCloseButton padding={"20px"} /> */}
          <ModalBody className="chakraBody">
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
