import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Box, Flex, Text, Button, Icon, Input, Select, Badge,
  SimpleGrid, useColorMode, useColorModeValue, keyframes,
} from "@chakra-ui/react";
import {
  MdStar, MdStarBorder, MdCheckCircle, MdBlock, MdDelete,
  MdSearch, MdFilterList, MdPending, MdDone,
  MdWarning, MdClose, MdRefresh, MdMovie,
  MdCalendarToday, MdRateReview, MdDownload,
  MdLightMode, MdDarkMode, MdNotifications,
} from "react-icons/md";

// ─── Keyframes ───────────────────────────────────────────────────────────────
const fadeUp   = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn  = keyframes`from{opacity:0;transform:scale(0.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}`;
const pulse    = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const slideIn  = keyframes`from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}`;
const badgePop = keyframes`0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}`;

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOVIES_LIST = [
  { id: 1, title: "Avengers: Infinity War",   poster: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",   avgRating: 4.8, totalReviews: 342, status: "Đang chiếu" },
  { id: 2, title: "Spider-Man: No Way Home",  poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg", avgRating: 4.9, totalReviews: 589, status: "Đang chiếu" },
  { id: 3, title: "Doctor Strange 2",         poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg", avgRating: 4.2, totalReviews: 178, status: "Sắp chiếu" },
  { id: 4, title: "Thor: Love and Thunder",   poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/Thor_Love_and_Thunder_poster.jpg",   avgRating: 3.9, totalReviews: 201, status: "Ngừng chiếu" },
];

const INITIAL_REVIEWS = [
  { id: 1,  movieId: 1, user: "Nguyễn Văn An",    avatar: "A", rating: 5, comment: "Bộ phim xuất sắc! Cảnh chiến đấu cuối phim làm mình rùng mình. Diễn xuất của tất cả diễn viên đều rất tốt, đặc biệt là Josh Brolin trong vai Thanos. Cốt truyện hấp dẫn từ đầu đến cuối.", date: "2026-05-20", status: "Chờ duyệt", report: 0 },
  { id: 2,  movieId: 2, user: "Trần Thị Bảo",     avatar: "B", rating: 4, comment: "Nội dung cuốn hút, diễn xuất tốt. Xứng đáng xem rạp. Phần fanservice rất hay cho những ai follow Marvel từ đầu.", date: "2026-05-21", status: "Chờ duyệt", report: 0 },
  { id: 3,  movieId: 1, user: "Lê Văn Cường",     avatar: "C", rating: 3, comment: "Phim tạm ổn nhưng hơi dài. Một số cảnh bị kéo dài không cần thiết. Tổng thể vẫn đáng xem.", date: "2026-05-22", status: "Chờ duyệt", report: 0 },
  { id: 4,  movieId: 3, user: "Phạm Thu Dung",    avatar: "D", rating: 5, comment: "Ảo diệu! Sam Raimi đã thổi hồn kinh dị vào vũ trụ Marvel. Elizabeth Olsen diễn cực đỉnh trong vai Scarlet Witch.", date: "2026-05-19", status: "Chờ duyệt", report: 2 },
  { id: 5,  movieId: 4, user: "Hoàng Minh Đức",   avatar: "H", rating: 2, comment: "Thất vọng so với các phần Thor trước. Nhân vật Gorr bị khai thác chưa đủ. Phần hài cũng khá gượng gạo.", date: "2026-05-18", status: "Chờ duyệt", report: 0 },
  { id: 6,  movieId: 2, user: "Vũ Thị Lan",       avatar: "V", rating: 5, comment: "Xem xong mà muốn xem lại ngay. Đây là một trong những phim Marvel hay nhất mình từng xem.", date: "2026-05-17", status: "Đã duyệt",  report: 0 },
  { id: 7,  movieId: 1, user: "Đặng Quốc Bảo",   avatar: "Đ", rating: 4, comment: "Phim rất hay, hiệu ứng hình ảnh đỉnh cao. Cốt truyện chặt chẽ và đầy cảm xúc. Recommend cho tất cả mọi người!", date: "2026-05-16", status: "Đã duyệt",  report: 0 },
  { id: 8,  movieId: 3, user: "Ngô Thanh Hà",     avatar: "N", rating: 1, comment: "Nội dung phản cảm, hình ảnh xúc phạm tôn giáo. Cần xem xét lại!", date: "2026-05-15", status: "Chờ duyệt", report: 8 },
  { id: 9,  movieId: 4, user: "Lý Quỳnh Nga",     avatar: "L", rating: 3, comment: "Phim vui, phù hợp xem cuối tuần cùng gia đình. Không quá nghiêm túc nhưng entertaining.", date: "2026-05-14", status: "Từ chối",  report: 0 },
  { id: 10, movieId: 2, user: "Trương Văn Phúc",  avatar: "T", rating: 4, comment: "Tom Holland diễn rất tốt. Câu chuyện xúc động và bất ngờ. Fan Marvel chắc chắn phải xem.", date: "2026-05-13", status: "Đã duyệt",  report: 0 },
  { id: 11, movieId: 1, user: "Bùi Khánh Linh",  avatar: "B", rating: 5, comment: "THANOS DID NOTHING WRONG! Phim có chiều sâu triết học về sự cân bằng. Visual effects tuyệt vời.", date: "2026-05-12", status: "Chờ duyệt", report: 1 },
  { id: 12, movieId: 3, user: "Phan Xuân Trường", avatar: "P", rating: 4, comment: "Doctor Strange 2 mang màu sắc kinh dị rất đặc sắc. Sam Raimi đã để lại dấu ấn rõ ràng của mình.", date: "2026-05-11", status: "Chờ duyệt", report: 0 },
];

// Simulated new reviews that "arrive" via polling
const SIMULATED_NEW_REVIEWS = [
  { id: 101, movieId: 1, user: "Minh Tuấn",     avatar: "M", rating: 4, comment: "Phim hành động đỉnh cao! Không thể rời mắt khỏi màn hình suốt 2 tiếng.", date: "2026-06-18", status: "Chờ duyệt", report: 0 },
  { id: 102, movieId: 2, user: "Thu Hương",      avatar: "T", rating: 5, comment: "Bất ngờ hoàn toàn với cái kết. Multiverse được xây dựng rất logic.", date: "2026-06-18", status: "Chờ duyệt", report: 0 },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ value, size = "13px", showValue = false }) {
  return (
    <Flex align="center" gap="2px">
      {[1,2,3,4,5].map(i => (
        <Icon key={i} as={i <= value ? MdStar : MdStarBorder}
          boxSize={size} color={i <= value ? "#f59e0b" : "#d1d5db"} />
      ))}
      {showValue && (
        <Text ml="4px" fontSize="12px" fontWeight="700" color="inherit">{value.toFixed(1)}</Text>
      )}
    </Flex>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Chờ duyệt": { color: "#b45309", bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", darkBg: "#422006", darkBorder: "#92400e" },
  "Đã duyệt":  { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981", darkBg: "#022c22", darkBorder: "#065f46" },
  "Từ chối":   { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af", darkBg: "#111827", darkBorder: "#374151" },
  "Vi phạm":   { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", dot: "#ef4444", darkBg: "#450a0a", darkBorder: "#991b1b" },
};

function StatusBadge({ status }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const cfg = STATUS_CFG[status] || STATUS_CFG["Chờ duyệt"];
  return (
    <Flex align="center" gap="5px" px="9px" py="4px" borderRadius="8px"
      bg={isDark ? cfg.darkBg : cfg.bg}
      border={`1px solid ${isDark ? cfg.darkBorder : cfg.border}`}
      display="inline-flex" w="fit-content"
    >
      <Box w="5px" h="5px" borderRadius="full" bg={cfg.dot}
        sx={status === "Chờ duyệt" ? { animation: `${pulse} 1.8s ease infinite` } : {}} />
      <Text fontSize="11px" fontWeight="700" color={cfg.color}>{status}</Text>
    </Flex>
  );
}

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────
function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Box
      as="button"
      onClick={toggleColorMode}
      w="56px" h="28px"
      borderRadius="full"
      bg={isDark ? "linear-gradient(135deg,#1e293b,#334155)" : "linear-gradient(135deg,#f1f5f9,#e2e8f0)"}
      border={isDark ? "1.5px solid #475569" : "1.5px solid #cbd5e1"}
      position="relative"
      transition="all 0.3s ease"
      _hover={{ opacity: 0.85 }}
      display="flex" alignItems="center"
      px="3px"
    >
      <Box
        w="20px" h="20px" borderRadius="full"
        bg={isDark ? "linear-gradient(135deg,#f97316,#fbbf24)" : "linear-gradient(135deg,#f97316,#fb923c)"}
        boxShadow={isDark ? "0 2px 8px rgba(249,115,22,0.5)" : "0 2px 6px rgba(249,115,22,0.35)"}
        transform={isDark ? "translateX(28px)" : "translateX(0)"}
        transition="transform 0.3s ease"
        display="flex" alignItems="center" justifyContent="center"
      >
        <Icon as={isDark ? MdDarkMode : MdLightMode} boxSize="12px" color="white" />
      </Box>
    </Box>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, delay = 0, highlight }) {
  const cardBg    = useColorModeValue("white", "#1e293b");
  const cardBorder= useColorModeValue("#f1f5f9", "#334155");
  const labelColor= useColorModeValue("#94a3b8", "#64748b");
  const valueColor= useColorModeValue("#0f172a", "#f1f5f9");
  const subColor  = useColorModeValue("#94a3b8", "#475569");

  return (
    <Box p="18px 20px" borderRadius="16px" bg={highlight ? `${accent}12` : cardBg}
      border={highlight ? `1.5px solid ${accent}40` : `1px solid ${cardBorder}`}
      boxShadow={highlight ? `0 4px 20px ${accent}20` : "0 1px 6px rgba(0,0,0,0.05)"}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.25s"
      _hover={{ boxShadow: `0 6px 20px ${accent}20`, transform: "translateY(-2px)", border: `1px solid ${accent}40` }}
    >
      <Flex align="flex-start" justify="space-between">
        <Box>
          <Text fontSize="10.5px" fontWeight="800" color={labelColor} letterSpacing="0.9px"
            textTransform="uppercase" mb="6px">{label}</Text>
          <Text fontSize="28px" fontWeight="800" color={highlight ? accent : valueColor} lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color={subColor} mt="4px">{sub}</Text>}
        </Box>
        <Box w="42px" h="42px" borderRadius="12px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center" flexShrink="0">
          <Icon as={icon} boxSize="18px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Movie Score Card ─────────────────────────────────────────────────────────
function MovieScoreCard({ movie, reviewCount, delay = 0 }) {
  const cardBg    = useColorModeValue("white", "#1e293b");
  const cardBorder= useColorModeValue("#f1f5f9", "#334155");
  const titleColor= useColorModeValue("#0f172a", "#f1f5f9");
  const subColor  = useColorModeValue("#94a3b8", "#475569");
  const pct = (movie.avgRating / 5) * 100;

  return (
    <Box p="14px 16px" borderRadius="14px" bg={cardBg}
      border={`1px solid ${cardBorder}`} boxShadow="0 1px 4px rgba(0,0,0,0.04)"
      transition="all 0.2s"
      _hover={{ boxShadow: "0 4px 16px rgba(249,115,22,0.1)", border: "1px solid #fed7aa" }}
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
    >
      <Flex align="center" gap="12px">
        <Box w="48px" h="64px" borderRadius="8px" overflow="hidden" flexShrink="0">
          <img src={movie.poster} alt={movie.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </Box>
        <Box flex="1" minW="0">
          <Text fontSize="13px" fontWeight="700" color={titleColor} noOfLines={1} mb="4px">{movie.title}</Text>
          <StarRating value={Math.round(movie.avgRating)} size="11px" />
          <Flex align="center" justify="space-between" mt="5px">
            <Text fontSize="11px" color={subColor}>{reviewCount} đánh giá</Text>
            <Flex align="center" gap="3px">
              <Icon as={MdStar} boxSize="12px" color="#f59e0b" />
              <Text fontSize="13px" fontWeight="800" color={titleColor}>{movie.avgRating}</Text>
            </Flex>
          </Flex>
          <Box mt="6px" h="4px" borderRadius="full" bg={useColorModeValue("#f1f5f9","#334155")} overflow="hidden">
            <Box h="100%" borderRadius="full" w={`${pct}%`}
              bg="linear-gradient(90deg,#f97316,#fbbf24)" transition="width 0.6s ease" />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, movie, index, onApprove, onReject, onDelete, isNew }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const cardBg      = useColorModeValue("white", "#1e293b");
  const commentBg   = useColorModeValue("#f8fafc", "#0f172a");
  const commentBorder= useColorModeValue("#f1f5f9", "#1e293b");
  const nameColor   = useColorModeValue("#0f172a", "#f1f5f9");
  const textColor   = useColorModeValue("#374151", "#94a3b8");
  const metaColor   = useColorModeValue("#64748b", "#475569");
  const isHighReport = review.report >= 3;

  const borderColor = isNew
    ? "#10b981"
    : isHighReport
      ? (isDark ? "#991b1b" : "#fca5a5")
      : (isDark ? "#334155" : "#f1f5f9");

  return (
    <Box p="16px 18px" borderRadius="14px" bg={cardBg}
      border={`1.5px solid ${borderColor}`}
      boxShadow={isNew ? "0 2px 12px rgba(16,185,129,0.12)" : isHighReport ? "0 2px 12px rgba(239,68,68,0.08)" : "0 1px 4px rgba(0,0,0,0.04)"}
      transition="all 0.2s"
      _hover={{ border: "1.5px solid #f97316", boxShadow: "0 4px 16px rgba(249,115,22,0.1)" }}
      sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.04}s both` }}
      position="relative"
    >
      {/* New badge */}
      {isNew && (
        <Box position="absolute" top="12px" right="12px"
          px="8px" py="3px" borderRadius="6px" bg="#ecfdf5" border="1px solid #6ee7b7"
        >
          <Flex align="center" gap="4px">
            <Box w="5px" h="5px" borderRadius="full" bg="#10b981"
              sx={{ animation: `${pulse} 1.5s ease infinite` }} />
            <Text fontSize="10px" fontWeight="700" color="#059669">Mới</Text>
          </Flex>
        </Box>
      )}

      {/* Report badge */}
      {!isNew && isHighReport && (
        <Box position="absolute" top="12px" right="12px"
          px="8px" py="3px" borderRadius="6px"
          bg={isDark ? "#450a0a" : "#fef2f2"}
          border={isDark ? "1px solid #991b1b" : "1px solid #fca5a5"}
        >
          <Flex align="center" gap="4px">
            <Icon as={MdWarning} boxSize="11px" color="#dc2626" />
            <Text fontSize="10px" fontWeight="700" color="#dc2626">{review.report} báo cáo</Text>
          </Flex>
        </Box>
      )}

      <Flex gap="12px">
        <Box w="38px" h="38px" borderRadius="10px" flexShrink="0"
          bg="linear-gradient(135deg,#f97316,#fbbf24)"
          display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="14px" fontWeight="800" color="white">{review.avatar}</Text>
        </Box>
        <Box flex="1" minW="0">
          <Flex align="center" justify="space-between" mb="5px"
            pr={(isNew || isHighReport) ? "80px" : "0"} flexWrap="wrap" gap="6px">
            <Flex align="center" gap="8px" flexWrap="wrap">
              <Text fontSize="13.5px" fontWeight="700" color={nameColor}>{review.user}</Text>
              <StatusBadge status={review.status} />
            </Flex>
          </Flex>
          <Flex align="center" gap="10px" mb="7px" flexWrap="wrap">
            <Flex align="center" gap="4px">
              <Icon as={MdMovie} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color={metaColor} fontWeight="600" noOfLines={1}>{movie?.title}</Text>
            </Flex>
            <Flex align="center" gap="4px">
              <Icon as={MdCalendarToday} boxSize="11px" color="#94a3b8" />
              <Text fontSize="11px" color="#94a3b8">{review.date}</Text>
            </Flex>
          </Flex>
          <Box mb="8px"><StarRating value={review.rating} size="13px" showValue /></Box>
          <Box p="10px 12px" borderRadius="10px" bg={commentBg} border={`1px solid ${commentBorder}`} mb="12px">
            <Text fontSize="13px" color={textColor} lineHeight="1.6">{review.comment}</Text>
          </Box>
          {review.status === "Chờ duyệt" && (
            <Flex gap="8px" flexWrap="wrap">
              <Button size="xs" h="30px" px="12px" borderRadius="8px"
                bg="#ecfdf5" color="#059669" border="1px solid #6ee7b7"
                fontSize="11.5px" fontWeight="700"
                leftIcon={<Icon as={MdCheckCircle} boxSize="12px" />}
                _hover={{ bg:"#d1fae5", transform:"translateY(-1px)" }} transition="all 0.15s"
                onClick={() => onApprove(review.id)}>Duyệt</Button>
              <Button size="xs" h="30px" px="12px" borderRadius="8px"
                bg={isDark ? "#1e293b" : "#f9fafb"} color="#6b7280"
                border={isDark ? "1px solid #334155" : "1px solid #e5e7eb"}
                fontSize="11.5px" fontWeight="700"
                leftIcon={<Icon as={MdBlock} boxSize="12px" />}
                _hover={{ bg: isDark ? "#0f172a" : "#f1f5f9", transform:"translateY(-1px)" }} transition="all 0.15s"
                onClick={() => onReject(review.id)}>Từ chối</Button>
              {isHighReport && (
                <Button size="xs" h="30px" px="12px" borderRadius="8px"
                  bg={isDark ? "#450a0a" : "#fef2f2"} color="#dc2626"
                  border={isDark ? "1px solid #991b1b" : "1px solid #fca5a5"}
                  fontSize="11.5px" fontWeight="700"
                  leftIcon={<Icon as={MdDelete} boxSize="12px" />}
                  _hover={{ bg: isDark ? "#600f0f" : "#fee2e2", transform:"translateY(-1px)" }} transition="all 0.15s"
                  onClick={() => onDelete(review.id)}>Xóa vi phạm</Button>
              )}
            </Flex>
          )}
          {review.status === "Đã duyệt" && (
            <Flex gap="8px">
              <Button size="xs" h="30px" px="12px" borderRadius="8px"
                bg={isDark ? "#450a0a" : "#fef2f2"} color="#dc2626"
                border={isDark ? "1px solid #991b1b" : "1px solid #fca5a5"}
                fontSize="11.5px" fontWeight="700"
                leftIcon={<Icon as={MdDelete} boxSize="12px" />}
                _hover={{ bg: isDark ? "#600f0f" : "#fee2e2" }} transition="all 0.15s"
                onClick={() => onDelete(review.id)}>Xóa</Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ action, review, movie, onConfirm, onCancel }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const modalBg = isDark ? "#1e293b" : "white";
  const previewBg = isDark ? "#0f172a" : "#f8fafc";
  const previewBorder = isDark ? "#334155" : "#f1f5f9";
  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const descColor  = isDark ? "#94a3b8" : "#64748b";

  const configs = {
    approve: { title:"Duyệt đánh giá", desc:"Đánh giá này sẽ được hiển thị công khai trên trang phim.", icon:MdCheckCircle, iconColor:"#059669", iconBg: isDark?"#022c22":"#ecfdf5", btnColor:"linear-gradient(135deg,#059669,#10b981)", btnText:"Xác nhận duyệt" },
    reject:  { title:"Từ chối đánh giá", desc:"Đánh giá sẽ bị ẩn và không hiển thị với người dùng.", icon:MdBlock, iconColor:"#6b7280", iconBg: isDark?"#111827":"#f9fafb", btnColor:"linear-gradient(135deg,#6b7280,#9ca3af)", btnText:"Từ chối" },
    delete:  { title:"Xóa đánh giá vi phạm", desc:"Hành động này không thể hoàn tác. Đánh giá sẽ bị xóa vĩnh viễn.", icon:MdDelete, iconColor:"#dc2626", iconBg: isDark?"#450a0a":"#fef2f2", btnColor:"linear-gradient(135deg,#dc2626,#ef4444)", btnText:"Xóa vĩnh viễn" },
  };
  const cfg = configs[action];

  return (
    <Box position="fixed" inset="0" bg="rgba(0,0,0,0.6)" zIndex="1000"
      display="flex" alignItems="center" justifyContent="center" p="16px"
      sx={{ animation:`${fadeIn} 0.2s ease both` }} onClick={onCancel}>
      <Box bg={modalBg} borderRadius="20px" p="28px" maxW="420px" w="100%"
        boxShadow="0 24px 64px rgba(0,0,0,0.3)"
        sx={{ animation:`${scaleIn} 0.25s ease both` }}
        onClick={e => e.stopPropagation()}>
        <Flex direction="column" align="center" mb="20px">
          <Box w="56px" h="56px" borderRadius="16px" bg={cfg.iconBg}
            display="flex" alignItems="center" justifyContent="center" mb="14px">
            <Icon as={cfg.icon} boxSize="24px" color={cfg.iconColor} />
          </Box>
          <Text fontSize="17px" fontWeight="800" color={titleColor} mb="6px">{cfg.title}</Text>
          <Text fontSize="13px" color={descColor} textAlign="center" lineHeight="1.6">{cfg.desc}</Text>
        </Flex>
        <Box p="12px 14px" borderRadius="10px" bg={previewBg} border={`1px solid ${previewBorder}`} mb="20px">
          <Text fontSize="12px" fontWeight="700" color={titleColor} mb="3px">{review?.user}</Text>
          <Text fontSize="11px" color={descColor} mb="5px">{movie?.title}</Text>
          <StarRating value={review?.rating} size="11px" />
          <Text fontSize="12px" color={descColor} mt="5px" noOfLines={2}>{review?.comment}</Text>
        </Box>
        <Flex gap="10px">
          <Button flex="1" h="42px" borderRadius="10px" variant="ghost"
            color={descColor} fontWeight="600" fontSize="13px"
            border={`1.5px solid ${isDark ? "#334155" : "#e2e8f0"}`}
            _hover={{ bg: isDark ? "#0f172a" : "#f8fafc" }}
            onClick={onCancel}>Hủy</Button>
          <Button flex="2" h="42px" borderRadius="10px"
            bg={cfg.btnColor} color="white" fontWeight="700" fontSize="13px"
            boxShadow="0 4px 14px rgba(0,0,0,0.15)"
            _hover={{ opacity:0.9, transform:"translateY(-1px)" }}
            _active={{ transform:"translateY(0)" }} transition="all 0.2s"
            onClick={onConfirm}>{cfg.btnText}</Button>
        </Flex>
      </Box>
    </Box>
  );
}

// ─── Realtime Toast ───────────────────────────────────────────────────────────
function RealtimeToast({ count, onView, onDismiss }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  if (count === 0) return null;
  return (
    <Box position="fixed" bottom="24px" right="24px" zIndex="900"
      bg={isDark ? "#1e293b" : "white"}
      border="1.5px solid #f97316"
      borderRadius="14px" p="14px 18px"
      boxShadow="0 8px 32px rgba(249,115,22,0.2)"
      sx={{ animation: `${scaleIn} 0.3s ease both` }}
    >
      <Flex align="center" gap="12px">
        <Box w="36px" h="36px" borderRadius="10px"
          bg="linear-gradient(135deg,#f97316,#fbbf24)"
          display="flex" alignItems="center" justifyContent="center" flexShrink="0">
          <Icon as={MdNotifications} boxSize="16px" color="white" />
        </Box>
        <Box>
          <Text fontSize="13px" fontWeight="700" color={isDark ? "#f1f5f9" : "#0f172a"}>
            {count} đánh giá mới chờ duyệt
          </Text>
          <Text fontSize="11px" color="#94a3b8">Vừa cập nhật từ hệ thống</Text>
        </Box>
        <Flex gap="6px" ml="4px">
          <Button size="xs" h="28px" px="10px" borderRadius="7px"
            bg="#fff7ed" color="#f97316" border="1px solid #fed7aa"
            fontSize="11px" fontWeight="700"
            _hover={{ bg:"#ffedd5" }} onClick={onView}>Xem</Button>
          <Button size="xs" h="28px" px="8px" borderRadius="7px"
            bg={isDark ? "#334155" : "#f1f5f9"} color="#94a3b8"
            fontSize="11px" fontWeight="700"
            _hover={{ bg: isDark ? "#475569" : "#e2e8f0" }}
            onClick={onDismiss}>
            <Icon as={MdClose} boxSize="12px" />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuanLyDanhGia() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Colors
  const pageBg      = useColorModeValue("transparent", "transparent");
  const cardBg      = useColorModeValue("white", "#1e293b");
  const cardBorder  = useColorModeValue("#f1f5f9", "#334155");
  const titleColor  = useColorModeValue("#0f172a", "#f1f5f9");
  const subColor    = useColorModeValue("#94a3b8", "#64748b");
  const inputBg     = useColorModeValue("#fafafa", "#0f172a");
  const inputBorder = useColorModeValue("#e8edf3", "#334155");
  const sectionAccent = useColorModeValue("#94a3b8", "#475569");
  const filterStripBg = useColorModeValue("#fafbfc", "#0f172a");
  const filterStripBorder = useColorModeValue("#f8fafc", "#1e293b");
  const barBg = useColorModeValue("#f1f5f9", "#334155");

  const [reviews, setReviews]         = useState(INITIAL_REVIEWS);
  const [newReviewIds, setNewReviewIds] = useState(new Set());
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterMovie, setFilterMovie]  = useState("Tất cả");
  const [filterRating, setFilterRating]= useState("Tất cả");
  const [sortBy, setSortBy]           = useState("date_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [realtimeToast, setRealtimeToast] = useState(0);
  const [lastPolled, setLastPolled]    = useState(null);
  const pollingRef = useRef(null);
  const simulatedRef = useRef(false);

  // ── Polling (60s) per spec section 3.2 ──
  const pollNewReviews = useCallback(() => {
    // Simulate: after 15s from mount, inject 2 new reviews once
    if (!simulatedRef.current) {
      simulatedRef.current = true;
      setTimeout(() => {
        setReviews(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const toAdd = SIMULATED_NEW_REVIEWS.filter(r => !existingIds.has(r.id));
          if (toAdd.length === 0) return prev;
          setNewReviewIds(ids => new Set([...ids, ...toAdd.map(r => r.id)]));
          setRealtimeToast(toAdd.length);
          return [...toAdd, ...prev];
        });
        setLastPolled(new Date().toLocaleTimeString("vi-VN"));
      }, 15000);
    }
    setLastPolled(new Date().toLocaleTimeString("vi-VN"));
  }, []);

  useEffect(() => {
    pollNewReviews();
    pollingRef.current = setInterval(pollNewReviews, 60000);
    return () => clearInterval(pollingRef.current);
  }, [pollNewReviews]);

  // ── Filtered + sorted ──
  const filtered = useMemo(() => {
    let arr = [...reviews];
    if (search) arr = arr.filter(r =>
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== "Tất cả") arr = arr.filter(r => r.status === filterStatus);
    if (filterMovie  !== "Tất cả") arr = arr.filter(r => r.movieId === parseInt(filterMovie));
    if (filterRating !== "Tất cả") arr = arr.filter(r => r.rating === parseInt(filterRating));
    if (sortBy === "date_desc")   arr.sort((a,b) => b.date.localeCompare(a.date));
    if (sortBy === "date_asc")    arr.sort((a,b) => a.date.localeCompare(b.date));
    if (sortBy === "rating_desc") arr.sort((a,b) => b.rating - a.rating);
    if (sortBy === "rating_asc")  arr.sort((a,b) => a.rating - b.rating);
    if (sortBy === "report_desc") arr.sort((a,b) => b.report - a.report);
    return arr;
  }, [reviews, search, filterStatus, filterMovie, filterRating, sortBy]);

  const counts = useMemo(() => ({
    total:    reviews.length,
    pending:  reviews.filter(r => r.status === "Chờ duyệt").length,
    approved: reviews.filter(r => r.status === "Đã duyệt").length,
    rejected: reviews.filter(r => r.status === "Từ chối").length,
    reported: reviews.filter(r => r.report >= 3).length,
  }), [reviews]);

  const movieStats = useMemo(() => MOVIES_LIST.map(m => ({
    ...m,
    reviewCount: reviews.filter(r => r.movieId === m.id && r.status === "Đã duyệt").length,
  })), [reviews]);

  // ── Actions ──
  const doApprove = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? {...r, status:"Đã duyệt"} : r));
    setNewReviewIds(ids => { const s = new Set(ids); s.delete(id); return s; });
  };
  const doReject = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? {...r, status:"Từ chối"} : r));
    setNewReviewIds(ids => { const s = new Set(ids); s.delete(id); return s; });
  };
  const doDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    setNewReviewIds(ids => { const s = new Set(ids); s.delete(id); return s; });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { action, reviewId } = confirmAction;
    if (action === "approve") doApprove(reviewId);
    if (action === "reject")  doReject(reviewId);
    if (action === "delete")  doDelete(reviewId);
    setConfirmAction(null);
  };

  const confirmReview = confirmAction ? reviews.find(r => r.id === confirmAction.reviewId) : null;
  const confirmMovie  = confirmReview ? MOVIES_LIST.find(m => m.id === confirmReview.movieId) : null;

  // ── Export CSV ──
  const handleExportCSV = () => {
    const headers = ["ID","Tên người dùng","Phim","Điểm","Nhận xét","Ngày","Trạng thái","Báo cáo"];
    const rows = filtered.map(r => {
      const m = MOVIES_LIST.find(mv => mv.id === r.movieId);
      return [r.id, r.user, m?.title || "", r.rating, `"${r.comment.replace(/"/g,'""')}"`, r.date, r.status, r.report];
    });
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `danh-gia-phim-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const inputSx = {
    bg: inputBg, border: `1.5px solid ${inputBorder}`, borderRadius:"10px",
    color: titleColor, fontSize:"13px", fontWeight:"500", px:"12px", h:"36px",
    _placeholder: { color: "#b0bac8" },
    _focus: { border:"1.5px solid #f97316", boxShadow:"0 0 0 3px rgba(249,115,22,0.10)", bg: isDark ? "#1e293b" : "#fff" },
    _hover: { border:"1.5px solid #f97316" },
    transition:"all 0.2s",
  };

  const resetFilters = () => {
    setSearch(""); setFilterStatus("Tất cả"); setFilterMovie("Tất cả");
    setFilterRating("Tất cả"); setSortBy("date_desc");
  };

  return (
    <Box pt={{ base:"100px", md:"80px" }} minH="100vh">

      {/* ── Page Header ── */}
      <Flex justify="space-between" align={{ base:"start", md:"center" }}
        direction={{ base:"column", md:"row" }} mb="20px" gap="12px">
        <Box sx={{ animation:`${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg,#f97316,#fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 4px 14px rgba(249,115,22,0.35)">
              <Icon as={MdRateReview} boxSize="18px" color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base:"22px", md:"26px" }} fontWeight="800" color={titleColor} letterSpacing="-0.5px">
                Quản lý đánh giá phim
              </Text>
              <Flex align="center" gap="8px">
                <Text fontSize="12.5px" color={subColor}>
                  Duyệt, từ chối và xử lý đánh giá của khách hàng
                </Text>
                {lastPolled && (
                  <Flex align="center" gap="4px" px="7px" py="2px" borderRadius="5px"
                    bg={isDark ? "#0f172a" : "#f0fdf4"} border={`1px solid ${isDark ? "#334155" : "#bbf7d0"}`}>
                    <Box w="5px" h="5px" borderRadius="full" bg="#10b981"
                      sx={{ animation:`${pulse} 2s ease infinite` }} />
                    <Text fontSize="10px" fontWeight="600" color="#10b981">Realtime · {lastPolled}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Flex gap="10px" align="center" sx={{ animation:`${fadeIn} 0.4s ease 0.1s both` }}>
          {/* Dark mode toggle */}
          <DarkModeToggle />

          {counts.reported > 0 && (
            <Box position="relative">
              <Button h="38px" px="14px" borderRadius="10px" fontWeight="600" fontSize="12.5px"
                bg={isDark ? "#450a0a" : "#fef2f2"} color="#dc2626"
                border={isDark ? "1px solid #991b1b" : "1px solid #fca5a5"}
                _hover={{ bg: isDark ? "#600f0f" : "#fee2e2" }} transition="all 0.2s"
                leftIcon={<Icon as={MdWarning} boxSize="13px" />}
                onClick={() => { setFilterStatus("Tất cả"); setSortBy("report_desc"); }}>Vi phạm</Button>
              <Box position="absolute" top="-6px" right="-6px" w="18px" h="18px"
                borderRadius="full" bg="#ef4444"
                display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="10px" fontWeight="800" color="white">{counts.reported}</Text>
              </Box>
            </Box>
          )}

          {counts.pending > 0 && (
            <Box position="relative">
              <Button h="38px" px="14px" borderRadius="10px" fontWeight="600" fontSize="12.5px"
                bg={isDark ? "#422006" : "#fffbeb"} color="#b45309"
                border={isDark ? "1px solid #92400e" : "1px solid #fcd34d"}
                _hover={{ bg: isDark ? "#6b2d0a" : "#fef3c7" }} transition="all 0.2s"
                leftIcon={<Icon as={MdPending} boxSize="13px" />}
                onClick={() => setFilterStatus("Chờ duyệt")}>Chờ duyệt</Button>
              <Box position="absolute" top="-6px" right="-6px" w="18px" h="18px"
                borderRadius="full" bg="#f97316"
                display="flex" alignItems="center" justifyContent="center"
                sx={{ animation: `${badgePop} 0.6s ease` }}>
                <Text fontSize="10px" fontWeight="800" color="white">{counts.pending}</Text>
              </Box>
            </Box>
          )}

          {/* Export CSV */}
          <Button h="38px" px="14px" borderRadius="10px" fontWeight="600" fontSize="12.5px"
            bg="linear-gradient(135deg,#f97316,#fb923c)" color="white"
            boxShadow="0 4px 12px rgba(249,115,22,0.3)"
            _hover={{ opacity:0.9, transform:"translateY(-1px)" }} transition="all 0.2s"
            leftIcon={<Icon as={MdDownload} boxSize="13px" />}
            onClick={handleExportCSV}>Export CSV</Button>

          <Button h="38px" px="14px" borderRadius="10px" fontWeight="600" fontSize="12.5px"
            bg={isDark ? "#1e293b" : "#f8fafc"} color={isDark ? "#94a3b8" : "#475569"}
            border={isDark ? "1px solid #334155" : "1px solid #e2e8f0"}
            _hover={{ bg: isDark ? "#334155" : "#f1f5f9" }} transition="all 0.2s"
            leftIcon={<Icon as={MdRefresh} boxSize="13px" />}
            onClick={resetFilters}>Reset</Button>
        </Flex>
      </Flex>

      {/* ── Stats Row ── */}
      <SimpleGrid columns={{ base:2, md:4 }} spacing="12px" mb="20px">
        <StatCard label="Tổng đánh giá" value={counts.total}    icon={MdRateReview} accent="#f97316" delay={0}    />
        <StatCard label="Chờ duyệt"     value={counts.pending}  icon={MdPending}    accent="#f59e0b" delay={0.05} sub={counts.pending > 0 ? "Cần xử lý" : "Đã xử lý hết"} highlight={counts.pending > 0} />
        <StatCard label="Đã duyệt"      value={counts.approved} icon={MdCheckCircle} accent="#10b981" delay={0.10} />
        <StatCard label="Báo cáo vi phạm" value={counts.reported} icon={MdWarning} accent="#ef4444" delay={0.15} sub={counts.reported > 0 ? "Cần xem xét" : "Không có"} highlight={counts.reported > 0} />
      </SimpleGrid>

      {/* ── Main Layout ── */}
      <Flex gap="16px" align="flex-start" direction={{ base:"column", xl:"row" }}>

        {/* ── LEFT: Review list ── */}
        <Box flex="1" minW="0">
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)"
            sx={{ animation:`${fadeUp} 0.4s ease 0.1s both` }}>

            {/* Card header */}
            <Box p="16px 18px 14px" borderBottom={`1px solid ${filterStripBorder}`}>
              <Flex align="center" justify="space-between" mb="12px">
                <Flex align="center" gap="8px">
                  <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
                  <Text fontWeight="800" fontSize="14.5px" color={titleColor}>Danh sách đánh giá</Text>
                  <Box px="8px" py="2px" borderRadius="6px"
                    bg={isDark ? "#1e293b" : "#fff7ed"}
                    border={isDark ? "1px solid #f97316" : "1px solid #fed7aa"}>
                    <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} kết quả</Text>
                  </Box>
                </Flex>
                <Button display={{ base:"flex", md:"none" }}
                  size="sm" h="32px" px="10px" borderRadius="8px"
                  bg={isDark?"#1e293b":"#f8fafc"} color={isDark?"#94a3b8":"#64748b"}
                  border={isDark?"1px solid #334155":"1px solid #e2e8f0"}
                  fontSize="11.5px" fontWeight="600"
                  leftIcon={<Icon as={MdFilterList} boxSize="12px" />}
                  onClick={() => setShowFilters(v => !v)}>Lọc</Button>
              </Flex>

              <Box display={{ base: showFilters?"block":"none", md:"block" }}>
                <Flex gap="8px" wrap="wrap">
                  <Box position="relative" flex="1" minW="180px">
                    <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                      transform="translateY(-50%)" boxSize="13px" color="#94a3b8" zIndex="1" />
                    <Input {...inputSx} pl="30px" placeholder="Tìm tên, nội dung..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </Box>
                  <Select {...inputSx} w={{ base:"100%", sm:"130px" }}
                    value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="Tất cả">Trạng thái</option>
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Từ chối">Từ chối</option>
                  </Select>
                  <Select {...inputSx} w={{ base:"100%", sm:"150px" }}
                    value={filterMovie} onChange={e => setFilterMovie(e.target.value)}>
                    <option value="Tất cả">Tất cả phim</option>
                    {MOVIES_LIST.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </Select>
                  <Select {...inputSx} w={{ base:"100%", sm:"120px" }}
                    value={filterRating} onChange={e => setFilterRating(e.target.value)}>
                    <option value="Tất cả">Điểm số</option>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
                  </Select>
                  <Select {...inputSx} w={{ base:"100%", sm:"160px" }}
                    value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="date_desc">Mới nhất</option>
                    <option value="date_asc">Cũ nhất</option>
                    <option value="rating_desc">Điểm cao nhất</option>
                    <option value="rating_asc">Điểm thấp nhất</option>
                    <option value="report_desc">Báo cáo nhiều nhất</option>
                  </Select>
                </Flex>
              </Box>
            </Box>

            {/* Active filter chips */}
            {(filterStatus !== "Tất cả" || filterMovie !== "Tất cả" || filterRating !== "Tất cả") && (
              <Flex px="18px" py="8px" gap="6px" wrap="wrap"
                borderBottom={`1px solid ${filterStripBorder}`} bg={filterStripBg}>
                <Text fontSize="11px" fontWeight="700" color={sectionAccent} alignSelf="center">Đang lọc:</Text>
                {filterStatus !== "Tất cả" && (
                  <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
                    bg={isDark?"#1e293b":"#fff7ed"} border={isDark?"1px solid #f97316":"1px solid #fed7aa"}>
                    <Text fontSize="11px" fontWeight="600" color="#f97316">{filterStatus}</Text>
                    <Icon as={MdClose} boxSize="11px" color="#f97316" cursor="pointer" onClick={() => setFilterStatus("Tất cả")} />
                  </Flex>
                )}
                {filterMovie !== "Tất cả" && (
                  <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
                    bg={isDark?"#1e293b":"#fff7ed"} border={isDark?"1px solid #f97316":"1px solid #fed7aa"}>
                    <Text fontSize="11px" fontWeight="600" color="#f97316" noOfLines={1} maxW="120px">
                      {MOVIES_LIST.find(m => m.id === parseInt(filterMovie))?.title}
                    </Text>
                    <Icon as={MdClose} boxSize="11px" color="#f97316" cursor="pointer" onClick={() => setFilterMovie("Tất cả")} />
                  </Flex>
                )}
                {filterRating !== "Tất cả" && (
                  <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
                    bg={isDark?"#1e293b":"#fff7ed"} border={isDark?"1px solid #f97316":"1px solid #fed7aa"}>
                    <Text fontSize="11px" fontWeight="600" color="#f97316">{filterRating} sao</Text>
                    <Icon as={MdClose} boxSize="11px" color="#f97316" cursor="pointer" onClick={() => setFilterRating("Tất cả")} />
                  </Flex>
                )}
              </Flex>
            )}

            {/* Reviews list */}
            <Box p="12px">
              {filtered.length === 0 ? (
                <Flex direction="column" align="center" justify="center" py="48px" color={sectionAccent}>
                  <Icon as={MdRateReview} boxSize="32px" mb="8px" />
                  <Text fontSize="13px" fontWeight="600" color={subColor}>Không tìm thấy đánh giá nào</Text>
                  <Text fontSize="12px" color={sectionAccent} mt="4px">Thử thay đổi bộ lọc</Text>
                </Flex>
              ) : (
                <Flex direction="column" gap="10px">
                  {filtered.map((r, i) => (
                    <ReviewCard
                      key={r.id} review={r} index={i}
                      isNew={newReviewIds.has(r.id)}
                      movie={MOVIES_LIST.find(m => m.id === r.movieId)}
                      onApprove={id => setConfirmAction({ action:"approve", reviewId:id })}
                      onReject={id  => setConfirmAction({ action:"reject",  reviewId:id })}
                      onDelete={id  => setConfirmAction({ action:"delete",  reviewId:id })}
                    />
                  ))}
                </Flex>
              )}
            </Box>
          </Box>
        </Box>

        {/* ── RIGHT Sidebar ── */}
        <Box w={{ base:"100%", xl:"320px" }} flexShrink="0">
          {/* Average rating by movie */}
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)" mb="14px"
            sx={{ animation:`${slideIn} 0.5s ease 0.2s both` }}>
            <Box p="16px 18px 12px" borderBottom={`1px solid ${filterStripBorder}`}>
              <Flex align="center" gap="8px">
                <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
                <Text fontWeight="800" fontSize="13.5px" color={titleColor}>Điểm trung bình theo phim</Text>
              </Flex>
            </Box>
            <Box p="12px">
              <Flex direction="column" gap="10px">
                {movieStats.map((m, i) => (
                  <MovieScoreCard key={m.id} movie={m} reviewCount={m.reviewCount} delay={i * 0.06} />
                ))}
              </Flex>
            </Box>
          </Box>

          {/* Status distribution */}
          <Box bg={cardBg} borderRadius="16px" border={`1px solid ${cardBorder}`}
            boxShadow="0 1px 4px rgba(0,0,0,0.04)"
            sx={{ animation:`${slideIn} 0.5s ease 0.3s both` }}>
            <Box p="16px 18px 12px" borderBottom={`1px solid ${filterStripBorder}`}>
              <Flex align="center" gap="8px">
                <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg,#f97316,#fbbf24)" />
                <Text fontWeight="800" fontSize="13.5px" color={titleColor}>Phân bố trạng thái</Text>
              </Flex>
            </Box>
            <Box p="14px 16px">
              {[
                { label:"Chờ duyệt", value:counts.pending,  color:"#f59e0b" },
                { label:"Đã duyệt",  value:counts.approved, color:"#10b981" },
                { label:"Từ chối",   value:counts.rejected, color:"#6b7280" },
              ].map(({ label, value, color }) => {
                const pct = counts.total > 0 ? Math.round((value / counts.total) * 100) : 0;
                return (
                  <Box key={label} mb="12px" _last={{ mb:0 }}>
                    <Flex justify="space-between" mb="5px">
                      <Text fontSize="12px" fontWeight="600" color={useColorModeValue("#374151","#94a3b8")}>{label}</Text>
                      <Flex align="center" gap="6px">
                        <Text fontSize="12px" fontWeight="700" color={color}>{value}</Text>
                        <Text fontSize="10px" color={subColor}>({pct}%)</Text>
                      </Flex>
                    </Flex>
                    <Box h="6px" borderRadius="full" bg={barBg} overflow="hidden">
                      <Box h="100%" borderRadius="full" w={`${pct}%`} bg={color} transition="width 0.8s ease" />
                    </Box>
                  </Box>
                );
              })}

              {/* Rating breakdown */}
              <Box mt="16px" pt="14px" borderTop={`1px solid ${filterStripBorder}`}>
                <Text fontSize="11px" fontWeight="800" color={sectionAccent} letterSpacing="0.8px"
                  textTransform="uppercase" mb="10px">Phân bố điểm số</Text>
                {[5,4,3,2,1].map(star => {
                  const cnt = reviews.filter(r => r.rating === star).length;
                  const pct = reviews.length > 0 ? Math.round((cnt / reviews.length) * 100) : 0;
                  return (
                    <Flex key={star} align="center" gap="8px" mb="6px">
                      <Flex align="center" gap="2px" w="30px" flexShrink="0">
                        <Text fontSize="11px" fontWeight="700" color={useColorModeValue("#374151","#94a3b8")}>{star}</Text>
                        <Icon as={MdStar} boxSize="10px" color="#f59e0b" />
                      </Flex>
                      <Box flex="1" h="5px" borderRadius="full" bg={barBg} overflow="hidden">
                        <Box h="100%" borderRadius="full"
                          bg="linear-gradient(90deg,#f97316,#fbbf24)"
                          w={`${pct}%`} transition="width 0.8s ease" />
                      </Box>
                      <Text fontSize="11px" color={subColor} w="28px" textAlign="right">{cnt}</Text>
                    </Flex>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* ── Confirm Modal ── */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction.action}
          review={confirmReview}
          movie={confirmMovie}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* ── Realtime toast notification ── */}
      <RealtimeToast
        count={realtimeToast}
        onView={() => { setFilterStatus("Chờ duyệt"); setSortBy("date_desc"); setRealtimeToast(0); }}
        onDismiss={() => setRealtimeToast(0)}
      />
    </Box>
  );
}