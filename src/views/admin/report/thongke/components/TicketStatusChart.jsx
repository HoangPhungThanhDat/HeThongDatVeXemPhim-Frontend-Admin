
import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import ChartCard from "./shared/ChartCard";
import { COLORS } from "../constants";

export default function TicketStatusChart({ tickets = 0 }) {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const pieTextColor = useColorModeValue("#2D3748", "white");
  const pieSubTextColor = useColorModeValue("rgba(0,0,0,0.4)", "rgba(255,255,255,0.4)");

  const ticketStatusData = [
    { name: "Đã bán", value: Number(tickets) || 0, color: "#F6AD55" },
    { name: "Đã hủy", value: 0, color: "#FC8181" },
  ];
  const totalTickets = ticketStatusData.reduce((s, i) => s + i.value, 0);

  return (
    <ChartCard accentColor="#FC8181">
      <Text fontSize="lg" fontWeight="700" color={textColor} mb="4px">Trạng thái vé</Text>
      <Text fontSize="xs" color={mutedTextColor} mb="20px">Tổng vé trong kỳ</Text>
      <Flex direction="column" align="center">
        <Box h="220px" w="100%">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ticketStatusData} dataKey="value" innerRadius={65} outerRadius={90} paddingAngle={5} startAngle={90} endAngle={-270}>
                {ticketStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="transparent" />
                ))}
              </Pie>
              <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill={pieTextColor}>{totalTickets}</text>
              <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill={pieSubTextColor} letterSpacing="2">TỔNG VÉ</text>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </ChartCard>
  );
}