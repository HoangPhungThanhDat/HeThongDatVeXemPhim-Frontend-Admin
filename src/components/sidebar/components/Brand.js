import React from "react";
import { Flex, Image } from "@chakra-ui/react";

import bannergau21 from "assets/img/bannergau21.png";

export function SidebarBrand() {
  return (
    <Flex
      align="center"
      direction="column"
      py="12px"
      flexShrink={0}
      position="relative"
    >
      <Image
        src={bannergau21}
        alt="Cinema Logo"
        w="180px"
        maxH="80px"
        objectFit="contain"
      />
    </Flex>
  );
}

export default SidebarBrand;