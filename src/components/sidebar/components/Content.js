// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";

import React from "react";

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;

  // SIDEBAR
  return (
    <Flex
      direction="column"
      pt="25px"
      px="16px"
      pb="40px"
      borderRadius="30px"
      minH="100%"
    >
      <Brand />

      <Stack direction="column" mt="8px" spacing={1}>
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="40px" mb="20px" />
    </Flex>
  );
}

export default SidebarContent;