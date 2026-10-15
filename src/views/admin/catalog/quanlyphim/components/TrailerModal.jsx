

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Box,
    IconButton,
    Flex,
    Text,
    useColorModeValue,
    AspectRatio,
    Spinner
  } from "@chakra-ui/react";
  import { MdClose, MdPlayArrow } from "react-icons/md";
  import { useState } from "react";
  
  export function TrailerModal({ isOpen, onClose, trailerUrl, title }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const cardBg = useColorModeValue("#0f172a", "#0a0f1f");
    const textColor = useColorModeValue("white", "#e2e8f0");
  
    // Hàm lấy embed URL từ YouTube
    const getEmbedUrl = (url) => {
      if (!url) return null;
      
      let videoId = null;
      
      // Pattern 1: youtube.com/watch?v=xxx
      let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
      if (match) {
        videoId = match[1];
      }
      
      // Pattern 2: youtu.be/xxx
      if (!videoId) {
        match = url.match(/youtu\.be\/([^&\s?]+)/);
        if (match) {
          videoId = match[1];
        }
      }
      
      // Pattern 3: Nếu chỉ có ID
      if (!videoId && url.length <= 20 && !url.includes('/')) {
        videoId = url;
      }
      
      // Pattern 4: Nếu là link embed
      if (!videoId && url.includes('embed/')) {
        match = url.match(/embed\/([^&\s?]+)/);
        if (match) {
          videoId = match[1];
        }
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
      }
      
      return url;
    };
  
    const embedUrl = getEmbedUrl(trailerUrl);
  
    // Xử lý lỗi khi iframe không load được
    const handleIframeError = () => {
      setIsLoading(false);
      setIsError(true);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay 
          bg="rgba(0,0,0,0.85)" 
          backdropFilter="blur(8px)"
        />
        <ModalContent
          bg={cardBg}
          borderRadius="16px"
          overflow="hidden"
          maxW="900px"
          mx="16px"
          position="relative"
          boxShadow="0 20px 60px rgba(0,0,0,0.8)"
        >
          {/* Header */}
          <Flex
            align="center"
            justify="space-between"
            px={{ base: "16px", md: "24px" }}
            py="12px"
            borderBottom="1px solid rgba(255,255,255,0.08)"
          >
            <Text 
              fontSize={{ base: "14px", md: "16px" }} 
              fontWeight="700" 
              color={textColor}
              noOfLines={1}
            >
              {title || "Trailer phim"}
            </Text>
            <IconButton
              aria-label="Close"
              icon={<MdClose size="20px" />}
              variant="ghost"
              color="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.200", color: "white" }}
              size="sm"
              onClick={onClose}
              borderRadius="full"
            />
          </Flex>
  
          {/* Video Player */}
          <ModalBody p="0" position="relative">
            {embedUrl ? (
              <>
                {isLoading && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bg="#0a0f1f"
                    zIndex="1"
                    gap="12px"
                  >
                    <Spinner 
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="rgba(255,255,255,0.1)"
                      color="#f97316"
                      size="xl"
                    />
                    <Text color="whiteAlpha.600" fontSize="14px">
                      Đang tải trailer...
                    </Text>
                  </Box>
                )}
                
                {isError && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bg="#0a0f1f"
                    zIndex="1"
                    gap="12px"
                  >
                    <Box
                      w="60px"
                      h="60px"
                      borderRadius="full"
                      bg="rgba(239,68,68,0.15)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="2px solid rgba(239,68,68,0.3)"
                    >
                      <Icon as={MdPlayArrow} boxSize="30px" color="#ef4444" />
                    </Box>
                    <Text color="whiteAlpha.600" fontSize="14px">
                      Không thể tải trailer
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="whiteAlpha.300"
                      color="whiteAlpha.700"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => {
                        setIsError(false);
                        setIsLoading(true);
                        // Reload iframe bằng cách set lại src
                      }}
                    >
                      Thử lại
                    </Button>
                  </Box>
                )}
  
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    key={embedUrl} // Force re-render khi URL thay đổi
                    src={embedUrl}
                    title={title || "Trailer phim"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: "none",
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                    onLoad={() => {
                      setIsLoading(false);
                      setIsError(false);
                    }}
                    onError={handleIframeError}
                  />
                </AspectRatio>
              </>
            ) : (
              <Box
                p="40px 20px"
                textAlign="center"
                bg="#0a0f1f"
                minH="300px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.05)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb="16px"
                >
                  <Icon as={MdPlayArrow} boxSize="40px" color="rgba(255,255,255,0.3)" />
                </Box>
                <Text color="whiteAlpha.600" fontSize="14px">
                  Không có trailer cho phim này
                </Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }