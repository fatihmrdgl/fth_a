import { Box, Heading, Stack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <Box maxW="3xl" mx="auto" mt={10} p={6}>
      <Heading size="lg" mb={4}>Genel Bakış</Heading>
      <Stack direction="row" spacing={3}>
        <Button as={Link} to="/app/customers" colorScheme="teal">Müşteriler</Button>
        <Button as={Link} to="/app/products">Ürünler</Button>
        <Button as={Link} to="/app/policies">Poliçeler</Button>
      </Stack>
    </Box>
  );
}