import { Button, IconButton } from "@chakra-ui/react";
import { MicIcon } from "chakra-ui-ionicons";
import React from "react";
import { useState } from "react";
import { ReactMic } from "react-mic";
const VoiceRecorder = ({ record, setRecord, setRecording }) => {
    
  const onData = (recordedBlob) => {
    console.log("chunk of real-time data is: ", recordedBlob);
  };

  const onStop = (recordedBlob) => {
    setRecording(recordedBlob);
    console.log("recordedBlob is: ", recordedBlob);
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
      />
      {/* <audio src={recording?.blobURL} controls /> */}
      <div>
        <Button
          leftIcon={<MicIcon w={8} h={8} color="black" />}
          colorScheme="teal"
          variant="solid"
          onClick={() => setRecord((prev) => !prev)}
        >
          {record ? "Stop" : "Start"}
        </Button>
        {/* <IconButton
          aria-label="Search database"
          icon={<MicIcon w={8} h={8} color="blue.500" />}
          onClick={() => setRecord((prev) => !prev)}
        /> */}
      </div>
    </>
  );
};

export default VoiceRecorder;
