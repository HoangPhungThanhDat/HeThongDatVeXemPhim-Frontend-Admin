
import React from "react";
import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { MdLocalMovies } from "react-icons/md";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import ChartCard from "./shared/ChartCard";
import { CustomBarTooltip } from "./shared/CustomTooltips";

export default function TopMoviesChart({ data }) {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const axisTickColor = useColorModeValue("rgba(0,0,0,0.45)", "rgba(255,255,255,0.4)");
  const gridStroke = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.05)");

  return (
    <ChartCard accentColor="#9F7AEA">
      <Flex align="center" gap="10px" mb="4px">
        <Icon as={MdLocalMovies} color="#9F7AEA" boxSize="18px" />
        <Text fontSize="lg" fontWeight="700" color={textColor}>Vé bán theo phim</Text>
      </Flex>
      <Text fontSize="xs" color={mutedTextColor} mb="20px">Top phim đang chiếu</Text>
      <Box h="260px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} barSize={36} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: axisTickColor, fontSize: 11 }} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="tickets" radius={[10, 10, 0, 0]} fill="#9F7AEA" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
}