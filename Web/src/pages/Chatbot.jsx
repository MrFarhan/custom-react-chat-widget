import {
  Box,
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
import chatbotIcon from "../assets/chaticon.png";
import { motion } from "framer-motion";
import { customAnimation, initialMessage, URL } from "utils/constant";
import { CloseIcon } from "chakra-ui-ionicons";
import Header from "components/Header";
import Messages from "components/Messages";
import Footer from "components/Footer";

export function Chatbot() {
  const url = URL;
  const { isOpen, onOpen, onClose } = useDisclosure(); // handles chatbot open close state
  const [messages, setMessages] = useState([initialMessage]); // initialMessage is initial templete message of chatbot
  const [inputMessage, setInputMessage] = useState(""); // input message state manager

  // backend api call
  const apiCall = () => {
    const lastMessage = messages[messages?.length - 1];
    if (lastMessage?.isQuickReply && !lastMessage?.isInitialMessage) {
      return axios
        .post(url, { text: lastMessage?.text })
        .then((result) => {
          const text = result?.data?.data?.fulfillmentText;
          const quickReplies = result?.data?.data?.quickReplies; // to show quick replies buttons
          text?.map((item) =>
            setMessages((old) => [
              ...old,
              {
                from: "computer",
                text:
                  item ||
                  "Sorry i am facing a technical glitch, please checkout our website for more details about our services",
                quickReplies: quickReplies,
              },
            ])
          );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length]); // calles the api when ever new message received.

  // send button handler
  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    // calles the api on click of enter
    axios
      .post(url, { text: data })
      .then((result) => {
        const text = result?.data?.data?.fulfillmentText;
        const quickReplies = result?.data?.data?.quickReplies;
        text?.map((item) =>
          setMessages((old) => [
            ...old,
            {
              from: "computer",
              text:
                item ||
                "Sorry i am facing a technical glitch, please checkout our website for more details about our services",
              quickReplies: quickReplies,
            },
          ])
        );
      })
      .catch((err) => {
        setMessages((old) => [
          ...old,
          { from: "computer", text: "Sorry i am currently offline" },
        ]);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      onOpen((prev) => !prev);
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* {chat widget handler to open and close chat} */}
      {!isOpen ? (
        <img
          src={chatbotIcon}
          className={"chatIcon"}
          onClick={onOpen}
          alt="chat icon"
          as={motion.div}
          animation={customAnimation}
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
          <Header /> {/* {Chatbot header} */}
          <ModalCloseButton
            padding={"20px"}
            color={"white"}
            onClick={onClose}
            className="modal-close"
          />{" "}
          {/* {Chatbot close button to be visible on mobile} */}
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
              {/* {Chatbot Messages list from user and bot} */}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Footer
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              setMessages={setMessages}
            />
          </ModalFooter>{" "}
          {/* {Chatbot footer} */}
        </ModalContent>
      </Modal>
    </>
  );
}
