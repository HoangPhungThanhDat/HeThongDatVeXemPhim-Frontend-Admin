

import {
    Box, Text, Button, Flex, Icon, Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { MdWarning, MdDelete } from "react-icons/md";
  
  export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, genre }) {
    const modalBg = useColorModeValue("white", "#0b1437");
    const modalBorder = useColorModeValue("#fee2e2", "#3d1515");
    const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
    const bodyBg = useColorModeValue("#fef2f2", "#2d1515");
    const bodyBorder = useColorModeValue("#fecaca", "#7f1d1d");
    const descColor = useColorModeValue("#64748b", "#94a3b8");
  
    if (!genre) return null;
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay bg="rgba(15,23,42,0.55)" backdropFilter="blur(4px)" />
        <ModalContent 
          borderRadius="20px" 
          border={`1px solid ${modalBorder}`}
          boxShadow="0 20px 60px rgba(0,0,0,0.35)" 
          bg={modalBg}
          mx="16px"
        >
          <ModalHeader p="20px 20px 0">
            <Flex align="center" gap="10px">
              <Box 
                w="56px" h="56px" borderRadius="full" bg={bodyBg}
                border={`2px solid ${modalBorder}`}
                display="flex" alignItems="center" justifyContent="center"
                flexShrink="0"
              >
                <Icon as={MdWarning} boxSize="24px" color="#ef4444" />
              </Box>
              <Box>
                <Text fontSize="18px" fontWeight="800" color={titleColor}>
                  Xóa thể loại
                </Text>
                <Text fontSize="11.5px" color="#94a3b8" fontWeight="500" mt="1px">
                  Hành động này không thể hoàn tác
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton top="14px" right="14px" borderRadius="8px" color={descColor} />
          <ModalBody px="20px" py="14px">
            <Box 
              p="12px 14px" 
              borderRadius="10px"
              bg={bodyBg}
              border={`1px solid ${bodyBorder}`}
              mb="12px"
            >
              <Text fontSize="13px" fontWeight="700" color="#991b1b" noOfLines={2}>
                {genre.Name || genre.name}
              </Text>
              <Text fontSize="11.5px" color="#6b7280" mt="3px">
                {genre.Status || genre.status || "Active"} · {genre.movieCount || 0} phim
              </Text>
            </Box>
            <Text fontSize="13px" color={descColor} lineHeight="1.7">
              Thể loại sẽ bị xóa vĩnh viễn khỏi hệ thống. 
              {genre.movieCount > 0 && (
                <Text as="span" fontWeight="700" color="#ef4444">
                  ⚠️ Thể loại này đang gắn với <strong>{genre.movieCount} phim</strong>.
                </Text>
              )}
            </Text>
          </ModalBody>
          <ModalFooter px="20px" pb="20px" gap="8px">
            <Button 
              flex="1" h="42px" borderRadius="10px" variant="ghost"
              color={descColor}
              border="1.5px solid #e2e8f0"
              fontWeight="600" fontSize="13px"
              _hover={{ bg: "#f8fafc" }}
              onClick={onClose}
            >
              Hủy bỏ
            </Button>
            <Button 
              flex="1" h="42px" borderRadius="10px"
              bg="linear-gradient(135deg, #ef4444, #f87171)"
              color="white" fontWeight="700" fontSize="13px"
              boxShadow="0 4px 14px rgba(239,68,68,0.35)"
              _hover={{ 
                boxShadow: "0 6px 20px rgba(239,68,68,0.45)", 
                transform: "translateY(-1px)" 
              }}
              _active={{ transform: "translateY(0)" }} 
              transition="all 0.2s"
              leftIcon={<Icon as={MdDelete} boxSize="14px" />}
              onClick={() => onConfirm(genre)}
            >
              Xóa ngay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }