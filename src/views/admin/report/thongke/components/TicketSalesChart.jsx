
import React from "react";
import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { MdTrendingUp } from "react-icons/md";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import ChartCard from "./shared/ChartCard";
import { CustomBarTooltip } from "./shared/CustomTooltips";

export default function TicketSalesChart({ data, period }) {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const axisTickColor = useColorModeValue("rgba(0,0,0,0.45)", "rgba(255,255,255,0.4)");
  const gridStroke = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.05)");
  const dotStrokeColor = useColorModeValue("#ffffff", "#1a1a2e");

  const chartData = data?.length > 0 ? data : [{ day: "Hôm nay", tickets: 0 }];
  const periodText = period === 'week' ? 'Ngày' : period === 'month' ? 'Ngày' : 'Tháng';

  return (
    <ChartCard accentColor="#76E4F7">
      <Flex align="center" gap="10px" mb="4px">
        <Icon as={MdTrendingUp} color="#76E4F7" boxSize="18px" />
        <Text fontSize="lg" fontWeight="700" color={textColor}>Lượt đặt vé</Text>
      </Flex>
      <Text fontSize="xs" color={mutedTextColor} mb="20px">Theo thời gian ({periodText})</Text>
      <Box h="260px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#76E4F7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#76E4F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
            <Tooltip content={<CustomBarTooltip />} />
            <Area type="monotone" dataKey="tickets" stroke="#76E4F7" strokeWidth={3} fill="url(#gradCyan)" dot={{ r: 4, fill: "#76E4F7", stroke: dotStrokeColor, strokeWidth: 2 }} activeDot={{ r: 6, fill: "#76E4F7", stroke: dotStrokeColor, strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
}