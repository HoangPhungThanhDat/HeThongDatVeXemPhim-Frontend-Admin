

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDelete, MdMovie, MdBusiness } from "react-icons/md";
  import { StatusBadge } from "./shared/StatusBadge";
  import { RegionBadge } from "./shared/RegionBadge";
  import { fadeUp } from "./shared/animations";
  import { FLAG_MAP } from "../constants";
  
  export function NhaPhatHanhCard({ 
    distributor, index, onView, onEdit, onDelete 
  }) {
    const isDark = useColorModeValue(false, true);
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textBody = useColorModeValue("#475569", "#cbd5e1");
    const textSub = useColorModeValue("#94a3b8", "#8b9bc4");
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
    const website = distributor.Website || distributor.website || "";
    const logoColor = distributor.LogoColor || distributor.logoColor || "#f97316";
    const shortName = distributor.ShortName || distributor.shortName || 
                      (name ? name.substring(0, 2).toUpperCase() : "PH");
  
    const isInactive = status === "Ended" || status === "Inactive";
  
    return (
      <Box
        borderRadius="16px" bg={cardBg} overflow="hidden"
        border={`1.5px solid ${isInactive ? cardBorder : `${logoColor}44`}`}
        boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        transition="all 0.25s"
        _hover={{ 
          border: `1.5px solid #f97316`, 
          boxShadow: isDark ? "0 8px 28px rgba(249,115,22,0.18)" : "0 8px 28px rgba(249,115,22,0.13)", 
          transform: "translateY(-3px)" 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
        opacity={isInactive ? 0.65 : 1}
      >
        <Box h="3px" bg={`linear-gradient(90deg, ${logoColor}, ${logoColor}88, ${logoColor})`}
          bgSize="200% 100%" sx={{ animation: `shimmer 4s linear infinite` }} 
        />
  
        <Box p="14px 16px 16px">
          {/* Logo + Name */}
          <Flex align="center" gap="12px" mb="10px">
            <Box w="48px" h="48px" borderRadius="12px"
              bg={`${logoColor}18`} border={`2px solid ${logoColor}35`}
              display="flex" alignItems="center" justifyContent="center" flexShrink="0"
            >
              <Text fontSize="16px" fontWeight="800" color={logoColor}>{shortName}</Text>
            </Box>
            <Box flex="1" minW="0">
              <Text fontSize="14px" fontWeight="700" color={textPrimary} noOfLines={1}>
                {name}
              </Text>
              <Flex gap="6px" flexWrap="wrap" mt="4px">
                <StatusBadge status={status} />
                <RegionBadge type={type} />
              </Flex>
            </Box>
          </Flex>
  
          {/* Country */}
          {country && (
            <Flex align="center" gap="6px" mb="8px">
              <Text fontSize="16px">{FLAG_MAP[country] || "🌍"}</Text>
              <Text fontSize="12.5px" fontWeight="600" color={textBody}>{country}</Text>
            </Flex>
          )}
  
          {/* Contact */}
          <Flex gap="10px" flexWrap="wrap" mb="10px">
            {email && (
              <Flex align="center" gap="4px">
                <Icon as={MdBusiness} boxSize="10px" color={textSub} />
                <Text fontSize="11px" color={textSub} noOfLines={1}>{email}</Text>
              </Flex>
            )}
            {phone && (
              <Flex align="center" gap="4px">
                <Icon as={MdBusiness} boxSize="10px" color={textSub} />
                <Text fontSize="11px" color={textSub}>{phone}</Text>
              </Flex>
            )}
          </Flex>
  
          {/* Movies Count */}
          <Flex align="center" gap="6px" mb="12px">
            <Icon as={MdMovie} boxSize="12px" color="#f97316" />
            <Text fontSize="12px" fontWeight="600" color={textBody}>
              {moviesCount} phim tham gia
            </Text>
          </Flex>
  
          <Box h="1px" bg={filterBorder} my="12px" />
  
          {/* Actions */}
          <Flex gap="7px">
            <Button flex="1" h="34px" borderRadius="9px"
              bg={pillBg} color={textBody} border={`1px solid ${filterBorder}`}
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
              _hover={{ bg: filterBg, color: textPrimary }} transition="all 0.15s"
              onClick={() => onView(distributor)}
            >
              Xem
            </Button>
            <Button flex="1" h="34px" borderRadius="9px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdEdit} boxSize="12px" />}
              _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
              boxShadow="0 2px 8px rgba(249,115,22,0.3)" transition="all 0.15s"
              onClick={() => onEdit(distributor)}
            >
              Sửa
            </Button>
            <Button h="34px" px="10px" borderRadius="9px"
              bg={isDark ? "rgba(239,68,68,0.12)" : "#fef2f2"}
              color="#dc2626" border={`1px solid ${isDark ? "rgba(239,68,68,0.3)" : "#fca5a5"}`}
              fontSize="12px" fontWeight="600"
              _hover={{ bg: isDark ? "rgba(239,68,68,0.22)" : "#fee2e2", transform: "translateY(-1px)" }}
              transition="all 0.15s"
              onClick={() => onDelete(distributor)}
            >
              <Icon as={MdDelete} boxSize="13px" />
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  }