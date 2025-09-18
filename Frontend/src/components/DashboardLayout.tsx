import { Box, Flex } from "../ui/UIlibraries";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
};

export default function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  return (
    <Flex height="100vh" bg="gray.50">
      <Sidebar />
      <Flex direction="column" flex="1">
       <div style={{ width: "83.5vw" }}>
  <Navbar title="Dashboard" />
      </div>
        <Box flex="1" p={6} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
