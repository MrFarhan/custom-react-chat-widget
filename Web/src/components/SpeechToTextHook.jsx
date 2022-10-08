import { Button } from "@chakra-ui/react";
import { MicIcon } from "chakra-ui-ionicons";
import React, { useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";

import { keyframes } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function SpeechToTextHook({
  setRecording,
  setVoiceConvertedText,
}) {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results[results?.length - 1]?.transcript?.length) {
      setRecording(isRecording);
      setVoiceConvertedText(results[results?.length - 1]?.transcript);
    } else {
      setRecording(false);
      setVoiceConvertedText(null);
    }
  }, [isRecording]);

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  const animationKeyframes = keyframes`
    0% { transform: scale(1) rotate(0); border-radius: 10%; }
    25% { transform: scale(1.2) rotate(0); border-radius: 12%; }
    50% { transform: scale(1.2) border-radius: 20%; }
    75% { transform: scale(1)  border-radius: 30%; }
    100% { transform: scale(1) rotate(0); border-radius: 40%; }
  `;
  const animation = isRecording
    ? `${animationKeyframes} 2s ease-in-out infinite`
    : "";

  const ClickHandler = () => {
    if (isRecording) {
      stopSpeechToText();
      setVoiceConvertedText(undefined);
      setRecording(true);
    } else {
      startSpeechToText();
      setRecording(true);
    }
    if (results[results?.length - 1]?.transcript?.length) {
      setVoiceConvertedText(results[results?.length - 1]?.transcript);
    }
    setVoiceConvertedText(null);
  };

  return (
    <div>
      {/* <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button> */}
      <Button
        as={motion.div}
        animation={animation}
        cursor={"pointer"}
        rightIcon={
          <MicIcon w={8} h={8} color={isRecording ? "#65151e" : "black"} />
        }
        _hover={"transparent"}
        variant="solid"
        background={"transparent"}
        onClick={ClickHandler}
        width="12"
        height="12"
        display="flex"
        padding="2"
      ></Button>
    </div>
  );
}
