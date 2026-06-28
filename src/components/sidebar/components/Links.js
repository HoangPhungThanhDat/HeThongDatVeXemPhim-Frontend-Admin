/* eslint-disable */
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Collapse,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdChevronRight, MdExpandMore } from "react-icons/md";

export function SidebarLinks(props) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const activeColor    = useColorModeValue("gray.700", "white");
  const inactiveColor  = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const activeIcon     = useColorModeValue("brand.500", "white");
  const textColor      = useColorModeValue("secondaryGray.500", "white");
  const brandColor     = useColorModeValue("brand.500", "brand.400");
  const childBg        = useColorModeValue("gray.50", "whiteAlpha.50");

  const { routes } = props;

  const activeRoute = (routePath) =>
    location.pathname.includes(routePath);

  const isChildActive = (children) =>
    children?.some((child) => activeRoute(child.path?.toLowerCase()));

  const toggleMenu = (name) =>
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));

  const getMenuOpen = (name, childActive) =>
    openMenus[name] !== undefined ? openMenus[name] : childActive;

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // Ẩn route có hidden: true (VD: Sign In)
      if (route.hidden) return null;

      // ── Menu mẹ có children → Accordion ──────────────────────────
      if (route.children) {
        const childActive = isChildActive(route.children);
        const isOpen = getMenuOpen(route.name, childActive);

        return (
          <Box key={index}>
            {/* Header menu mẹ */}
            <Box
              onClick={() => toggleMenu(route.name)}
              cursor="pointer"
              userSelect="none"
              _hover={{ opacity: 0.85 }}
              transition="opacity 0.15s"
            >
              <HStack
                spacing={childActive ? "22px" : "26px"}
                py="5px"
                ps="10px"
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  {/* Icon */}
                  <Box
                    color={childActive ? activeIcon : textColor}
                    me="18px"
                    flexShrink={0}
                  >
                    {route.icon}
                  </Box>

                  {/* Label */}
                  <Text
                    me="auto"
                    color={childActive ? activeColor : textColor}
                    fontWeight={childActive ? "bold" : "normal"}
                    fontSize="md"
                  >
                    {route.name}
                  </Text>

                  {/* Mũi tên */}
                  <Icon
                    as={isOpen ? MdExpandMore : MdChevronRight}
                    w="16px"
                    h="16px"
                    color={childActive ? activeIcon : textColor}
                    me="4px"
                    transition="transform 0.2s"
                  />
                </Flex>

                {/* Thanh active bên phải */}
                <Box
                  h="36px"
                  w="4px"
                  bg={childActive ? brandColor : "transparent"}
                  borderRadius="5px"
                  flexShrink={0}
                />
              </HStack>
            </Box>

            {/* Danh sách menu con */}
            <Collapse in={isOpen} animateOpacity>
              <Box
                ms="10px"
                ps="8px"
                borderLeft="2px solid"
                borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
                mb="4px"
              >
                {route.children.map((child, childIndex) => (
                  <NavLink key={childIndex} to={child.layout + child.path}>
                    <HStack
                      spacing={activeRoute(child.path.toLowerCase()) ? "22px" : "26px"}
                      py="4px"
                      ps="8px"
                      borderRadius="8px"
                      bg={activeRoute(child.path.toLowerCase()) ? childBg : "transparent"}
                      _hover={{ bg: childBg, opacity: 0.9 }}
                      transition="all 0.15s"
                    >
                      <Flex w="100%" alignItems="center">
                        {/* Icon con */}
                        {child.icon && (
                          <Box
                            color={
                              activeRoute(child.path.toLowerCase())
                                ? activeIcon
                                : inactiveColor
                            }
                            me="12px"
                            flexShrink={0}
                          >
                            {child.icon}
                          </Box>
                        )}

                        {/* Label con */}
                        <Text
                          me="auto"
                          color={
                            activeRoute(child.path.toLowerCase())
                              ? activeColor
                              : inactiveColor
                          }
                          fontWeight={
                            activeRoute(child.path.toLowerCase()) ? "bold" : "normal"
                          }
                          fontSize="sm"
                        >
                          {child.name}
                        </Text>
                      </Flex>

                      {/* Thanh active bên phải (menu con) */}
                      <Box
                        h="28px"
                        w="3px"
                        bg={
                          activeRoute(child.path.toLowerCase())
                            ? brandColor
                            : "transparent"
                        }
                        borderRadius="5px"
                        flexShrink={0}
                      />
                    </HStack>
                  </NavLink>
                ))}
              </Box>
            </Collapse>
          </Box>
        );
      }

      // ── Route bình thường ─────────────────────────────────────────
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
                  py="5px"
                  ps="10px"
                >
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor}
                      me="18px"
                      flexShrink={0}
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
                      color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
                      fontWeight={activeRoute(route.path.toLowerCase()) ? "bold" : "normal"}
                    >
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h="36px"
                    w="4px"
                    bg={activeRoute(route.path.toLowerCase()) ? brandColor : "transparent"}
                    borderRadius="5px"
                    flexShrink={0}
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
                  py="5px"
                  ps="10px"
                >
                  <Text
                    me="auto"
                    color={activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor}
                    fontWeight={activeRoute(route.path.toLowerCase()) ? "bold" : "normal"}
                  >
                    {route.name}
                  </Text>
                  <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }

      return null;
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;