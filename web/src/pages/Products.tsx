import { useEffect, useState } from "react";
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
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../api/client";

type Product = { id: string; code: string; name: string; description: string; basePrice: number; isActive: boolean };

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({ basePrice: 0, isActive: true });
  const toast = useToast();

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList() {
    setLoading(true);
    api
      .get("/products")
      .then((res) => setItems(res.data))
      .catch(() => toast({ status: "error", title: "Ürünler alınamadı" }))
      .finally(() => setLoading(false));
  }

  function openNew() {
    setEditing(null);
    setForm({ code: "", name: "", description: "", basePrice: 0, isActive: true });
    onOpen();
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ ...p });
    onOpen();
  }

  async function save() {
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, form);
        toast({ status: "success", title: "Güncellendi" });
      } else {
        await api.post(`/products`, form);
        toast({ status: "success", title: "Eklendi" });
      }
      onClose();
      fetchList();
    } catch (err: any) {
      toast({ status: "error", title: err?.response?.data?.message ?? "İşlem başarısız" });
    }
  }

  if (loading) return <Spinner />;

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="md">Ürünler</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={openNew}>
          Yeni Ürün
        </Button>
      </HStack>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Kod</Th>
            <Th>Ad</Th>
            <Th>Açıklama</Th>
            <Th>Fiyat</Th>
            <Th>Aktif</Th>
            <Th>İşlemler</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((p) => (
            <Tr key={p.id}>
              <Td>{p.code}</Td>
              <Td>{p.name}</Td>
              <Td>{p.description}</Td>
              <Td>{p.basePrice}</Td>
              <Td>{p.isActive ? "Evet" : "Hayır"}</Td>
              <Td>
                <HStack>
                  <IconButton aria-label="Düzenle" icon={<FaEdit />} size="sm" onClick={() => openEdit(p)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editing ? "Ürün Güncelle" : "Yeni Ürün"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2}>
              <FormLabel>Kod</FormLabel>
              <Input value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Ad</FormLabel>
              <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Açıklama</FormLabel>
              <Input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Fiyat</FormLabel>
              <NumberInput value={String(form.basePrice ?? 0)} onChange={(v) => setForm({ ...form, basePrice: Number(v) })}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={2}>
              <FormLabel mb="0">Aktif</FormLabel>
              <Switch isChecked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>İptal</Button>
            <Button colorScheme="teal" onClick={save}>{editing ? "Güncelle" : "Ekle"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}