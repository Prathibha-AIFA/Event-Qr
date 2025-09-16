import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

// Zod schema for manual registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // Helper to get first Zod error
  const getFirstZodError = (error: any) => {
    const formatted = error.format?.();
    return (
      formatted?.name?._errors?.[0] ||
      formatted?.email?._errors?.[0] ||
      "Validation failed"
    );
  };

  // ----------------- Manual Register -----------------
  const handleManualRegister = async () => {
    const validation = registerSchema.safeParse({ name, email });

    if (!validation.success) {
      const message = getFirstZodError(validation.error);
      console.log("Validation message:", message);

      toast({
        title: "Validation Error",
        description: message,
        status: "warning",
        position: "top-right",
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email }
      );

      const ticketId = res.data.ticket?._id;

      if (!ticketId) throw new Error("Ticket ID not found");

      toast({
        title: "Registered Successfully",
        description: "QR code sent to your email!",
        status: "success",
        position: "top-right",
      });

      navigate(`/ticket/${ticketId}`);
    } catch (err: any) {
      if (err.response?.data?.msg === "User already exists") {
        toast({
          title: "User Already Exists",
          description: "Please log in instead.",
          status: "info",
          position: "top-right",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: err.response?.data?.msg || err.message || "Please try again",
          status: "error",
          position: "top-right",
        });
      }
    }
  };

  // ----------------- Google OAuth -----------------
const handleGoogleSignIn = () => {
  const origin = window.location.origin; // dynamically get current frontend origin
  window.location.href = `http://localhost:5000/google?origin=${encodeURIComponent(origin)}`;
};


  return (
    <Box
      minH="100vh"
      w="100vw"
      bgImage="url('https://images.unsplash.com/photo-1581092795366-99d72bbdb9b0?auto=format&fit=crop&w=1950&q=80')"
      bgSize="cover"
      bgPosition="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        bg="whiteAlpha.900"
        p={{ base: 6, md: 10 }}
        rounded="2xl"
        shadow="xl"
        maxW="400px"
        w="full"
        textAlign="center"
      >
        <Heading mb={6} size="xl">
          Register for Tech Event
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              focusBorderColor="blue.400"
              rounded="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              focusBorderColor="blue.400"
              rounded="md"
            />
          </FormControl>

          <Button
            colorScheme="blue"
            w="full"
            onClick={handleManualRegister}
            size="lg"
          >
            Register
          </Button>

          <Text textAlign="center" color="gray.500">
            — or —
          </Text>

          <Button
            colorScheme="red"
            w="full"
            onClick={handleGoogleSignIn}
            size="lg"
          >
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
