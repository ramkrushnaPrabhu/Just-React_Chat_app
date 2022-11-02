import { Box } from "@chakra-ui/react";

import React, { useState } from "react";
import ChatBox from "../Components/Miscellaneous/ChatBox";
import MyChats from "../Components/Miscellaneous/MyChats";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchagain, setFetchagain] = useState(false);

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
          height={"91.5vh"}
          padding={"10px"}
        >
          {user && <MyChats fetchagain={fetchagain} />}
          {user && (
            <ChatBox fetchagain={fetchagain} setFetchagain={setFetchagain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default Chatpage;
