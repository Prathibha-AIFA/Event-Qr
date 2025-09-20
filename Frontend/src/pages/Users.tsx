
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
      await onScan(ticketId); 
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
  <Box px={{ base: 4, md: 12 }} py={6} bg="gray.50" minH="100vh">
    <Heading size="lg" mb={8} textAlign="center">
      Users Info
    </Heading>

    <Flex wrap="wrap" gap={8} justify="center">
      {users.map((user) => (
        <Card
          key={user._id}
          borderWidth="1px"
          borderRadius="2xl"
          flex="1 1 300px"
          minW="280px"
          maxW="340px"
          h="100%"
          bg="white"
          shadow="md"
          transition="all 0.25s"
          _hover={{
            shadow: "2xl",
            transform: "translateY(-6px) scale(1.02)",
          }}
        >
          <CardBody display="flex" flexDirection="column" h="100%">
            {/* Header */}
            <Flex align="center" mb={4} gap={4}>
              <Avatar name={user.name} size="lg" />
              <Stack spacing={1} flex="1" minW={0}>
                <Heading size="md" noOfLines={1}>
                  {user.name}
                </Heading>
                <Text color="gray.600" fontSize="sm" noOfLines={1}>
                  {user.email}
                </Text>
              </Stack>
            </Flex>

            {/* Badge */}
            <Center mb={4}>
              <Badge
                px={3}
                py={1}
                rounded="full"
                colorScheme={user.scanned ? "green" : "red"}
                fontSize="0.8em"
                fontWeight="semibold"
              >
                {user.scanned ? "✅ Scanned" : "❌ Not Scanned"}
              </Badge>
            </Center>

            {/* Footer actions */}
            <Flex mt="auto" justify="space-between" align="center" pt={4}>
              <Link
                href={user.ticketUrl}
                color="blue.600"
                fontWeight="medium"
                fontSize="sm"
                isExternal
                noOfLines={1}
                _hover={{ textDecoration: "underline" }}
              >
                🎟️ View Ticket
              </Link>

              {!user.scanned && user.ticketId && (
                <Button
                  size="sm"
                  colorScheme="green"
                  isLoading={scanningId === user._id}
                  onClick={() => handleScanClick(user.ticketId, user._id)}
                  rounded="full"
                  shadow="sm"
                  _hover={{ shadow: "md" }}
                >
                  Scan QR
                </Button>
              )}
            </Flex>
          </CardBody>
        </Card>
      ))}
    </Flex>
  </Box>
);

}
