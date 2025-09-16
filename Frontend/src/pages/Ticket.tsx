import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";

interface ITicket {
  _id: string;
  eventId: string;
  userId?: {
    name: string;
    email: string;
  };
  name?: string;
  email?: string;
}

const Ticket = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<ITicket | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      console.log(`[Ticket Page] Fetching ticket for ID: ${id}`);
      try {
        const res = await axios.get(
          `https://event-qr-backend.onrender.com/api/tickets/${id}`
        );
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
      <VStack spacing={6} align="center">
        <Heading size="xl" textAlign="center">
          🎟️ Your Tech Event Ticket
        </Heading>

        <Box
          bg="white"
          p={8}
          rounded="xl"
          shadow="2xl"
          textAlign="center"
          maxW="400px"
        >
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            Event: {ticket.eventId}
          </Text>
          <Text fontSize="md" mb={1}>
            👤 Name: {userName}
          </Text>
          <Text fontSize="md" mb={4}>
            ✉️ Email: {userEmail}
          </Text>

          <Text fontSize="sm" color="gray.500">
            Ticket ID: {ticket._id}
          </Text>

          <Box mt={6} p={4} bg="blue.50" rounded="md">
            <Text fontSize="md" color="blue.800">
              ✅ Please present this ticket at the entry desk.  
              <br />Welcome to <strong>Tech Event 2025</strong> 🚀
            </Text>
          </Box>
        </Box>
      </VStack>
    </Center>
  );
};

export default Ticket;
