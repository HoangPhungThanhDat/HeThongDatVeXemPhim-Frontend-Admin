

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDelete, MdPerson } from "react-icons/md";
  import { FaFilm, FaGlobe } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { RoleBadge } from "./shared/RoleBadge";
  import { fadeUp } from "./shared/animations";
  
  export function DienVienRow({ 
    artist, index, onView, onEdit, onDelete, onToggle 
  }) {
    const isDark = useColorModeValue(false, true);
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textBody = useColorModeValue("#475569", "#cbd5e1");
    const textSub = useColorModeValue("#94a3b8", "#8b9bc4");
    const textMuted = useColorModeValue("#c0c8d4", "#4a5568");
    const rowHoverBg = useColorModeValue("#fffbf7", "#0d1a3a");
    const filterBg = useColorModeValue("#f8fafc", "#1b2559");
    const filterBorder = useColorModeValue("#e2e8f0", "#243170");
    const pillBg = useColorModeValue("#f8fafc", "#0d1a3a");
    const pillBorder = useColorModeValue("#f1f5f9", "#1b2559");
    const noPhotoBg = useColorModeValue("#f1f5f9", "#1b2559");
  
    const name = artist.Name || artist.name || "";
    const role = artist.Role || artist.role || "Actor";
    const status = artist.Status || artist.status || "Active";
    const photo = artist.Photo || artist.photo || "";
    const nationality = artist.Nationality || artist.nationality || "";
    const movies = artist.movies || [];
    const movieCount = movies.length;
  
    return (
      <Box
        p={{ base: "14px", md: "12px 18px" }}
        borderRadius="12px" bg={cardBg}
        border={`1.5px solid ${cardBorder}`}
        transition="all 0.2s"
        _hover={{ 
          border: `1.5px solid #f97316`, 
          boxShadow: isDark ? "0 2px 12px rgba(249,115,22,0.15)" : "0 2px 12px rgba(249,115,22,0.1)", 
          bg: rowHoverBg 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      >
        <Flex align="center">
          <Box w="32px" flexShrink="0" display={{ base: "none", md: "block" }}>
            <Text fontSize="12px" fontWeight="700" color={textMuted}>
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Box>
  
          <Box w={{ base: "48px", md: "52px" }} h={{ base: "48px", md: "52px" }}
            borderRadius="12px" overflow="hidden" flexShrink="0" mr="14px"
            bg={noPhotoBg}
          >
            {photo ? (
              <img src={photo} alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <Flex align="center" justify="center" h="100%">
                <Icon as={MdPerson} boxSize="22px" color={textSub} />
              </Flex>
            )}
          </Box>
  
          <Box flex="2" minW="0" pr="12px">
            <Text fontSize="13.5px" fontWeight="700" color={textPrimary} noOfLines={1}>{name}</Text>
            <Flex gap="6px" mt="4px" flexWrap="wrap">
              <RoleBadge role={role} />
            </Flex>
          </Box>
  
          <Box flex="0.8" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <Flex align="center" gap="5px">
              <Icon as={FaGlobe} boxSize="11px" color={textSub} />
              <Text fontSize="12px" fontWeight="600" color={textBody}>{nationality || "—"}</Text>
            </Flex>
          </Box>
  
          <Box flex="1" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <Flex align="center" gap="4px">
              <Icon as={FaFilm} boxSize="11px" color="#f97316" />
              <Text fontSize="12px" fontWeight="600" color={textBody}>{movieCount} phim</Text>
            </Flex>
            <Text fontSize="10.5px" color={textSub} noOfLines={1} mt="2px">
              {movies.slice(0, 2).join(", ")}{movies.length > 2 ? "..." : ""}
            </Text>
          </Box>
  
          <Box flex="0.7" minW="0" pr="12px" display={{ base: "none", md: "block" }}>
            <StatusBadge status={status} />
          </Box>
  
          <Flex gap="6px" flexShrink="0">
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={pillBg} color={textBody} border={`1px solid ${filterBorder}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: filterBg, color: textPrimary }} transition="all 0.15s"
              onClick={() => onView(artist)}
            >
              Xem
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(artist)}
            >
              Sửa
            </Button>
            <Button size="xs" h="30px" px="10px" borderRadius="8px"
              bg={isDark ? "rgba(239,68,68,0.12)" : "#fef2f2"}
              color="#dc2626" border={`1px solid ${isDark ? "rgba(239,68,68,0.3)" : "#fca5a5"}`}
              fontSize="11.5px" fontWeight="600"
              leftIcon={<Icon as={MdDelete} boxSize="12px" />}
              _hover={{ bg: isDark ? "rgba(239,68,68,0.22)" : "#fee2e2", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(artist)}
            >
              Xóa
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  }