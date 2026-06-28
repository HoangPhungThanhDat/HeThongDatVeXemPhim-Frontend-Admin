

import {
    Box, Text, Button, Flex, SimpleGrid, Grid, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { 
    MdArrowBack, MdEdit, MdDelete, MdCalendarToday, 
    MdPerson, MdPhone, MdEmail, MdLink, MdLocationOn,
    MdBusiness, MdInfo, MdWarning, MdMovie
  } from "react-icons/md";
  import { FaBuilding, FaGlobe } from "react-icons/fa";
  import { StatusBadge } from "./shared/StatusBadge";
  import { RegionBadge } from "./shared/RegionBadge";
  import { fadeIn, shimmer, fadeUp } from "./shared/animations";
  import { FLAG_MAP } from "../constants";
  
  export function NhaPhatHanhDetail({ distributor, movies, onBack, onEdit, onDelete }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const cardBg2 = useColorModeValue("#f8fafc", "#0B1437");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
    const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
    const descBg = useColorModeValue("#fffbf7", "rgba(194,65,12,0.10)");
    const descBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.3)");
    const filterBg = useColorModeValue("#f8fafc", "#1b2559");
    const filterBorder = useColorModeValue("#e2e8f0", "#243170");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
    const pillBg = useColorModeValue("#f8fafc", "#0d1a3a");
    const pillBorder = useColorModeValue("#f1f5f9", "#1b2559");
  
    // Lấy dữ liệu
    const id = distributor.DistributorId || distributor.id;
    const name = distributor.Name || distributor.name || "";
    const shortName = distributor.ShortName || distributor.shortName || name.substring(0, 2).toUpperCase();
    const type = distributor.Type || distributor.type || "International";
    const status = distributor.Status || distributor.status || "Active";
    const country = distributor.Country || distributor.country || "";
    const contactPerson = distributor.ContactPerson || distributor.contactPerson || "";
    const email = distributor.Email || distributor.email || "";
    const phone = distributor.Phone || distributor.phone || "";
    const website = distributor.Website || distributor.website || "";
    const address = distributor.Address || distributor.address || "";
    const description = distributor.Description || distributor.description || "";
    const foundedYear = distributor.FoundedYear || distributor.foundedYear || "";
    const contractStart = distributor.ContractStart || distributor.contractStart || "";
    const contractEnd = distributor.ContractEnd || distributor.contractEnd || "";
    const notes = distributor.Notes || distributor.notes || "";
    const logoColor = distributor.LogoColor || distributor.logoColor || "#f97316";
    const moviesCount = distributor.moviesCount || 0;
    const createdAt = distributor.CreatedAt || distributor.createdAt || "";
    const updatedAt = distributor.UpdatedAt || distributor.updatedAt || "";
    const createdBy = distributor.CreatedBy || distributor.createdBy || "N/A";
    const updatedBy = distributor.UpdatedBy || distributor.updatedBy || "N/A";
    const movieId = distributor.MovieId || distributor.movieId || "";
  
    // Tìm tên phim
    const movieTitle = movies.find(m => (m.MovieId || m.id) === movieId)?.Title || movieId || "";
  
    // Kiểm tra hợp đồng
    const contractExpiring = contractEnd && (() => {
      const diff = (new Date(contractEnd) - new Date()) / 86400000;
      return diff < 90 && diff > 0;
    })();
    const contractExpired = contractEnd && new Date(contractEnd) < new Date();
  
    return (
      <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
        {/* Header - Back + Actions */}
        <Flex align="center" justify="space-between" mb="18px" gap="10px"
          direction={{ base: "column", sm: "row" }}
        >
          <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
            color={secondaryBtnColor} borderRadius="10px" h="40px" fontSize="13px" fontWeight="600"
            border={`1.5px solid ${secondaryBtnBorder}`} _hover={{ bg: secondaryBtnHoverBg }}
            onClick={onBack}
            w={{ base: "100%", sm: "auto" }}
          >
            Quay lại danh sách
          </Button>
          <Flex gap="8px" w={{ base: "100%", sm: "auto" }}>
            <Button flex="1" h="40px" px={{ base: "12px", md: "16px" }} borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg={useColorModeValue("#fff5f5", "#2d0a0a")}
              color="#dc2626" border={`1px solid ${useColorModeValue("#fca5a5", "rgba(239,68,68,0.3)")}`}
              _hover={{ bg: useColorModeValue("#fee2e2", "rgba(239,68,68,0.22)"), transform: "translateY(-1px)" }}
              transition="all 0.2s"
              leftIcon={<Icon as={MdDelete} />}
              onClick={onDelete}
            >
              Xóa
            </Button>
            <Button flex="1" h="40px" px={{ base: "14px", md: "20px" }} borderRadius="10px"
              fontWeight="700" fontSize="13px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              color="white" boxShadow="0 4px 14px rgba(249,115,22,0.3)"
              _hover={{ boxShadow: "0 6px 20px rgba(249,115,22,0.4)", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }} transition="all 0.2s"
              leftIcon={<Icon as={MdEdit} />}
              onClick={onEdit}
            >
              Chỉnh sửa
            </Button>
          </Flex>
        </Flex>
  
        {/* Hero Card */}
        <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
          boxShadow="0 2px 12px rgba(0,0,0,0.06)" overflow="hidden" mb="18px"
        >
          <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
            bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
          />
          <Box p={{ base: "18px", md: "28px" }}>
            <Flex direction={{ base: "column", sm: "row" }} gap="20px" align="flex-start">
              {/* Logo */}
              <Box w={{ base: "64px", md: "80px" }} h={{ base: "64px", md: "80px" }} borderRadius="18px"
                bg={`${logoColor}18`} border={`2.5px solid ${logoColor}35`}
                display="flex" alignItems="center" justifyContent="center" flexShrink="0"
              >
                <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={logoColor}>
                  {shortName}
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="800"
                  color={textPrimary} letterSpacing="-0.5px" mb="8px">{name}</Text>
                <Flex gap="8px" flexWrap="wrap">
                  <StatusBadge status={status} />
                  <RegionBadge type={type} />
                  {country && (
                    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
                      bg={pillBg} border={`1px solid ${pillBorder}`}
                    >
                      <Text fontSize="13px">{FLAG_MAP[country] || "🌍"}</Text>
                      <Text fontSize="12px" fontWeight="600" color={textSecondary}>{country}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Flex>
  
            <Box h="1px" bg={cardBorder} my="18px" />
  
            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="16px">
              {[
                { icon: MdMovie, label: "Phim", val: `${moviesCount} phim`, color: "#f97316" },
                { icon: FaBuilding, label: "Năm thành lập", val: foundedYear || "—", color: "#2563eb" },
                { icon: MdCalendarToday, label: "Hợp đồng đến", val: contractEnd ? new Date(contractEnd).toLocaleDateString("vi-VN") : "—", color: "#7c3aed" },
                { icon: MdPerson, label: "Người đại diện", val: contactPerson || "—", color: "#059669" },
              ].map(({ icon: Ic, label, val, color }) => (
                <Box key={label} p="12px 14px" borderRadius="12px"
                  bg={filterBg} border={`1px solid ${cardBorder}`}
                >
                  <Flex align="center" gap="6px" mb="5px">
                    <Icon as={Ic} boxSize="11px" color={color} />
                    <Text fontSize="9.5px" fontWeight="700" color={textMuted}
                      letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                  </Flex>
                  <Text fontSize="13px" fontWeight="800" color={textPrimary}>{val}</Text>
                </Box>
              ))}
            </SimpleGrid>
  
            {/* Contract Warning */}
            {(contractExpiring || contractExpired) && (
              <Box p="12px 14px" borderRadius="10px" mb="14px"
                bg={useColorModeValue(
                  contractExpired ? "#fef2f2" : "#fffbeb",
                  contractExpired ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)"
                )}
                border={`1px solid ${useColorModeValue(
                  contractExpired ? "#fca5a5" : "#fcd34d",
                  contractExpired ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"
                )}`}
                sx={{ animation: `${fadeIn} 0.3s ease both` }}
              >
                <Flex align="center" gap="8px">
                  <Icon as={MdWarning} boxSize="16px" color={contractExpired ? "#dc2626" : "#f59e0b"} />
                  <Text fontSize="12.5px" fontWeight="700"
                    color={contractExpired ? "#dc2626" : "#b45309"}>
                    {contractExpired ? "⚠️ Hợp đồng đã hết hạn — Cần gia hạn ngay!" : "🔔 Hợp đồng sắp hết hạn trong vòng 90 ngày"}
                  </Text>
                </Flex>
              </Box>
            )}
  
            {/* Description */}
            {description && (
              <Box p="14px 16px" borderRadius="12px" bg={descBg} border={`1px solid ${descBorder}`}>
                <Text fontSize="10px" fontWeight="800" color="#f97316"
                  letterSpacing="1px" textTransform="uppercase" mb="7px">Giới thiệu</Text>
                <Text fontSize={{ base: "12.5px", md: "13px" }} color={textSecondary} lineHeight="1.75">
                  {description}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
  
        {/* Contact + Contract - Sử dụng Grid đã import */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="14px" mb="16px">
          {/* Contact Info */}
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
            sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
          >
            <Flex align="center" gap="8px" mb="12px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={MdPerson} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="11px" fontWeight="800" color={textPrimary} letterSpacing="0.3px">
                Thông tin liên hệ
              </Text>
            </Flex>
            <Box h="1px" bg={cardBorder} mb="14px" />
            <Flex direction="column" gap="12px">
              {[
                { icon: MdPerson, label: "Người đại diện", val: contactPerson },
                { icon: MdEmail, label: "Email", val: email, isLink: true },
                { icon: MdPhone, label: "Điện thoại", val: phone },
                { icon: MdLink, label: "Website", val: website, isLink: true },
                { icon: MdLocationOn, label: "Địa chỉ", val: address },
              ].map(({ icon: Ic, label, val, isLink }) => (
                <Flex key={label} align="flex-start" gap="10px">
                  <Box w="28px" h="28px" borderRadius="8px"
                    bg={useColorModeValue("#fff7ed", "rgba(249,115,22,0.12)")}
                    display="flex" alignItems="center" justifyContent="center" flexShrink="0" mt="1px"
                  >
                    <Icon as={Ic} boxSize="12px" color="#f97316" />
                  </Box>
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={textMuted}
                      letterSpacing="0.7px" textTransform="uppercase">{label}</Text>
                    {isLink ? (
                      <Text as="a" href={val} target="_blank"
                        fontSize="12.5px" fontWeight="600" color="#2563eb"
                        textDecoration="underline" display="block" noOfLines={1}>{val || "—"}</Text>
                    ) : (
                      <Text fontSize="12.5px" fontWeight="600" color={textPrimary} mt="1px">{val || "—"}</Text>
                    )}
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
  
          {/* Contract Info */}
          <Flex direction="column" gap="14px">
            <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
              boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
              sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
            >
              <Flex align="center" gap="8px" mb="12px">
                <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={MdCalendarToday} boxSize="13px" color="#f97316" />
                </Box>
                <Text fontSize="11px" fontWeight="800" color={textPrimary} letterSpacing="0.3px">
                  Hợp đồng
                </Text>
              </Flex>
              <Box h="1px" bg={cardBorder} mb="14px" />
              <Grid templateColumns="1fr 1fr" gap="10px">
                <Box p="12px" borderRadius="10px" bg={filterBg} border={`1px solid ${cardBorder}`}>
                  <Text fontSize="9.5px" fontWeight="700" color={textMuted}
                    letterSpacing="0.7px" textTransform="uppercase" mb="4px">Bắt đầu</Text>
                  <Text fontSize="13px" fontWeight="700" color={textPrimary}>
                    {contractStart ? new Date(contractStart).toLocaleDateString("vi-VN") : "—"}
                  </Text>
                </Box>
                <Box p="12px" borderRadius="10px"
                  bg={useColorModeValue(
                    contractExpired ? "#fef2f2" : contractExpiring ? "#fffbeb" : filterBg,
                    contractExpired ? "rgba(239,68,68,0.1)" : contractExpiring ? "rgba(245,158,11,0.1)" : filterBg
                  )}
                  border={`1px solid ${useColorModeValue(
                    contractExpired ? "#fca5a5" : contractExpiring ? "#fcd34d" : cardBorder,
                    contractExpired ? "rgba(239,68,68,0.3)" : contractExpiring ? "rgba(245,158,11,0.3)" : cardBorder
                  )}`}
                >
                  <Text fontSize="9.5px" fontWeight="700"
                    color={contractExpired ? "#dc2626" : contractExpiring ? "#b45309" : textMuted}
                    letterSpacing="0.7px" textTransform="uppercase" mb="4px">Kết thúc</Text>
                  <Text fontSize="13px" fontWeight="700"
                    color={contractExpired ? "#dc2626" : contractExpiring ? "#b45309" : textPrimary}>
                    {contractEnd ? new Date(contractEnd).toLocaleDateString("vi-VN") : "—"}
                  </Text>
                </Box>
              </Grid>
            </Box>
  
            {notes && (
              <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
                boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "16px", md: "20px" }}
                sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
              >
                <Flex align="center" gap="8px" mb="12px">
                  <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={MdInfo} boxSize="13px" color="#f97316" />
                  </Box>
                  <Text fontSize="11px" fontWeight="800" color={textPrimary} letterSpacing="0.3px">
                    Ghi chú nội bộ
                  </Text>
                </Flex>
                <Box h="1px" bg={cardBorder} mb="12px" />
                <Box p="12px 14px" borderRadius="10px" bg={filterBg} border={`1px solid ${cardBorder}`}>
                  <Text fontSize="12.5px" color={textSecondary} lineHeight="1.7">{notes}</Text>
                </Box>
              </Box>
            )}
          </Flex>
        </Grid>
  
        {/* System Info */}
        <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
          boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
          sx={{ animation: `${fadeUp} 0.5s ease both` }}
        >
          <Flex align="center" gap="8px" mb="12px">
            <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdBusiness} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="11px" fontWeight="800" color={textPrimary} letterSpacing="0.3px">
              Thông tin hệ thống
            </Text>
          </Flex>
          <Box h="1px" bg={cardBorder} mb="12px" />
          
          <Flex gap="12px" flexWrap="wrap" direction={{ base: "column", sm: "row" }}>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Người tạo
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>{createdBy}</Text>
              </Box>
            </Box>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Ngày tạo
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "N/A"}
                </Text>
              </Box>
            </Box>
          </Flex>
          
          <Box h="1px" bg={cardBorder} my="10px" />
          
          <Flex gap="12px" flexWrap="wrap" direction={{ base: "column", sm: "row" }}>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Người cập nhật
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>{updatedBy}</Text>
              </Box>
            </Box>
            <Box flex="1" minW="0">
              <Box p="10px 12px" borderRadius="8px" bg={cardBg2} border={`1px solid ${cardBorder}`}>
                <Text fontSize="9px" fontWeight="700" color={textMuted} textTransform="uppercase" letterSpacing="0.6px" mb="2px">
                  Cập nhật lần cuối
                </Text>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "N/A"}
                </Text>
              </Box>
            </Box>
          </Flex>
  
          <Box h="1px" bg={cardBorder} my="10px" />
  
          <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FaBuilding} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                ID Nhà phát hành
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="700" color={textPrimary} fontFamily="monospace">
              #{id}
            </Text>
          </Flex>
  
          {/* Movie linked */}
          {movieTitle && (
            <>
              <Box h="1px" bg={cardBorder} my="10px" />
              <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
                <Flex align="center" gap="8px">
                  <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={MdMovie} boxSize="13px" color="#f97316" />
                  </Box>
                  <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
                    Phim liên quan
                  </Text>
                </Flex>
                <Text fontSize="13px" fontWeight="600" color={textPrimary}>
                  {movieTitle}
                </Text>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    );
  }