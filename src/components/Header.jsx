import React from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const Header = ({ withAvatar }) => {
  return (
    <Flex w="100%">
      {withAvatar ? (
        <>
          <Avatar
            size="lg"
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          >
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Flex flexDirection="column" mx="5" justify="center">
            <Text fontSize="lg" fontWeight="bold">
              Ferin Patel
            </Text>
            <Text color="green.500">Online</Text>
          </Flex>
        </>
      ) : (
        <Flex
          flexDirection="column"
          mx="5"
          justify="center"
          background={"blue.200"}
          width={"100%"}
          borderRadius={"5px"}
          padding={"20px"}
        >
          <Text fontSize="lg" fontWeight="bold">
            Spera Electric
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
