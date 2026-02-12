import { useEffect, useState } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import api from "../api/client";

type Product = { id: string; code: string; name: string; description: string; basePrice: number; isActive: boolean };

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then(res => setItems(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <Heading size="md" mb={4}>Ürünler</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Kod</Th><Th>Ad</Th><Th>Açıklama</Th><Th>Fiyat</Th><Th>Aktif</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map(p => (
            <Tr key={p.id}>
              <Td>{p.code}</Td>
              <Td>{p.name}</Td>
              <Td>{p.description}</Td>
              <Td>{p.basePrice}</Td>
              <Td>{p.isActive ? "Evet" : "Hayır"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}