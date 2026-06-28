import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";

export default function TableTopCreators({ data = [] }) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Khách hàng</Th>
          <Th>Chủ đề</Th>
          <Th>Trạng thái</Th>
        </Tr>
      </Thead>
      
      <Tbody>
        {data.length === 0 ? (
          <Tr>
            <Td colSpan={3} textAlign="center" color="gray.400">
              Chưa có yêu cầu mới
            </Td>
          </Tr>
        ) : (
          data.map((item, index) => (
            <Tr key={index}>
              <Td>{item.name}</Td>
              <Td>{item.subject}</Td>
              <Td>
                <Badge
                  colorScheme={
                    item.status === "done"
                      ? "green"
                      : item.status === "processing"
                      ? "orange"
                      : "red"
                  }
                >
                  {item.status}
                </Badge>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
}
