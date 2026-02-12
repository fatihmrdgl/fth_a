import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import api from "../api/client";

type Customer = { id: string; firstName: string; lastName: string; email: string; phone: string; nationalId: string; address: string };

export default function Customers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/customers").then(res => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <Heading size="md" mb={4}>Müşteriler</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Ad</Th><Th>Soyad</Th><Th>Email</Th><Th>Telefon</Th><Th>TC</Th><Th>Adres</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map(c => (
            <Tr key={c.id}>
              <Td>{c.firstName}</Td>
              <Td>{c.lastName}</Td>
              <Td>{c.email}</Td>
              <Td>{c.phone}</Td>
              <Td>{c.nationalId}</Td>
              <Td>{c.address}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}