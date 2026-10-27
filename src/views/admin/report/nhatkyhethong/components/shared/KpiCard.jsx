
import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Icon, Text, Badge, useColorModeValue } from "@chakra-ui/react";
import { pulseRing } from "../../constants";

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const numericVal = parseFloat(String(value).replace(/[^\d.]/g, ""));
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(numericVal * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <>{prefix}{display.toLocaleString("vi-VN")}{suffix}</>;
}

export default function KpiCard({ icon, label, value, prefix, suffix, iconColor, trend, trendLabel, pulse }) {
  const cardBg = useColorModeValue("white", "rgba(255,255,255,0.03)");
  const cardBorder = useColorModeValue("gray.100", "rgba(255,255,255,0.08)");
  const cardHoverBg = useColorModeValue("gray.50", "rgba(255,255,255,0.06)");
  const textColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const trendLabelColor = useColorModeValue("gray.400", "whiteAlpha.400");
  const shadowColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(0,0,0,0.4)");

  return (
    <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="20px" p="20px" position="relative" overflow="hidden" transition="all 0.3s ease" boxShadow={useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none")}
      _hover={{ bg: cardHoverBg, borderColor: `${iconColor}59`, transform: "translateY(-3px)", boxShadow: `0 16px 40px ${shadowColor}, 0 0 0 1px ${iconColor}1a` }}
      _before={{ content: '""', position: "absolute", top: 0, left: 0, right: 0, h: "2px", bgGradient: `linear(to-r, transparent, ${iconColor}, transparent)` }}>
      <Box position="absolute" top="-20px" right="-20px" w="80px" h="80px" borderRadius="full" bg={iconColor} opacity={0.07} filter="blur(20px)" pointerEvents="none" />
      <Flex align="center" justify="space-between" mb="16px">
        <Flex w="42px" h="42px" borderRadius="12px" bg={`${iconColor}18`} border={`1px solid ${iconColor}30`} align="center" justify="center" position="relative">
          <Icon as={icon} boxSize="20px" color={iconColor} />
          {pulse && <Box position="absolute" inset="0" borderRadius="12px" sx={{ animation: `${pulseRing} 1.6s ease-out infinite` }} />}
        </Flex>
        {trend !== undefined && (
          <Badge bg={trend > 0 ? "rgba(72,187,120,0.15)" : "rgba(252,129,129,0.15)"} color={trend > 0 ? "#38A169" : "#E53E3E"} border={`1px solid ${trend > 0 ? "rgba(72,187,120,0.3)" : "rgba(252,129,129,0.3)"}`} borderRadius="8px" px="8px" py="3px" fontSize="xs" fontWeight="700">
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </Badge>
        )}
      </Flex>
      <Text fontSize="xs" color={labelColor} fontWeight="600" letterSpacing="0.1em" textTransform="uppercase" mb="6px">{label}</Text>
      <Text fontSize="2xl" fontWeight="800" color={textColor} letterSpacing="-0.5px"><AnimatedNumber value={value} prefix={prefix} suffix={suffix} /></Text>
      {trendLabel && <Text fontSize="xs" color={trendLabelColor} mt="6px">{trendLabel}</Text>}
    </Box>
  );
}