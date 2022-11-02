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
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [password, setpassword] = useState("");
  const [pic, setpic] = useState("");
  const [Show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePassWordVis = () => setShow(!Show);

  const postDetail = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Just-react");
      data.append("cloud_name", "dc3plmbpp");
      fetch("https://api.cloudinary.com/v1_1/dc3plmbpp/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select Image for Upload!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password do not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        Headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://ramk-just-react-chat-app.herokuapp.com/api/user/",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration Successful.",
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handlePassWordVis}>
              {Show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="Confirm-password" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
          <Input
            type={Show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handlePassWordVis}>
              {Show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Update Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetail(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
