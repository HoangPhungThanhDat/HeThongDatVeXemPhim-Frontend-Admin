import React, { useState } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Icon, keyframes,
  Input, Select, Textarea, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent,
  useDisclosure, useBreakpointValue, useColorMode, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Switch, Progress, Radio, RadioGroup, Stack,
} from "@chakra-ui/react";
import {
  MdEdit, MdArrowBack, MdVisibility, MdSearch, MdCampaign,
  MdCheckCircle, MdSchedule, MdDrafts, MdDelete, MdAdd,
  MdClose, MdDarkMode, MdLightMode, MdFilterAlt, MdEmail,
  MdNotificationsActive, MdGroups, MdPerson, MdPublic,
  MdOutlineMarkEmailRead, MdSend, MdEvent, MdBarChart, MdWarning,
} from "react-icons/md";
import { FaBell, FaPaperPlane, FaRegClock, FaRegFileAlt } from "react-icons/fa";
import Card from "components/card/Card";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn  = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;
const ring = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(234,88,12,.35); }
  100% { box-shadow: 0 0 0 10px rgba(234,88,12,0); }
`;

// ─── Orange palette ───────────────────────────────────────────────────────────
const OR   = "#ea580c";
const ORL  = "#fb923c";
const ORPL = "#fff7ed";
const ORBD = "#fed7aa";
const ORSW = "rgba(234,88,12,0.25)";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Đã gửi":      { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", dot: "#10b981" },
  "Đã lên lịch": { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#fb923c" },
  "Nháp":        { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", dot: "#9ca3af" },
};

const CHANNEL_CFG = {
  "Push":      { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: MdNotificationsActive },
  "Email":     { color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd", icon: MdEmail },
  "Push & Email": { color: OR, bg: ORPL, border: ORBD, icon: FaBell },
};

const AUDIENCE_ICON = {
  "Tất cả người dùng": MdPublic,
  "Theo hạng hội viên": MdGroups,
  "Người dùng cụ thể": MdPerson,
};

// ─── Shared style helpers ─────────────────────────────────────────────────────
const labelStyle = {
  fontSize: "10.5px", fontWeight: "800", letterSpacing: "0.9px",
  textTransform: "uppercase", color: "#64748b", mb: "7px",
};

// ─── Column widths (desktop only) ─────────────────────────────────────────────
const COL = {
  idx:      "36px",
  title:    "1",
  channel:  "128px",
  audience: "168px",
  time:     "150px",
  status:   "128px",
  read:     "110px",
  actions:  "132px",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const INIT_NOTIS = [
  {
    id: 1, code: "TB001",
    title: "Ưu đãi cuối tuần: Giảm 30% vé xem phim",
    content: "Đặt vé cuối tuần này để nhận ngay ưu đãi giảm 30% cho tất cả suất chiếu 2D. Áp dụng đến hết Chủ Nhật.",
    channel: "Push & Email", audience: "Tất cả người dùng", audienceDetail: "128.450 người dùng",
    sentAt: "20/05/2026 09:00", status: "Đã gửi",
    readRate: 68, sentCount: 128450, readCount: 87346,
  },
  {
    id: 2, code: "TB002",
    title: "Chúc mừng hạng Kim Cương mới của bạn!",
    content: "Chúc mừng bạn đã đạt hạng Kim Cương. Nhận ngay voucher sinh nhật đặc biệt trị giá 100.000đ.",
    channel: "Push", audience: "Theo hạng hội viên", audienceDetail: "Hạng Kim cương — 2.340 người",
    sentAt: "19/05/2026 14:20", status: "Đã gửi",
    readRate: 91, sentCount: 2340, readCount: 2129,
  },
  {
    id: 3, code: "TB003",
    title: "Ra mắt phim bom tấn: Avatar 3 — Đặt vé sớm",
    content: "Avatar: Fire and Ash chính thức khởi chiếu 25/05. Đặt vé sớm để nhận ưu đãi combo bắp nước miễn phí.",
    channel: "Push & Email", audience: "Tất cả người dùng", audienceDetail: "128.450 người dùng",
    sentAt: "25/05/2026 08:00", status: "Đã lên lịch",
    readRate: 0, sentCount: 0, readCount: 0,
  },
  {
    id: 4, code: "TB004",
    title: "Nhắc lịch chiếu: Suất phim của bạn sắp bắt đầu",
    content: "Suất chiếu Doctor Strange 2 của bạn sẽ bắt đầu trong 1 giờ nữa tại Phòng 3.",
    channel: "Push", audience: "Người dùng cụ thể", audienceDetail: "nguyenvanan@gmail.com",
    sentAt: "21/05/2026 14:00", status: "Đã gửi",
    readRate: 100, sentCount: 1, readCount: 1,
  },
  {
    id: 5, code: "TB005",
    title: "Khảo sát trải nghiệm khách hàng tháng 5",
    content: "Chúng tôi rất mong nhận được phản hồi của bạn để cải thiện chất lượng dịch vụ. Tham gia khảo sát để nhận 20 điểm thưởng.",
    channel: "Email", audience: "Theo hạng hội viên", audienceDetail: "Hạng Vàng & Kim cương — 18.760 người",
    sentAt: "—", status: "Nháp",
    readRate: 0, sentCount: 0, readCount: 0,
  },
  {
    id: 6, code: "TB006",
    title: "Voucher SUMMER25 sắp hết hạn",
    content: "Mã giảm giá SUMMER25 của bạn sẽ hết hạn vào ngày mai. Sử dụng ngay để không bỏ lỡ ưu đãi 25%.",
    channel: "Push & Email", audience: "Theo hạng hội viên", audienceDetail: "Hạng Bạc — 34.120 người",
    sentAt: "18/05/2026 10:15", status: "Đã gửi",
    readRate: 54, sentCount: 34120, readCount: 18425,
  },
];

const TIERS = ["Đồng", "Bạc", "Vàng", "Kim cương"];

// ─── Shared small components ──────────────────────────────────────────────────
function SectionTitle({ label, isDark }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg={`linear-gradient(180deg,${OR},${ORL})`} />
        <Text fontSize="10.5px" fontWeight="800" color={isDark ? "#e2e8f0" : "#374151"} letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg={isDark ? "linear-gradient(90deg,#4a5568,transparent)" : "linear-gradient(90deg,#f1f5f9,transparent)"} />
    </Box>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Nháp"];
  return (
    <Flex align="center" gap="5px" px="10px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Box w="6px" h="6px" borderRadius="full" bg={cfg.dot}
        sx={status === "Đã lên lịch" ? { animation: `${ring} 1.6s ease-out infinite` } : {}} />
      <Text fontSize="11.5px" fontWeight="600" color={cfg.color} whiteSpace="nowrap">{status}</Text>
    </Flex>
  );
}

function ChannelBadge({ channel }) {
  const cfg = CHANNEL_CFG[channel] || CHANNEL_CFG["Push"];
  return (
    <Flex align="center" gap="5px" px="9px" py="5px" borderRadius="8px"
      bg={cfg.bg} border={`1px solid ${cfg.border}`} display="inline-flex" w="fit-content">
      <Icon as={cfg.icon} boxSize="11px" color={cfg.color} />
      <Text fontSize="11px" fontWeight="700" color={cfg.color} whiteSpace="nowrap">{channel}</Text>
    </Flex>
  );
}

function ReadRateBar({ rate, status, isDark }) {
  if (status !== "Đã gửi") {
    return <Text fontSize="12px" fontWeight="600" color={isDark ? "#4a5568" : "#cbd5e1"}>—</Text>;
  }
  const color = rate >= 70 ? "#10b981" : rate >= 40 ? OR : "#ef4444";
  return (
    <Box w="100%">
      <Flex justify="space-between" mb="3px">
        <Text fontSize="11.5px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>{rate}%</Text>
      </Flex>
      <Box h="5px" w="100%" borderRadius="full" bg={isDark ? "#4a5568" : "#e5e7eb"} overflow="hidden">
        <Box h="100%" w={`${rate}%`} borderRadius="full"
          bg={rate >= 70 ? "linear-gradient(90deg,#10b981,#34d399)" : rate >= 40 ? `linear-gradient(90deg,${OR},${ORL})` : "linear-gradient(90deg,#ef4444,#f87171)"}
          transition="width .5s ease" />
      </Box>
    </Box>
  );
}

function StatCard({ label, value, icon, accent, sub, delay=0, isDark }) {
  return (
    <Box p={{ base:"14px 16px", md:"18px 20px" }} borderRadius="14px"
      bg={isDark ? "#2d3748" : "white"}
      border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
      boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.05)"}
      sx={{ animation: `${fadeUp} .4s ease ${delay}s both` }}
      transition="all .2s"
      _hover={{ boxShadow: isDark ? "0 4px 16px rgba(0,0,0,.4)" : "0 4px 16px rgba(0,0,0,.08)", transform:"translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base:"9px", md:"11px" }} fontWeight="700" color={isDark ? "#718096" : "#94a3b8"}
            letterSpacing=".8px" textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize={{ base:"22px", md:"28px" }} fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"} mt="3px">{sub}</Text>}
        </Box>
        <Box w={{ base:"36px", md:"42px" }} h={{ base:"36px", md:"42px" }}
          borderRadius="12px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center">
          <Icon as={icon} boxSize={{ base:"15px", md:"18px" }} color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Column header helper ─────────────────────────────────────────────────────
function CH({ children, w, flex, pr, textAlign, isDark }) {
  return (
    <Box w={w} flex={flex} flexShrink={w?"0":undefined} pr={pr||"0"} textAlign={textAlign}>
      <Text fontSize="10px" fontWeight="800" color={isDark ? "#718096" : "#94a3b8"} letterSpacing="1px" textTransform="uppercase">
        {children}
      </Text>
    </Box>
  );
}

// ─── Input style factory (theme-aware) ────────────────────────────────────────
function useFieldStyles(isDark) {
  return {
    bg: isDark ? "#2d3748" : "#fafafa",
    border: isDark ? "1.5px solid #4a5568" : "1.5px solid #e8edf3",
    borderRadius: "10px",
    color: isDark ? "#e2e8f0" : "#1a202c",
    fontSize: "14px",
    fontWeight: "500",
    px: "14px",
    h: "44px",
    _placeholder: { color: isDark ? "#718096" : "#b0bac8", fontWeight: "400" },
    _focus: { border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)`, bg: isDark ? "#2d3748" : "#fff" },
    _hover: { border: `1.5px solid ${OR}`, bg: isDark ? "#2d3748" : "#fff" },
    transition: "all .2s",
  };
}

// ─── Compose Notification Modal ───────────────────────────────────────────────
function ComposeModal({ isOpen, onClose, onCreate, isDark }) {
  const styles = useFieldStyles(isDark);
  const [form, setForm] = useState({
    title: "", content: "", channels: { push: true, email: false },
    audienceType: "Tất cả người dùng", tier: "Vàng", specificUser: "",
    scheduleType: "now", scheduleAt: "",
  });

  const reset = () => setForm({
    title: "", content: "", channels: { push: true, email: false },
    audienceType: "Tất cả người dùng", tier: "Vàng", specificUser: "",
    scheduleType: "now", scheduleAt: "",
  });

  const handleSubmit = (asDraft) => {
    if (!form.title || !form.content) return;
    const channel = form.channels.push && form.channels.email ? "Push & Email"
      : form.channels.push ? "Push" : "Email";
    const audienceDetail =
      form.audienceType === "Tất cả người dùng" ? "128.450 người dùng" :
      form.audienceType === "Theo hạng hội viên" ? `Hạng ${form.tier}` :
      form.specificUser || "Chưa xác định";
    const status = asDraft ? "Nháp" : (form.scheduleType === "schedule" ? "Đã lên lịch" : "Đã gửi");
    const newNoti = {
      id: Date.now(),
      code: `TB${String(Date.now()).slice(-4)}`,
      title: form.title, content: form.content,
      channel, audience: form.audienceType, audienceDetail,
      sentAt: asDraft ? "—" : (form.scheduleType === "schedule" ? form.scheduleAt || "Chưa đặt giờ" : "Vừa gửi"),
      status, readRate: 0, sentCount: 0, readCount: 0,
    };
    onCreate(newNoti);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); }} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent
        borderRadius="20px"
        border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
        bg={isDark ? "#1a202c" : "#ffffff"}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .3s cubic-bezier(.22,1,.36,1) both` }}
      >
        <Box h="4px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
          bgSize="200% 100%" sx={{ animation: `${shimmer} 3s linear infinite` }}
          borderRadius="20px 20px 0 0" />

        <ModalHeader>
          <Flex align="center" gap="10px">
            <Box w="36px" h="36px" borderRadius="10px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 12px ${ORSW}`}>
              <Icon as={FaPaperPlane} boxSize="14px" color="white" />
            </Box>
            <Box>
              <Text fontSize="17px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>Soạn thông báo mới</Text>
              <Text fontSize="12px" color={isDark ? "#718096" : "#94a3b8"}>Gửi push notification hoặc email đến người dùng</Text>
            </Box>
          </Flex>
          <ModalCloseButton color={isDark ? "#718096" : "#94a3b8"} />
        </ModalHeader>

        <ModalBody py="16px">
          <Box mb="14px">
            <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Tiêu đề thông báo *</Text>
            <Input {...styles} placeholder="VD: Ưu đãi cuối tuần: Giảm 30% vé xem phim"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </Box>

          <Box mb="16px">
            <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Nội dung *</Text>
            <Textarea
              bg={isDark ? "#2d3748" : "#fafafa"}
              border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e8edf3"}
              borderRadius="10px" color={isDark ? "#e2e8f0" : "#1a202c"}
              fontSize="14px" fontWeight="500" px="14px" py="10px"
              _placeholder={{ color: isDark ? "#718096" : "#b0bac8" }}
              _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.1)`, bg: isDark ? "#2d3748" : "#fff" }}
              _hover={{ border: `1.5px solid ${OR}` }}
              transition="all .2s" rows={4}
              placeholder="Nhập nội dung thông báo gửi đến người dùng..."
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
            />
          </Box>

          <Box mb="16px">
            <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Kênh gửi *</Text>
            <SimpleGrid columns={2} gap="10px">
              {[
                { key: "push", label: "Push Notification", icon: MdNotificationsActive, color: "#7c3aed" },
                { key: "email", label: "Email", icon: MdEmail, color: "#0284c7" },
              ].map(({ key, label, icon, color }) => {
                const active = form.channels[key];
                return (
                  <Flex key={key} align="center" justify="space-between" px="14px" h="52px" borderRadius="10px"
                    bg={active ? `${color}12` : (isDark ? "#2d3748" : "#fafafa")}
                    border={`1.5px solid ${active ? color : (isDark ? "#4a5568" : "#e8edf3")}`}
                    cursor="pointer" transition="all .18s"
                    onClick={() => setForm({ ...form, channels: { ...form.channels, [key]: !active } })}>
                    <Flex align="center" gap="8px">
                      <Icon as={icon} boxSize="15px" color={active ? color : (isDark ? "#718096" : "#94a3b8")} />
                      <Text fontSize="13px" fontWeight="700" color={active ? color : (isDark ? "#a0aec0" : "#64748b")}>{label}</Text>
                    </Flex>
                    <Switch isChecked={active} colorScheme="orange" pointerEvents="none" />
                  </Flex>
                );
              })}
            </SimpleGrid>
          </Box>

          <Box mb="16px">
            <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Đối tượng nhận *</Text>
            <RadioGroup value={form.audienceType} onChange={v => setForm({ ...form, audienceType: v })}>
              <Stack spacing="8px">
                {Object.keys(AUDIENCE_ICON).map(opt => {
                  const active = form.audienceType === opt;
                  const Ic = AUDIENCE_ICON[opt];
                  return (
                    <Flex key={opt} align="center" gap="10px" px="14px" h="46px" borderRadius="10px"
                      bg={active ? ORPL : (isDark ? "#2d3748" : "#fafafa")}
                      border={`1.5px solid ${active ? ORBD : (isDark ? "#4a5568" : "#e8edf3")}`}
                      cursor="pointer" transition="all .18s"
                      onClick={() => setForm({ ...form, audienceType: opt })}>
                      <Radio value={opt} colorScheme="orange" />
                      <Icon as={Ic} boxSize="14px" color={active ? OR : (isDark ? "#718096" : "#94a3b8")} />
                      <Text fontSize="13px" fontWeight="600" color={active ? OR : (isDark ? "#e2e8f0" : "#374151")}>{opt}</Text>
                    </Flex>
                  );
                })}
              </Stack>
            </RadioGroup>

            {form.audienceType === "Theo hạng hội viên" && (
              <Box mt="10px" pl={{ base:"0", md:"4px" }} sx={{ animation: `${fadeUp} .25s ease both` }}>
                <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Chọn hạng hội viên</Text>
                <Select {...styles} value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                  {TIERS.map(t => <option key={t} value={t}>Hạng {t}</option>)}
                </Select>
              </Box>
            )}
            {form.audienceType === "Người dùng cụ thể" && (
              <Box mt="10px" sx={{ animation: `${fadeUp} .25s ease both` }}>
                <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Email hoặc số điện thoại khách hàng</Text>
                <Input {...styles} placeholder="VD: nguyenvanan@gmail.com" value={form.specificUser}
                  onChange={e => setForm({ ...form, specificUser: e.target.value })} />
              </Box>
            )}
          </Box>

          <Box>
            <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"}>Thời gian gửi *</Text>
            <SimpleGrid columns={2} gap="10px" mb="10px">
              {[
                { key: "now", label: "Gửi ngay", icon: MdSend },
                { key: "schedule", label: "Đặt lịch gửi", icon: MdEvent },
              ].map(({ key, label, icon }) => {
                const active = form.scheduleType === key;
                return (
                  <Flex key={key} align="center" justify="center" gap="8px" h="46px" borderRadius="10px"
                    bg={active ? `linear-gradient(135deg,${OR},${ORL})` : (isDark ? "#2d3748" : "#fafafa")}
                    border={`1.5px solid ${active ? OR : (isDark ? "#4a5568" : "#e8edf3")}`}
                    color={active ? "white" : (isDark ? "#a0aec0" : "#64748b")}
                    boxShadow={active ? `0 3px 10px ${ORSW}` : "none"}
                    cursor="pointer" fontWeight="700" fontSize="13px" transition="all .18s"
                    onClick={() => setForm({ ...form, scheduleType: key })}>
                    <Icon as={icon} boxSize="14px" />
                    {label}
                  </Flex>
                );
              })}
            </SimpleGrid>
            {form.scheduleType === "schedule" && (
              <Box sx={{ animation: `${fadeUp} .25s ease both` }}>
                <Input {...styles} type="datetime-local" value={form.scheduleAt}
                  onChange={e => setForm({ ...form, scheduleAt: e.target.value })} />
              </Box>
            )}
          </Box>
        </ModalBody>

        <ModalFooter gap="10px" borderTop={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
          <Button h="42px" px="18px" variant="ghost"
            color={isDark ? "#a0aec0" : "#64748b"}
            borderRadius="10px" fontWeight="600" fontSize="13px"
            border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }}
            transition="all .2s" leftIcon={<Icon as={FaRegFileAlt} boxSize="12px" />}
            onClick={() => handleSubmit(true)}>
            Lưu nháp
          </Button>
          <Button h="42px" px="24px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
            boxShadow={`0 4px 16px ${ORSW}`}
            _hover={{ boxShadow: `0 8px 24px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all .2s"
            leftIcon={<Icon as={form.scheduleType === "schedule" ? MdEvent : MdSend} />}
            onClick={() => handleSubmit(false)}>
            {form.scheduleType === "schedule" ? "Đặt lịch gửi" : "Gửi ngay"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ noti, onClose, onConfirm, isDark }) {
  return (
    <Modal isOpen={!!noti} onClose={onClose} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(15,23,42,.65)" />
      <ModalContent borderRadius="18px"
        bg={isDark ? "#1a202c" : "white"}
        border={isDark ? "1px solid #4a5568" : "none"}
        boxShadow="0 32px 80px rgba(0,0,0,.25)"
        sx={{ animation: `${scaleIn} .25s cubic-bezier(.22,1,.36,1) both` }}>
        <ModalBody pt="28px" pb="8px" textAlign="center">
          <Box w="52px" h="52px" borderRadius="14px" bg="#fef2f2" mx="auto" mb="14px"
            display="flex" alignItems="center" justifyContent="center">
            <Icon as={MdWarning} boxSize="24px" color="#dc2626" />
          </Box>
          <Text fontSize="15px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} mb="6px">Xóa thông báo?</Text>
          <Text fontSize="13px" color={isDark ? "#a0aec0" : "#64748b"} mb="4px">
            Bạn sắp xóa thông báo <b>{noti?.code}</b> — "{noti?.title}".
          </Text>
          <Text fontSize="12.5px" color={isDark ? "#718096" : "#94a3b8"}>Hành động này không thể hoàn tác.</Text>
        </ModalBody>
        <ModalFooter gap="10px" pb="20px" pt="16px">
          <Button flex="1" h="42px" variant="ghost" color={isDark ? "#a0aec0" : "#64748b"}
            borderRadius="10px" fontWeight="600" fontSize="13px"
            border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
            _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button flex="1" h="42px" borderRadius="10px" fontWeight="700" fontSize="13px"
            bg="linear-gradient(135deg,#dc2626,#ef4444)" color="white"
            boxShadow="0 4px 16px rgba(220,38,38,.3)"
            _hover={{ boxShadow: "0 8px 24px rgba(220,38,38,.4)", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }} transition="all .2s"
            leftIcon={<Icon as={MdDelete} />}
            onClick={() => onConfirm(noti)}>
            Xóa vĩnh viễn
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Mobile Notification Card ─────────────────────────────────────────────────
function MobileNotiCard({ noti, index, onView, onDelete, isDark }) {
  const AIc = AUDIENCE_ICON[noti.audience] || MdPublic;
  return (
    <Box p="14px" borderRadius="12px"
      bg={isDark ? "#2d3748" : "white"}
      border={isDark ? "1.5px solid #4a5568" : "1.5px solid #f1f5f9"}
      transition="all .2s"
      _active={{ bg: isDark ? "#2d3748" : "#fffaf7", border: `1.5px solid ${ORBD}` }}
      boxShadow="0 1px 4px rgba(0,0,0,.04)"
      sx={{ animation:`${fadeUp} .35s ease ${index*.04}s both` }}
    >
      <Flex justify="space-between" align="flex-start" mb="8px">
        <Flex align="center" gap="8px">
          <Box px="7px" py="3px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
            <Text fontSize="10.5px" fontWeight="800" color={OR}>{noti.code}</Text>
          </Box>
          <ChannelBadge channel={noti.channel} />
        </Flex>
        <StatusBadge status={noti.status} />
      </Flex>

      <Text fontSize="14px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} mb="4px" noOfLines={2}>{noti.title}</Text>
      <Text fontSize="11.5px" color={isDark ? "#718096" : "#94a3b8"} mb="10px" noOfLines={2}>{noti.content}</Text>

      <Flex align="center" gap="6px" mb="10px">
        <Icon as={AIc} boxSize="12px" color={isDark ? "#718096" : "#94a3b8"} />
        <Text fontSize="11.5px" fontWeight="600" color={isDark ? "#a0aec0" : "#64748b"} noOfLines={1}>{noti.audienceDetail}</Text>
      </Flex>

      <Flex align="center" justify="space-between" mb="12px">
        <Flex align="center" gap="5px">
          <Icon as={FaRegClock} boxSize="11px" color={isDark ? "#718096" : "#94a3b8"} />
          <Text fontSize="11.5px" color={isDark ? "#a0aec0" : "#64748b"}>{noti.sentAt}</Text>
        </Flex>
        {noti.status === "Đã gửi" && (
          <Text fontSize="12px" fontWeight="800" color={noti.readRate >= 70 ? "#10b981" : noti.readRate >= 40 ? OR : "#ef4444"}>
            {noti.readRate}% đã đọc
          </Text>
        )}
      </Flex>

      <Flex gap="8px">
        <Button flex="1" h="36px" borderRadius="8px" fontSize="12px" fontWeight="600"
          bg={isDark ? "#4a5568" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"}
          border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
          leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
          _hover={{ bg: isDark ? "#4a5568" : "#f1f5f9" }} _active={{ transform:"scale(.97)" }}
          transition="all .15s" onClick={() => onView(noti)}>
          Xem chi tiết
        </Button>
        <Button h="36px" w="44px" borderRadius="8px"
          bg="#fef2f2" color="#dc2626" border="1px solid #fecaca"
          _hover={{ bg: "#fee2e2" }} _active={{ transform:"scale(.95)" }}
          transition="all .15s" onClick={() => onDelete(noti)}>
          <Icon as={MdDelete} boxSize="14px" />
        </Button>
      </Flex>
    </Box>
  );
}

// ─── Desktop Notification Row ─────────────────────────────────────────────────
function NotiRow({ noti, index, onView, onDelete, isDark }) {
  return (
    <Flex align="center" px="16px" py="12px" borderRadius="10px"
      bg={isDark ? "#1a202c" : "white"}
      border={isDark ? "1.5px solid #4a5568" : "1.5px solid #f1f5f9"}
      transition="all .2s"
      _hover={{ border: `1.5px solid ${ORBD}`, boxShadow: `0 2px 12px rgba(234,88,12,.08)`, bg: isDark ? "#2d3748" : "#fffaf7" }}
      sx={{ animation:`${fadeUp} .35s ease ${index*.04}s both` }}
    >
      <Box w={COL.idx} flexShrink="0">
        <Text fontSize="12px" fontWeight="700" color={isDark ? "#4a5568" : "#cbd5e1"}>{String(index+1).padStart(2,"0")}</Text>
      </Box>
      <Box flex={COL.title} minW="0" pr="12px">
        <Flex align="center" gap="8px" mb="2px">
          <Box px="7px" py="2px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`} flexShrink="0">
            <Text fontSize="10px" fontWeight="800" color={OR} letterSpacing=".5px">{noti.code}</Text>
          </Box>
          <Text fontSize="12.5px" fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"} noOfLines={1}>{noti.title}</Text>
        </Flex>
        <Text fontSize="11px" color={isDark ? "#718096" : "#94a3b8"} noOfLines={1}>{noti.content}</Text>
      </Box>
      <Box w={COL.channel} flexShrink="0" pr="10px">
        <ChannelBadge channel={noti.channel} />
      </Box>
      <Box w={COL.audience} flexShrink="0" pr="10px">
        <Text fontSize="12px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"} noOfLines={1}>{noti.audience}</Text>
        <Text fontSize="10.5px" color={isDark ? "#718096" : "#94a3b8"} noOfLines={1}>{noti.audienceDetail}</Text>
      </Box>
      <Box w={COL.time} flexShrink="0" pr="10px">
        <Text fontSize="12px" fontWeight="600" color={isDark ? "#e2e8f0" : "#334155"}>{noti.sentAt}</Text>
      </Box>
      <Box w={COL.status} flexShrink="0" pr="10px">
        <StatusBadge status={noti.status} />
      </Box>
      <Box w={COL.read} flexShrink="0" pr="10px">
        <ReadRateBar rate={noti.readRate} status={noti.status} isDark={isDark} />
      </Box>
      <Box w={COL.actions} flexShrink="0">
        <Flex gap="5px" align="center">
          <Button size="xs" h="28px" px="10px" borderRadius="7px"
            bg={isDark ? "#4a5568" : "#f8fafc"} color={isDark ? "#e2e8f0" : "#475569"}
            border={isDark ? "1px solid #4a5568" : "1px solid #e2e8f0"}
            fontSize="11.5px" fontWeight="600"
            leftIcon={<Icon as={MdVisibility} boxSize="12px" />}
            _hover={{ bg: isDark ? "#4a5568" : "#f1f5f9", color: isDark ? "#f7fafc" : "#0f172a" }} transition="all .15s"
            onClick={() => onView(noti)}>Xem</Button>
          <Button size="xs" h="28px" w="28px" minW="28px" px="0" borderRadius="7px"
            bg="#fef2f2" color="#dc2626" border="1px solid #fecaca"
            _hover={{ bg: "#fee2e2" }} transition="all .15s"
            onClick={() => onDelete(noti)}>
            <Icon as={MdDelete} boxSize="13px" />
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

// ─── Filter Drawer (Mobile) ────────────────────────────────────────────────────
function FilterDrawer({ isOpen, onClose, filterStatus, setFilterStatus, filterChannel, setFilterChannel, isDark }) {
  const statuses = ["Tất cả", "Đã gửi", "Đã lên lịch", "Nháp"];
  const channels = ["Tất cả", "Push", "Email", "Push & Email"];
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent borderRadius="20px 20px 0 0"
        bg={isDark ? "#1a202c" : "white"}
        border={isDark ? "1px solid #4a5568" : "none"}
        pb="env(safe-area-inset-bottom, 16px)">
        <Box h="4px" bg={`linear-gradient(90deg,${OR},${ORL})`} borderRadius="20px 20px 0 0" />
        <DrawerHeader pt="16px" pb="8px">
          <Flex align="center" justify="space-between">
            <Text fontSize="15px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>Bộ lọc</Text>
            <Button size="sm" variant="ghost" borderRadius="8px" color={isDark ? "#718096" : "#94a3b8"}
              onClick={onClose}><Icon as={MdClose} boxSize="18px" /></Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody pb="24px">
          <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"} mb="8px">Trạng thái</Text>
          <Flex direction="column" gap="8px" mb="18px">
            {statuses.map(s => {
              const cfg = STATUS_CFG[s];
              const isActive = filterStatus === s;
              return (
                <Button key={s} h="46px" borderRadius="12px" justifyContent="flex-start"
                  px="16px" fontSize="13.5px" fontWeight="600"
                  bg={isActive ? (cfg ? cfg.bg : ORPL) : (isDark ? "#2d3748" : "#f8fafc")}
                  color={isActive ? (cfg ? cfg.color : OR) : (isDark ? "#e2e8f0" : "#374151")}
                  border={`1.5px solid ${isActive ? (cfg ? cfg.border : ORBD) : (isDark ? "#4a5568" : "#e8edf3")}`}
                  _hover={{ bg: cfg ? cfg.bg : ORPL }}
                  onClick={() => setFilterStatus(s)}>
                  {cfg && <Box w="8px" h="8px" borderRadius="full" bg={cfg.dot} mr="10px" />}
                  {s}
                  {isActive && <Icon as={MdCheckCircle} boxSize="16px" color={cfg ? cfg.color : OR} ml="auto" />}
                </Button>
              );
            })}
          </Flex>
          <Text sx={labelStyle} color={isDark ? "#a0aec0" : "#64748b"} mb="8px">Kênh gửi</Text>
          <Flex direction="column" gap="8px" mb="8px">
            {channels.map(c => {
              const cfg = CHANNEL_CFG[c];
              const isActive = filterChannel === c;
              return (
                <Button key={c} h="46px" borderRadius="12px" justifyContent="flex-start"
                  px="16px" fontSize="13.5px" fontWeight="600"
                  bg={isActive ? (cfg ? cfg.bg : ORPL) : (isDark ? "#2d3748" : "#f8fafc")}
                  color={isActive ? (cfg ? cfg.color : OR) : (isDark ? "#e2e8f0" : "#374151")}
                  border={`1.5px solid ${isActive ? (cfg ? cfg.border : ORBD) : (isDark ? "#4a5568" : "#e8edf3")}`}
                  _hover={{ bg: cfg ? cfg.bg : ORPL }}
                  onClick={() => { setFilterChannel(c); onClose(); }}>
                  {cfg && <Icon as={cfg.icon} boxSize="13px" color={cfg.color} mr="10px" />}
                  {c}
                  {isActive && <Icon as={MdCheckCircle} boxSize="16px" color={cfg ? cfg.color : OR} ml="auto" />}
                </Button>
              );
            })}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Detail View ────────────────────────────────────────────────────────────────
function NotiDetail({ noti, onBack, onDelete, isDark }) {
  const AIc = AUDIENCE_ICON[noti.audience] || MdPublic;
  return (
    <Box sx={{ animation:`${fadeIn} .3s ease both` }}>
      <Flex align="center" justify="space-between" mb="20px">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color={isDark ? "#a0aec0" : "#64748b"} borderRadius="10px" h={{ base:"40px", md:"38px" }}
          fontSize="13px" fontWeight="600"
          border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
          _hover={{ bg: isDark ? "#2d3748" : "#f8fafc" }} onClick={onBack}>
          Quay lại
        </Button>
        <Button h={{ base:"40px", md:"40px" }} px="18px" borderRadius="10px"
          fontWeight="700" fontSize="13px"
          bg="#fef2f2" color="#dc2626" border="1px solid #fecaca"
          _hover={{ bg: "#fee2e2" }} transition="all .2s"
          leftIcon={<Icon as={MdDelete} />} onClick={() => onDelete(noti)}>
          Xóa thông báo
        </Button>
      </Flex>

      <Box bg={isDark ? "#1a202c" : "white"} borderRadius="18px"
        border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 2px 12px rgba(0,0,0,.3)" : "0 2px 12px rgba(0,0,0,.06)"}
        overflow="hidden" mb="18px">
        <Box h="4px" bg={`linear-gradient(90deg,${OR},${ORL},#fbbf24,${ORL},${OR})`}
          bgSize="200% 100%" sx={{ animation:`${shimmer} 3s linear infinite` }} />
        <Box p={{ base:"18px", md:"26px" }}>
          <Flex justify="space-between" align="flex-start" mb="14px"
            direction={{ base:"column", md:"row" }} gap={{ base:"10px", md:"0" }}>
            <Box>
              <Flex align="center" gap="10px" mb="8px" flexWrap="wrap">
                <Box px="9px" py="4px" borderRadius="7px" bg={ORPL} border={`1px solid ${ORBD}`}>
                  <Text fontSize="11px" fontWeight="800" color={OR} letterSpacing=".5px">{noti.code}</Text>
                </Box>
                <ChannelBadge channel={noti.channel} />
              </Flex>
              <Text fontSize={{ base:"17px", md:"20px" }} fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"} letterSpacing="-.3px">
                {noti.title}
              </Text>
            </Box>
            <StatusBadge status={noti.status} />
          </Flex>

          <Box h="1px" bg={isDark ? "#4a5568" : "#f1f5f9"} mb="16px" />

          <Box p="16px" borderRadius="12px" bg={isDark ? "#2d3748" : "#f8fafc"}
            border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"} mb="16px">
            <Flex align="center" gap="6px" mb="6px">
              <Icon as={FaRegFileAlt} boxSize="11px" color={OR} />
              <Text fontSize="9.5px" fontWeight="700" color={isDark ? "#718096" : "#94a3b8"} letterSpacing=".8px" textTransform="uppercase">
                Nội dung
              </Text>
            </Flex>
            <Text fontSize="13.5px" fontWeight="500" color={isDark ? "#e2e8f0" : "#334155"} lineHeight="1.6">
              {noti.content}
            </Text>
          </Box>

          <SimpleGrid columns={{ base:2, md:4 }} spacing={{ base:"10px", md:"14px" }}>
            {[
              { icon:AIc,         label:"Đối tượng",     val:noti.audience },
              { icon:MdGroups,    label:"Chi tiết",       val:noti.audienceDetail },
              { icon:FaRegClock,  label:"Thời gian",      val:noti.sentAt },
              { icon:MdBarChart,  label:"Đã gửi",         val:noti.status === "Đã gửi" ? noti.sentCount.toLocaleString("vi-VN") : "—" },
            ].map(({ icon:Ic, label, val }) => (
              <Box key={label} p={{ base:"10px 12px", md:"10px 14px" }} borderRadius="10px"
                bg={isDark ? "#2d3748" : "#f8fafc"} border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={Ic} boxSize="11px" color={OR} />
                  <Text fontSize="9.5px" fontWeight="700" color={isDark ? "#718096" : "#94a3b8"} letterSpacing=".8px"
                    textTransform="uppercase">{label}</Text>
                </Flex>
                <Text fontSize={{ base:"12px", md:"13px" }} fontWeight="700" color={isDark ? "#f7fafc" : "#0f172a"}
                  noOfLines={2}>{val}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {noti.status === "Đã gửi" && (
        <Box bg={isDark ? "#1a202c" : "white"} borderRadius="16px"
          border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
          boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"}
          p={{ base:"16px", md:"20px" }}
          sx={{ animation:`${fadeUp} .4s ease .1s both` }}>
          <SectionTitle label="Thống kê tỷ lệ đọc" isDark={isDark} />

          <Flex align="center" gap="20px" mb="18px" direction={{ base:"column", sm:"row" }}>
            <Box position="relative" w="112px" h="112px" flexShrink="0">
              <svg viewBox="0 0 112 112" width="112" height="112">
                <circle cx="56" cy="56" r="48" fill="none" stroke={isDark ? "#4a5568" : "#eef2f6"} strokeWidth="12" />
                <circle cx="56" cy="56" r="48" fill="none"
                  stroke={noti.readRate >= 70 ? "#10b981" : noti.readRate >= 40 ? OR : "#ef4444"}
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(noti.readRate/100)*301.6} 301.6`}
                  transform="rotate(-90 56 56)" />
              </svg>
              <Flex position="absolute" inset="0" align="center" justify="center" direction="column">
                <Text fontSize="20px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>{noti.readRate}%</Text>
                <Text fontSize="9.5px" color={isDark ? "#718096" : "#94a3b8"} fontWeight="600">đã đọc</Text>
              </Flex>
            </Box>
            <SimpleGrid columns={2} spacing="10px" flex="1" w="100%">
              <Box p="12px 14px" borderRadius="10px" bg={isDark ? "#2d3748" : ORPL} border={isDark ? "1px solid #4a5568" : `1px solid ${ORBD}`}>
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={MdSend} boxSize="12px" color={OR} />
                  <Text fontSize="9.5px" fontWeight="700" color={OR} letterSpacing=".8px" textTransform="uppercase">Đã gửi</Text>
                </Flex>
                <Text fontSize="18px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>{noti.sentCount.toLocaleString("vi-VN")}</Text>
              </Box>
              <Box p="12px 14px" borderRadius="10px" bg={isDark ? "#2d3748" : "#ecfdf5"} border={isDark ? "1px solid #4a5568" : "1px solid #6ee7b7"}>
                <Flex align="center" gap="6px" mb="4px">
                  <Icon as={MdOutlineMarkEmailRead} boxSize="12px" color="#059669" />
                  <Text fontSize="9.5px" fontWeight="700" color="#059669" letterSpacing=".8px" textTransform="uppercase">Đã đọc</Text>
                </Flex>
                <Text fontSize="18px" fontWeight="800" color={isDark ? "#f7fafc" : "#0f172a"}>{noti.readCount.toLocaleString("vi-VN")}</Text>
              </Box>
            </SimpleGrid>
          </Flex>

          <Progress value={noti.readRate} size="sm" borderRadius="full"
            bg={isDark ? "#4a5568" : "#e5e7eb"}
            sx={{ "& > div": { background: noti.readRate >= 70 ? "linear-gradient(90deg,#10b981,#34d399)" : noti.readRate >= 40 ? `linear-gradient(90deg,${OR},${ORL})` : "linear-gradient(90deg,#ef4444,#f87171)" } }} />
        </Box>
      )}
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function QuanLyThongBao() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [notis, setNotis]               = useState(INIT_NOTIS);
  const [view, setView]                 = useState("list");
  const [selectedNoti, setSelectedNoti] = useState(null);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterChannel, setFilterChannel] = useState("Tất cả");
  const [showSearch, setShowSearch]     = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isOpen: isFilterOpen, onOpen: openFilter, onClose: closeFilter } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const filtered = notis.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = n.code.toLowerCase().includes(q) ||
                        n.title.toLowerCase().includes(q) ||
                        n.content.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Tất cả" || n.status === filterStatus;
    const matchChannel = filterChannel === "Tất cả" || n.channel === filterChannel;
    return matchSearch && matchStatus && matchChannel;
  });

  const sentNotis = notis.filter(n => n.status === "Đã gửi");
  const avgReadRate = sentNotis.length
    ? Math.round(sentNotis.reduce((sum, n) => sum + n.readRate, 0) / sentNotis.length)
    : 0;

  const counts = {
    total:     notis.length,
    sent:      notis.filter(n => n.status === "Đã gửi").length,
    scheduled: notis.filter(n => n.status === "Đã lên lịch").length,
    draft:     notis.filter(n => n.status === "Nháp").length,
  };

  const handleCreate = (newNoti) => setNotis(prev => [newNoti, ...prev]);

  const handleDeleteConfirm = (target) => {
    setNotis(prev => prev.filter(n => n.id !== target.id));
    setDeleteTarget(null);
    if (view === "detail") setView("list");
  };

  const bg = useColorModeValue("#f8fafc", "#0a0a18");
  const textColor = useColorModeValue("#0f172a", "#f7fafc");
  const textSecondary = useColorModeValue("#94a3b8", "#718096");

  if (view === "detail" && selectedNoti) {
    const live = notis.find(n => n.id === selectedNoti.id) || selectedNoti;
    return (
      <Box pt={{ base:"80px", md:"80px" }} px={{ base:"12px", md:"0" }} bg={bg} minH="100vh">
        <DeleteModal noti={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} isDark={isDark} />
        <NotiDetail
          noti={live}
          onBack={() => setView("list")}
          onDelete={tk => setDeleteTarget(tk)}
          isDark={isDark}
        />
      </Box>
    );
  }

  return (
    <Box pt={{ base:"80px", md:"80px" }} px={{ base:"0", md:"0" }} bg={bg} minH="100vh">
      {/* Compose Modal */}
      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onCreate={handleCreate}
        isDark={isDark}
      />

      {/* Delete Confirm Modal */}
      <DeleteModal noti={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} isDark={isDark} />

      {/* Filter Drawer (Mobile) */}
      <FilterDrawer
        isOpen={isFilterOpen} onClose={closeFilter}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterChannel={filterChannel} setFilterChannel={setFilterChannel}
        isDark={isDark}
      />

      {/* Page header */}
      <Box px={{ base:"16px", md:"0" }}>
        <Flex justify="space-between" align="center" mb="16px"
          sx={{ animation:`${fadeUp} .4s ease both` }}>
          <Flex align="center" gap="10px">
            <Box w={{ base:"36px", md:"38px" }} h={{ base:"36px", md:"38px" }} borderRadius="11px"
              bg={`linear-gradient(135deg,${OR},${ORL})`}
              display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 12px ${ORSW}`}>
              <Icon as={MdCampaign} boxSize={{ base:"16px", md:"18px" }} color="white" />
            </Box>
            <Box>
              <Text fontSize={{ base:"20px", md:"26px" }} fontWeight="800" color={textColor} letterSpacing="-.5px">
                Quản lý thông báo
              </Text>
              <Text color={textSecondary} fontSize={{ base:"11px", md:"13px" }} display={{ base:"none", md:"block" }}>
                Soạn, gửi và theo dõi thông báo push / email đến người dùng
              </Text>
            </Box>
          </Flex>

          <Flex gap="8px" align="center">
            <Button h="38px" w="38px" minW="38px" p="0" borderRadius="10px"
              bg={isDark ? "#2d3748" : "#f8fafc"}
              color={isDark ? "#e2e8f0" : "#475569"}
              border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e2e8f0"}
              onClick={toggleColorMode}>
              <Icon as={isDark ? MdLightMode : MdDarkMode} boxSize="16px" />
            </Button>

            <Button h="38px" px="14px" borderRadius="10px" fontWeight="700" fontSize="12px"
              bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
              boxShadow={`0 3px 12px ${ORSW}`}
              _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }} transition="all .2s"
              leftIcon={<Icon as={MdAdd} boxSize="14px" />}
              onClick={() => setShowComposeModal(true)}
              display={{ base:"none", md:"flex" }}>
              <Text>Soạn thông báo</Text>
            </Button>

            <Button h="36px" w="36px" minW="36px" p="0" borderRadius="10px"
              display={{ base:"flex", md:"none" }}
              bg={showSearch ? ORPL : (isDark ? "#2d3748" : "#f8fafc")}
              color={showSearch ? OR : (isDark ? "#e2e8f0" : "#475569")}
              border={isDark ? `1.5px solid ${showSearch ? ORBD : "#4a5568"}` : `1.5px solid ${showSearch ? ORBD : "#e2e8f0"}`}
              onClick={() => setShowSearch(v => !v)}>
              <Icon as={MdSearch} boxSize="16px" />
            </Button>
            <Button h="36px" w="36px" minW="36px" p="0" borderRadius="10px"
              display={{ base:"flex", md:"none" }}
              bg={(filterStatus !== "Tất cả" || filterChannel !== "Tất cả") ? ORPL : (isDark ? "#2d3748" : "#f8fafc")}
              color={(filterStatus !== "Tất cả" || filterChannel !== "Tất cả") ? OR : (isDark ? "#e2e8f0" : "#475569")}
              border={isDark ? `1.5px solid ${(filterStatus !== "Tất cả" || filterChannel !== "Tất cả") ? ORBD : "#4a5568"}` : `1.5px solid ${(filterStatus !== "Tất cả" || filterChannel !== "Tất cả") ? ORBD : "#e2e8f0"}`}
              onClick={openFilter}>
              <Icon as={MdFilterAlt} boxSize="16px" />
            </Button>
          </Flex>
        </Flex>

        {/* Mobile compose button */}
        <Button h="40px" w="100%" borderRadius="10px" fontWeight="700" fontSize="13px"
          bg={`linear-gradient(135deg,${OR},${ORL})`} color="white"
          boxShadow={`0 3px 12px ${ORSW}`}
          _hover={{ boxShadow: `0 6px 20px rgba(234,88,12,.4)`, transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }} transition="all .2s"
          leftIcon={<Icon as={MdAdd} boxSize="16px" />}
          onClick={() => setShowComposeModal(true)}
          display={{ base:"flex", md:"none" }}
          mb="12px">
          Soạn thông báo mới
        </Button>

        {/* Mobile search bar */}
        {showSearch && (
          <Box mb="12px" display={{ base:"block", md:"none" }}
            sx={{ animation:`${fadeUp} .2s ease both` }}>
            <Box position="relative">
              <Icon as={MdSearch} position="absolute" left="12px" top="50%"
                transform="translateY(-50%)" boxSize="16px" color={textSecondary} zIndex="1" />
              <Input
                pl="36px" h="42px" fontSize="13px" fontWeight="500"
                placeholder="Tìm mã, tiêu đề, nội dung..."
                bg={isDark ? "#1a202c" : "white"}
                border={isDark ? "1.5px solid #4a5568" : "1.5px solid #e8edf3"}
                borderRadius="12px"
                color={isDark ? "#e2e8f0" : "#374151"}
                _placeholder={{ color: isDark ? "#718096" : "#b0bac8" }}
                _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.08)`, bg: isDark ? "#1a202c" : "#fff" }}
                transition="all .2s"
                value={search} onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </Box>
            {(filterStatus !== "Tất cả" || filterChannel !== "Tất cả") && (
              <Flex mt="8px" gap="6px" flexWrap="wrap">
                {filterStatus !== "Tất cả" && (
                  <Box px="10px" py="4px" borderRadius="8px" bg={ORPL} border={`1px solid ${ORBD}`}
                    display="inline-flex" alignItems="center" gap="6px">
                    <Text fontSize="11.5px" fontWeight="600" color={OR}>{filterStatus}</Text>
                    <Box as="button" onClick={() => setFilterStatus("Tất cả")} color={OR}>
                      <Icon as={MdClose} boxSize="12px" />
                    </Box>
                  </Box>
                )}
                {filterChannel !== "Tất cả" && (
                  <Box px="10px" py="4px" borderRadius="8px" bg={ORPL} border={`1px solid ${ORBD}`}
                    display="inline-flex" alignItems="center" gap="6px">
                    <Text fontSize="11.5px" fontWeight="600" color={OR}>{filterChannel}</Text>
                    <Box as="button" onClick={() => setFilterChannel("Tất cả")} color={OR}>
                      <Icon as={MdClose} boxSize="12px" />
                    </Box>
                  </Box>
                )}
              </Flex>
            )}
          </Box>
        )}
      </Box>

      {/* Stats */}
      <Box px={{ base:"16px", md:"0" }} mb="16px">
        <SimpleGrid columns={{ base:2, sm:4, md:4 }} spacing={{ base:"8px", md:"14px" }}>
          <StatCard label="Tổng thông báo" value={counts.total}     icon={FaBell}        accent={OR}       delay={0}    isDark={isDark} />
          <StatCard label="Đã gửi"         value={counts.sent}      icon={MdCheckCircle} accent="#10b981" delay={0.04} isDark={isDark} />
          <StatCard label="Đã lên lịch"    value={counts.scheduled} icon={MdSchedule}    accent={OR}       delay={0.08} isDark={isDark} />
          <StatCard label="Tỷ lệ đọc TB"   value={`${avgReadRate}%`} icon={MdBarChart}   accent="#7c3aed"  delay={0.12} isDark={isDark} sub={`${counts.draft} nháp`} />
        </SimpleGrid>
      </Box>

      {/* Table card */}
      <Box bg={isDark ? "#1a202c" : "white"} borderRadius={{ base:"16px 16px 0 0", md:"16px" }}
        border={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}
        boxShadow={isDark ? "0 1px 4px rgba(0,0,0,.3)" : "0 1px 4px rgba(0,0,0,.04)"}
        sx={{ animation:`${fadeUp} .4s ease .1s both` }}>

        {/* Desktop toolbar */}
        <Box display={{ base:"none", md:"block" }}>
          <Flex align="center" justify="space-between" p="18px 20px 14px"
            borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f8fafc"}
            flexWrap="wrap" gap="10px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color={textColor}>Danh sách thông báo</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
                <Text fontSize="11px" fontWeight="700" color={OR}>{filtered.length} thông báo</Text>
              </Box>
            </Flex>
            <Flex gap="8px" align="center">
              <Box position="relative">
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color={textSecondary} zIndex="1" />
                <Input
                  pl="30px" h="34px" w="230px" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm mã, tiêu đề, nội dung..."
                  bg={isDark ? "#2d3748" : "#f8fafc"}
                  border={isDark ? "1px solid #4a5568" : "1px solid #e8edf3"}
                  borderRadius="9px"
                  color={isDark ? "#e2e8f0" : "#374151"}
                  _placeholder={{ color: isDark ? "#718096" : "#b0bac8" }}
                  _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.08)`, bg: isDark ? "#2d3748" : "#fff" }}
                  _hover={{ border: `1px solid ${OR}` }}
                  transition="all .2s"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </Box>
              <Select h="34px" fontSize="12.5px" fontWeight="600"
                color={isDark ? "#e2e8f0" : "#374151"}
                bg={isDark ? "#2d3748" : "#f8fafc"}
                border={isDark ? "1px solid #4a5568" : "1px solid #e8edf3"}
                borderRadius="9px" w="150px"
                _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.08)` }}
                _hover={{ border: `1px solid ${OR}` }} transition="all .2s"
                value={filterChannel} onChange={e => setFilterChannel(e.target.value)}>
                <option value="Tất cả">Tất cả kênh</option>
                <option value="Push">Push</option>
                <option value="Email">Email</option>
                <option value="Push & Email">Push & Email</option>
              </Select>
              <Select h="34px" fontSize="12.5px" fontWeight="600"
                color={isDark ? "#e2e8f0" : "#374151"}
                bg={isDark ? "#2d3748" : "#f8fafc"}
                border={isDark ? "1px solid #4a5568" : "1px solid #e8edf3"}
                borderRadius="9px" w="165px"
                _focus={{ border: `1.5px solid ${OR}`, boxShadow: `0 0 0 3px rgba(234,88,12,.08)` }}
                _hover={{ border: `1px solid ${OR}` }} transition="all .2s"
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đã gửi">Đã gửi</option>
                <option value="Đã lên lịch">Đã lên lịch</option>
                <option value="Nháp">Nháp</option>
              </Select>
            </Flex>
          </Flex>
        </Box>

        {/* Mobile toolbar */}
        <Box display={{ base:"block", md:"none" }}>
          <Flex align="center" justify="space-between" px="16px" py="12px"
            borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f8fafc"}>
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="14px" color={textColor}>Danh sách thông báo</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg={ORPL} border={`1px solid ${ORBD}`}>
                <Text fontSize="11px" fontWeight="700" color={OR}>{filtered.length}</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {/* Desktop column headers */}
        <Box display={{ base:"none", md:"block" }}>
          <Flex align="center" px="16px" py="10px" bg={isDark ? "#2d3748" : "#fafbfc"}
            borderBottom={isDark ? "1px solid #4a5568" : "1px solid #f1f5f9"}>
            <CH w={COL.idx} isDark={isDark}>#</CH>
            <CH flex="1" pr="12px" isDark={isDark}>Tiêu đề / Nội dung</CH>
            <CH w={COL.channel} pr="10px" isDark={isDark}>Kênh</CH>
            <CH w={COL.audience} pr="10px" isDark={isDark}>Đối tượng</CH>
            <CH w={COL.time} pr="10px" isDark={isDark}>Thời gian</CH>
            <CH w={COL.status} pr="10px" isDark={isDark}>Trạng thái</CH>
            <CH w={COL.read} pr="10px" isDark={isDark}>Tỷ lệ đọc</CH>
            <CH w={COL.actions} isDark={isDark}>Hành động</CH>
          </Flex>
        </Box>

        {/* Rows */}
        <Box p={{ base:"12px", md:"10px" }}>
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="40px" color={isDark ? "#4a5568" : "#cbd5e1"}>
              <Icon as={FaBell} boxSize="32px" mb="8px" />
              <Text fontSize="13px" fontWeight="600" color={textSecondary}>Không tìm thấy thông báo nào</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap={{ base:"8px", md:"6px" }}>
              {filtered.map((n, i) =>
                isMobile ? (
                  <MobileNotiCard
                    key={n.id} noti={n} index={i}
                    onView={tk => { setSelectedNoti(tk); setView("detail"); }}
                    onDelete={tk => setDeleteTarget(tk)}
                    isDark={isDark}
                  />
                ) : (
                  <NotiRow
                    key={n.id} noti={n} index={i}
                    onView={tk => { setSelectedNoti(tk); setView("detail"); }}
                    onDelete={tk => setDeleteTarget(tk)}
                    isDark={isDark}
                  />
                )
              )}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}