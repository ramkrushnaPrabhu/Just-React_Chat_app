import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchagain, setFetchagain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir={"column"}
      padding={3}
      bg="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <SingleChat fetchagain={fetchagain} setFetchagain={setFetchagain} />
    </Box>
  );
};

export default ChatBox;
