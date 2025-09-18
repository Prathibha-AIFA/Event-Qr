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
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  title: string;
};

export default function Navbar({ title }: NavbarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onOpen(); // open confirmation modal
  };

  const confirmLogout = () => {
    onClose();
    navigate("/"); 
  };

  return (
    <Flex w="100%" bg="white" p={4} boxShadow="sm" align="center">
      <Text fontSize="xl" fontWeight="bold">
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
