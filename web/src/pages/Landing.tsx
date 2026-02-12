import { Box, Button, Heading, Text, Stack, Flex, VStack, HStack, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaShieldAlt } from "react-icons/fa";

export default function Landing() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" px={4} py={12}>
      <Stack spacing={10} textAlign="center" maxW="5xl" w="full">
        <VStack spacing={4}>
          <Heading size="2xl">mimcrm</Heading>
          <Text fontSize="lg" color="gray.600">
            Sigorta acenteleri için poliçe ve müşteri yönetimi. Tek panelden müşteri, ürün ve poliçe takibini yapın.
          </Text>
        </VStack>

        <Flex gap={6} direction={{ base: "column", md: "row" }} justify="center">
          <ActionCard
            icon={FaUserPlus}
            title="Yeni Kayıt"
            description="Dakikalar içinde hesap oluşturun, ekibinizi davet edin."
            to="/register"
            buttonLabel="Kayıt Ol"
            colorScheme="teal"
          />
          <ActionCard
            icon={FaSignInAlt}
            title="Giriş"
            description="Var olan hesabınızla giriş yapıp panoya geçin."
            to="/login"
            buttonLabel="Giriş Yap"
            variant="outline"
          />
        </Flex>

        <Box bg="white" borderWidth="1px" borderRadius="lg" p={6} shadow="sm" maxW="3xl" mx="auto">
          <Stack spacing={4} align="center">
            <HStack spacing={3} color="teal.500">
              <Icon as={FaShieldAlt} boxSize={6} />
              <Heading size="md">Tek panel, çok katmanlı mimari</Heading>
            </HStack>
            <Text color="gray.600">
              Müşteri, ürün ve poliçe yönetimini tek uygulamada toplayın. Yetkilendirme, JWT oturum açma ve MySQL üzerinde
              EF Core ile hazır gelir.
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function ActionCard({
  icon,
  title,
  description,
  to,
  buttonLabel,
  colorScheme,
  variant,
}: {
  icon: any;
  title: string;
  description: string;
  to: string;
  buttonLabel: string;
  colorScheme?: string;
  variant?: "solid" | "outline" | "ghost" | "link";
}) {
  return (
    <Box bg="white" borderWidth="1px" borderRadius="lg" p={6} shadow="sm" flex="1" minW={{ base: "full", md: "280px" }}>
      <Stack spacing={4} align="center" textAlign="center">
        <Icon as={icon} boxSize={8} color="teal.500" />
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
        <Button as={Link} to={to} colorScheme={colorScheme} variant={variant ?? "solid"} width="full">
          {buttonLabel}
        </Button>
      </Stack>
    </Box>
  );
}