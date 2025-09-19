// src/components/Sidebar.tsx
import React from "react";
import { VStack, Box, Text, Icon } from "@chakra-ui/react";
import { FiHome, FiUsers, FiMail } from "react-icons/fi";

type SidebarProps = {
  active?: string;
  onSectionChange?: (section: "overview" | "users" | "resend") => void;
};

const links = [
  { name: "Dashboard", key: "overview", icon: FiHome },
  { name: "Users", key: "users", icon: FiUsers },
  { name: "Resend Emails", key: "resend", icon: FiMail },
];

export default function Sidebar({ active, onSectionChange }: SidebarProps) {
  return (
    <Box w="250px" bg="white" p={6} borderRight="1px solid" borderColor="gray.200">
      <VStack spacing={4} align="stretch">
        {links.map((link) => (
          <Box
            key={link.key}
            display="flex"
            alignItems="center"
            p={2}
            borderRadius="md"
            bg={active === link.key ? "blue.100" : "transparent"}
            _hover={{ bg: "blue.50", cursor: "pointer" }}
            onClick={() => onSectionChange?.(link.key as "overview" | "users" | "resend")}
          >
            <Icon as={link.icon} mr={3} />
            <Text fontWeight={active === link.key ? "bold" : "normal"}>
              {link.name}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
