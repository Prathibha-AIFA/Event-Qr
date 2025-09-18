import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const EventPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      w="100vw"
      bgImage="url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1950&q=80')" // Tech event image
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack
        bg="rgba(0,0,0,0.6)" // Dark overlay for readability
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        spacing={6}
        textAlign="center"
        color="white"
        maxW={{ base: "90%", md: "600px" }}
      >
        <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
          Tech Event 2025
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }}>
          Explore new technologies, network with peers, and gain insights. Join us for an
          unforgettable experience!
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate("/register")}
          _hover={{ bg: "red.600" }}
        >
          Register Now
        </Button>
      </VStack>
    </Box>
  );
};

export default EventPage;
