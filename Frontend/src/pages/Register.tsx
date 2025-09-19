import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
} from "../ui/UIlibraries";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

// Zod schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

const onSubmit = async (data: FormData) => {
  console.log("Submitting manual registration with data:", data);
  try {
    const response = await registerUser(data);
    console.log("Manual registration response:", response);

    const ticketId = response.ticket?._id;
    console.log("Extracted ticketId:", ticketId);

    if (!ticketId) throw new Error("Ticket ID not found");

    toast.success("QR code sent to your email!", { position: "top-right", autoClose: 3000 });
    navigate(`/ticket/${ticketId}?showQR=true`);
  } catch (err: any) {
    console.error("Manual registration error:", err);
    const msg = err.response?.data?.msg || err.message || "Please try again";
    if (msg === "User already exists") toast.info("Try another email", { position: "top-right", autoClose: 3000 });
    else toast.error(msg, { position: "top-right", autoClose: 3000 });
  }
};

const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  console.log("Google credential received:", credentialResponse);
  try {
    const response = await registerUser({ googleToken: credentialResponse.credential });
    console.log("Google registration response:", response);

    const ticketId = response.ticketId;
    console.log("Extracted ticketId from Google response:", ticketId);

    if (!ticketId) throw new Error("Ticket ID not found");

    toast.success("QR code sent to your email!", { position: "top-right", autoClose: 3000 });
    navigate(`/ticket/${ticketId}?showQR=true`);
  } catch (err: any) {
    console.error("Google registration error:", err);
    toast.error(err.message || "Google registration failed", { position: "top-right", autoClose: 3000 });
  }
};


  const handleGoogleError = () => {
    toast.error("Google sign-in failed", { position: "top-right", autoClose: 3000 });
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

        <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!formState.errors.name}>
            <FormLabel fontWeight={200} >Name</FormLabel>
            <Input {...register("name")} placeholder="Your name" rounded="md" focusBorderColor="red.400" />
            <Text color="red.500" fontSize="sm">{formState.errors.name?.message}</Text>
          </FormControl>

          <FormControl isInvalid={!!formState.errors.email}>
            <FormLabel fontWeight={200}>Email</FormLabel>
            <Input {...register("email")} placeholder="Your email" rounded="md" focusBorderColor="red.400" />
            <Text color="red.500" fontSize="sm">{formState.errors.email?.message}</Text>
          </FormControl>

          <Button colorScheme="red" w="full" size="lg" type="submit">Register</Button>

          <Text textAlign="center" color="gray.500">— or —</Text>

          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} width={300} />

          <Text fontSize="sm" color="gray.600">
            <ChakraLink as={Link} to="/login" color="blue.500" fontWeight="bold">
              Login
            </ChakraLink>{" "} as Admin
          </Text>
        </VStack>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default Register;
