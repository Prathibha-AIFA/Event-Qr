import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Center, Heading, Image, Text, VStack } from "@chakra-ui/react";

interface ITicket {
  _id: string;
  eventId: string;
  qrCodeData?: string;
  qrCodeUrl?: string;
  userId?: {
    name: string;
    email: string;
  };
  name?: string; // for manual registration tickets without userId populated
  email?: string;
}

const Ticket = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<ITicket | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      console.log(`[Ticket Page] Fetching ticket for ID: ${id}`);
      try {
        const res = await axios.get(`http://localhost:5000/api/tickets/${id}`);
        console.log("[Ticket Page] API response:", res.data);
        setTicket(res.data);
      } catch (err: any) {
        console.error(
          "[Ticket Page] Failed to fetch ticket:",
          err.response?.data || err.message
        );
      }
    };

    if (id) fetchTicket();
  }, [id]);

  if (!ticket)
    return (
      <Center minH="100vh">
        <Text fontSize="lg">Loading ticket...</Text>
      </Center>
    );

  const userName = ticket.userId?.name || ticket.name || "Unknown";
  const userEmail = ticket.userId?.email || ticket.email || "Unknown";

  return (
    <Center minH="100vh" bg="gray.100" px={4}>
      <VStack spacing={8} align="center">
        <Heading size="xl" textAlign="center">
          Your Tech Event Ticket
        </Heading>

        <Box
          bg="white"
          p={8}
          rounded="xl"
          shadow="2xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Image
            src={ticket.qrCodeData || ticket.qrCodeUrl}
            alt="QR Code"
            boxSize="250px"
            objectFit="contain"
            mb={6}
          />

          <VStack spacing={2} textAlign="center">
            <Text fontWeight="bold" fontSize="lg">
              Event: {ticket.eventId}
            </Text>
            <Text fontSize="md">
              User: {userName} ({userEmail})
            </Text>
            <Text fontSize="sm" color="gray.500">
              Ticket ID: {ticket._id}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
};

export default Ticket;
