import { Flex, Text, Badge } from "@chakra-ui/react";

export default function HistoryItem({ title, user, time, status }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      px="20px"
      py="12px"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Flex direction="column">
        <Text fontWeight="600">{title}</Text>
        <Text fontSize="sm" color="gray.500">
          {user}
        </Text>
      </Flex>

      <Flex align="center">
        <Badge
          colorScheme={
            status === "done"
              ? "green"
              : status === "processing"
              ? "orange"
              : "red"
          }
          mr="10px"
        >
          {status}
        </Badge>
        <Text fontSize="sm" color="gray.400">
          {time}
        </Text>
      </Flex>
    </Flex>
  );
}
