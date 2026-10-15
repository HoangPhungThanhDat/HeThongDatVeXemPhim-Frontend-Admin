

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import {
  MdEdit, MdVisibilityOff, MdVisibility, MdShoppingCart, MdDelete,
} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { TagBadge } from "./TagBadge";
import { DARK } from "../constants";
import { fadeUp, float } from "./shared/animations";

export const ComboCard = ({ combo, index, onView, onEdit, onToggle, onDelete, isDark }) => {
  // ✅ Kiểm tra combo tồn tại
  if (!combo) {
    return null;
  }

  // ✅ Gán giá trị mặc định cho các field
  const name = combo.name || "Không có tên";
  const description = combo.description || "";
  const price = combo.price || 0;
  const originalPrice = combo.originalPrice || combo.price || 0;
  const image = combo.image || "";
  const items = combo.items || [];
  const category = combo.category || "Combo";
  const isActive = combo.isActive !== undefined ? combo.isActive : true;
  const isSeasonal = combo.isSeasonal || false;
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
      borderRadius="16px" bg={bg}
      border={isActive ? `1.5px solid ${ink6}` : `1.5px solid ${ink6}`}
      boxShadow={isDark ? "0 1px 6px rgba(0,0,0,.3)" : "0 1px 6px rgba(0,0,0,0.05)"}
      overflow="hidden"
      transition="all 0.22s"
      opacity={isActive ? 1 : 0.65}
      _hover={{ boxShadow: isDark ? "0 6px 24px rgba(0,0,0,.4)" : "0 6px 24px rgba(249,115,22,0.12)", transform: "translateY(-3px)", border: "1.5px solid #fed7aa" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.06}s both` }}
    >
      <Box position="relative" h="130px" bg="linear-gradient(135deg, #fff7ed, #ffedd5)" overflow="hidden">
        {image ? (
          <img src={image} alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <Flex align="center" justify="center" h="100%">
            <Box sx={{ animation: `${float} 3s ease-in-out infinite` }}>
              <Icon as={FaBoxOpen} boxSize="44px" color="#fed7aa" />
            </Box>
          </Flex>
        )}
        {discount > 0 && (
          <Box position="absolute" top="10px" left="10px"
            px="8px" py="4px" borderRadius="7px"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            boxShadow="0 2px 8px rgba(249,115,22,0.4)"
          >
            <Text fontSize="10.5px" fontWeight="800" color="white">-{discount}%</Text>
          </Box>
        )}
        {isSeasonal && (
          <Box position="absolute" top="10px" right="10px"
            px="7px" py="3px" borderRadius="6px" bg="rgba(255,255,255,0.92)"
            border="1px solid #7dd3fc"
          >
            <Text fontSize="10px" fontWeight="800" color="#0284c7">Theo mùa</Text>
          </Box>
        )}
        {!isActive && (
          <Box position="absolute" inset="0" bg="rgba(255,255,255,0.55)"
            display="flex" alignItems="center" justifyContent="center"
          >
            <Box px="12px" py="5px" borderRadius="8px" bg="rgba(100,116,139,0.9)">
              <Text fontSize="11px" fontWeight="800" color="white">Đã tắt</Text>
            </Box>
          </Box>
        )}
      </Box>

      <Box p="14px">
        <Flex align="flex-start" justify="space-between" gap="8px" mb="6px">
          <Text fontSize="13.5px" fontWeight="800" color={ink} lineHeight="1.3" flex="1">
            {name}
          </Text>
          <TagBadge tag={tag} isDark={isDark} />
        </Flex>

        <Box px="7px" py="2px" borderRadius="5px" bg={isDark ? DARK.ink6 : "#f1f5f9"} display="inline-block" mb="8px">
          <Text fontSize="10px" fontWeight="600" color={isDark ? DARK.ink3 : "#64748b"}>{category}</Text>
        </Box>

        <Text fontSize="11.5px" color={isDark ? DARK.ink3 : "#64748b"} lineHeight="1.6" mb="10px" noOfLines={2}>
          {description || "Không có mô tả"}
        </Text>

        <Flex gap="5px" flexWrap="wrap" mb="12px">
          {items.length > 0 ? (
            items.slice(0, 3).map((item) => (
              <Box key={item} px="7px" py="3px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="10.5px" fontWeight="600" color="#c2410c">{item}</Text>
              </Box>
            ))
          ) : (
            <Box px="7px" py="3px" borderRadius="6px" bg="#f3f4f6" border="1px solid #d1d5db">
              <Text fontSize="10.5px" fontWeight="600" color="#6b7280">Không có thành phần</Text>
            </Box>
          )}
          {items.length > 3 && (
            <Box px="7px" py="3px" borderRadius="6px" bg="#f3f4f6" border="1px solid #d1d5db">
              <Text fontSize="10.5px" fontWeight="600" color="#6b7280">+{items.length - 3}</Text>
            </Box>
          )}
        </Flex>

        <Box h="1px" bg={isDark ? DARK.ink5 : "#f8fafc"} mb="12px" />

        <Flex align="center" justify="space-between" mb="12px">
          <Box>
            <Text fontSize="17px" fontWeight="800" color="#f97316" lineHeight="1">
              {price.toLocaleString("vi-VN")}đ
            </Text>
            {originalPrice > price && (
              <Text fontSize="10.5px" color={isDark ? DARK.ink4 : "#94a3b8"} mt="2px"
                textDecoration="line-through">
                {originalPrice.toLocaleString("vi-VN")}đ
              </Text>
            )}
          </Box>
          <Flex align="center" gap="5px">
            <Icon as={MdShoppingCart} boxSize="11px" color={isDark ? DARK.ink4 : "#94a3b8"} />
            <Text fontSize="11px" fontWeight="700" color={isDark ? DARK.ink2 : "#475569"}>
              {soldCount.toLocaleString()} đã bán
            </Text>
          </Flex>
        </Flex>

        <Flex gap="8px">
          <Button flex="1" h="34px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
            leftIcon={<Icon as={MdEdit} boxSize="12px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.28)" transition="all 0.15s"
            onClick={() => onEdit && onEdit(combo)}
          >Sửa</Button>
          <Button h="34px" px="12px" borderRadius="9px" fontSize="12px" fontWeight="700"
            bg={isActive ? "#fef2f2" : "#f0fdf4"}
            color={isActive ? "#dc2626" : "#16a34a"}
            border={isActive ? "1px solid #fca5a5" : "1px solid #86efac"}
            leftIcon={<Icon as={isActive ? MdVisibilityOff : MdVisibility} boxSize="12px" />}
            _hover={{ opacity: 0.88 }} transition="all 0.15s"
            onClick={() => onToggle && onToggle(id)}
          >{isActive ? "Tắt" : "Bật"}</Button>
        </Flex>
        
        <Button w="100%" mt="6px" h="28px" borderRadius="8px" fontSize="10.5px" fontWeight="600"
          bg="#fef2f2" color="#dc2626" border="1px solid #fca5a5"
          leftIcon={<Icon as={MdDelete} boxSize="11px" />}
          _hover={{ bg: "#fee2e2" }} transition="all 0.15s"
          onClick={() => onDelete && onDelete(combo)}
        >Xóa vĩnh viễn</Button>
      </Box>
    </Box>
  );
};