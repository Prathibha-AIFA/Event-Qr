import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import Register from "./pages/Register";
import Ticket from "./pages/Ticket";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Resend from "./pages/Resend";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "md",
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ticket/:id" element={<Ticket />} />
          <Route path="/login" element={<Login/>}   />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="dashboard/users" element={<Users/>}  />
          <Route path="/dashboard/resend" element={<Resend/>} />
        </Routes>
      </Router>
       <ToastContainer
        position="top-right"
        autoClose={3000}   // milliseconds before toast disappears
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ChakraProvider>
  );
}

export default App;
