// src/pages/Dashboard/Resend.tsx
import { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, Text } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { fetchUsersForResend, resendEmail } from "../services/api"; // import helpers

interface IUser {
  _id: string;
  name: string;
  email: string;
}

export default function Resend() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsersForResend();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (userId: string) => {
    try {
      setResending(userId);
      const res = await resendEmail(userId);
      toast.success(res.msg || "Email sent successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend email");
    } finally {
      setResending(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Resend Emails
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  isLoading={resending === user._id}
                  onClick={() => handleResend(user._id)}
                >
                  Resend Email
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
