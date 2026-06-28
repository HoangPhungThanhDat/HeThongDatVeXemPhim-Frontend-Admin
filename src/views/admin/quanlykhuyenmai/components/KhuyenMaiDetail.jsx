// views/admin/quanlykhuyenmai/components/KhuyenMaiDetail.jsx

import {
  Box, Text, Button, Flex, SimpleGrid, Icon, useColorModeValue
} from "@chakra-ui/react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCalendarToday, 
  MdLocalOffer, MdBarChart, MdAttachMoney, MdDescription,
  MdPerson, MdAccessTime, MdImage
} from "react-icons/md";
import { FaTag, FaPercent } from "react-icons/fa";
import { StatusBadge } from "./shared/StatusBadge";
import { TypeBadge } from "./shared/TypeBadge";
import { fadeIn, shimmer, fadeUp } from "./shared/animations";
import { STATUS_MAP, TYPE_CONFIG, TYPE_MAP } from "../constants";

export function KhuyenMaiDetail({ promo, onBack, onEdit, onDelete }) {
  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("#f1f5f9", "#1a2744");
  const cardBg2 = useColorModeValue("#f8fafc", "#0B1437");
  const textPrimary = useColorModeValue("#0f172a", "#e2e8f0");
  const textSecondary = useColorModeValue("#475569", "#cbd5e1");
  const textMuted = useColorModeValue("#94a3b8", "#6b7fa3");
  const tagBg = useColorModeValue("#fff7ed", "rgba(194,65,12,0.16)");
  const tagBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.35)");
  const descBg = useColorModeValue("#fffbf7", "rgba(194,65,12,0.10)");
  const descBorder = useColorModeValue("#fed7aa", "rgba(253,186,116,0.3)");
  const descTitleColor = useColorModeValue("#92400e", "#fdba74");

  // Lấy dữ liệu từ promo
  const id = promo.PromotionId || promo.id;
  const title = promo.Title || promo.title || "";
  const code = promo.Code || promo.code || "";
  const description = promo.Description || promo.description || "";
  const imageUrl = promo.ImageUrl || promo.imageUrl || "";
  const type = promo.DiscountType || promo.discountType || "Percentage";
  const discountValue = promo.DiscountValue || promo.discountValue || 0;
  const startDate = promo.StartDate || promo.startDate || "";
  const endDate = promo.EndDate || promo.endDate || "";
  const status = promo.Status || promo.status || "Inactive";
  const applyFor = promo.ApplyFor || promo.applyFor || "Tất cả phim";
  const applyTarget = promo.ApplyTarget || promo.applyTarget || "";
  const minOrder = promo.MinOrder || promo.minOrder || 0;
  const maxDiscount = promo.MaxDiscount || promo.maxDiscount || 0;
  const usageCount = promo.UsageCount || promo.usageCount || 0;
  const usageLimit = promo.UsageLimit || promo.usageLimit || 0;
  const createdAt = promo.CreatedAt || promo.createdAt || "";
  const updatedAt = promo.UpdatedAt || promo.updatedAt || "";

  const typeCfg = TYPE_CONFIG[type] || TYPE_CONFIG["Percentage"];
  const typeLabel = TYPE_MAP[type] || type;
  const isActive = status === "Active";

  const formatValue = () => {
    if (type === "Percentage") return `${discountValue}%`;
    if (type === "FixedAmount") return `${Number(discountValue).toLocaleString()}đ`;
    return "1+1";
  };

  const pct = usageLimit > 0 ? Math.min(100, Math.round((usageCount / usageLimit) * 100)) : null;

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header - Back + Actions */}
      <Flex align="center" justify="space-between" mb="20px"
        direction={{ base: "column", sm: "row" }} gap="10px"
      >
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={useColorModeValue("#64748b", "#94a3b8")} 
          borderRadius="10px" h="38px"
          fontSize={{ base: "12px", md: "13px" }} fontWeight="600"
          border={useColorModeValue("1.5px solid #e2e8f0", "1.5px solid #2d3a6b")}
          _hover={{ bg: useColorModeValue("#f8fafc", "#0f172a") }}
          onClick={onBack}
          w={{ base: "100%", sm: "auto" }}
        >
          <Box as="span" display={{ base: "none", sm: "inline" }}>Quay lại danh sách</Box>
          <Box as="span" display={{ base: "inline", sm: "none" }}>Danh sách</Box>
        </Button>
        <Flex gap="8px" w={{ base: "100%", sm: "auto" }}>
          <Button flex="1" h="40px" px={{ base: "12px", md: "18px" }} borderRadius="10px"
            fontWeight="700" fontSize="13px"
            bg={useColorModeValue("#fff5f5", "#2d0a0a")} 
            color="#ef4444"
            border="1px solid #fca5a5"
            _hover={{ bg: "#fef2f2", border: "1px solid #ef4444", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
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
            transition="all 0.2s"
            leftIcon={<Icon as={MdEdit} />}
            onClick={onEdit}
          >
            Chỉnh sửa
          </Button>
        </Flex>
      </Flex>

      {/* Hero Card */}
      <Box bg={cardBg} borderRadius="18px" border={`1px solid ${cardBorder}`}
        boxShadow="0 2px 12px rgba(0,0,0,0.08)" overflow="hidden" mb="18px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        
        <Flex direction={{ base: "column", md: "row" }}>
          {/* Left - Value Display */}
          <Box w={{ base: "100%", md: "200px" }} flexShrink="0"
            bg={useColorModeValue("linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)", "#0f172a")}
            borderRight={{ base: "none", md: useColorModeValue("1px solid #fed7aa", "1px solid #2d3a6b") }}
            borderBottom={{ base: useColorModeValue("1px solid #fed7aa", "1px solid #2d3a6b"), md: "none" }}
            display="flex" flexDirection={{ base: "row", md: "column" }}
            alignItems="center" justifyContent="center"
            p={{ base: "18px 20px", md: "28px" }}
            gap={{ base: "14px", md: "0" }}
          >
            <Box w="48px" h="48px" borderRadius="14px"
              bg={useColorModeValue(typeCfg.bg, "#1b2559")}
              border={`1.5px solid ${useColorModeValue(typeCfg.border, "#2d3a6b")}`}
              display="flex" alignItems="center" justifyContent="center"
              mb={{ base: "0", md: "12px" }} flexShrink="0"
            >
              <Icon as={typeCfg.icon || FaTag} boxSize="20px" color={typeCfg.color} />
            </Box>
            <Box textAlign={{ base: "left", md: "center" }}>
              <Text fontSize={{ base: "32px", md: "40px" }} fontWeight="900" color="#f97316" lineHeight="1">
                {formatValue()}
              </Text>
              <Text fontSize="11px" fontWeight="800" color={useColorModeValue("#b45309", "#94a3b8")} mt="4px"
                letterSpacing="1px" textTransform="uppercase"
              >
                {typeLabel}
              </Text>
            </Box>
          </Box>

          {/* Right - Info */}
          <Box p={{ base: "16px", md: "24px" }} flex="1">
            <Flex justify="space-between" align="flex-start" mb="8px">
              <Box flex="1" minW="0" pr="8px">
                <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800" color={textPrimary}
                  letterSpacing="-0.3px" mb="6px" noOfLines={2}
                >
                  {title}
                </Text>
                <Flex gap="6px" flexWrap="wrap" mb="6px">
                  <StatusBadge status={status} />
                  <TypeBadge type={type} />
                </Flex>
                {code && (
                  <Text fontSize="13px" color={textMuted} fontWeight="500">
                    Mã: <Text as="span" fontWeight="700" color="#f97316">{code}</Text>
                  </Text>
                )}
              </Box>
            </Flex>

            <Box h="1px" bg={useColorModeValue("#f1f5f9", "#2d3a6b")} mb="14px" />

            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing="10px" mb="14px">
              {[
                { icon: MdCalendarToday, label: "Bắt đầu", val: startDate || "N/A" },
                { icon: MdCalendarToday, label: "Kết thúc", val: endDate || "N/A" },
                { icon: MdLocalOffer, label: "Áp dụng", val: applyFor + (applyTarget ? `: ${applyTarget}` : "") },
                { icon: MdBarChart, label: "Đã dùng", val: `${usageCount.toLocaleString()} lượt` },
              ].map(({ icon: Ic, label, val }) => (
                <Box key={label} p="10px 12px" borderRadius="10px"
                  bg={useColorModeValue("#f8fafc", "#0f172a")}
                  border={useColorModeValue("1px solid #f1f5f9", "1px solid #2d3a6b")}
                >
                  <Flex align="center" gap="5px" mb="3px">
                    <Icon as={Ic} boxSize="11px" color="#f97316" />
                    <Text fontSize="9.5px" fontWeight="700" color={textSecondary}
                      letterSpacing="0.8px" textTransform="uppercase"
                    >
                      {label}
                    </Text>
                  </Flex>
                  <Text fontSize="12px" fontWeight="700" color={textPrimary} noOfLines={1}>{val}</Text>
                </Box>
              ))}
            </SimpleGrid>

            {/* Usage Progress */}
            {usageLimit > 0 && pct !== null && (
              <Box mb="14px" p="12px 14px" borderRadius="10px"
                bg={useColorModeValue("#f8fafc", "#0f172a")}
                border={useColorModeValue("1px solid #f1f5f9", "1px solid #2d3a6b")}
              >
                <Flex justify="space-between" mb="6px">
                  <Text fontSize="11px" fontWeight="700" color={textMuted}>Lượt sử dụng</Text>
                  <Text fontSize="11px" fontWeight="800" color={pct >= 90 ? "#ef4444" : textPrimary}>
                    {usageCount.toLocaleString()} / {usageLimit.toLocaleString()} ({pct}%)
                  </Text>
                </Flex>
                <Box h="6px" borderRadius="full" bg={useColorModeValue("#e2e8f0", "#2d3a6b")} overflow="hidden">
                  <Box h="100%" borderRadius="full" w={`${pct}%`}
                    bg={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
                    transition="width 0.4s ease"
                  />
                </Box>
              </Box>
            )}

            {/* Description */}
            {description && (
              <Box p="12px 16px" borderRadius="12px" bg={descBg} border={`1px solid ${descBorder}`}>
                <Flex align="center" gap="6px" mb="5px">
                  <Icon as={MdDescription} boxSize="14px" color="#f97316" />
                  <Text fontSize="10px" fontWeight="800" color={descTitleColor} 
                    letterSpacing="1px" textTransform="uppercase"
                  >
                    Mô tả chương trình
                  </Text>
                </Flex>
                <Text fontSize="13px" color={textSecondary} lineHeight="1.7">
                  {description}
                </Text>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Additional Info - 3 columns */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing="12px" mb="16px">
        {[
          {
            icon: MdLocalOffer,
            label: "Đối tượng áp dụng",
            val: applyFor + (applyTarget ? `: ${applyTarget}` : ""),
          },
          {
            icon: MdAttachMoney,
            label: "Đơn hàng tối thiểu",
            val: minOrder > 0 ? `${Number(minOrder).toLocaleString()}đ` : "Không giới hạn",
          },
          {
            icon: MdBarChart,
            label: "Giới hạn lượt dùng",
            val: usageLimit > 0 ? `${usageLimit.toLocaleString()} lượt` : "Không giới hạn",
          },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} bg={cardBg} border={`1px solid ${cardBorder}`} 
            borderRadius="14px" p="16px"
            sx={{ animation: `${fadeUp} 0.4s ease both` }}
          >
            <Flex align="center" gap="8px" mb="8px">
              <Box w="28px" h="28px" borderRadius="8px"
                bg={useColorModeValue("#fff7ed", "#0f172a")}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={Ic} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textSecondary} 
                letterSpacing="0.8px" textTransform="uppercase"
              >
                {label}
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.5">
              {val}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* System Info - 2 columns */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="12px" mb="16px">
        {[
          {
            icon: MdPerson,
            label: "Người tạo",
            val: promo.CreatedBy || promo.createdBy || "N/A",
          },
          {
            icon: MdAccessTime,
            label: "Ngày tạo",
            val: createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "N/A",
          },
        ].map(({ icon: Ic, label, val }) => (
          <Box key={label} bg={cardBg} border={`1px solid ${cardBorder}`} 
            borderRadius="14px" p="16px"
            sx={{ animation: `${fadeUp} 0.45s ease both` }}
          >
            <Flex align="center" gap="8px" mb="8px">
              <Box w="28px" h="28px" borderRadius="8px"
                bg={useColorModeValue("#fff7ed", "#0f172a")}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={Ic} boxSize="13px" color="#f97316" />
              </Box>
              <Text fontSize="10px" fontWeight="700" color={textSecondary} 
                letterSpacing="0.8px" textTransform="uppercase"
              >
                {label}
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="600" color={textPrimary} lineHeight="1.5">
              {val}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* ID & Update Info - Bottom */}
      <Box bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
        sx={{ animation: `${fadeUp} 0.5s ease both` }}
      >
        <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
          <Flex align="center" gap="8px">
            <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={FaTag} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
              ID Khuyến mãi
            </Text>
          </Flex>
          <Text fontSize="13px" fontWeight="700" color={textPrimary} fontFamily="monospace">
            #{id}
          </Text>
        </Flex>
        <Box h="1px" bg={cardBorder} my="10px" />
        <Flex align="center" justify="space-between" flexWrap="wrap" gap="10px">
          <Flex align="center" gap="8px">
            <Box w="28px" h="28px" borderRadius="8px" bg={cardBg2}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={MdAccessTime} boxSize="13px" color="#f97316" />
            </Box>
            <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
              Cập nhật lần cuối
            </Text>
          </Flex>
          <Text fontSize="13px" fontWeight="600" color={textPrimary}>
            {updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "N/A"}
          </Text>
        </Flex>
      </Box>

      {/* Image (nếu có) */}
      {imageUrl && (
  <Box mt="14px" bg={cardBg} borderRadius="14px" border={`1px solid ${cardBorder}`}
    boxShadow="0 1px 4px rgba(0,0,0,0.04)" p={{ base: "14px 16px", md: "16px 20px" }}
    sx={{ animation: `${fadeUp} 0.55s ease both` }}
  >
    <Flex align="center" gap="8px" mb="10px">
      <Box w="28px" h="28px" borderRadius="8px" bg={tagBg}
        display="flex" alignItems="center" justifyContent="center"
      >
        <Icon as={MdImage} boxSize="13px" color="#f97316" />
      </Box>
      <Text fontSize="10px" fontWeight="700" color={textMuted} letterSpacing="0.8px" textTransform="uppercase">
        Hình ảnh khuyến mãi
      </Text>
    </Flex>
    <Box 
  borderRadius="10px" 
  overflow="hidden" 
  border={`1px solid ${cardBorder}`}
  bg={cardBg2}
  position="relative"
  w="100%"
  pt="56.25%"  // Tỷ lệ 16:9 (hoặc có thể dùng 75% cho 4:3)
>
  <img 
    src={imageUrl} 
    alt={title}
    style={{ 
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",  // ✅ Hiển thị toàn bộ ảnh
      objectPosition: "center",
      backgroundColor: "#f8fafc"
    }}
    onError={(e) => { 
      e.target.style.display = "none"; 
    }}
  />
</Box>
  </Box>
      )}
    </Box>
  );
}