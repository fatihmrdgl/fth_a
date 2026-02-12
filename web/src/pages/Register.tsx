import { useState } from "react";
import { Box, Button, Input, Stack, Heading, Text } from "@chakra-ui/react";
import api from "../api/client";
import { useAuthStore } from "../stores/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const setToken = useAuthStore((s) => s.setToken);
  const nav = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/register", { email, password, fullName });
      setToken(res.data.token);
      nav("/app");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Kayıt hatası");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16} p={6} borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={4}>Kayıt Ol</Heading>
      <Stack spacing={3}>
        <Input placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
        <Button colorScheme="teal" onClick={submit}>Kayıt Ol</Button>
        <Button as={Link} to="/login" variant="link">Zaten hesabın var mı? Giriş yap</Button>
      </Stack>
    </Box>
  );
}