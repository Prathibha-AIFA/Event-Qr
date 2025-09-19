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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginAdmin } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//  Type for form data
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  // ✅ Submit handler
  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginAdmin(data.email, data.password);

      if (res.token) {
        localStorage.setItem("adminToken", res.token);
      }

      toast.success(res.msg || "Login Successful", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(
  err?.response?.data?.msg || err.message || "Login Failed",
  { position: "top-right", autoClose: 3000 }
);
    }
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
          Admin Login
        </Heading>
        <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel fontWeight={200}>Email</FormLabel>
            <Input
              placeholder="Enter your email"
              {...register("email")}
              focusBorderColor="red.400"
              rounded="md"
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel fontWeight={200}>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              focusBorderColor="red.400"
              rounded="md"
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm">
                {errors.password.message}
              </Text>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="red"
            w="full"
            size="lg"
            isLoading={isSubmitting}
          >
            Login
          </Button>
        </VStack>
      </Box>

      {/* Toast container for notifications */}
      <ToastContainer />
    </Box>
  );
};

export default Login;
