import {
  Box, Text, Button, Flex, Icon, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  useColorModeValue, Spinner
} from "@chakra-ui/react";
import { MdWarning, MdDeleteForever } from "react-icons/md";
import { useState } from "react";

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, banner }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const modalBg = useColorModeValue("white", "#0b1437");
  const modalBorder = useColorModeValue("#fee2e2", "#3d1515");
  const titleColor = useColorModeValue("#0f172a", "#e2e8f0");
  const bodyBg = useColorModeValue("#fef2f2", "#2d1515");
  const bodyBorder = useColorModeValue("#fecaca", "#7f1d1d");
  const descColor = useColorModeValue("#64748b", "#94a3b8");

  // Xử lý xác nhận xóa
  const handleConfirm = async () => {
      if (isDeleting) return; // Ngăn click nhiều lần
      
      setIsDeleting(true);
      try {
          await onConfirm();
          // onConfirm đã xử lý xóa và đóng modal bên ngoài
      } catch (error) {
          console.error("Lỗi khi xóa:", error);
      } finally {
          setIsDeleting(false);
      }
  };

  // Xử lý đóng modal khi đang xóa thì không cho đóng
  const handleClose = () => {
      if (isDeleting) return;
      onClose();
  };

  return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="sm">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent 
              borderRadius="16px" 
              border={`1px solid ${modalBorder}`}
              boxShadow="0 20px 60px rgba(0,0,0,0.3)" 
              bg={modalBg}
              opacity={isDeleting ? 0.7 : 1}
              pointerEvents={isDeleting ? "none" : "auto"}
              transition="opacity 0.2s"
          >
              <ModalHeader pb="8px" pt="20px" px="20px">
                  <Flex align="center" gap="10px">
                      <Box 
                          w="36px" h="36px" borderRadius="10px" bg="#fef2f2"
                          display="flex" alignItems="center" justifyContent="center" flexShrink="0"
                      >
                          <Icon as={MdWarning} boxSize="18px" color="#dc2626" />
                      </Box>
                      <Box>
                          <Text fontSize="15px" fontWeight="800" color={titleColor}>
                              Xóa vĩnh viễn banner?
                          </Text>
                          <Text fontSize="11.5px" color="#94a3b8" fontWeight="500" mt="1px">
                              Hành động này không thể hoàn tác
                          </Text>
                      </Box>
                  </Flex>
              </ModalHeader>
              <ModalCloseButton 
                  top="14px" 
                  right="14px" 
                  borderRadius="8px" 
                  color={descColor}
                  isDisabled={isDeleting}
              />
              <ModalBody px="20px" py="12px">
                  {banner && (
                      <Box p="12px 14px" borderRadius="10px" bg={bodyBg} border={`1px solid ${bodyBorder}`}>
                          <Text fontSize="12px" color="#dc2626" fontWeight="700" mb="4px">
                              Banner sẽ bị xóa:
                          </Text>
                          <Flex align="center" gap="10px">
                              <Box w="44px" h="28px" borderRadius="6px" overflow="hidden" flexShrink="0">
                                  <img 
                                      src={banner.image} 
                                      alt={banner.title}
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                  />
                              </Box>
                              <Text fontSize="13px" fontWeight="700" color={titleColor} noOfLines={2}>
                                  {banner.title}
                              </Text>
                          </Flex>
                      </Box>
                  )}
                  <Text fontSize="12.5px" color={descColor} mt="10px" lineHeight="1.6">
                      Banner sẽ bị xóa hoàn toàn khỏi hệ thống. Bạn sẽ không thể khôi phục lại sau khi xóa.
                  </Text>
              </ModalBody>
              <ModalFooter px="20px" pb="20px" gap="8px">
                  <Button 
                      flex="1" h="40px" variant="ghost" borderRadius="9px" fontSize="13px" fontWeight="600"
                      border="1.5px solid" borderColor={useColorModeValue("#e2e8f0", "#2d3748")}
                      color={descColor} 
                      _hover={{ bg: useColorModeValue("#f8fafc", "#1a2744") }}
                      onClick={handleClose}
                      isDisabled={isDeleting}
                  >
                      Hủy bỏ
                  </Button>
                  <Button 
                      flex="1" h="40px" borderRadius="9px" fontSize="13px" fontWeight="700"
                      bg={isDeleting ? "linear-gradient(135deg, #94a3b8, #64748b)" : "linear-gradient(135deg, #ef4444, #dc2626)"}
                      color="white"
                      boxShadow={isDeleting ? "none" : "0 4px 14px rgba(220,38,38,0.3)"}
                      _hover={!isDeleting && { 
                          boxShadow: "0 6px 20px rgba(220,38,38,0.4)", 
                          transform: "translateY(-1px)" 
                      }}
                      _active={!isDeleting && { transform: "translateY(0)" }}
                      transition="all 0.2s"
                      leftIcon={!isDeleting && <Icon as={MdDeleteForever} boxSize="15px" />}
                      onClick={handleConfirm}
                      isDisabled={isDeleting}
                      cursor={isDeleting ? "not-allowed" : "pointer"}
                  >
                      {isDeleting ? (
                          <Flex align="center" gap="8px">
                              <Spinner size="sm" color="white" />
                              <Text>Đang xóa...</Text>
                          </Flex>
                      ) : (
                          "Xóa vĩnh viễn"
                      )}
                  </Button>
              </ModalFooter>
          </ModalContent>
      </Modal>
  );
}