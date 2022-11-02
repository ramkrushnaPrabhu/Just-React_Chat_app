import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePassWordVis = () => setShow(!Show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        Headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://ramk-just-react-chat-app.herokuapp.com/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Log In Successful !",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"} color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handlePassWordVis}>
              {Show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Log in
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        onClick={() => {
          setemail("guest@example.com");
          setpassword("123456789");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
