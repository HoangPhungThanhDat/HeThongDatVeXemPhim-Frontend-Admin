import React from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, ModalCloseButton,
  Box, Flex, Text, Icon, Badge, Grid, VStack, HStack, Avatar, AvatarBadge, 
  Button, useColorModeValue, Tooltip as ChakraTooltip, Divider, Center
} from "@chakra-ui/react";
import {
  MdWarningAmber, MdOutlineFactCheck, MdErrorOutline, MdSmartphone,
  MdComputer, MdWifiTethering, MdPublic, MdHistory, MdPerson,
  MdAccessTime, MdSecurity, MdCheckCircle
} from "react-icons/md";
import { OR, ORL, scaleIn } from "../constants";
import ActionBadge from "./ActionBadge";
import StatusBadge from "./shared/StatusBadge";

export default function LogDetailModal({ log, onClose, isDark }) {
  // 🎨 Bảng màu chuyên nghiệp
  const bgModal = useColorModeValue("#ffffff", "#111827"); // Nền modal
  const bgCard = useColorModeValue("#f8fafc", "#1f2937");   // Nền card con
  const borderCol = useColorModeValue("#e2e8f0", "#374151"); // Viền
  const textMain = useColorModeValue("#0f172a", "#f9fafb");  // Chữ chính
  const textSub = useColorModeValue("#64748b", "#9ca3af");   // Chữ phụ
  const headerBg = isDark 
    ? "linear-gradient(135deg, #1e293b, #0f172a)" 
    : "linear-gradient(135deg, #ffffff, #f1f5f9)";

  if (!log) return null;
  const isAbnormal = log.status === "Bất thường";
  const displayIp = log.ip === '::1' ? '127.0.0.1' : log.ip;

  return (
    <Modal isOpen={!!log} onClose={onClose} isCentered size="4xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(16px)" bg="rgba(15,23,42,.6)" />
      
      <ModalContent 
        borderRadius="24px" 
        overflow="hidden" 
        bg={bgModal}
        border={`1px solid ${borderCol}`}
        boxShadow="0 25px 50px -12px rgba(0,0,0,0.25)"
        sx={{ animation: `${scaleIn} .25s cubic-bezier(.22,1,.36,1) both` }}
        maxH="90vh"
      >
        {/* === HEADER === */}
        <Box 
          bg={headerBg} 
          px={{ base: 6, md: 8 }} 
          py={6} 
          position="relative"
          borderBottom={`1px solid ${borderCol}`}
        >
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={4}>
              {/* Icon */}
              <Center
                w={14}
                h={14}
                borderRadius="2xl"
                bg={isAbnormal ? "rgba(220,38,38,0.1)" : "rgba(249,115,22,0.1)"}
                color={isAbnormal ? "red.500" : OR}
                border={`1px solid ${isAbnormal ? "rgba(220,38,38,0.2)" : "rgba(249,115,22,0.2)"}`}
              >
                <Icon as={isAbnormal ? MdWarningAmber : MdOutlineFactCheck} boxSize={7} />
              </Center>
              
              <Box>
                <Text fontSize="xl" fontWeight="800" color={textMain} letterSpacing="-0.5px">
                  Chi tiết nhật ký
                </Text>
                <HStack spacing={3} mt={1}>
                  <Badge 
                    bg={isAbnormal ? "red.50" : "orange.50"} 
                    color={isAbnormal ? "red.600" : "orange.600"}
                    borderRadius="md" 
                    px={2} 
                    py={0.5} 
                    fontSize="xs" 
                    fontWeight="700"
                    textTransform="none"
                  >
                    #{log.id}
                  </Badge>
                  <HStack spacing={1} color={textSub} fontSize="sm">
                    <Icon as={MdAccessTime} boxSize={3.5} />
                    <Text>{log.time}</Text>
                  </HStack>
                </HStack>
              </Box>
            </Flex>
            <ModalCloseButton position="static" borderRadius="full" color={textSub} _hover={{ bg: bgCard }} />
          </Flex>
        </Box>

        {/* === BODY === */}
        <ModalBody p={0}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 380px" }}>
            
            {/* --- CỘT TRÁI: Nội dung chính --- */}
            <Box p={{ base: 6, md: 8 }} borderRight={{ md: `1px solid ${borderCol}` }}>
              
              {/* Hàng badges */}
              <HStack spacing={3} mb={6} flexWrap="wrap">
                <ActionBadge action={log.action} />
                <StatusBadge status={log.status} />
              </HStack>

              {/* Cảnh báo bảo mật */}
              {isAbnormal && log.reason && (
                <Box 
                  mb={6} 
                  p={4} 
                  borderRadius="xl" 
                  bg="rgba(220,38,38,0.04)" 
                  border="1px solid rgba(220,38,38,0.15)"
                  position="relative"
                  overflow="hidden"
                >
                  <Flex gap={3}>
                    <Icon as={MdSecurity} boxSize={5} color="red.500" mt={0.5} flexShrink={0} />
                    <Box>
                      <Text fontSize="sm" fontWeight="700" color="red.500" mb={1}>
                        Cảnh báo bảo mật
                      </Text>
                      <Text fontSize="sm" fontWeight="500" color="red.600" lineHeight="1.6">
                        {log.reason}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              )}

              {/* Nội dung thao tác */}
              <Box mb={6}>
                <Text fontSize="xs" fontWeight="700" color={textSub} letterSpacing="wider" textTransform="uppercase" mb={2.5}>
                  Nội dung thao tác
                </Text>
                <Box 
                  p={4} 
                  borderRadius="xl" 
                  bg={bgCard} 
                  border={`1px solid ${borderCol}`}
                >
                  <Text fontSize="md" fontWeight="600" color={textMain} lineHeight="1.7">
                    {log.target}
                  </Text>
                </Box>
              </Box>

              {/* Người thực hiện */}
              <Box>
                <Text fontSize="xs" fontWeight="700" color={textSub} letterSpacing="wider" textTransform="uppercase" mb={3}>
                  Người thực hiện
                </Text>
                <Flex 
                  align="center" 
                  gap={4} 
                  p={4} 
                  borderRadius="xl" 
                  bg={bgCard} 
                  border={`1px solid ${borderCol}`}
                >
                  <Avatar 
                    size="md" 
                    name={log.user} 
                    bg={isAbnormal ? "red.500" : OR} 
                    color="white" 
                    fontWeight="bold"
                  >
                    <AvatarBadge boxSize="1em" bg={log.user === 'Khách vãng lai' ? "gray.400" : "green.400"} border="2px solid white" />
                  </Avatar>
                  <Box flex="1" minW="0">
                    <Text fontSize="md" fontWeight="700" color={textMain} noOfLines={1}>
                      {log.user}
                    </Text>
                    <Text fontSize="sm" color={textSub} mt={0.5} fontWeight="500">
                      {log.role}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* --- CỘT PHẢI: Thông tin kỹ thuật --- */}
            <Box p={{ base: 6, md: 8 }} bg={isDark ? "rgba(0,0,0,0.15)" : "#f8fafc"}>
              <Text fontSize="xs" fontWeight="700" color={textSub} letterSpacing="wider" textTransform="uppercase" mb={4}>
                Thông tin kỹ thuật
              </Text>

              <VStack spacing={0} align="stretch" divider={<Divider borderColor={borderCol} />}>
                {/* Thiết bị */}
                <TechRow 
                  icon={log.device.includes("Android") || log.device.includes("iOS") ? MdSmartphone : MdComputer}
                  label="Thiết bị / Trình duyệt"
                  value={log.device}
                  isDark={isDark}
                  textMain={textMain}
                  textSub={textSub}
                  tooltip
                />

                {/* IP */}
                <TechRow 
                  icon={MdWifiTethering}
                  label="Địa chỉ IP"
                  value={displayIp}
                  isDark={isDark}
                  textMain={textMain}
                  textSub={textSub}
                />

                {/* Vị trí */}
                <TechRow 
                  icon={MdPublic}
                  label="Vị trí"
                  value={log.location}
                  isDark={isDark}
                  textMain={textMain}
                  textSub={textSub}
                />

                {/* Thời gian */}
                <TechRow 
                  icon={MdHistory}
                  label="Thời gian ghi nhận"
                  value={log.time}
                  isDark={isDark}
                  textMain={textMain}
                  textSub={textSub}
                />
              </VStack>
            </Box>
          </Grid>
        </ModalBody>

        {/* === FOOTER === */}
        <ModalFooter 
          borderTop={`1px solid ${borderCol}`} 
          bg={bgModal} 
          px={{ base: 6, md: 8 }} 
          py={4}
        >
          <HStack w="full" justify="space-between">
            <HStack spacing={2} color={textSub} fontSize="xs">
              <Icon as={MdCheckCircle} color="green.500" />
              <Text>Đã ghi nhận</Text>
            </HStack>
            <HStack spacing={3}>
              <Button 
                variant="ghost" 
                onClick={onClose} 
                borderRadius="lg" 
                fontWeight="600" 
                color={textSub}
                _hover={{ bg: bgCard }}
              >
                Đóng
              </Button>
              <Button 
                h={10}
                px={6}
                borderRadius="lg" 
                fontWeight="600" 
                fontSize="sm"
                color="white" 
                bg={isAbnormal ? "red.500" : `linear-gradient(135deg, ${OR}, ${ORL})`}
                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                transition="all 0.2s"
                onClick={onClose}
              >
                Đã hiểu
              </Button>
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ✅ Component phụ: Hàng thông tin kỹ thuật
const TechRow = ({ icon, label, value, isDark, textMain, textSub, tooltip }) => {
  const rowBg = useColorModeValue("#ffffff", "#111827");
  const borderCol = useColorModeValue("#e2e8f0", "#374151");

  const content = (
    <Text fontSize="sm" fontWeight="600" color={textMain} noOfLines={tooltip ? 2 : 1}>
      {value}
    </Text>
  );

  return (
    <Flex align="center" gap={3} py={3}>
      <Center 
        w={9} 
        h={9} 
        borderRadius="lg" 
        bg={isDark ? "whiteAlpha.100" : "white"} 
        border={`1px solid ${borderCol}`}
        boxShadow="sm"
        flexShrink={0}
      >
        <Icon as={icon} boxSize={4} color={textSub} />
      </Center>
      <Box minW="0" flex="1">
        <Text fontSize="xs" fontWeight="600" color={textSub} mb={0.5}>
          {label}
        </Text>
        {tooltip ? (
          <ChakraTooltip label={value} placement="top" hasArrow openDelay={300}>
            {content}
          </ChakraTooltip>
        ) : content}
      </Box>
    </Flex>
  );
};