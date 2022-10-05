import {
  Box,
  Flex,
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
import { URL } from "utils/constant";
import { CloseIcon } from "chakra-ui-ionicons";

export function ManualClose() {
  const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 10%; }
  25% { transform: scale(1.2) rotate(0); border-radius: 12%; }
  50% { transform: scale(1.2) border-radius: 20%; }
  75% { transform: scale(1)  border-radius: 30%; }
  100% { transform: scale(1) rotate(0); border-radius: 40%; }
`;

  const animation = `${animationKeyframes} 2s ease-in-out infinite`;
  const url = URL;
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
        .post(url, { text: lastMessage?.text })
        .then((result) => {
          const text = result?.data?.data?.fulfillmentText;
          const quickReplies = result?.data?.data?.quickReplies;
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
      .post(url, { text: data })
      .then((result) => {
        const text = result?.data?.data?.fulfillmentText;
        const quickReplies = result?.data?.data?.quickReplies;
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
      {!isOpen ? (
        <img
          src={chatbotIcon}
          className={"chatIcon"}
          onClick={onOpen}
          alt="chat icon"
          as={motion.div}
          animation={animation}
          cursor={"pointer"}
        />
      ) : (
        <Box
          onClick={!isOpen ? onOpen : onClose}
          background={"#65151e"}
          borderRadius={"36px"}
          padding={"5px"}
          cursor={"pointer"}
          color={"white"}
          zIndex={2}
        >
          <CloseIcon fontSize={"50px"} />
        </Box>
      )}

      <Modal blockScrollOnMount={false} isOpen={isOpen}>
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
