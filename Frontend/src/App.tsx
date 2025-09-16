import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import Register from "./pages/Register";
import Ticket from "./pages/Ticket";

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
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
