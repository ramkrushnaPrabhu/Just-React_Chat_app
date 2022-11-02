import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import animationData from "../Animation/107605-typing.json";
import { io } from "socket.io-client";
import { getSender, getSenderFull } from "../ConfigChatLogic/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./Miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
// import "./style.css";
//
const EndPoint = "https://ramk-just-react-chat-app.herokuapp.com/";
//
var socket, selectedChatCompare;
//
const SingleChat = ({ fetchagain, setFetchagain }) => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  //
  const { user, selectedChat, setselectedChat, notifiction, setNotification } =
    ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          authorization: user.token,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );

      setMessage(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "failed to load the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(EndPoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notifiction.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notifiction]);
          setFetchagain(!fetchagain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: user.token,
          },
        };

        const { data } = await axios.post(
          "http://localhost:8000/api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");
        socket.emit("new message", data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Error Ocurred!",
          description: "failed to send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            />
            {message &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchagain={fetchagain}
                    setFetchagain={setFetchagain}
                    fetchMessage={fetchMessage}
                  />
                </>
              ))}
          </Text>
          <Box
            display={"flex"}
            flexDir="column"
            justifyContent={"flex-end"}
            padding={3}
            bg="#E8E8E8"
            w={"100%"}
            h={"100%"}
            borderRadius="lg"
            overflow={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                width={20}
                height={20}
                alignSelf="center"
                margin={"auto"}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat message={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          height="100%"
        >
          <Text fontSize={"3xl"} paddingBottom={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
