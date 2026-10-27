
import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ResponsiveContainer, AreaChart, defs, linearGradient, stop, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import ChartCard from "./shared/ChartCard";
import { CustomLineTooltip } from "./shared/CustomTooltips";

export default function RevenueChart({ data, title }) {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const axisTickColor = useColorModeValue("rgba(0,0,0,0.45)", "rgba(255,255,255,0.4)");
  const gridStroke = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.05)");
  const dotStrokeColor = useColorModeValue("#ffffff", "#1a1a2e");

  const chartData = data?.length > 0 ? data : [{ day: "Hôm nay", revenue: 0 }];

  return (
    <ChartCard accentColor="#F6AD55">
      <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
        <Box>
          <Text fontSize="lg" fontWeight="700" color={textColor}>{title || "Doanh thu"}</Text>
          <Text fontSize="xs" color={mutedTextColor} mt="2px">Đơn vị: Triệu đồng</Text>
        </Box>
      </Flex>
      <Box h="280px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F6AD55" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F6AD55" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
            <Tooltip content={<CustomLineTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#F6AD55" strokeWidth={3} fill="url(#grad1)" dot={{ r: 5, fill: "#F6AD55", strokeWidth: 2, stroke: dotStrokeColor }} activeDot={{ r: 7, fill: "#F6AD55", stroke: dotStrokeColor, strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
}