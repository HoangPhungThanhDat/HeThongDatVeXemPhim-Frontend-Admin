

import {
    Box, Text, Button, Icon, Input, Select, Drawer, DrawerOverlay,
    DrawerContent, DrawerCloseButton, DrawerBody, useColorModeValue
  } from "@chakra-ui/react";
  import { MdSearch } from "react-icons/md";
  import { STATUS_OPTS, GENRE_OPTS } from "../constants";
  
  export function FilterDrawer({ 
    isOpen, onClose, search, setSearch, 
    filterStatus, setFilterStatus, filterGenre, setFilterGenre 
  }) {
    const inputBg = useColorModeValue("#fafafa", "#0B1437");
    const inputBorder = useColorModeValue("#e8edf3", "rgba(255,255,255,0.12)");
    const inputColor = useColorModeValue("#1a202c", "#ffffff");
    const placeholderColor = useColorModeValue("#b0bac8", "#8b9bc4");
    const cardBg = useColorModeValue("white", "#111C44");
    const textPrimary = useColorModeValue("#0f172a", "#ffffff");
  
    const inputStyle = {
      bg: inputBg,
      border: `1.5px solid ${inputBorder}`,
      borderRadius: "10px",
      color: inputColor,
      fontSize: "14px",
      fontWeight: "500",
      px: "14px",
      h: "44px",
      _placeholder: { color: placeholderColor, fontWeight: "400" },
      _focus: { 
        border: "1.5px solid #f97316", 
        boxShadow: "0 0 0 3px rgba(249,115,22,0.10)", 
        bg: useColorModeValue("#ffffff", "#111C44") 
      },
      _hover: { border: "1.5px solid #f97316", bg: useColorModeValue("#ffffff", "#111C44") },
      transition: "all 0.2s ease",
    };
  
    const labelStyle = {
      fontSize: "10.5px", 
      fontWeight: "800", 
      letterSpacing: "0.9px",
      textTransform: "uppercase", 
      color: useColorModeValue("#64748b", "#8b9bc4"), 
      mb: "7px",
    };
  
    return (
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          borderTopRadius="20px" 
          pb="env(safe-area-inset-bottom)"
          bg={cardBg}
          border={useColorModeValue(undefined, "1px solid rgba(255,255,255,0.08)")}
        >
          <DrawerCloseButton top="14px" color={useColorModeValue(undefined, "#8b9bc4")} />
          <DrawerBody p="20px">
            <Text fontSize="15px" fontWeight="800" color={textPrimary} mb="18px">
              Bộ lọc & Tìm kiếm
            </Text>
            
            <Box mb="14px">
              <Text sx={labelStyle}>Tìm kiếm</Text>
              <Box position="relative">
                <Icon as={MdSearch} position="absolute" left="12px" top="50%"
                  transform="translateY(-50%)" boxSize="15px" color="#94a3b8" zIndex="1" />
                <Input
                  pl="36px" {...inputStyle}
                  placeholder="Tìm tên phim, đạo diễn..."
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                />
              </Box>
            </Box>
            
            <Box mb="14px">
              <Text sx={labelStyle}>Trạng thái</Text>
              <Select {...inputStyle} value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                {STATUS_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Box>
            
            <Box mb="20px">
              <Text sx={labelStyle}>Thể loại</Text>
              <Select {...inputStyle} value={filterGenre} 
                onChange={e => setFilterGenre(e.target.value)}
              >
                <option value="Tất cả">Tất cả thể loại</option>
                {GENRE_OPTS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>
            </Box>
            
            <Button w="100%" h="44px" borderRadius="12px" fontWeight="700" fontSize="14px"
              bg="linear-gradient(135deg, #f97316, #fb923c)" color="white"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)"
              onClick={onClose}
            >
              Áp dụng bộ lọc
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }