import React, { useRef, useState } from "react";
import { VStack, Box, Text, Icon, Button,   } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiMail, FiLogOut } from "react-icons/fi";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: FiHome },
  { name: "Users", path: "/dashboard/users", icon: FiUsers },
  { name: "Resend Emails", path: "/dashboard/resend", icon: FiMail },
  
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <>
      <Box w="250px" bg="white" p={6} borderRight="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          {links.map(link =>
             (
              <Link key={link.name} to={link.path}>
                <Box
                  display="flex"
                  alignItems="center"
                  p={2}
                  borderRadius="md"
                  bg={location.pathname === link.path ? "blue.100" : "transparent"}
                  _hover={{ bg: "blue.50" }}
                >
                  <Icon as={link.icon} mr={3} />
                  <Text fontWeight={location.pathname === link.path ? "bold" : "normal"}>
                    {link.name}
                  </Text>
                </Box>
              </Link>
            )
          )}
        </VStack>
      </Box>

     
    </>
  );
}
