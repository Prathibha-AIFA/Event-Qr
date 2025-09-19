// src/components/DashboardLayout.tsx
import { Box, Flex } from "../ui/UIlibraries";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
  onSectionChange?: (section: "overview" | "users" | "resend") => void;
};

export default function DashboardLayout({
  children,
  pageTitle,
  onSectionChange,
}: DashboardLayoutProps) {
  return (
    <Flex height="100vh" bg="gray.50">
      {/* Pass section change handler to Sidebar */}
      <Sidebar onSectionChange={onSectionChange} />
      <Flex direction="column" flex="1">
        <div style={{ width: "83.5vw" }}>
          <Navbar title={pageTitle || "Dashboard"} />
        </div>
        <Box flex="1" p={6} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
