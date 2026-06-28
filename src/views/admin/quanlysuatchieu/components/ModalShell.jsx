// src/views/admin/quanlysuatchieu/components/ModalShell.jsx

import React from "react";
import {
  Box, Flex, Icon, Modal, ModalOverlay, ModalContent, ModalBody,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { scaleIn, shimmer } from "./shared/animations";

export const ModalShell = ({ isOpen, onClose, leftPanel, children, footer, isDark }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered motionPreset="none">
      <ModalOverlay
        bg={isDark ? "rgba(0,0,0,0.8)" : "rgba(15,23,42,0.6)"}
        backdropFilter="blur(10px)"
      />
      <ModalContent
        borderRadius="20px"
        border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
        bg={isDark ? "#1a202c" : "#ffffff"}
        boxShadow="0 32px 80px rgba(0,0,0,0.2)"
        overflow="hidden"
        sx={{ animation: `${scaleIn} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both` }}
        maxW="760px"
        mx={{ base: "16px", md: "auto" }}
      >
        <Box
          h="3px"
          bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Flex>
          {leftPanel}
          <Box flex="1" display="flex" flexDirection="column" minW="0">
            <Box
              position="absolute"
              top="14px"
              right="14px"
              zIndex="10"
              w="28px"
              h="28px"
              borderRadius="9px"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={isDark ? "#718096" : "#94a3b8"}
              transition="all 0.2s"
              _hover={{
                color: isDark ? "#e2e8f0" : "#374151",
                bg: isDark ? "#2d3748" : "#f1f5f9"
              }}
              onClick={onClose}
            >
              <Icon as={MdClose} boxSize="15px" />
            </Box>
            <ModalBody px={{ base: "20px", md: "32px" }} py="26px" flex="1" overflowY="auto">
              {children}
            </ModalBody>
            {footer && (
              <Box
                px={{ base: "20px", md: "32px" }}
                py="18px"
                borderTop={isDark ? "1px solid #2d3748" : "1px solid #f1f5f9"}
                bg={isDark
                  ? "linear-gradient(180deg, #1a202c 0%, #2d3748 100%)"
                  : "linear-gradient(180deg, #fff 0%, #fafafa 100%)"
                }
              >
                {footer}
              </Box>
            )}
          </Box>
        </Flex>
      </ModalContent>
    </Modal>
  );
};