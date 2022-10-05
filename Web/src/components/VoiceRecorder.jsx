import { Button } from "@chakra-ui/react";
import { MicIcon } from "chakra-ui-ionicons";
import React from "react";
import { ReactMic } from "react-mic";

import {  keyframes } from "@chakra-ui/react";
import { motion } from "framer-motion";

const VoiceRecorder = ({ record, setRecord, setRecording }) => {
  const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 10%; }
  25% { transform: scale(1.2) rotate(0); border-radius: 12%; }
  50% { transform: scale(1.2) border-radius: 20%; }
  75% { transform: scale(1)  border-radius: 30%; }
  100% { transform: scale(1) rotate(0); border-radius: 40%; }
`;

  const animation = record
    ? `${animationKeyframes} 2s ease-in-out infinite`
    : "";

  const onData = (recordedBlob) => {
    console.log("chunk of real-time data is: ", recordedBlob);
  };

  const onStop = async (recordedBlob) => {
    // console.log('recordedBlob is: ', await recordedBlob.arrayBuffer())
    setRecording(recordedBlob);
  };
  return (
    <>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        mimeType="audio/mpeg"
      />
      {/* <audio src={recording?.blobURL} controls /> */}
      {/* <div> */}
        <Button
          as={motion.div}
          animation={animation}
          cursor={"pointer"}
          rightIcon={
            <MicIcon w={8} h={8} color={record ? "#65151e" : "black"} />
          }
          _hover={"transparent"}
          variant="solid"
          background={"transparent"}
          onClick={() => setRecord((prev) => !prev)}
          width="12"
          height="12"
          display="flex"
          padding="2"
        ></Button>
      {/* </div> */}
    </>
  );
};

export default VoiceRecorder;
