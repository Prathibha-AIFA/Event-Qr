
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
  Badge,
  Button,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { fetchAllUsers } from "../services/api";

interface IUser {
  _id: string;
  name: string;
  email: string;
  ticketUrl: string;
  ticketId: string; // must have ticketId for scanning
  scanned?: boolean; // scan status
}

interface UsersProps {
  onScan: (ticketId: string) => Promise<void>; // parent prop for scanning
}

export default function Users({ onScan }: UsersProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);

  // Fetch users from backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(
        data.map((u: IUser) => ({
          ...u,
          scanned: u.scanned ?? false, // default false
        }))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Handle scan click
  const handleScanClick = async (ticketId: string, userId: string) => {
    try {
      setScanningId(userId);
      await onScan(ticketId); // call parent handler
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, scanned: true } : u))
      );
      toast.success("Ticket scanned successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || err.message || "Failed to scan ticket");
    } finally {
      setScanningId(null);
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
    <Box px={{ base: 4, md: 12 }} py={6}>
      <Heading size="lg" mb={6}>
        Users Info
      </Heading>

      <Flex wrap="wrap" gap={6}>
        {users.map((user) => (
          <Card
            key={user._id}
            borderWidth="1px"
            borderRadius="2xl"
            flex="1 1 300px"
            minW="280px"
            maxW="350px"
            p={4}
            bg="white"
            boxShadow="sm"
            _hover={{
              boxShadow: "xl",
              transform: "translateY(-4px)",
              transition: "all 0.3s",
            }}
          >
            <CardBody>
              <Flex align="center" gap={4}>
                <Avatar name={user.name} size="lg" />
                <Stack spacing={2} flex="1">
                  <Flex justify="space-between" align="center">
                    <Heading size="md" isTruncated>
                      {user.name}
                    </Heading>
                    <Badge
                      colorScheme={user.scanned ? "green" : "red"}
                      fontSize="0.75em"
                      px={2}
                      py={1}
                    >
                      {user.scanned ? "Scanned" : "Not Scanned"}
                    </Badge>
                  </Flex>

                  <Text color="gray.600" isTruncated>
                    {user.email}
                  </Text>

                  <Flex justify="space-between" mt={3} align="center">
                    <Link
                      href={user.ticketUrl}
                      color="blue.500"
                      isExternal
                      fontWeight="medium"
                      noOfLines={1}
                    >
                      View Ticket
                    </Link>

                    {!user.scanned && user.ticketId && (
                      <Button
                        size="sm"
                        colorScheme="green"
                        isLoading={scanningId === user._id}
                        onClick={() => handleScanClick(user.ticketId, user._id)}
                        ml={2}
                      >
                        Scan QR
                      </Button>
                    )}
                  </Flex>
                </Stack>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
