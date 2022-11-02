import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import axios from "axios";
import React, { useState } from "react";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../ConfigChatLogic/ChatLogic";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import ProfileModel from "./ProfileModel";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const toast = useToast();

  const {
    user,
    selectedChat,
    setselectedChat,
    chats,
    setChats,
    notifiction,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    toast({
      title: "Logout Successful!",
      status: "success",
      duration: 3500,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter name or email",
        status: "warning",
        duration: 3500,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: user.token,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      const { data } = await axios.post(
        `http://localhost:8000/api/chat/`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setselectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "error Fetching Chats!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        bg="white"
        width={"100%"}
        padding="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="search friends to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search friends
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily="Work sans">
          Just-React
        </Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <NotificationBadge
                count={notifiction.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} margin={1} />
            </MenuButton>
            <MenuList paddingLeft={2}>
              {!notifiction.length && "No New Messages"}
              {notifiction.map((notifi) => (
                <MenuItem
                  key={notifi._id}
                  onClick={() => {
                    setselectedChat(notifi.chat);
                    setNotification(notifiction.filter((n) => n !== notifi));
                  }}
                >
                  {notifi.chat.isGroupChat
                    ? `New Message in ${notifi.chat.chatName}`
                    : `New Message from ${getSender(user, notifi.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Friends</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by Name of Email..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
