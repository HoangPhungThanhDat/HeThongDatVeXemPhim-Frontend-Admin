import React from "react";
import { Flex, Image } from "@chakra-ui/react";

import bannergau21 from "assets/img/bannergau21.png";

export function SidebarBrand() {
  return (
    <Flex align="center" direction="column" py="12px">
      <Image
        src={bannergau21}
        alt="Cinema Logo"
        w="200px"
        
        objectFit="contain"
      />
    </Flex>
  );
}

export default SidebarBrand;
