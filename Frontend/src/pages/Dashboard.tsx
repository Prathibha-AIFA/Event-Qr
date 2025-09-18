import { useEffect, useState } from "react";
import { SimpleGrid, Box, Text, Spinner } from "../ui/UIlibraries";
import DashboardLayout from "../components/DashboardLayout";
import { getDashboardCounts, DashboardCounts } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardCounts();
      // be forgiving: support alternate keys if backend returns users/tickets arrays
      const totalUsers = data.totalUsers ?? (data as any).usersCount ?? 0;
      const totalTickets = data.totalTickets ?? (data as any).ticketsCount ?? 0;

      setStats({ totalUsers, totalTickets });
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      toast.error(
        err?.response?.data?.msg || err.message || "Failed to load dashboard",
        { position: "top-right", autoClose: 3000 }
      );
      setStats({ totalUsers: 0, totalTickets: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardLayout pageTitle="Dashboard Overview">
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" py={12}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
            <Text fontSize="lg" fontWeight="bold">
              Total Users
            </Text>
            <Text mt={2} fontSize="2xl" fontWeight="bold">
              {stats?.totalUsers ?? 0}
            </Text>
          </Box>

          <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
            <Text fontSize="lg" fontWeight="bold">
              Tickets Issued
            </Text>
            <Text mt={2} fontSize="2xl" fontWeight="bold">
              {stats?.totalTickets ?? 0}
            </Text>
          </Box>

          <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
            <Text fontSize="lg" fontWeight="bold">
              QR Scans
            </Text>
            <Text mt={2} fontSize="2xl" fontWeight="bold">
              {/* placeholder until you add a scans count API */}
              0
            </Text>
          </Box>
        </SimpleGrid>
      )}

      {/* Toast container for notifications */}
      <ToastContainer />
    </DashboardLayout>
  );
}
