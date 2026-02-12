import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Policies from "./pages/Policies";
import Reports from "./pages/Reports";
import { useAuthStore } from "./stores/auth";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";

export default function App() {
  const isAuthed = useAuthStore((s) => !!s.token);
  return (
    <Flex>
      <Sidebar />
      <Box as="main" flex={1} p={6}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={isAuthed ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/app/customers" element={isAuthed ? <Customers /> : <Navigate to="/login" />} />
          <Route path="/app/products" element={isAuthed ? <Products /> : <Navigate to="/login" />} />
          <Route path="/app/policies" element={isAuthed ? <Policies /> : <Navigate to="/login" />} />
          <Route path="/reports" element={isAuthed ? <Reports /> : <Navigate to="/login" />} />
          <Route path="/reports/:range" element={isAuthed ? <Reports /> : <Navigate to="/login" />} />
        </Routes>
      </Box>
    </Flex>
  );
}