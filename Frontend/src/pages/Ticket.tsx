import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Center, Heading, Image, Text, VStack } from "../ui/UIlibraries";
import { getTicket } from "../services/api";

interface ITicket {
  _id: string;
  eventId: string;
  qrCodeData?: string;
  qrCodeUrl?: string;
  userId?: {
    name: string;
    email: string;
  };
  name?: string;
  email?: string;
}

const Ticket = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [ticket, setTicket] = useState<ITicket | null>(null);

  // check query param ?showQR=true
  const queryParams = new URLSearchParams(location.search);
  const showQR = queryParams.get("showQR") === "true";

  useEffect(() => {
    const fetchTicket = async () => {

      try {
        if (id) {
          const res = await getTicket(id);
          setTicket(res.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch ticket:", err.response?.data || err.message);
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
          {showQR ? (
            //  Mode 1: Show QR code (when redirected after login)
            <>
              <Image
                src={ticket.qrCodeData || ticket.qrCodeUrl}
                alt="QR Code"
                boxSize="250px"
                objectFit="contain"
                mb={6}
              />
              <Text fontSize="sm" color="gray.500">
                Scan this QR to access your ticket details
              </Text>
            </>
          ) : (
            //  Mode 2: Show details (when QR is scanned in mobile)
            <>
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
            </>
          )}
        </Box>
      </VStack>
    </Center>
  );
};

export default Ticket;
