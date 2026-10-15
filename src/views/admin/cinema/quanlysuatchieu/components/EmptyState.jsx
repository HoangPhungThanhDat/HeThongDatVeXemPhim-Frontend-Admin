// src/views/admin/quanlysuatchieu/components/EmptyState.jsx

import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { MdMovie } from "react-icons/md";

export const EmptyState = ({ isDark }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py="60px"
      color={isDark ? "#4a5568" : "#d1d5db"}
    >
      <Box
        w="64px"
        h="64px"
        borderRadius="18px"
        bg={isDark ? "#2d3748" : "#f9fafb"}
        border={isDark ? "2px dashed #4a5568" : "2px dashed #e5e7eb"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb="14px"
      >
        <Icon as={MdMovie} boxSize="28px" color={isDark ? "#4a5568" : "#d1d5db"} />
      </Box>
      <Text fontSize="14px" fontWeight="700" color={isDark ? "#718096" : "#9ca3af"}>
        Không tìm thấy suất chiếu
      </Text>
      <Text fontSize="12px" mt="4px" color={isDark ? "#4a5568" : "#d1d5db"}>
        Thử thay đổi bộ lọc hoặc thêm mới
      </Text>
    </Flex>
  );
};