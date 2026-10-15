import React from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Button,
  Input,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdSearch,
  MdFilterAlt,
  MdDarkMode,
  MdLightMode,
  MdClose,
} from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";

export const PageHeader = ({
  isDark,
  toggleColorMode,
  onCreateTicket,
  showSearch,
  setShowSearch,
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  isMobile,
  openFilter,
}) => {
  const OR = "#ea580c";
  const ORBD = "#fed7aa";
  const ORPL = "#fff7ed";
  const ORSW = "rgba(234,88,12,0.25)";

  const textColor = useColorModeValue("#0f172a", "#f7fafc");
  const textSecondary = useColorModeValue("#94a3b8", "#718096");

  return (
    <Box px={{ base: "16px", md: "0" }}>
      <Flex
        justify="space-between"
        align="center"
        mb="16px"
        sx={{ animation: `fadeUp .4s ease both` }}
      >
        <Flex align="center" gap="10px">
          <Box
            w={{ base: "36px", md: "38px" }}
            h={{ base: "36px", md: "38px" }}
            borderRadius="11px"
            bg={`linear-gradient(135deg,${OR},${OR})`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={`0 4px 12px ${ORSW}`}
          >
            <Icon as={FaTicketAlt} boxSize={{ base: "14px", md: "16px" }} color="white" />
          </Box>
          <Box>
            <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" color={textColor} letterSpacing="-.5px">
              Quản lý vé
            </Text>
            <Text color={textSecondary} fontSize={{ base: "11px", md: "13px" }} display={{ base: "none", md: "block" }}>
              Tra cứu và quản lý vé đã bán theo suất chiếu và khách hàng
            </Text>
          </Box>
        </Flex>

        <Flex gap="8px" align="center">
          <Button
            h="38px"
            w="38px"
            minW="38px"
            p="0"
            borderRadius="10px"
            bg={isDark ? "#2d3748" : "#f8fafc"}
            color={isDark ? "#e2e8f0" : "#475569"}
            border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
            onClick={toggleColorMode}
          >
            <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="16px" />
          </Button>

          <Button
            h="38px"
            px="14px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="12px"
            bg={`linear-gradient(135deg,${OR},${OR})`}
            color="white"
            boxShadow={`0 3px 12px ${ORSW}`}
            _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
            transition="all .2s"
            leftIcon={<Icon as={MdAdd} boxSize="14px" />}
            onClick={onCreateTicket}
            display={{ base: "none", md: "flex" }}
          >
            <Text>Tạo vé thủ công</Text>
          </Button>

          <Button
            h="36px"
            w="36px"
            minW="36px"
            p="0"
            borderRadius="10px"
            display={{ base: "flex", md: "none" }}
            bg={showSearch ? ORPL : isDark ? "#2d3748" : "#f8fafc"}
            color={showSearch ? OR : isDark ? "#e2e8f0" : "#475569"}
            border={
              isDark
                ? `1.5px solid ${showSearch ? ORBD : "#4a5568"}`
                : `1.5px solid ${showSearch ? ORBD : "#e2e8f0"}`
            }
            onClick={() => setShowSearch((v) => !v)}
          >
            <Icon as={MdSearch} boxSize="16px" />
          </Button>
          <Button
            h="36px"
            w="36px"
            minW="36px"
            p="0"
            borderRadius="10px"
            display={{ base: "flex", md: "none" }}
            bg={filterStatus !== "Tất cả" ? ORPL : isDark ? "#2d3748" : "#f8fafc"}
            color={filterStatus !== "Tất cả" ? OR : isDark ? "#e2e8f0" : "#475569"}
            border={
              isDark
                ? `1.5px solid ${filterStatus !== "Tất cả" ? ORBD : "#4a5568"}`
                : `1.5px solid ${filterStatus !== "Tất cả" ? ORBD : "#e2e8f0"}`
            }
            onClick={openFilter}
          >
            <Icon as={MdFilterAlt} boxSize="16px" />
          </Button>
        </Flex>
      </Flex>

      {/* Mobile Create Button */}
      <Button
        h="40px"
        w="100%"
        borderRadius="10px"
        fontWeight="700"
        fontSize="13px"
        bg={`linear-gradient(135deg,${OR},${OR})`}
        color="white"
        boxShadow={`0 3px 12px ${ORSW}`}
        _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
        _active={{ transform: "translateY(0)" }}
        transition="all .2s"
        leftIcon={<Icon as={MdAdd} boxSize="16px" />}
        onClick={onCreateTicket}
        display={{ base: "flex", md: "none" }}
        mb="12px"
      >
        Tạo vé thủ công (Admin)
      </Button>

      {/* Mobile search */}
      {showSearch && (
        <Box mb="12px" display={{ base: "block", md: "none" }} sx={{ animation: `fadeUp .2s ease both` }}>
          <Box position="relative">
            <Icon
              as={MdSearch}
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              boxSize="16px"
              color={textSecondary}
              zIndex="1"
            />
            <Input
              pl="36px"
              h="42px"
              fontSize="13px"
              fontWeight="500"
              placeholder="Tìm mã vé, khách hàng, phim..."
              bg={isDark ? "#1a202c" : "white"}
              border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e8edf3"}
              borderRadius="12px"
              color={isDark ? "#e2e8f0" : "#374151"}
              _placeholder={{ color: isDark ? "#718096" : "#b0bac8" }}
              _focus={{
                border: `1.5px solid ${OR}`,
                boxShadow: `0 0 0 3px rgba(234,88,12,.08)`,
                bg: isDark ? "#1a202c" : "#fff",
              }}
              transition="all .2s"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </Box>
          {filterStatus !== "Tất cả" && (
            <Flex mt="8px" gap="6px">
              <Box
                px="10px"
                py="4px"
                borderRadius="8px"
                bg={ORPL}
                border={`1px solid ${ORBD}`}
                display="inline-flex"
                alignItems="center"
                gap="6px"
              >
                <Text fontSize="11.5px" fontWeight="600" color={OR}>
                  {filterStatus}
                </Text>
                <Box as="button" onClick={() => setFilterStatus("Tất cả")} color={OR}>
                  <Icon as={MdClose} boxSize="12px" />
                </Box>
              </Box>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};