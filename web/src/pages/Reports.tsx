import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import api from "../api/client";

type Policy = { id: string; policyNumber: string; customerId: string; productId: string; startDate: string; endDate: string; premium: number; status: string };
type Customer = { id: string; firstName: string; lastName: string; email: string; phone: string };
type Product = { id: string; name: string };

function daysForRange(r?: string) {
  switch (r) {
    case "day":
      return 1;
    case "week":
      return 7;
    case "month":
    default:
      return 30;
  }
}

export default function Reports() {
  const { range } = useParams();
  const days = daysForRange(range);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<Policy | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/policies/expiring?days=${days}`)
      .then((r) => {
        setPolicies(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const filtered = policies as Policy[];

  function openDetails(p: Policy) {
    setSelected(p);
    onOpen();
  }

  if (loading) return <Spinner />;

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Raporlar - {range ?? "month"}</Heading>
        <Text>Son {days} gün içinde süresi bitecek poliçeler</Text>
      </VStack>

      <Table variant="simple" size="sm" mt={4}>
        <Thead>
          <Tr><Th>No</Th><Th>Müşteri</Th><Th>Ürün</Th><Th>Bitiş</Th><Th>Prim</Th><Th>Durum</Th><Th>İşlemler</Th></Tr>
        </Thead>
        <Tbody>
          {filtered.map(p => (
            <Tr key={p.id}>
              <Td>{p.policyNumber}</Td>
              <Td>{p.customerName ?? p.customerId}</Td>
              <Td>{p.productName ?? p.productId}</Td>
              <Td>{new Date(p.endDate).toLocaleDateString()}</Td>
              <Td>{p.premium}</Td>
              <Td>{p.status}</Td>
              <Td><Button size="sm" onClick={() => openDetails(p)}>Aç</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Poliçe Detayı</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                {selected && (
              <VStack align="start" spacing={3}>
                <Text><b>No:</b> {selected.policyNumber}</Text>
                <Text><b>Başlangıç:</b> {new Date(selected.startDate).toLocaleString()}</Text>
                <Text><b>Bitiş:</b> {new Date(selected.endDate).toLocaleString()}</Text>
                <Text><b>Prim:</b> {selected.premium}</Text>
                <Text><b>Durum:</b> {selected.status}</Text>
                <Box mt={3}>
                  <Heading size="sm">Müşteri</Heading>
                      <Text>{selected.customerName ?? selected.customerId}</Text>
                      <Text>{/* email not returned in report dto */}</Text>
                      <Text>{/* phone not returned in report dto */}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
