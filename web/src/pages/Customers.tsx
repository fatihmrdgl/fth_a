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
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../api/client";

type Customer = { id: string; firstName: string; lastName: string; email: string; phone: string; nationalId: string; address: string };

export default function Customers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Partial<Customer>>({});
  const toast = useToast();
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [policyForm, setPolicyForm] = useState<any>({});
  const { isOpen: isPolicyModalOpen, onOpen: onPolicyModalOpen, onClose: onPolicyModalClose } = useDisclosure();
  const { isOpen: isPolicyEditOpen, onOpen: onPolicyEditOpen, onClose: onPolicyEditClose } = useDisclosure();

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList() {
    setLoading(true);
    api
      .get("/customers")
      .then((res) => setItems(res.data))
      .catch(() => toast({ status: "error", title: "Liste alınamadı" }))
      .finally(() => setLoading(false));
  }

  function openNew() {
    setEditing(null);
    setForm({});
    onOpen();
  }

  function openEdit(c: Customer) {
    setEditing(c);
    setForm({ ...c });
    onOpen();
  }

  function openPolicies(c: Customer) {
    setSelectedCustomer(c);
    fetchPolicies(c.id);
    fetchProducts();
    setPoliciesOpen(true);
  }

  function closePolicies() {
    setSelectedCustomer(null);
    setPoliciesOpen(false);
  }

  function fetchProducts() {
    api.get("/products").then((r) => setProducts(r.data)).catch(() => {});
  }

  function fetchPolicies(customerId: string) {
    api
      .get("/policies")
      .then((r) => setPolicies(r.data.filter((p: any) => p.customerId === customerId)))
      .catch(() => toast({ status: "error", title: "Poliçeler alınamadı" }));
  }

  async function save() {
    try {
      if (editing) {
        const res = await api.put(`/customers/${editing.id}`, form);
        toast({ status: "success", title: "Güncellendi" });
      } else {
        const res = await api.post(`/customers`, form);
        toast({ status: "success", title: "Eklendi" });
      }
      onClose();
      fetchList();
    } catch (err: any) {
      toast({ status: "error", title: err?.response?.data?.message ?? "İşlem başarısız" });
    }
  }

  async function openNewPolicy() {
    const today = new Date().toISOString().slice(0, 10);
    setPolicyForm({ customerId: selectedCustomer?.id, productId: products[0]?.id ?? "", startDate: today, endDate: today, premium: 0, status: "Aktif" });
    onPolicyModalOpen();
  }

  async function editPolicy(p: any) {
    setPolicyForm({ ...p });
    onPolicyEditOpen();
  }

  async function savePolicy() {
    try {
      if (policyForm.id) {
        await api.put(`/policies/${policyForm.id}`, policyForm);
        toast({ status: "success", title: "Poliçe güncellendi" });
      } else {
        // Map to backend DTO property names (PascalCase) to avoid model binding issues
        const payload = {
          CustomerId: policyForm.customerId,
          ProductId: policyForm.productId,
          StartDate: policyForm.startDate,
          EndDate: policyForm.endDate,
          Premium: policyForm.premium,
          Status: policyForm.status,
        };
        await api.post(`/policies`, payload);
        toast({ status: "success", title: "Poliçe eklendi" });
      }
      onPolicyModalClose();
      onPolicyEditClose();
      if (selectedCustomer) fetchPolicies(selectedCustomer.id);
    } catch (err: any) {
      toast({ status: "error", title: err?.response?.data?.message ?? "Poliçe işlemi başarısız" });
    }
  }

  if (loading) return <Spinner />;

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="md">Müşteriler</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={openNew}>
          Yeni Müşteri
        </Button>
      </HStack>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Ad</Th>
            <Th>Soyad</Th>
            <Th>Email</Th>
            <Th>Telefon</Th>
            <Th>TC</Th>
            <Th>Adres</Th>
            <Th>İşlemler</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((c) => (
            <Tr key={c.id}>
              <Td>{c.firstName}</Td>
              <Td>{c.lastName}</Td>
              <Td>{c.email}</Td>
              <Td>{c.phone}</Td>
              <Td>{c.nationalId}</Td>
              <Td>{c.address}</Td>
              <Td>
                <HStack>
                  <IconButton aria-label="Düzenle" icon={<FaEdit />} size="sm" onClick={() => openEdit(c)} />
                  <Button size="sm" onClick={() => openPolicies(c)}>Poliçeler</Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editing ? "Müşteri Güncelle" : "Yeni Müşteri"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2}>
              <FormLabel>Ad</FormLabel>
              <Input value={form.firstName ?? ""} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Soyad</FormLabel>
              <Input value={form.lastName ?? ""} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Email</FormLabel>
              <Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Telefon</FormLabel>
              <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>TC</FormLabel>
              <Input value={form.nationalId ?? ""} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Adres</FormLabel>
              <Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>İptal</Button>
            <Button colorScheme="teal" onClick={save}>{editing ? "Güncelle" : "Ekle"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Policies Drawer/Modal */}
      <Modal isOpen={policiesOpen} onClose={closePolicies} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Poliçeler - {selectedCustomer?.firstName} {selectedCustomer?.lastName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button mb={4} colorScheme="teal" onClick={openNewPolicy} leftIcon={<FaPlus />}>Yeni Poliçe</Button>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr><Th>No</Th><Th>Ürün</Th><Th>Başlangıç</Th><Th>Bitiş</Th><Th>Prim</Th><Th>Durum</Th><Th>İşlemler</Th></Tr>
              </Thead>
              <Tbody>
                {policies.map(p => (
                  <Tr key={p.id}>
                    <Td>{p.policyNumber}</Td>
                    <Td>{products.find(pr => pr.id === p.productId)?.name ?? p.productId}</Td>
                    <Td>{new Date(p.startDate).toLocaleDateString()}</Td>
                    <Td>{new Date(p.endDate).toLocaleDateString()}</Td>
                    <Td>{p.premium}</Td>
                    <Td>{p.status}</Td>
                    <Td><Button size="sm" onClick={() => editPolicy(p)}>Düzenle</Button></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closePolicies}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Policy Modal */}
      <Modal isOpen={isPolicyModalOpen} onClose={onPolicyModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Poliçe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2}>
              <FormLabel>Ürün</FormLabel>
              <select value={policyForm.productId ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, productId: e.target.value })} style={{ width: "100%", padding: "8px" }}>
                {products.map(pr => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
              </select>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Başlangıç</FormLabel>
              <Input type="date" value={policyForm.startDate ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, startDate: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Bitiş</FormLabel>
              <Input type="date" value={policyForm.endDate ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, endDate: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Prim</FormLabel>
              <Input type="number" value={policyForm.premium ?? 0} onChange={(e) => setPolicyForm({ ...policyForm, premium: Number(e.target.value) })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Durum</FormLabel>
              <select value={policyForm.status ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, status: e.target.value })} style={{ width: "100%", padding: "8px" }}>
                <option value="Teklif">Teklif</option>
                <option value="Aktif">Aktif</option>
                <option value="Sonlanmis">Sonlanmış</option>
                <option value="IptalEdilmis">İptal Edilmiş</option>
              </select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onPolicyModalClose}>İptal</Button>
            <Button colorScheme="teal" onClick={savePolicy}>Ekle</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Policy Modal */}
      <Modal isOpen={isPolicyEditOpen} onClose={onPolicyEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Poliçe Düzenle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2}>
              <FormLabel>Ürün</FormLabel>
              <select value={policyForm.productId ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, productId: e.target.value })} style={{ width: "100%", padding: "8px" }}>
                {products.map(pr => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
              </select>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Başlangıç</FormLabel>
              <Input type="date" value={policyForm.startDate ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, startDate: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Bitiş</FormLabel>
              <Input type="date" value={policyForm.endDate ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, endDate: e.target.value })} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Prim</FormLabel>
              <Input type="number" value={policyForm.premium ?? 0} onChange={(e) => setPolicyForm({ ...policyForm, premium: Number(e.target.value) })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onPolicyEditClose}>İptal</Button>
            <Button colorScheme="teal" onClick={savePolicy}>Güncelle</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}