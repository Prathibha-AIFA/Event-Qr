// src/pages/Dashboard/Users.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Link,
  Spinner,
  Card,
  CardBody,
  Text,
  Stack,
  Avatar,
  Flex,
  Center,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { fetchAllUsers } from "../services/api";

interface IUser {
  _id: string;
  name: string;
  email: string;
  ticketUrl: string;
}

export default function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading)
    return (
      <Center py={12}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Center>
    );

  if (!users.length)
    return (
      <Center py={12}>
        <Text>No users found.</Text>
      </Center>
    );

  return (
    <Box px={{ base: 6, md: 12 }} py={6} h="100vh">
      <Heading size="lg" mb={6}>
        Users Info
      </Heading>

      <Flex wrap="wrap" gap={6} justify="flex-start">
        {users.map((user) => (
          <Card
            key={user._id}
            borderWidth="1px"
            borderRadius="md"
            flex="1 1 300px" // grow, shrink, base width
            minW="350px"
            p={4}
            _hover={{ boxShadow: "lg", transform: "translateY(-2px)", transition: "all 0.2s" }}
          >
            <CardBody>
              <Flex align="center" gap={4}>
                <Avatar name={user.name} size="lg" />
                <Stack spacing={1} flex="1">
                  <Heading size="md">{user.name}</Heading>
                  <Text color="gray.600">{user.email}</Text>
                  <Link href={user.ticketUrl} color="blue.500" isExternal fontWeight="medium">
                    View Ticket
                  </Link>
                </Stack>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
