import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import api from "../api/client";

type Policy = { id: string; policyNumber: string; customerId: string; productId: string; startDate: string; endDate: string; premium: number; status: string };

export default function Policies() {
  const [items, setItems] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/policies").then(res => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <Heading size="md" mb={4}>Poliçeler</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>No</Th><Th>Müşteri</Th><Th>Ürün</Th><Th>Başlangıç</Th><Th>Bitiş</Th><Th>Prim</Th><Th>Durum</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map(p => (
            <Tr key={p.id}>
              <Td>{p.policyNumber}</Td>
              <Td>{p.customerId}</Td>
              <Td>{p.productId}</Td>
              <Td>{new Date(p.startDate).toLocaleDateString()}</Td>
              <Td>{new Date(p.endDate).toLocaleDateString()}</Td>
              <Td>{p.premium}</Td>
              <Td>{p.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}