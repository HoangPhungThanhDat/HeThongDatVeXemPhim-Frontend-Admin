// src/views/admin/quanlycombo/components/FoodItemRow.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon, Image } from "@chakra-ui/react";
import {
  MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdClose,
  MdShoppingCart, MdVisibilityOff, 
} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { TagBadge } from "./TagBadge";
import { DARK } from "../constants";
import { fadeUp, pulse } from "./shared/animations";

export const ComboRow = ({ combo, index, onView, onEdit, onDelete, onToggle, isDark }) => {
  // Kiểm tra combo tồn tại
  if (!combo) {
    return null;
  }

  // Gán giá trị mặc định
  const name = combo.name || "Không có tên";
  const price = combo.price || 0;
  const originalPrice = combo.originalPrice || combo.price || 0;
  const image = combo.image || "";
  const items = combo.items || [];
  const category = combo.category || "Combo";
  const isActive = combo.isActive !== undefined ? combo.isActive : true;
  const soldCount = combo.soldCount || 0;
  const tag = combo.tag || "Mới";
  const id = combo.id || 0;

  const discount = originalPrice && price && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const bg = isDark ? DARK.bgCard : "white";
  const ink = isDark ? DARK.ink : "#0f172a";
  const ink2 = isDark ? DARK.ink2 : "#475569";
  const ink3 = isDark ? DARK.ink3 : "#64748b";
  const ink4 = isDark ? DARK.ink4 : "#94a3b8";
  const ink5 = isDark ? DARK.ink5 : "#e2e8f0";
  const ink6 = isDark ? DARK.ink6 : "#f1f5f9";

  return (
    <Box
      p="12px 18px"
      borderRadius="12px"
      bg={bg}
      border={isActive ? `1.5px solid ${ink6}` : `1.5px solid ${ink6}`}
      transition="all 0.18s"
      opacity={isActive ? 1 : 0.65}
      _hover={{
        border: "1.5px solid #f97316",
        boxShadow: isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(249,115,22,0.1)",
        bg: isDark ? DARK.ink6 : "#fffbf7"
      }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
    >
      <Flex align="center">
        <Box w="28px" flexShrink="0">
          <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink4 : "#cbd5e1"}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </Box>
        <Box
          w="44px"
          h="44px"
          borderRadius="9px"
          overflow="hidden"
          flexShrink="0"
          mr="14px"
          bg="linear-gradient(135deg, #fff7ed, #ffedd5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {image
            ? <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Icon as={FaBoxOpen} boxSize="18px" color="#fed7aa" />
          }
        </Box>
        <Box flex="2" minW="0" pr="12px">
          <Flex align="center" gap="7px" mb="3px">
            <Text fontSize="13px" fontWeight="700" color={ink} noOfLines={1}>
              {name}
            </Text>
            <TagBadge tag={tag} isDark={isDark} />
          </Flex>
          <Flex gap="4px" flexWrap="nowrap" overflow="hidden">
            {items.slice(0, 3).map((item) => (
              <Box key={item} px="6px" py="1px" borderRadius="4px" bg="#fff7ed" border="1px solid #fcd34d" flexShrink="0">
                <Text fontSize="9.5px" fontWeight="600" color="#c2410c" whiteSpace="nowrap">{item}</Text>
              </Box>
            ))}
            {items.length > 3 && (
              <Box px="6px" py="1px" borderRadius="4px" bg={isDark ? DARK.ink6 : "#f1f5f9"} flexShrink="0">
                <Text fontSize="9.5px" fontWeight="600" color={isDark ? DARK.ink3 : "#64748b"}>+{items.length - 3}</Text>
              </Box>
            )}
          </Flex>
        </Box>
        <Box flex="0.8" minW="0" pr="12px">
          <Box px="7px" py="3px" borderRadius="5px" bg={isDark ? DARK.ink6 : "#f1f5f9"} display="inline-block">
            <Text fontSize="10.5px" fontWeight="600" color={isDark ? DARK.ink3 : "#64748b"} noOfLines={1}>
              {category}
            </Text>
          </Box>
        </Box>
        <Box flex="0.8" minW="0" pr="12px">
          <Text fontSize="13px" fontWeight="800" color="#f97316">
            {price.toLocaleString("vi-VN")}đ
          </Text>
          {discount > 0 && (
            <Flex align="center" gap="4px">
              <Text fontSize="10px" color={isDark ? DARK.ink4 : "#94a3b8"} textDecoration="line-through">
                {originalPrice.toLocaleString("vi-VN")}đ
              </Text>
              <Box px="4px" borderRadius="4px" bg="#fff7ed">
                <Text fontSize="9.5px" fontWeight="800" color="#f97316">-{discount}%</Text>
              </Box>
            </Flex>
          )}
        </Box>
        <Box flex="0.6" minW="0" pr="12px">
          <Flex align="center" gap="4px">
            <Icon as={MdShoppingCart} boxSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} />
            <Text fontSize="12px" fontWeight="700" color={isDark ? DARK.ink2 : "#475569"}>
              {soldCount.toLocaleString()}
            </Text>
          </Flex>
        </Box>
        <Box flex="0.5" minW="0" pr="12px">
          <Flex
            align="center"
            gap="5px"
            px="9px"
            py="4px"
            borderRadius="7px"
            bg={isActive ? "#ecfdf5" : (isDark ? DARK.ink6 : "#f9fafb")}
            border={isActive ? "1px solid #6ee7b7" : (isDark ? `1px solid ${DARK.ink5}` : "1px solid #e5e7eb")}
            display="inline-flex"
          >
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg={isActive ? "#10b981" : "#9ca3af"}
              sx={isActive ? { animation: `${pulse} 2s ease infinite` } : {}}
            />
            <Text fontSize="11px" fontWeight="700" color={isActive ? "#059669" : "#6b7280"}>
              {isActive ? "Đang bán" : "Đã tắt"}
            </Text>
          </Flex>
        </Box>
        <Flex gap="6px" flexShrink="0">
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdEdit} boxSize="11px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)" transition="all 0.15s"
            onClick={() => onEdit && onEdit(combo)}
          >Sửa</Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg={isActive ? "#fef2f2" : "#f0fdf4"}
            color={isActive ? "#dc2626" : "#16a34a"}
            border={isActive ? "1px solid #fca5a5" : "1px solid #86efac"}
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={isActive ? MdVisibilityOff : MdVisibility} boxSize="11px" />}
            _hover={{ opacity: 0.88 }}
            transition="all 0.15s"
            onClick={() => onToggle && onToggle(id)}
          >
            {isActive ? "Tắt" : "Bật"}
          </Button>
          <Button size="xs" h="30px" px="10px" borderRadius="8px"
            bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
            fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={MdDelete} boxSize="11px" />}
            _hover={{ bg: "#fee2e2" }}
            transition="all 0.15s"
            onClick={() => onDelete && onDelete(id)}
          >
            Xóa
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};