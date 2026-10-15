

import {
    Box, Flex, Text, Button, Icon, useColorModeValue
  } from "@chakra-ui/react";
  import { MdVisibility, MdEdit, MdDeleteOutline, MdVisibilityOff, MdPublish, MdPerson, MdCalendarToday, MdRemoveRedEye } from "react-icons/md";
  import { StatusBadge } from "./shared/StatusBadge";
  import { CategoryBadge } from "./shared/CategoryBadge";
  import { fadeUp } from "./shared/animations";
  
  export function TinTucCard({ 
    article, index, onView, onEdit, onToggleStatus, onDelete 
  }) {
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.08)");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
    const textSecondary = useColorModeValue("#475569", "#cbd5e1");
    const textMuted = useColorModeValue("#94a3b8", "#8b9bc4");
    const dangerBg = useColorModeValue("#fef2f2", "rgba(239,68,68,0.13)");
    const dangerColor = useColorModeValue("#dc2626", "#f87171");
    const dangerBorder = useColorModeValue("#fecaca", "rgba(248,113,113,0.35)");
    const dangerHoverBg = useColorModeValue("#fee2e2", "rgba(239,68,68,0.2)");
    const warnBg = useColorModeValue("#fffbeb", "rgba(245,158,11,0.14)");
    const warnColor = useColorModeValue("#b45309", "#fcd34d");
    const warnBorder = useColorModeValue("#fcd34d", "rgba(252,211,77,0.35)");
    const successBg = useColorModeValue("#ecfdf5", "rgba(16,185,129,0.14)");
    const successColor = useColorModeValue("#059669", "#34d399");
    const successBorder = useColorModeValue("#6ee7b7", "rgba(110,231,183,0.35)");
    const secondaryBtnBg = useColorModeValue("#f8fafc", "rgba(255,255,255,0.05)");
    const secondaryBtnBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.14)");
    const secondaryBtnColor = useColorModeValue("#475569", "#cbd5e1");
    const secondaryBtnHoverBg = useColorModeValue("#f1f5f9", "rgba(255,255,255,0.1)");
  
    const isPublished = article.status === "Published";
  
    return (
      <Box 
        p="14px" 
        borderRadius="14px"
        bg={cardBg}
        border={`1.5px solid ${cardBorder}`}
        transition="all 0.2s"
        _hover={{ 
          border: "1.5px solid #f97316", 
          boxShadow: "0 2px 14px rgba(249,115,22,0.10)" 
        }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex gap="12px" mb="12px">
          <Box w="72px" h="52px" borderRadius="10px" overflow="hidden" flexShrink="0">
            <img 
              src={article.ImageUrl || article.imageUrl || article.thumbnail} 
              alt={article.Title || article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={2} mb="6px" lineHeight="1.4">
              {article.Title || article.title}
            </Text>
            <Flex gap="6px" flexWrap="wrap">
              <StatusBadge status={article.Status || article.status || "Draft"} />
              <CategoryBadge category={article.Category || article.category || "Tin tức"} />
            </Flex>
          </Box>
        </Flex>
        
        <Flex gap="12px" mb="10px" flexWrap="wrap">
          <Flex align="center" gap="4px">
            <Icon as={MdPerson} boxSize="11px" color={textMuted} />
            <Text fontSize="11px" color={textSecondary} fontWeight="600">
              {article.Author || article.author || "N/A"}
            </Text>
          </Flex>
          {article.CreatedAt && (
            <Flex align="center" gap="4px">
              <Icon as={MdCalendarToday} boxSize="11px" color={textMuted} />
              <Text fontSize="11px" color={textMuted}>
                {new Date(article.CreatedAt).toLocaleDateString("vi-VN")}
              </Text>
            </Flex>
          )}
          <Flex align="center" gap="4px">
            <Icon as={MdRemoveRedEye} boxSize="11px" color={textMuted} />
            <Text fontSize="11px" color={textSecondary}>{article.views || 0}</Text>
          </Flex>
        </Flex>
        
        <Flex gap="8px" mb="8px">
          <Button flex="1" size="sm" h="36px" borderRadius="9px" bg={secondaryBtnBg}
            color={secondaryBtnColor} border={`1px solid ${secondaryBtnBorder}`} fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
            _hover={{ bg: secondaryBtnHoverBg }} transition="all 0.15s" 
            onClick={() => onView(article)}
          >
            Xem
          </Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={MdEdit} boxSize="13px" />}
            _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.3)"
            transition="all 0.15s" onClick={() => onEdit(article)}
          >
            Sửa
          </Button>
          <Button flex="1" size="sm" h="36px" borderRadius="9px" 
            bg={isPublished ? warnBg : successBg}
            color={isPublished ? warnColor : successColor}
            border={`1px solid ${isPublished ? warnBorder : successBorder}`}
            fontSize="12px" fontWeight="600"
            leftIcon={<Icon as={isPublished ? MdVisibilityOff : MdPublish} boxSize="13px" />}
            _hover={{ opacity: 0.85 }} transition="all 0.15s"
            onClick={() => onToggleStatus(article)}
          >
            {isPublished ? "Ẩn" : "Đăng"}
          </Button>
        </Flex>
        
        <Button w="100%" size="sm" h="36px" borderRadius="9px" bg={dangerBg}
          color={dangerColor} border={`1px solid ${dangerBorder}`} fontSize="12px" fontWeight="600"
          leftIcon={<Icon as={MdDeleteOutline} boxSize="14px" />}
          _hover={{ bg: dangerHoverBg }} transition="all 0.15s"
          onClick={() => onDelete(article)}
        >
          Xóa bài viết
        </Button>
      </Box>
    );
  }