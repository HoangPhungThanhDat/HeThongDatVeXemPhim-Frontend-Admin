
import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { MdPeopleAlt, MdHistory } from "react-icons/md";
import { fadeUp } from "../constants";
import ActionBadge from "./ActionBadge";
import StatusBadge from "./shared/StatusBadge";

export default function MobileLogCard({ log, index, onView, isDark }) {
  const isAbnormal = log.status === "Bất thường";
  return (
    <Box p="14px" borderRadius="12px" bg={isDark ? "rgba(255,255,255,0.03)" : "white"} border={`1.5px solid ${isAbnormal ? "rgba(220,38,38,0.35)" : (isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9")}`} boxShadow="0 1px 4px rgba(0,0,0,.04)" sx={{ animation:`${fadeUp} .35s ease ${index*.03}s both` }} onClick={() => onView(log)}>
      <Flex justify="space-between" align="flex-start" mb="8px"><ActionBadge action={log.action} /><StatusBadge status={log.status} /></Flex>
      <Text fontSize="13px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} mb="4px" noOfLines={2}>{log.target}</Text>
      <Flex align="center" gap="6px" mb="4px"><Icon as={MdPeopleAlt} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} /><Text fontSize="11.5px" color={isDark ? "#a0aec0" : "#64748b"} noOfLines={1}>{log.user}</Text></Flex>
      <Flex align="center" justify="space-between"><Flex align="center" gap="5px"><Icon as={MdHistory} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} /><Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>{log.time}</Text></Flex><Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"}>{log.ip === '::1' ? '127.0.0.1' : log.ip}</Text></Flex>
    </Box>
  );
}