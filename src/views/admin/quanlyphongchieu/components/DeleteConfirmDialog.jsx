// src/views/admin/quanlyphongchieu/components/DeleteConfirmDialog.jsx

import React from "react";
import {
  Box, Flex, Text, Button, Icon, AlertDialog, AlertDialogBody,
  AlertDialogFooter, AlertDialogHeader, AlertDialogContent,
  AlertDialogOverlay, useColorMode,
} from "@chakra-ui/react";
import { MdWarning } from "react-icons/md";

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, roomName }) => {
  const { colorMode } = useColorMode();
  const cancelRef = React.useRef();
  const isDark = colorMode === "dark";
  const bg = isDark ? "#1e293b" : "white";

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter="blur(4px)">
        <AlertDialogContent bg={bg} borderRadius="20px" border={`1px solid ${isDark ? "#334155" : "#e2e8f0"}`}>
          <AlertDialogHeader fontSize="lg" fontWeight="800" color={isDark ? "#f1f5f9" : "#0f172a"}>
            <Flex align="center" gap="10px">
              <Icon as={MdWarning} boxSize="22px" color="#dc2626" />
              Xác nhận xóa phòng
            </Flex>
          </AlertDialogHeader>
          <AlertDialogBody color={isDark ? "#94a3b8" : "#64748b"}>
            Bạn có chắc chắn muốn xóa phòng <strong>{roomName}</strong>?
            <Text fontSize="12px" mt="6px" color="#dc2626">
              Lưu ý: Hành động này sẽ xóa vĩnh viễn phòng và tất cả dữ liệu liên quan. Không thể khôi phục.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="ghost" color={isDark ? "#94a3b8" : "#64748b"}>
              Hủy bỏ
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Xóa vĩnh viễn
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;