import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender } from "../../ConfigChatLogic/ChatLogic";

import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchagain}) => {
  const { user, selectedChat, setselectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          authorization: user.token,
        },
      };
      const { data } = await axios.get(
        "http://localhost:8000/api/chat/",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "error Occured!",
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchagain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <Box
        paddingBottom={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display={"flex"}
        width="100%"
        justifyContent={"space-between"}
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Create Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir="column"
        padding={3}
        bg="#F8F8F8"
        width={"100%"}
        height={"100%"}
        borderRadius="lg"
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setselectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? chat.users[0]._id === user._id
                      ? chat.users[1].name
                      : chat.users[0].name
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
