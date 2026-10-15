// components/StatsRow.jsx
import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import StatCard from "./shared/StatCard";
import { 
  MdInbox, 
  MdAccessTime,  
  MdPending,     
  MdCheckCircle 
} from "react-icons/md";

export default function StatsRow({ stats }) {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
      <StatCard
        label="Tổng liên hệ"
        value={stats.total}
        icon={MdInbox}
        accent="#ea580c"
        delay={0}
      />
      <StatCard
        label="Chưa xử lý"
        value={stats.pending}
        icon={MdAccessTime}  // Đã sửa
        accent="#dc2626"
        delay={0.05}
      />
      <StatCard
        label="Đang xử lý"
        value={stats.processing}
        icon={MdPending}     // Đã sửa
        accent="#f59e0b"
        delay={0.1}
      />
      <StatCard
        label="Đã xử lý"
        value={stats.done}
        icon={MdCheckCircle}
        accent="#10b981"
        delay={0.15}
      />
    </SimpleGrid>
  );
}