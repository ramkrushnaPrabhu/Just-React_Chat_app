import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          authorization: user.token,
        },
      };
      const { data } = await axios.get(
        `https://ramk-just-react-chat-app.herokuapp.com/api/user?search=${search}`,
        config
      );
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  //
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      const { data } = await axios.post(
        `https://ramk-just-react-chat-app.herokuapp.com/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  //
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  //
  const handleDelete = (deluser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deluser._id));
  };
  //
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily="Work sans"
            display={"flex"}
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                marginBottom={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Tom , Jerry"
                marginBottom={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} width="100%" flexWrap={"wrap"}>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
