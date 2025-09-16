import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Center, Button } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [appUrl, setAppUrl] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Always generate QR with current deployed origin
    const origin = window.location.origin; 
    setAppUrl(`${origin}/event`);
  }, []);

  const handleNavigate = () => {
    navigate("/event");
  };

  return (
    <Center minH="100vh" flexDirection="column" bg="gray.50" px={4}>
      <Heading mb={4} size="2xl" textAlign="center">
        Tech Event 2025
      </Heading>
      <Text
        mb={8}
        textAlign="center"
        maxW="450px"
        fontSize="lg"
        color="gray.600"
      >
        Join us for an amazing technology event! Innovate, Learn, Connect.
      </Text>

      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="xl"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {appUrl && <QRCode value={appUrl} size={180} />}

        <Text mt={4} textAlign="center" fontSize="sm" color="gray.500">
          Scan this QR code with your mobile to join the event.
        </Text>

        <Button
          mt={6}
          colorScheme="blue"
          onClick={handleNavigate}
          _hover={{ bg: "blue.600" }}
        >
          Join Event (Laptop)
        </Button>
      </Box>
    </Center>
  );
};

export default Home;
