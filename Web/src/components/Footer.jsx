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
    // let f = new File([recording], 'test.wav', { lastModified: new Date().getTime(), type: recording.type });

    // console.log("hello audio",f)
    if (voiceConvertedText?.length) {
      return axios
        .post(url, { text: voiceConvertedText, type: "text" })
        .then((result) => {
          const text = result?.data?.data?.fulfillmentText;
          const quickReplies = result?.data?.data?.quickReplies;

          return setMessages((old) => [
            ...old,
            {
              from: "computer",
              text:
                text ||
                "Sorry i am facing a technical glitch, please checkout our website for more details about our services",
              quickReplies: quickReplies,
            },
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
    if (voiceConvertedText?.length && !recording) {
      apiCall();
      setMessages((old) => [
        ...old,
        { from: "me", text: voiceConvertedText, type: "text" },
      ]);
    }
  }, [recording, voiceConvertedText]);
  return (
    <Flex w="100%" mt="5" display={"flex"} align={"center"}>
      <Input
        placeholder="Type Something..."
        // border="none"
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
          // onClick={() => setRecord((prev) => !prev)}
          _hover={"transparent"}
          onClick={handleSendMessage}
        >
          {/* Send */}
        </Button>
      ) : (
        <>
          <SpeechToTextHook
            setRecording={setRecording}
            setVoiceConvertedText={setVoiceConvertedText}
          />
          {/* <VoiceRecorder
            record={record}
            setRecord={setRecord}
            recording={recording}
            setRecording={setRecording}
          /> */}
        </>
      )}
    </Flex>
  );
};

export default Footer;
