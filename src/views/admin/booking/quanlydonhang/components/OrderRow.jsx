// src/views/admin/quanlydonhang/components/OrderRow.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { MdVisibility, MdDelete, MdEventSeat } from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { COL, fmtVND, OR, ORBD, ORSW } from "../constants";
import { fadeUp } from "./shared/animations";

export const OrderRow = ({ order, index, onView, onDelete, isAdmin, isDark }) => {
  // Hiển thị ghế dạng text
  const seatText = order.seats?.join(", ") || "Chưa có ghế";
  
  return (
    <Flex
      align="center"
      px="16px"
      py="12px"
      borderRadius="10px"
      bg={isDark ? "#0b1437" : "white"}
      border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #f1f5f9"}
      transition="all .2s"
      _hover={{
        border: `1.5px solid ${ORBD}`,
        boxShadow: `0 2px 12px rgba(234,88,12,.08)`,
        bg: isDark ? "#1B254B" : "#fffaf7",
      }}
      sx={{ animation: `${fadeUp} .35s ease ${index * 0.04}s both` }}
    >
      <Box w={COL.idx} flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color={isDark ? "#2D3A6B" : "#cbd5e1"}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>
      
      <Box flex={COL.order} minW="0" pr="12px">
        <Flex align="center" gap="8px" mb="2px">
          <Box px="7px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa" flexShrink="0">
            <Text fontSize="10px" fontWeight="800" color={OR} letterSpacing=".5px">{order.code}</Text>
          </Box>
          <Text fontSize="12.5px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} noOfLines={1}>
            {order.customerName}
          </Text>
        </Flex>
        <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"} noOfLines={1}>
          {order.movieTitle}
        </Text>
      </Box>
      
      <Box w={COL.cinema} flexShrink="0" pr="10px">
        <Text fontSize="12px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"} noOfLines={1}>
          {order.cinema}
        </Text>
        <Text fontSize="10.5px" color={isDark ? "#718096" : "#94a3b8"} noOfLines={1}>
          {order.room}
        </Text>
      </Box>

      {/* Cột Ghế */}
      <Box w="100px" flexShrink="0" pr="10px">
        <Flex align="center" gap="4px" flexWrap="wrap">
          <Icon as={MdEventSeat} boxSize="10px" color={OR} />
          <Text fontSize="11px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"} noOfLines={1}>
            {seatText}
          </Text>
        </Flex>
      </Box>
      
      <Box w={COL.showtime} flexShrink="0" pr="10px">
        <Text fontSize="12px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>
          {order.showtime}
        </Text>
      </Box>
      
      <Box w={COL.total} flexShrink="0" pr="10px">
        <Text fontSize="13px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>
          {fmtVND(order.total)}
        </Text>
      </Box>
      
      <Box w={COL.payment} flexShrink="0" pr="10px">
        <StatusBadge status={order.paymentStatus} type="payment" />
      </Box>
      
      <Box w={COL.status} flexShrink="0" pr="10px">
        <StatusBadge status={order.orderStatus} type="order" />
      </Box>
      
      <Box w={COL.actions} flexShrink="0">
        <Flex gap="5px" align="center">
          <Button
            size="xs"
            h="28px"
            px="10px"
            borderRadius="7px"
            bg={isDark ? "#2D3A6B" : "#f8fafc"}
            color={isDark ? "#e2e8f0" : "#475569"}
            border={isDark ? "1px solid #2D3A6B" : "1px solid #e2e8f0"}
            fontSize="11.5px"
            fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: isDark ? "#2D3A6B" : "#f1f5f9", color: isDark ? "#f7fafc" : "#0f172a" }}
            transition="all .15s"
            onClick={() => onView(order)}
          >
            Xem
          </Button>
          {isAdmin && (
            <Button
              size="xs"
              h="28px"
              w="28px"
              minW="28px"
              px="0"
              borderRadius="7px"
              bg="#fef2f2"
              color="#dc2626"
              border="1px solid #fecaca"
              _hover={{ bg: "#fee2e2" }}
              transition="all .15s"
              onClick={() => onDelete(order)}
            >
              <Icon as={MdDelete} boxSize="13px" />
            </Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};