// src/views/admin/quanlydonhang/components/OrderCard.jsx

import React from "react";
import { Box, Flex, Text, Button, Icon, SimpleGrid } from "@chakra-ui/react";
import { MdVisibility, MdDelete, MdLocalMovies, MdLocationOn, MdAccessTime, MdEventSeat } from "react-icons/md";
import { StatusBadge } from "./shared/StatusBadge";
import { fmtVND, OR, ORBD, ORPL } from "../constants";
import { fadeUp, popIn } from "./shared/animations";

export const OrderCard = ({ order, index, onView, onDelete, isAdmin, isDark }) => {
  return (
    <Box
      p="14px"
      borderRadius="12px"
      bg={isDark ? "#1B254B" : "white"}
      border={isDark ? "1.5px solid #2D3A6B" : "1.5px solid #f1f5f9"}
      transition="all .2s"
      _active={{ bg: isDark ? "#1B254B" : "#fffaf7", border: `1.5px solid ${ORBD}` }}
      boxShadow="0 1px 4px rgba(0,0,0,.04)"
      sx={{ animation: `${fadeUp} .35s ease ${index * .04}s both` }}
    >
      <Flex justify="space-between" align="flex-start" mb="8px">
        <Flex align="center" gap="8px">
          <Box px="7px" py="3px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
            <Text fontSize="10.5px" fontWeight="800" color={OR}>{order.code}</Text>
          </Box>
          {order.isNew && (
            <Box px="6px" py="2px" borderRadius="5px" bg="#fef2f2" sx={{ animation: `${popIn} .4s ease both` }}>
              <Text fontSize="9.5px" fontWeight="800" color="#dc2626">MỚI</Text>
            </Box>
          )}
        </Flex>
        <StatusBadge status={order.orderStatus} type="order" />
      </Flex>

      <Text fontSize="14px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} mb="2px" noOfLines={1}>
        {order.customerName}
      </Text>
      <Flex align="center" gap="6px" mb="8px">
        <Icon as={MdLocalMovies} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
        <Text fontSize="11.5px" color={isDark ? "#a0aec0" : "#64748b"} noOfLines={1}>{order.movieTitle}</Text>
      </Flex>

      <SimpleGrid columns={2} spacing="8px" mb="10px">
        <Flex align="center" gap="6px">
          <Icon as={MdLocationOn} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
          <Text fontSize="11px" color={isDark ? "#a0aec0" : "#64748b"} noOfLines={1}>{order.cinema}</Text>
        </Flex>
        <Flex align="center" gap="6px">
          <Icon as={MdAccessTime} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
          <Text fontSize="11px" color={isDark ? "#a0aec0" : "#64748b"}>{order.showtime}</Text>
        </Flex>
      </SimpleGrid>

      <Flex align="center" gap="6px" flexWrap="wrap" mb="8px">
        {order.seats?.slice(0, 3).map((s) => (
          <Flex key={s} align="center" gap="4px" px="8px" py="3px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
            <Icon as={MdEventSeat} boxSize="10px" color={OR} />
            <Text fontSize="11px" fontWeight="700" color={OR}>{s}</Text>
          </Flex>
        ))}
        {order.seats?.length > 3 && (
          <Text fontSize="10px" color={isDark ? "#718096" : "#94a3b8"}>+{order.seats.length - 3}</Text>
        )}
      </Flex>

      <Flex align="center" justify="space-between" mb="12px">
        <StatusBadge status={order.paymentStatus} type="payment" />
        <Text fontSize="15px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>{fmtVND(order.total)}</Text>
      </Flex>

      <Flex gap="8px">
        <Button
          flex="1"
          h="36px"
          borderRadius="8px"
          fontSize="12px"
          fontWeight="600"
          bg={isDark ? "#2D3A6B" : "#f8fafc"}
          color={isDark ? "#e2e8f0" : "#475569"}
          border={isDark ? "1px solid #2D3A6B" : "1px solid #e2e8f0"}
          leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
          _hover={{ bg: isDark ? "#2D3A6B" : "#f1f5f9" }}
          _active={{ transform: "scale(.97)" }}
          transition="all .15s"
          onClick={() => onView(order)}
        >
          Xem chi tiết
        </Button>
        {isAdmin && (
          <Button
            h="36px"
            w="44px"
            borderRadius="8px"
            bg="#fef2f2"
            color="#dc2626"
            border="1px solid #fecaca"
            _hover={{ bg: "#fee2e2" }}
            _active={{ transform: "scale(.95)" }}
            transition="all .15s"
            onClick={() => onDelete(order)}
          >
            <Icon as={MdDelete} boxSize="14px" />
          </Button>
        )}
      </Flex>
    </Box>
  );
};