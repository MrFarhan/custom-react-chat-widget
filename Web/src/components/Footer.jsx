import React, { useEffect, useState } from "react";
import { Flex, Input, Button } from "@chakra-ui/react";
import axios from "axios";
import { SendIcon } from "chakra-ui-ionicons";
import SpeechToTextHook from "./SpeechToTextHook";
import { URL } from "utils/constant";

const Footer = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  setMessages,
}) => {
  const isInputEmpty = inputMessage.trim().length > 0;
  const [voiceConvertedText, setVoiceConvertedText] = useState();
  const [recording, setRecording] = useState();
  const url = URL;

  const apiCall = async () => {
    if (voiceConvertedText?.length) {
      return axios
        .post(url, { text: voiceConvertedText, type: "text" })
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
    }
  };

  useEffect(() => {
    if (voiceConvertedText?.length && !recording) {
      apiCall();
      setMessages((old) => [
        ...old,
        { from: "me", text: voiceConvertedText, type: "text" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording, voiceConvertedText]); // Send messages when ever new voice message comes in
  return (
    <Flex w="100%" mt="5" display={"flex"} align={"center"}>
      {/* {Chatbot Input bar} */}
      <Input
        placeholder="Type Something..."
        borderRadius="5px"
        maxW={"335px"}
        _focus={{
          border: "1px solid black",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      {isInputEmpty ? (
        <Button
          rightIcon={<SendIcon w={8} h={8} color="black" />}
          variant="solid"
          background={"transparent"}
          className="sendButton"
          _hover={"transparent"}
          onClick={handleSendMessage}
        >
          {/* {Chatbot send  button} */}
          {/* Send */}
        </Button>
      ) : (
        <>
          {/* {Chatbot mic button and handles voice to text conversion} */}
          <SpeechToTextHook
            setRecording={setRecording}
            setVoiceConvertedText={setVoiceConvertedText}
          />
        </>
      )}
    </Flex>
  );
};

export default Footer;
