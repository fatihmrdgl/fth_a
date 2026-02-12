import { Box, Button, Heading, Text, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={6} textAlign="center" maxW="lg">
        <Heading>mimcrm</Heading>
        <Text>Sigorta acenteleri için poliçe ve müşteri yönetimi.</Text>
        <Stack direction="row" spacing={4} justify="center">
          <Button as={Link} to="/register" colorScheme="teal">Yeni Kayıt</Button>
          <Button as={Link} to="/login" variant="outline">Giriş Yap</Button>
        </Stack>
      </Stack>
    </Box>
  );
}