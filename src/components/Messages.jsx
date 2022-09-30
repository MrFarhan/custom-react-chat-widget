import React, { useEffect, useRef } from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";

const Messages = ({
  messages,
  setMessages,
  setInputMessage,
  handleSendMessage,
}) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const badgeChangeHandler = (value) => {
    setMessages((old) => [
      ...old,
      { from: "me", text: value, isQuickReply: true },
    ]);
    // setInputMessage(value);
    // handleSendMessage();
  };

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
        if (item.from === "me") {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="black"
                color="white"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
              >
                {item.type === "voice" ? (
                  <audio src={item?.voice?.blobURL} controls />
                ) : (
                  <Text>{item.text}</Text>
                )}
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
              ></Avatar>
              <Box>
                <Flex
                  bg="gray.100"
                  color="black"
                  minW="100px"
                  maxW="350px"
                  my="1"
                  p="3"
                >
                  <Flex display={"block"} align={"center"}>
                    <Box>
                      <Text>{item.text}</Text>
                    </Box>
                  </Flex>
                </Flex>
                {item?.quickReplies && (
                  <Box>
                    {item?.quickReplies?.map((value) => (
                      <Badge
                        cursor={"pointer"}
                        mr={2}
                        mb={2}
                        background={"gray.100"}
                        padding={"8px"}
                        borderRadius={"5px"}
                        onClick={() => badgeChangeHandler(value)}
                      >
                        {value}
                      </Badge>
                    ))}
                  </Box>
                )}
              </Box>
            </Flex>
          );
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;