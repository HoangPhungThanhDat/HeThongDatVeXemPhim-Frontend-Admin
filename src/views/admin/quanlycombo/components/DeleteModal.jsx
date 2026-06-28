

import React from "react";
import {
  Box, Text, Button, Flex, Icon, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdWarning, MdDelete } from "react-icons/md";
import { DARK } from "../constants";
import { scaleIn, shimmer } from "./shared/animations";

export const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, isDark }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent
        borderRadius="20px"
        border={isDark ? `1px solid ${DARK.ink5}` : "1px solid #e2e8f0"}
        bg={isDark ? DARK.bgCard : "#ffffff"}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .3s cubic-bezier(.22,1,.36,1) both` }}
        maxW="420px"
      >
        <Box
          h="4px"
          bg="linear-gradient(90deg, #dc2626, #ef4444, #dc2626)"
          bgSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
          borderRadius="20px 20px 0 0"
        />

        <ModalHeader>
          <Flex align="center" gap="10px">
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg="#fef2f2"
              border="1px solid #fca5a5"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={MdWarning} boxSize="18px" color="#dc2626" />
            </Box>
            <Box>
              <Text fontSize="17px" fontWeight="800" color={isDark ? DARK.ink : "#0f172a"}>
                Xóa sản phẩm
              </Text>
              <Text fontSize="12px" color={isDark ? DARK.ink4 : "#94a3b8"}>
                Hành động này không thể hoàn tác
              </Text>
            </Box>
          </Flex>
          <ModalCloseButton color={isDark ? DARK.ink4 : "#94a3b8"} />
        </ModalHeader>

        <ModalBody py="16px">
          <Box p="14px 16px" borderRadius="12px" bg="#fef2f2" border="1px solid #fca5a5">
            <Text fontSize="13px" color="#991b1b" fontWeight="600">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <Text as="span" fontWeight="800">"{itemName}"</Text>?
            </Text>
            <Text fontSize="11.5px" color="#dc2626" mt="4px">
              Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter gap="10px" borderTop={isDark ? `1px solid ${DARK.ink5}` : "1px solid #f1f5f9"}>
          <Button
            h="42px"
            px="20px"
            variant="ghost"
            color={isDark ? DARK.ink3 : "#64748b"}
            borderRadius="10px"
            fontWeight="600"
            fontSize="13px"
            border={isDark ? `1.5px solid ${DARK.ink5}` : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? DARK.ink6 : "#f8fafc" }}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            h="42px"
            px="24px"
            borderRadius="10px"
            fontWeight="700"
            fontSize="13px"
            bg="#dc2626"
            color="white"
            boxShadow="0 4px 16px rgba(220,38,38,0.35)"
            _hover={{
              boxShadow: "0 8px 24px rgba(220,38,38,0.45)",
              transform: "translateY(-1px)"
            }}
            _active={{ transform: "translateY(0)" }}
            leftIcon={<Icon as={MdDelete} />}
            onClick={onConfirm}
          >
            Xóa vĩnh viễn
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};