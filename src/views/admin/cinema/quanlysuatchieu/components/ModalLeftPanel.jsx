// src/views/admin/quanlysuatchieu/components/ModalLeftPanel.jsx

import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FaFilm } from "react-icons/fa";
import { fadeIn, pulse, slideRight } from "./shared/animations";

export const ModalLeftPanel = ({ title, subtitle, previewData }) => {
  return (
    <Box
      w="220px"
      minW="220px"
      bg="linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      p="28px 20px"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-40px"
        right="-40px"
        w="150px"
        h="150px"
        borderRadius="full"
        bg="rgba(249,115,22,0.07)"
        border="1px solid rgba(249,115,22,0.1)"
      />
      <Box
        position="absolute"
        bottom="-20px"
        left="-30px"
        w="110px"
        h="110px"
        borderRadius="full"
        bg="rgba(99,102,241,0.07)"
        border="1px solid rgba(99,102,241,0.08)"
      />
      <Flex
        direction="column"
        gap="5px"
        position="absolute"
        left="10px"
        top="0"
        bottom="0"
        justify="center"
        opacity={0.12}
      >
        {[...Array(12)].map((_, i) => (
          <Box key={i} w="4px" h="4px" borderRadius="1px" bg="#f97316" />
        ))}
      </Flex>

      <Box
        w="50px"
        h="50px"
        borderRadius="14px"
        bg="linear-gradient(135deg, #f97316, #fb923c)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 6px 20px rgba(249,115,22,0.4)"
        mb="18px"
        sx={{ animation: `${fadeIn} 0.5s ease 0.1s both` }}
      >
        <Icon as={FaFilm} boxSize="20px" color="white" />
      </Box>

      <Box sx={{ animation: `${slideRight} 0.4s ease 0.15s both` }}>
        <Text fontSize="15px" fontWeight="800" color="white" lineHeight="1.3" mb="6px">
          {title}
        </Text>
        <Text fontSize="11px" color="rgba(255,255,255,0.45)" lineHeight="1.6">
          {subtitle}
        </Text>
      </Box>

      <Box my="20px" h="1px" bg="linear-gradient(90deg, rgba(249,115,22,0.5), transparent)" />

      {previewData && (
        <Box sx={{ animation: `${fadeIn} 0.4s ease 0.2s both` }}>
          <Text
            fontSize="9px"
            color="rgba(249,115,22,0.8)"
            fontWeight="800"
            letterSpacing="2px"
            textTransform="uppercase"
            mb="12px"
          >
            Xem trước
          </Text>
          <Flex direction="column" gap="10px">
            {previewData.map(({ icon: Ic, label, val }) => (
              <Box key={label}>
                <Flex align="center" gap="5px" mb="2px">
                  <Icon as={Ic} boxSize="9px" color="rgba(249,115,22,0.6)" />
                  <Text
                    fontSize="8.5px"
                    color="rgba(255,255,255,0.3)"
                    fontWeight="700"
                    letterSpacing="1px"
                    textTransform="uppercase"
                  >
                    {label}
                  </Text>
                </Flex>
                <Text
                  fontSize="12px"
                  fontWeight="600"
                  color={val ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.18)"}
                >
                  {val || "—"}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      <Box mt="auto" pt="18px">
        <Flex
          align="center"
          gap="6px"
          p="9px 12px"
          borderRadius="9px"
          bg="rgba(249,115,22,0.1)"
          border="1px solid rgba(249,115,22,0.18)"
        >
          <Box
            w="5px"
            h="5px"
            borderRadius="full"
            bg="#f97316"
            sx={{ animation: `${pulse} 2s ease infinite` }}
          />
          <Text fontSize="10px" color="rgba(249,115,22,0.9)" fontWeight="700">
            Rạp chiếu phim
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};