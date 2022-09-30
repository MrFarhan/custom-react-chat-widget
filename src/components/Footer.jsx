import React, { useEffect, useState } from "react";
import { Flex, Input, Button, IconButton } from "@chakra-ui/react";
import { MicIcon } from "chakra-ui-ionicons";
import VoiceRecorder from "./VoiceRecorder";

const Footer = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  setMessages,
}) => {
  const isInputEmpty = inputMessage.trim().length > 0;
  const [record, setRecord] = useState(false);
  const [recording, setRecording] = useState();

  useEffect(() => {
    setMessages((old) => [
      ...old,
      { from: "me", voice: recording, type: "voice" },
    ]);
  }, [recording]);
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
