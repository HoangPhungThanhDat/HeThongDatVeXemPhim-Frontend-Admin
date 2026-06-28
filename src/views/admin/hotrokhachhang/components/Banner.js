import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";

export default function Banner() {
  return (
    <Flex
      direction="column"
      bg="brand.500"
      color="white"
      p="30px"
      borderRadius="20px"
      mb="20px"
    >
      <Text fontSize="2xl" fontWeight="700">
        Hỗ trợ khách hàng
      </Text>
      <Text fontSize="sm" opacity={0.9} mt="5px">
        Quản lý yêu cầu, phản hồi và khiếu nại của khách hàng
      </Text>

      <Button
        mt="20px"
        size="sm"
        bg="white"
        color="brand.500"
        w="fit-content"
        _hover={{ bg: "gray.100" }}
      >
        + Tạo yêu cầu mới
      </Button>
    </Flex>
  );
}
