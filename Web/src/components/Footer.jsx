import React, { useEffect, useState } from "react";
import { Flex, Input, Button } from "@chakra-ui/react";
import VoiceRecorder from "./VoiceRecorder";
import axios from "axios";
import { SendIcon } from "chakra-ui-ionicons";

const Footer = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  setMessages,
}) => {
  const isInputEmpty = inputMessage.trim().length > 0;
  const [record, setRecord] = useState(false);
  const [recording, setRecording] = useState();
  const url = "http://localhost:4001/";

  const apiCall = async () => {
    if (recording?.blobURL) {
      return axios
        .post(url, { body: { inputAudio: recording } })
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
        { from: "me", inputAudio: recording, type: "inputAudio" },
      ]);
    }
  }, [recording?.blobURL]);
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
