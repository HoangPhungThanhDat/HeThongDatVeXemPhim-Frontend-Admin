/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const textColor = useColorModeValue("gray.500", "gray.300");
  const hoverColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        md: "row",
      }}
      alignItems='center'
      justifyContent='space-between'
      px={{ base: "20px", md: "35px" }}
      py='18px'
      borderTop='1px solid'
      borderColor={useColorModeValue("gray.200", "whiteAlpha.100")}
    >
      {/* TEXT */}
      <Text
        color={textColor}
        fontSize='sm'
        textAlign={{
          base: "center",
          md: "left",
        }}
        mb={{ base: "12px", md: "0" }}
      >
        © {new Date().getFullYear()} Hệ thống quản lý rạp phim.
        <Text as='span' fontWeight='600' ms='4px'>
          Phát triển bởi DAT HOANG 🚀
        </Text>
      </Text>

      {/* MENU */}
      <List display='flex' alignItems='center'>
        <ListItem
          me={{
            base: "16px",
            md: "28px",
          }}
        >
          <Link
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            _hover={{
              color: hoverColor,
              textDecoration: "none",
            }}
          >
            Hỗ trợ
          </Link>
        </ListItem>

        <ListItem
          me={{
            base: "16px",
            md: "28px",
          }}
        >
          <Link
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            _hover={{
              color: hoverColor,
              textDecoration: "none",
            }}
          >
            Điều khoản
          </Link>
        </ListItem>

        <ListItem>
          <Link
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            _hover={{
              color: hoverColor,
              textDecoration: "none",
            }}
          >
            Liên hệ
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}