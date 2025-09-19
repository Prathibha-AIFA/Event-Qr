// src/components/Navbar.tsx
import React, { useRef } from "react";
import {
  Flex,
  Text,
  Spacer,
  Button,
  Avatar,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "../ui/UIlibraries";

type NavbarProps = {
  title: string;
  onSectionChange?: (section: "overview" | "users" | "resend") => void;
};

export default function Navbar({ title, onSectionChange }: NavbarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleLogoutClick = () => {
    onOpen(); // open confirmation modal
  };

  const confirmLogout = () => {
    onClose();
    // 🔴 Instead of navigate("/") we just reload or clear session
    // If you *do* want to go back to login page, keep navigate("/") here
    window.location.href = "/";
  };

  return (
    <Flex w="100%" bg="white" p={4} boxShadow="sm" align="center">
      <Text fontSize="xl" fontWeight="bold" cursor="pointer" onClick={() => onSectionChange?.("overview")}>
        {title}
      </Text>
      <Spacer />

      <Avatar name="Admin" size="sm" mr={4} />
      <Button colorScheme="red" size="sm" onClick={handleLogoutClick}>
        Logout
      </Button>

      {/* Logout Confirmation Modal */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to logout?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={confirmLogout} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
