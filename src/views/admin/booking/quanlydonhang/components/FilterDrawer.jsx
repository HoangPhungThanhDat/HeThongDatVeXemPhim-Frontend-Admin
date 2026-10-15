// src/views/admin/quanlydonhang/components/FilterDrawer.jsx

import React from "react";
import {
  Box,
  Text,
  Button,
  Icon,
  Flex,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { MdClose, MdCheckCircle } from "react-icons/md";
import { ORDER_STATUS_CFG, PAYMENT_STATUS_CFG } from "../constants";

export const FilterDrawer = ({
  isOpen,
  onClose,
  filterCinema,
  setFilterCinema,
  filterPayment,
  setFilterPayment,
  filterStatus,
  setFilterStatus,
  isDark,
}) => {
  const cinemas = ["Tất cả", "GấuPhim Landmark 81", "GấuPhim Vincom Đồng Khởi", "GấuPhim Aeon Tân Phú"];
  const payments = ["Tất cả", "Đã thanh toán", "Chờ thanh toán", "Đã hoàn tiền"];
  const statuses = ["Tất cả", "Đã đặt", "Đã check-in", "Đã hủy", "Hết hạn"];

  const Section = ({ title, options, value, setValue, cfgMap }) => (
    <Box mb="18px">
      <Text
        fontSize="10.5px"
        fontWeight="800"
        letterSpacing="0.9px"
        textTransform="uppercase"
        color={isDark ? "#a0aec0" : "#64748b"}
        mb="8px"
      >
        {title}
      </Text>
      <Flex direction="column" gap="8px">
        {options.map((o) => {
          const cfg = cfgMap ? cfgMap[o] : null;
          const isActive = value === o;
          return (
            <Button
              key={o}
              h="46px"
              borderRadius="12px"
              justifyContent="flex-start"
              px="16px"
              fontSize="13.5px"
              fontWeight="600"
              bg={isActive ? (cfg ? cfg.bg : "#fff7ed") : (isDark ? "#1B254B" : "#f8fafc")}
              color={isActive ? (cfg ? cfg.color : "#ea580c") : (isDark ? "#e2e8f0" : "#374151")}
              border={`1.5px solid ${isActive ? (cfg ? cfg.border : "#fed7aa") : (isDark ? "#2D3A6B" : "#e8edf3")}`}
              _hover={{ bg: cfg ? cfg.bg : "#fff7ed" }}
              onClick={() => setValue(o)}
            >
              {cfg && <Box w="8px" h="8px" borderRadius="full" bg={cfg.dot} mr="10px" />}
              {o}
              {isActive && <Icon as={MdCheckCircle} boxSize="16px" color={cfg ? cfg.color : "#ea580c"} ml="auto" />}
            </Button>
          );
        })}
      </Flex>
    </Box>
  );

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent
        borderRadius="20px 20px 0 0"
        bg={isDark ? "#0b1437" : "white"}
        border={isDark ? "1px solid #2D3A6B" : "none"}
        maxH="80vh"
        pb="env(safe-area-inset-bottom, 16px)"
      >
        <Box h="4px" bg="linear-gradient(90deg,#ea580c,#fb923c)" borderRadius="20px 20px 0 0" />
        <DrawerHeader pt="16px" pb="8px">
          <Flex align="center" justify="space-between">
            <Text fontSize="15px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>Bộ lọc</Text>
            <Button size="sm" variant="ghost" borderRadius="8px" color={isDark ? "#718096" : "#94a3b8"} onClick={onClose}>
              <Icon as={MdClose} boxSize="18px" />
            </Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody pb="24px" overflowY="auto">
          <Section title="Rạp chiếu" options={cinemas} value={filterCinema} setValue={setFilterCinema} />
          <Section
            title="Trạng thái thanh toán"
            options={payments}
            value={filterPayment}
            setValue={setFilterPayment}
            cfgMap={PAYMENT_STATUS_CFG}
          />
          <Section
            title="Trạng thái đơn"
            options={statuses}
            value={filterStatus}
            setValue={(v) => {
              setFilterStatus(v);
              onClose();
            }}
            cfgMap={ORDER_STATUS_CFG}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;