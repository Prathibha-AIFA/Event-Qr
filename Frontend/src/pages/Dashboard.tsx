// src/pages/Dashboard/Dashboard.tsx
import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Spinner, Center } from "@chakra-ui/react";
import DashboardLayout from "../components/DashboardLayout";
import Users from "./Users";
import Resend from "./Resend";
import { getDashboardCounts, DashboardCounts, scanTicket } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<"overview" | "users" | "resend">("overview");
  const [stats, setStats] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardCounts();
      const totalUsers = data.totalUsers ?? 0;
      const totalTickets = data.totalTickets ?? 0;
      const totalScans = data.totalScans ?? 0; // should come from backend

      setStats({ totalUsers, totalTickets, totalScans });
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      toast.error(
        err?.response?.data?.msg || err.message || "Failed to load dashboard",
        { position: "top-right", autoClose: 3000 }
      );
      setStats({ totalUsers: 0, totalTickets: 0, totalScans: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Handle QR scan for Users section
  const handleScan = async (ticketId: string) => {
    try {
      await scanTicket(ticketId); // call backend to mark scanned
      toast.success("Ticket scanned successfully!", { position: "top-right", autoClose: 2000 });
      fetchStats(); // refresh overview counts
    } catch (err: any) {
      toast.error(
        err?.response?.data?.msg || err.message || "Failed to scan ticket",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  useEffect(() => {
    if (activeSection === "overview") {
      fetchStats();
    }
  }, [activeSection]);

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      onSectionChange={(section: "overview" | "users" | "resend") => setActiveSection(section)}
    >
      {/* Overview section */}
      {activeSection === "overview" && (
        <Box>
          {loading ? (
            <Center py={12}>
              <Spinner size="xl" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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
                  {stats?.totalScans ?? 0}
                </Text>
              </Box>
            </SimpleGrid>
          )}
        </Box>
      )}

      {/* Users section */}
      {activeSection === "users" && <Users onScan={handleScan} />}

      {/* Resend emails section */}
      {activeSection === "resend" && <Resend />}
    </DashboardLayout>
  );
}
