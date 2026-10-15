

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDelete, MdMovie, MdEmail } from "react-icons/md";
  import { StatusBadge } from "./shared/StatusBadge";
  import { RegionBadge } from "./shared/RegionBadge";
  import { fadeUp } from "./shared/animations";
  import { FLAG_MAP } from "../constants";
  
  export function NhaPhatHanhRow({ 
    distributor, index, onView, onEdit, onDelete 
  }) {
    const isDark = useColorModeValue(false, true);
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textBody = useColorModeValue("#475569", "#cbd5e1");
    const textSub = useColorModeValue("#94a3b8", "#8b9bc4");
    const textMuted = useColorModeValue("#c0c8d4", "#4a5568");
    const filterBg = useColorModeValue("#f8fafc", "#1b2559");
    const filterBorder = useColorModeValue("#e2e8f0", "#243170");
    const pillBg = useColorModeValue("#f8fafc", "#0d1a3a");
    const pillBorder = useColorModeValue("#f1f5f9", "#1b2559");
  
    const name = distributor.Name || distributor.name || "";
    const status = distributor.Status || distributor.status || "Active";
    const type = distributor.Type || distributor.type || "International";
    const country = distributor.Country || distributor.country || "";
    const email = distributor.Email || distributor.email || "";
    const phone = distributor.Phone || distributor.phone || "";
    const moviesCount = distributor.moviesCount || 0;
    const contactPerson = distributor.ContactPerson || distributor.contactPerson || "";
    const logoColor = distributor.LogoColor || distributor.logoColor || "#f97316";
    const shortName = distributor.ShortName || distributor.shortName || 
                      (name ? name.substring(0, 2).toUpperCase() : "PH");
  
    const isInactive = status === "Ended" || status === "Inactive";
  
    return (
      <Box
        p={{ base: "14px", md: "12px 18px" }}
        borderRadius="12px" bg={cardBg}
        border={`1.5px solid ${isInactive ? cardBorder : `${logoColor}44`}`}
        transition="all 0.2s"
        _hover={{ 
          border: `1.5px solid #f97316`, 
          boxShadow: isDark ? "0 2px 12px rgba(249,115,22,0.15)" : "0 2px 12px rgba(249,115,22,0.1)", 
          bg: useColorModeValue("#fffbf7", "#0d1a3a")
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
        opacity={isInactive ? 0.65 : 1}
      >
        <Flex align="center">
          <Box w="28px" flexShrink="0" display={{ base: "none", md: "block" }}>
            <Text fontSize="11.5px" fontWeight="700" color={textMuted}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
  
          <Flex align="center" gap="12px" flex="2.5" minW="0" pr="12px">
            <Box w="40px" h="40px" borderRadius="10px"
              bg={`${logoColor}18`} border={`2px solid ${logoColor}35`}
              display="flex" alignItems="center" justifyContent="center" flexShrink="0"
            >
              <Text fontSize="13px" fontWeight="800" color={logoColor}>{shortName}</Text>
            </Box>
            <Box minW="0">
              <Text fontSize="13.5px" fontWeight="700" color={textPrimary} noOfLines={1}>{name}</Text>
              <Flex align="center" gap="5px" mt="3px">
                <Text fontSize="12px">{FLAG_MAP[country] || "🌍"}</Text>
                <Text fontSize="11px" color={textSub} fontWeight="600">{country}</Text>
              </Flex>
            </Box>
          </Flex>
  
          <Box flex="0.9" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <RegionBadge type={type} />
          </Box>
  
          <Box flex="1.1" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <StatusBadge status={status} />
          </Box>
  
          <Box flex="1.2" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <Text fontSize="12px" fontWeight="600" color={textPrimary} noOfLines={1}>
              {contactPerson || "—"}
            </Text>
            <Text fontSize="10.5px" color={textSub} noOfLines={1} mt="2px">
              {email}
            </Text>
          </Box>
  
          <Box flex="0.8" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <Flex align="center" gap="5px">
              <Icon as={MdMovie} boxSize="11px" color="#f97316" />
              <Text fontSize="12px" fontWeight="700" color={textPrimary}>{moviesCount} phim</Text>
            </Flex>
            <Text fontSize="10.5px" color={textSub} mt="2px">{phone}</Text>
          </Box>
  
          <Flex gap="5px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={pillBg} color={textBody} border={`1px solid ${pillBorder}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="11px" />}
              _hover={{ bg: filterBg, color: textPrimary }} transition="all 0.15s"
              onClick={() => onView(distributor)}
            >
              Xem
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="11px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(distributor)}
            >
              Sửa
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={isDark ? "rgba(239,68,68,0.12)" : "#fef2f2"}
              color="#dc2626" border={`1px solid ${isDark ? "rgba(239,68,68,0.3)" : "#fca5a5"}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdDelete} boxSize="11px" />}
              _hover={{ bg: isDark ? "rgba(239,68,68,0.22)" : "#fee2e2", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(distributor)}
            >
              Xóa
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  }