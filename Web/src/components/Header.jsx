import React from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const Header = ({ withAvatar }) => {
  return (
    <Flex w="100%" className="chakraHeader">
      {/* {WithAvatar if true will show chat avatar else will show normal header} */}
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
          background={"#65151e"}
          width={"100%"}
          borderRadius={"5px"}
          color={"white"}
          maxH={"50px"}
          padding={"15px"}
          margin={0}
        >
          <Text fontSize="xl" fontWeight="bold">
            Spera Electric
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
