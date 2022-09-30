import React, { useEffect, useState } from "react";
import { Flex, Input, Button } from "@chakra-ui/react";
import VoiceRecorder from "./VoiceRecorder";
import axios from "axios";

const Footer = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  setMessages,
}) => {
  const isInputEmpty = inputMessage.trim().length > 0;
  const [record, setRecord] = useState(false);
  const [recording, setRecording] = useState();
  const url = "http://localhost:4000/";

  const apiCall = () => {
    if (recording?.blobURL) {
      return axios
        .get(url, { params: { text: recording?.blobURL } })
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
    if (recording?.blobURL) {
      apiCall();
      setMessages((old) => [
        ...old,
        { from: "me", voice: recording, type: "voice" },
      ]);
    }
  }, [recording?.blobURL]);
  return (
    <Flex w="100%" mt="5">
      <Input
        placeholder="Type Something..."
        border="none"
        borderRadius="none"
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
          bg="black"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "white",
            color: "black",
            border: "1px solid black",
          }}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      ) : (
        <>
          {/* <IconButton
          aria-label="Search database"
          icon={<MicIcon w={8} h={8} color="blue.500" />}
          onEndedCapture={()=>setMessages((prev) => [
            ...prev,
            {
              from: "me",
              text: "Hi, My Name is HoneyChat",
              type: "audio",
            },
          ])}
          //   onChange={(e) => setInputMessage({ type: "audio" })}
          onClick={() => setRecord((prev) => !prev)}
        /> */}
          <VoiceRecorder
            record={record}
            setRecord={setRecord}
            recording={recording}
            setRecording={setRecording}
          />
        </>
      )}
    </Flex>
  );
};

export default Footer;
