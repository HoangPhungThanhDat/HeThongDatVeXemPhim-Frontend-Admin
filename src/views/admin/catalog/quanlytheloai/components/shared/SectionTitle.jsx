

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export function SectionTitle({ label }) {
  const textColor = useColorModeValue("#374151", "#a0aec0");
  
  return (
    <Box mb="16px">
      <Flex align="center" gap="8px">
        <Box 
          w="3px" 
          h="14px" 
          borderRadius="full" 
          bg="linear-gradient(180deg, #f97316, #fbbf24)" 
        />
        <Text 
          fontSize="10.5px" 
          fontWeight="800" 
          color={textColor} 
          letterSpacing="1.2px" 
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Box 
        mt="8px" 
        h="1px" 
        bg={useColorModeValue(
          "linear-gradient(90deg, #fed7aa 0%, transparent 100%)",
          "rgba(249,115,22,0.2)"
        )} 
      />
    </Box>
  );
}