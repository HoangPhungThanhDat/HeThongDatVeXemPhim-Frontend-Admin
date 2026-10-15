// src/components/sidebar/components/Links.js
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";

// Chakra imports
import { Icon } from "@chakra-ui/react";

// ─────────────────────────────────────────────────────────────────
// DIVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────
function SidebarDivider({ label }) {
  const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const labelColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      as="div"
      mt="20px"
      mb="12px"
      px="20px"
      role="separator"
      aria-label={label}
    >
      <HStack spacing="10px" mb="6px">
        <Box
          flex="1"
          h="1px"
          bg={dividerColor}
        />
        <Text
          fontSize="10px"
          fontWeight="700"
          letterSpacing="1.2px"
          color={labelColor}
          textTransform="uppercase"
          whiteSpace="nowrap"
        >
          {label}
        </Text>
      </HStack>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────
// MENU ITEM (dùng cho cả mục đơn & mục con)
// ─────────────────────────────────────────────────────────────────
function SidebarItem({ route, isActive = false }) {
  const activeColor = useColorModeValue("brand.500", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const activeBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.50");

  return (
    <NavLink to={`${route.layout}${route.path}`}>
      <Box
        px="20px"
        py="10px"
        mx="12px"
        mb="4px"
        borderRadius="10px"
        bg={isActive ? activeBg : "transparent"}
        _hover={{ bg: isActive ? activeBg : hoverBg }}
        transition="all 0.2s ease"
      >
        <HStack spacing="12px">
          {route.icon && (
            <Box
              color={isActive ? activeColor : textColor}
              fontSize="16px"
              display="flex"
              alignItems="center"
            >
              {route.icon}
            </Box>
          )}
          <Text
            fontSize="14px"
            fontWeight={isActive ? "600" : "500"}
            color={isActive ? activeColor : textColor}
            noOfLines={1}
          >
            {route.name}
          </Text>
        </HStack>
      </Box>
    </NavLink>
  );
}

// ─────────────────────────────────────────────────────────────────
// MENU GROUP (nhóm có submenu — collapse/expand)
// ─────────────────────────────────────────────────────────────────
function SidebarGroup({ route, currentPath }) {
  const [isOpen, setIsOpen] = React.useState(
    // Tự động mở nếu route con đang active
    route.children?.some(
      (child) =>
        currentPath === `${child.layout}${child.path}`
    ) || false
  );

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const activeColor = useColorModeValue("brand.500", "white");
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.50");
  const arrowColor = useColorModeValue("gray.400", "gray.500");

  const hasActiveChild = route.children?.some(
    (child) => currentPath === `${child.layout}${child.path}`
  );

  return (
    <Box mb="4px">
      {/* Header nhóm */}
      <Box
        px="20px"
        py="10px"
        mx="12px"
        borderRadius="10px"
        cursor="pointer"
        onClick={() => setIsOpen((v) => !v)}
        _hover={{ bg: hoverBg }}
        transition="all 0.2s ease"
      >
        <HStack spacing="12px" justify="space-between">
          <HStack spacing="12px">
            {route.icon && (
              <Box
                color={hasActiveChild ? activeColor : textColor}
                fontSize="16px"
                display="flex"
                alignItems="center"
              >
                {route.icon}
              </Box>
            )}
            <Text
              fontSize="14px"
              fontWeight={hasActiveChild ? "600" : "500"}
              color={hasActiveChild ? activeColor : textColor}
              noOfLines={1}
            >
              {route.name}
            </Text>
          </HStack>
          <Box
            color={arrowColor}
            fontSize="12px"
            transform={isOpen ? "rotate(90deg)" : "rotate(0deg)"}
            transition="transform 0.2s ease"
          >
            ▶
          </Box>
        </HStack>
      </Box>

      {/* Submenu */}
      {isOpen && (
        <Box
          mt="2px"
          ml="20px"
          borderLeft="2px solid"
          borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
        >
          {route.children
            ?.filter((child) => !child.hidden)
            .map((child, idx) => {
              const childPath = `${child.layout}${child.path}`;
              const isChildActive = currentPath === childPath;
              return (
                <SidebarItem
                  key={idx}
                  route={child}
                  isActive={isChildActive}
                />
              );
            })}
        </Box>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN LINKS COMPONENT
// ─────────────────────────────────────────────────────────────────
function SidebarLinks({ routes }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Box>
      {routes.map((route, index) => {
        // Ẩn route hidden
        if (route.hidden) return null;

        // Render DIVIDER
        if (route.type === "divider") {
          return <SidebarDivider key={`divider-${index}`} label={route.label} />;
        }

        // Render NHÓM có submenu
        if (route.children && route.children.length > 0) {
          return (
            <SidebarGroup
              key={`group-${index}`}
              route={route}
              currentPath={currentPath}
            />
          );
        }

        // Render MỤC ĐƠN (không có submenu)
        if (route.layout && route.path) {
          const routePath = `${route.layout}${route.path}`;
          const isActive = currentPath === routePath;
          return (
            <SidebarItem
              key={`item-${index}`}
              route={route}
              isActive={isActive}
            />
          );
        }

        return null;
      })}
    </Box>
  );
}

export default SidebarLinks;