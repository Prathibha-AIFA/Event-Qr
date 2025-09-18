import { Box, VStack, Heading, Text,  Link as ChakraLink } from "@chakra-ui/react";

import { ReactNode } from "react";

interface CustomAuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function CustomAuthLayout({ title, subtitle, children }: CustomAuthLayoutProps) {
  return (
    <Box
      maxW="400px"
      mx="auto"
      mt={12}
      p={8}
      borderRadius="2xl"
      bg="white"
      boxShadow="2xl"
      border="1px solid"
      borderColor="gray.200"
      transition="all 0.3s"
      _hover={{ boxShadow: "3xl", transform: "translateY(-2px)" }}
    >
      <Heading textAlign="center" mb={2} fontSize="2xl" color="gray.700">
        {title}
      </Heading>
      {subtitle && (
        <Text textAlign="center" mb={6} fontSize="sm" color="gray.500">
          {subtitle}
        </Text>
      )}
      <VStack spacing={4}>{children}</VStack>
    </Box>
  );
}
