import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({ fetchagain, setFetchagain, fetchMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setselectedChat } = ChatState();

  const [groupChatName, setgroupChatName] = useState();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameLoading, setrenameLoading] = useState(false);

  const toast = useToast();

  const handleRemove = async (query) => {
    if (selectedChat.groupAdmin._id !== user._id && query._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8000/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: query._id,
        },
        config
      );
      query._id === user._id ? setselectedChat() : setselectedChat(data);
      setFetchagain(!fetchagain);
      fetchMessage();
      setloading(false);
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };
  //
  //
  //
  const handleAddUser = async (query) => {
    if (selectedChat.users.find((u) => u._id === query._id)) {
      toast({
        title: "User is Already in group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };

      const { data } = await axios.put(
        "http://localhost:8000/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: query._id,
        },
        config
      );
      setselectedChat(data);
      setFetchagain(!fetchagain);
      setloading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };
  //
  //
  //
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setrenameLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8000/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setselectedChat(data);
      setFetchagain(!fetchagain);
      setrenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setrenameLoading(false);
    }
    setgroupChatName("");
  };
  //
  //
  //
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
        `http://localhost:8000/api/user?search=${search}`,
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
  //
  //
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily="Work sans"
            display={"flex"}
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display="flex" flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Enter new Name for Group"
                mb={3}
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User To Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
