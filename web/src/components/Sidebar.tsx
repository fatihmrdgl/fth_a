import { Box, VStack, Heading, Link as ChakraLink, Icon, Text, Collapse, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaTachometerAlt, FaUsers, FaBoxes, FaFileContract, FaChartBar, FaChevronDown, FaChevronUp } from "react-icons/fa";

const items = [
  { to: "/", label: "Ana Sayfa", icon: FaHome },
  { to: "/app", label: "Panoya Git", icon: FaTachometerAlt },
  { to: "/app/customers", label: "Müşteriler", icon: FaUsers },
  { to: "/app/products", label: "Ürünler", icon: FaBoxes },
  { to: "/app/policies", label: "Poliçeler", icon: FaFileContract },
];

export default function Sidebar() {
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <Box as="nav" w={{ base: "60px", md: "220px" }} bg="white" borderRightWidth="1px" minH="100vh" px={4} py={6}>
      <VStack align="start" spacing={6}>
        <Heading size="sm">mimcrm</Heading>
        <VStack align="stretch" spacing={1} w="full">
          {items.map((it) => (
            <ChakraLink
              key={it.to}
              as={NavLink}
              to={it.to}
              px={3}
              py={2}
              borderRadius="md"
              _activeLink={{ bg: "teal.50", color: "teal.700" }}
              _hover={{ textDecoration: "none", bg: "gray.50" }}
              display="flex"
              alignItems="center"
            >
              <Icon as={it.icon} mr={3} />
              <Text display={{ base: "none", md: "block" }}>{it.label}</Text>
            </ChakraLink>
          ))}
          {/* Reports menu with subitems */}
          <Box>
            <Button
              variant="ghost"
              px={3}
              py={2}
              w="full"
              justifyContent="flex-start"
              leftIcon={<Icon as={FaChartBar} mr={3} />}
              rightIcon={<Icon as={reportsOpen ? FaChevronUp : FaChevronDown} />}
              onClick={() => setReportsOpen((s) => !s)}
            >
              <Text display={{ base: "none", md: "block" }}>Raporlar</Text>
            </Button>
            <Collapse in={reportsOpen} animateOpacity>
              <VStack align="start" spacing={0} pl={6} pt={2}>
                <ChakraLink as={NavLink} to="/reports/day" px={3} py={2} borderRadius="md" _hover={{ textDecoration: "none", bg: "gray.50" }}>
                  <Text display={{ base: "none", md: "block" }}>Son Gün</Text>
                </ChakraLink>
                <ChakraLink as={NavLink} to="/reports/week" px={3} py={2} borderRadius="md" _hover={{ textDecoration: "none", bg: "gray.50" }}>
                  <Text display={{ base: "none", md: "block" }}>Son Hafta</Text>
                </ChakraLink>
                <ChakraLink as={NavLink} to="/reports/month" px={3} py={2} borderRadius="md" _hover={{ textDecoration: "none", bg: "gray.50" }}>
                  <Text display={{ base: "none", md: "block" }}>Son Ay</Text>
                </ChakraLink>
              </VStack>
            </Collapse>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
}
