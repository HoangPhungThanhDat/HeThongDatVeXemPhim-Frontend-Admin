

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDelete, MdPerson } from "react-icons/md";
  import { FaFilm, FaGlobe } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { RoleBadge } from "./shared/RoleBadge";
  import { fadeUp, shimmer, pulse } from "./shared/animations";
  
  export function DienVienCard({ 
    artist, index, onView, onEdit, onDelete, onToggle 
  }) {
    const isDark = useColorModeValue(false, true);
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textBody = useColorModeValue("#475569", "#cbd5e1");
    const textSub = useColorModeValue("#94a3b8", "#8b9bc4");
    const noPhotoBg = useColorModeValue("#f1f5f9", "#1b2559");
    const filterBg = useColorModeValue("#f8fafc", "#1b2559");
    const filterBorder = useColorModeValue("#e2e8f0", "#243170");
    const pillBg = useColorModeValue("#f8fafc", "#0d1a3a");
    const pillBorder = useColorModeValue("#f1f5f9", "#1b2559");
  
    const name = artist.Name || artist.name || "";
    const role = artist.Role || artist.role || "Actor";
    const status = artist.Status || artist.status || "Active";
    const photo = artist.Photo || artist.photo || "";
    const nationality = artist.Nationality || artist.nationality || "";
    const movies = artist.movies || [];
    const movieCount = movies.length;
  
    return (
      <Box
        borderRadius="16px" bg={cardBg} overflow="hidden"
        border={`1.5px solid ${cardBorder}`}
        boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        transition="all 0.25s"
        _hover={{ 
          border: `1.5px solid #f97316`, 
          boxShadow: isDark ? "0 8px 28px rgba(249,115,22,0.18)" : "0 8px 28px rgba(249,115,22,0.13)", 
          transform: "translateY(-3px)" 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
      >
        <Box h="3px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 4s linear infinite` }} 
        />
  
        {/* Photo */}
        <Box position="relative" h="180px" bg={isDark ? "#1b2559" : "#f8fafc"} overflow="hidden">
          {photo ? (
            <img src={photo} alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          ) : (
            <Flex align="center" justify="center" h="100%" direction="column" gap="8px">
              <Box w="56px" h="56px" borderRadius="full" bg={noPhotoBg}
                display="flex" alignItems="center" justifyContent="center">
                <Icon as={MdPerson} boxSize="28px" color={textSub} />
              </Box>
              <Text fontSize="11px" color={textSub}>Chưa có ảnh</Text>
            </Flex>
          )}
          <Box position="absolute" bottom="0" left="0" right="0" h="60px"
            bg={isDark
              ? "linear-gradient(to top, rgba(17,28,68,0.95), transparent)"
              : "linear-gradient(to top, rgba(255,255,255,0.95), transparent)"}
          />
        </Box>
  
        {/* Info */}
        <Box p="14px 16px 16px">
          <Text fontSize="14.5px" fontWeight="800" color={textPrimary} noOfLines={1} mb="6px">
            {name}
          </Text>
          <Flex gap="6px" flexWrap="wrap" mb="10px">
            <RoleBadge role={role} />
            {nationality && (
              <Flex align="center" gap="4px" px="8px" py="4px" borderRadius="7px"
                bg={pillBg} border={`1px solid ${pillBorder}`}
              >
                <Icon as={FaGlobe} boxSize="9px" color={textSub} />
                <Text fontSize="11px" fontWeight="600" color={textBody}>{nationality}</Text>
              </Flex>
            )}
          </Flex>
  
          <Flex align="center" gap="6px" mb="10px">
            <Icon as={FaFilm} boxSize="11px" color="#f97316" />
            <Text fontSize="12px" fontWeight="600" color={textBody}>
              {movieCount} phim tham gia
            </Text>
          </Flex>
  
          <StatusBadge status={status} />
  
          <Box h="1px" bg={filterBorder} my="12px" />
  
          {/* Actions */}
          <Flex gap="7px">
            <Button flex="1" h="34px" borderRadius="9px"
              bg={pillBg} color={textBody} border={`1px solid ${filterBorder}`}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: filterBg, color: textPrimary }} transition="all 0.15s"
              onClick={() => onView(artist)}
            >
              Xem
            </Button>
            <Button flex="1" h="34px" borderRadius="9px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(artist)}
            >
              Sửa
            </Button>
            <Button h="34px" px="10px" borderRadius="9px"
              bg={isDark ? "rgba(239,68,68,0.12)" : "#fef2f2"}
              color="#dc2626" border={`1px solid ${isDark ? "rgba(239,68,68,0.3)" : "#fca5a5"}`}
              fontSize="12px" fontWeight="600"
              _hover={{ bg: isDark ? "rgba(239,68,68,0.22)" : "#fee2e2", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(artist)}
            >
              <Icon as={MdDelete} boxSize="13px" />
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  }