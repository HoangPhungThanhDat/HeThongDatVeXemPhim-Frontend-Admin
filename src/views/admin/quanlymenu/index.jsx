import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
  IconButton,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Tooltip,
  Tag,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  MdMenu,
  MdSearch,
  MdAdd,
  MdDragIndicator,
  MdEdit,
  MdVisibility,
  MdVisibilityOff,
  MdDelete,
  MdHome,
  MdLocalMovies,
  MdConfirmationNumber,
  MdStar,
  MdCampaign,
  MdInfo,
  MdContactSupport,
  MdExpandMore,
  MdExpandLess,
  MdLink,
  MdOpenInNew,
  MdSave,
  MdUndo,
  MdWarning,
} from "react-icons/md";

/* ─────────────────── MOCK DATA ─────────────────── */

const ICON_MAP = {
  MdHome,
  MdLocalMovies,
  MdConfirmationNumber,
  MdStar,
  MdCampaign,
  MdInfo,
  MdContactSupport,
};

const initialMenuItems = [
  {
    id: 1,
    label: "Trang chủ",
    url: "/",
    icon: "MdHome",
    visible: true,
    order: 1,
    badge: null,
    children: [],
  },
  {
    id: 2,
    label: "Phim đang chiếu",
    url: "/phim-dang-chieu",
    icon: "MdLocalMovies",
    visible: true,
    order: 2,
    badge: "HOT",
    children: [
      { id: 21, label: "Phim 2D", url: "/phim-dang-chieu/2d", visible: true, order: 1 },
      { id: 22, label: "Phim 3D", url: "/phim-dang-chieu/3d", visible: true, order: 2 },
      { id: 23, label: "Phim IMAX", url: "/phim-dang-chieu/imax", visible: false, order: 3 },
    ],
  },
  {
    id: 3,
    label: "Đặt vé",
    url: "/dat-ve",
    icon: "MdConfirmationNumber",
    visible: true,
    order: 3,
    badge: null,
    children: [],
  },
  {
    id: 4,
    label: "Phim sắp chiếu",
    url: "/phim-sap-chieu",
    icon: "MdStar",
    visible: true,
    order: 4,
    badge: "NEW",
    children: [],
  },
  {
    id: 5,
    label: "Khuyến mãi",
    url: "/khuyen-mai",
    icon: "MdCampaign",
    visible: true,
    order: 5,
    badge: "5",
    children: [
      { id: 51, label: "Ưu đãi thành viên", url: "/khuyen-mai/thanh-vien", visible: true, order: 1 },
      { id: 52, label: "Combo bắp nước", url: "/khuyen-mai/combo", visible: true, order: 2 },
    ],
  },
  {
    id: 6,
    label: "Giới thiệu",
    url: "/gioi-thieu",
    icon: "MdInfo",
    visible: false,
    order: 6,
    badge: null,
    children: [],
  },
  {
    id: 7,
    label: "Liên hệ",
    url: "/lien-he",
    icon: "MdContactSupport",
    visible: true,
    order: 7,
    badge: null,
    children: [],
  },
];

/* ─────────────────── THEME HOOK ─────────────────── */

function useMenuTheme() {
  return {
    pageBg: useColorModeValue("#f8f9fb", "rgba(10,12,22,1)"),
    cardBg: useColorModeValue("white", "rgba(255,255,255,0.03)"),
    cardBorder: useColorModeValue("gray.100", "rgba(255,255,255,0.07)"),
    cardHover: useColorModeValue("gray.50", "rgba(255,255,255,0.05)"),
    textPrimary: useColorModeValue("gray.800", "white"),
    textSecondary: useColorModeValue("gray.500", "whiteAlpha.500"),
    textMuted: useColorModeValue("gray.400", "whiteAlpha.400"),
    inputBg: useColorModeValue("gray.50", "rgba(255,255,255,0.05)"),
    inputBorder: useColorModeValue("gray.200", "rgba(255,255,255,0.1)"),
    divider: useColorModeValue("gray.100", "rgba(255,255,255,0.06)"),
    rowHover: useColorModeValue("rgba(249,115,22,0.04)", "rgba(249,115,22,0.07)"),
    rowDrag: useColorModeValue("rgba(249,115,22,0.08)", "rgba(249,115,22,0.12)"),
    childRowBg: useColorModeValue("rgba(249,115,22,0.03)", "rgba(249,115,22,0.04)"),
    shadow: useColorModeValue("0 2px 12px rgba(0,0,0,0.06)", "none"),
    accent: "#f97316",
    accentHover: "#ea580c",
    accentLight: useColorModeValue("rgba(249,115,22,0.1)", "rgba(249,115,22,0.15)"),
    accentBorder: "rgba(249,115,22,0.3)",
    badgeHot: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", border: "rgba(239,68,68,0.3)" },
    badgeNew: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.3)" },
    badgeNum: { bg: "rgba(249,115,22,0.12)", color: "#ea580c", border: "rgba(249,115,22,0.3)" },
  };
}

/* ─────────────────── BADGE RENDER ─────────────────── */

function MenuBadge({ badge, t }) {
  if (!badge) return null;
  const style =
    badge === "HOT" ? t.badgeHot :
    badge === "NEW" ? t.badgeNew :
    t.badgeNum;
  return (
    <Badge
      bg={style.bg}
      color={style.color}
      border={`1px solid ${style.border}`}
      borderRadius="6px"
      px="7px" py="2px"
      fontSize="10px" fontWeight="800"
      letterSpacing="0.05em"
    >
      {badge}
    </Badge>
  );
}

/* ─────────────────── EDIT MODAL (inline) ─────────────────── */

function InlineEdit({ item, onSave, onCancel, t }) {
  const [label, setLabel] = useState(item.label);
  const [url, setUrl] = useState(item.url);
  const [badge, setBadge] = useState(item.badge || "");

  return (
    <Box
      bg={t.cardBg}
      border="1px solid"
      borderColor={t.accentBorder}
      borderRadius="14px"
      p="16px"
      mx="16px"
      mb="8px"
      boxShadow={`0 0 0 3px rgba(249,115,22,0.08)`}
    >
      <Text fontSize="xs" fontWeight="700" color={t.accent} mb="12px" letterSpacing="0.08em" textTransform="uppercase">
        Chỉnh sửa mục menu
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12px" mb="12px">
        <Box>
          <Text fontSize="xs" color={t.textSecondary} mb="6px" fontWeight="600">Tên hiển thị *</Text>
          <Input
            value={label}
            onChange={e => setLabel(e.target.value)}
            bg={t.inputBg}
            border="1px solid"
            borderColor={t.inputBorder}
            borderRadius="10px"
            fontSize="sm"
            color={t.textPrimary}
            _focus={{ borderColor: t.accent, boxShadow: `0 0 0 2px rgba(249,115,22,0.2)` }}
            size="sm"
          />
        </Box>
        <Box>
          <Text fontSize="xs" color={t.textSecondary} mb="6px" fontWeight="600">Đường dẫn (URL)</Text>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            bg={t.inputBg}
            border="1px solid"
            borderColor={t.inputBorder}
            borderRadius="10px"
            fontSize="sm"
            color={t.textPrimary}
            _focus={{ borderColor: t.accent, boxShadow: `0 0 0 2px rgba(249,115,22,0.2)` }}
            size="sm"
          />
        </Box>
        <Box>
          <Text fontSize="xs" color={t.textSecondary} mb="6px" fontWeight="600">Badge (HOT / NEW / số)</Text>
          <Input
            value={badge}
            onChange={e => setBadge(e.target.value)}
            placeholder="Để trống = ẩn badge"
            bg={t.inputBg}
            border="1px solid"
            borderColor={t.inputBorder}
            borderRadius="10px"
            fontSize="sm"
            color={t.textPrimary}
            _focus={{ borderColor: t.accent, boxShadow: `0 0 0 2px rgba(249,115,22,0.2)` }}
            size="sm"
          />
        </Box>
      </SimpleGrid>
      <Flex gap="8px" justify="flex-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          color={t.textSecondary}
          _hover={{ bg: t.inputBg }}
          borderRadius="8px"
        >
          Huỷ
        </Button>
        <Button
          size="sm"
          bg={t.accent}
          color="white"
          _hover={{ bg: t.accentHover }}
          borderRadius="8px"
          leftIcon={<Icon as={MdSave} />}
          onClick={() => onSave({ ...item, label, url, badge: badge || null })}
        >
          Lưu thay đổi
        </Button>
      </Flex>
    </Box>
  );
}

/* ─────────────────── CHILD ROW ─────────────────── */

function ChildRow({ child, onToggle, t }) {
  return (
    <Flex
      align="center"
      px="20px" py="10px"
      bg={t.childRowBg}
      borderBottom="1px solid"
      borderColor={t.divider}
      _hover={{ bg: t.rowHover }}
      transition="background 0.2s"
      gap="12px"
      role="group"
    >
      {/* indent + drag */}
      <Box w="24px" />
      <Icon as={MdDragIndicator} color={t.textMuted} boxSize="16px" cursor="grab" opacity={0.4} />
      <Box w="8px" h="8px" borderRadius="full" border="2px solid" borderColor={t.textMuted} opacity={0.4} />

      {/* label */}
      <Text fontSize="sm" color={t.textSecondary} flex="1" fontStyle="italic">
        {child.label}
      </Text>

      {/* url */}
      <Flex align="center" gap="6px" display={{ base: "none", md: "flex" }}>
        <Icon as={MdLink} boxSize="13px" color={t.textMuted} />
        <Text fontSize="xs" color={t.textMuted} fontFamily="mono">{child.url}</Text>
      </Flex>

      {/* toggle */}
      <Switch
        size="sm"
        isChecked={child.visible}
        onChange={() => onToggle(child.id)}
        sx={{
          "& .chakra-switch__track[data-checked]": { bg: t.accent },
        }}
      />

      {/* actions */}
      <Flex gap="4px" opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
        <Tooltip label="Sửa" hasArrow placement="top">
          <IconButton aria-label="edit" icon={<MdEdit />} size="xs" variant="ghost"
            color={t.textMuted} _hover={{ color: t.accent, bg: t.accentLight }} borderRadius="7px" />
        </Tooltip>
        <Tooltip label="Xoá" hasArrow placement="top">
          <IconButton aria-label="delete" icon={<MdDelete />} size="xs" variant="ghost"
            color={t.textMuted} _hover={{ color: "#ef4444", bg: "rgba(239,68,68,0.1)" }} borderRadius="7px" />
        </Tooltip>
      </Flex>
    </Flex>
  );
}

/* ─────────────────── MAIN ROW ─────────────────── */

function MenuRow({ item, index, total, editingId, onEdit, onSaveEdit, onCancelEdit, onToggle, onToggleChild, onDelete, t }) {
  const [expanded, setExpanded] = useState(false);
  const isEditing = editingId === item.id;
  const hasChildren = item.children.length > 0;
  const IconComp = ICON_MAP[item.icon] || MdMenu;

  return (
    <Box>
      {/* Main row */}
      <Flex
        align="center"
        px="20px" py="14px"
        borderBottom={!expanded || !hasChildren ? "1px solid" : "none"}
        borderColor={t.divider}
        _hover={{ bg: t.rowHover }}
        transition="background 0.2s"
        gap="14px"
        role="group"
        opacity={item.visible ? 1 : 0.5}
      >
        {/* Order badge */}
        <Flex
          w="28px" h="28px"
          borderRadius="8px"
          bg={t.accentLight}
          align="center" justify="center"
          flexShrink={0}
        >
          <Text fontSize="xs" fontWeight="800" color={t.accent}>{index + 1}</Text>
        </Flex>

        {/* Drag handle */}
        <Icon as={MdDragIndicator} color={t.textMuted} boxSize="18px" cursor="grab"
          opacity={0} _groupHover={{ opacity: 0.5 }} transition="opacity 0.2s" />

        {/* Icon */}
        <Flex
          w="36px" h="36px" borderRadius="10px"
          bg={item.visible ? `${t.accent}18` : t.inputBg}
          border={`1px solid ${item.visible ? t.accentBorder : t.inputBorder}`}
          align="center" justify="center" flexShrink={0}
        >
          <Icon as={IconComp} boxSize="17px" color={item.visible ? t.accent : t.textMuted} />
        </Flex>

        {/* Label + badge */}
        <Flex align="center" gap="8px" flex="1" minW={0}>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary} noOfLines={1}>
            {item.label}
          </Text>
          <MenuBadge badge={item.badge} t={t} />
          {!item.visible && (
            <Tag size="sm" bg="rgba(107,114,128,0.1)" color={t.textMuted} borderRadius="6px" fontSize="10px">
              Ẩn
            </Tag>
          )}
        </Flex>

        {/* URL */}
        <Flex align="center" gap="6px" display={{ base: "none", lg: "flex" }} minW="160px">
          <Icon as={MdLink} boxSize="13px" color={t.textMuted} />
          <Text fontSize="xs" color={t.textMuted} fontFamily="mono" noOfLines={1}>{item.url}</Text>
          <Icon as={MdOpenInNew} boxSize="11px" color={t.textMuted} opacity={0.5} />
        </Flex>

        {/* Children count */}
        {hasChildren && (
          <Tooltip label={expanded ? "Thu gọn" : "Xem menu con"} hasArrow>
            <Button
              size="xs"
              variant="ghost"
              color={t.accent}
              bg={t.accentLight}
              border={`1px solid ${t.accentBorder}`}
              borderRadius="8px"
              px="8px"
              rightIcon={<Icon as={expanded ? MdExpandLess : MdExpandMore} />}
              onClick={() => setExpanded(v => !v)}
              fontSize="11px" fontWeight="700"
            >
              {item.children.length} mục con
            </Button>
          </Tooltip>
        )}

        {/* Visible toggle */}
        <Tooltip label={item.visible ? "Đang hiển thị" : "Đang ẩn"} hasArrow>
          <Switch
            size="sm"
            isChecked={item.visible}
            onChange={() => onToggle(item.id)}
            sx={{
              "& .chakra-switch__track[data-checked]": { bg: t.accent },
            }}
          />
        </Tooltip>

        {/* Actions */}
        <Flex gap="4px">
          <Tooltip label="Sửa" hasArrow>
            <IconButton
              aria-label="edit"
              icon={<MdEdit />}
              size="sm" variant="ghost"
              color={isEditing ? t.accent : t.textMuted}
              bg={isEditing ? t.accentLight : "transparent"}
              _hover={{ color: t.accent, bg: t.accentLight }}
              borderRadius="9px"
              onClick={() => onEdit(item.id)}
            />
          </Tooltip>
          <Tooltip label="Xoá" hasArrow>
            <IconButton
              aria-label="delete"
              icon={<MdDelete />}
              size="sm" variant="ghost"
              color={t.textMuted}
              _hover={{ color: "#ef4444", bg: "rgba(239,68,68,0.1)" }}
              borderRadius="9px"
              onClick={() => onDelete(item.id)}
            />
          </Tooltip>
        </Flex>
      </Flex>

      {/* Inline edit panel */}
      {isEditing && (
        <InlineEdit
          item={item}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          t={t}
        />
      )}

      {/* Children */}
      {expanded && hasChildren && (
        <Box borderBottom="1px solid" borderColor={t.divider}>
          {item.children.map(child => (
            <ChildRow key={child.id} child={child} onToggle={onToggleChild} t={t} />
          ))}
          {/* Add child button */}
          <Flex
            align="center" gap="8px"
            px="80px" py="10px"
            _hover={{ bg: t.rowHover }}
            cursor="pointer"
            transition="background 0.2s"
          >
            <Icon as={MdAdd} color={t.accent} boxSize="14px" />
            <Text fontSize="xs" color={t.accent} fontWeight="600">Thêm mục con</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

/* ─────────────────── STAT CARD ─────────────────── */

function StatCard({ label, value, sub, color, t }) {
  return (
    <Box
      bg={t.cardBg}
      border="1px solid"
      borderColor={t.cardBorder}
      borderRadius="16px"
      p="18px"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        h: "2px",
        bgGradient: `linear(to-r, transparent, ${color}, transparent)`,
      }}
    >
      <Text fontSize="xs" color={t.textSecondary} fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" mb="8px">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="800" color={t.textPrimary} letterSpacing="-0.5px">{value}</Text>
      {sub && <Text fontSize="xs" color={t.textMuted} mt="4px">{sub}</Text>}
    </Box>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function MenuDieuHuong() {
  const t = useMenuTheme();
  const [items, setItems] = useState(initialMenuItems);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase()) ||
    i.url.toLowerCase().includes(search.toLowerCase())
  );

  const totalVisible = items.filter(i => i.visible).length;
  const totalHidden = items.filter(i => !i.visible).length;
  const totalChildren = items.reduce((s, i) => s + i.children.length, 0);

  const handleToggle = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, visible: !i.visible } : i));
  };

  const handleToggleChild = (childId) => {
    setItems(prev => prev.map(item => ({
      ...item,
      children: item.children.map(c => c.id === childId ? { ...c, visible: !c.visible } : c),
    })));
  };

  const handleSaveEdit = (updated) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddItem = () => {
    if (!newLabel.trim()) return;
    const newItem = {
      id: Date.now(),
      label: newLabel,
      url: newUrl || `/${newLabel.toLowerCase().replace(/\s+/g, "-")}`,
      icon: "MdMenu",
      visible: true,
      order: items.length + 1,
      badge: null,
      children: [],
    };
    setItems(prev => [...prev, newItem]);
    setNewLabel(""); setNewUrl(""); setShowAddForm(false);
  };

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box
      pt={{ base: "120px", md: "80px" }}
      px={{ base: "16px", md: "0" }}
      minH="100vh"
      bg={t.pageBg}
    >
      {/* ── HEADER ── */}
      <Flex align="flex-start" justify="space-between" mb="32px" flexWrap="wrap" gap="12px">
        <Box>
          <Flex align="center" gap="10px" mb="6px">
            <Box w="3px" h="28px" borderRadius="2px" bgGradient="linear(to-b, #f97316, #ea580c)" />
            <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color={t.textPrimary} letterSpacing="-0.5px">
              Menu điều hướng
            </Text>
          </Flex>
          <Text color={t.textSecondary} fontSize="sm" pl="13px">
            Chỉnh sửa tên, thứ tự & trạng thái các mục menu trên website người dùng
          </Text>
        </Box>

        <HStack spacing="10px">
          <Button
            leftIcon={<Icon as={MdUndo} />}
            size="sm"
            variant="ghost"
            color={t.textSecondary}
            _hover={{ bg: t.inputBg }}
            borderRadius="10px"
          >
            Hoàn tác
          </Button>
          <Button
            leftIcon={<Icon as={MdSave} />}
            size="sm"
            bg={saved ? "#16a34a" : t.accent}
            color="white"
            _hover={{ bg: saved ? "#15803d" : t.accentHover }}
            borderRadius="10px"
            onClick={handleSaveAll}
            transition="background 0.3s"
          >
            {saved ? "Đã lưu ✓" : "Lưu thay đổi"}
          </Button>
        </HStack>
      </Flex>

      {/* ── STATS ── */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="14px" mb="28px">
        <StatCard label="Tổng mục menu" value={items.length} sub="mục cấp 1" color={t.accent} t={t} />
        <StatCard label="Đang hiển thị" value={totalVisible} sub="trên website" color="#22c55e" t={t} />
        <StatCard label="Đang ẩn" value={totalHidden} sub="không hiển thị" color="#94a3b8" t={t} />
        <StatCard label="Menu con" value={totalChildren} sub="tổng cộng" color="#a78bfa" t={t} />
      </SimpleGrid>

      {/* ── SEARCH + ADD ── */}
      <Flex gap="12px" mb="20px" flexWrap="wrap">
        <InputGroup flex="1" minW="200px">
          <InputLeftElement pointerEvents="none">
            <Icon as={MdSearch} color={t.textMuted} boxSize="18px" />
          </InputLeftElement>
          <Input
            placeholder="Tìm theo tên hoặc đường dẫn..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            bg={t.inputBg}
            border="1px solid"
            borderColor={t.inputBorder}
            borderRadius="12px"
            color={t.textPrimary}
            _placeholder={{ color: t.textMuted }}
            _focus={{ borderColor: t.accent, boxShadow: `0 0 0 2px rgba(249,115,22,0.2)` }}
          />
        </InputGroup>
        <Button
          leftIcon={<Icon as={MdAdd} />}
          bg={t.accent}
          color="white"
          _hover={{ bg: t.accentHover }}
          borderRadius="12px"
          fontWeight="700"
          onClick={() => setShowAddForm(v => !v)}
        >
          Thêm mục mới
        </Button>
      </Flex>

      {/* ── ADD FORM ── */}
      {showAddForm && (
        <Box
          bg={t.cardBg}
          border="1px solid"
          borderColor={t.accentBorder}
          borderRadius="16px"
          p="20px"
          mb="16px"
          boxShadow={`0 0 0 3px rgba(249,115,22,0.07)`}
        >
          <Text fontSize="sm" fontWeight="700" color={t.accent} mb="14px">
            ➕ Thêm mục menu mới
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="12px" mb="14px">
            <Box>
              <Text fontSize="xs" color={t.textSecondary} mb="6px" fontWeight="600">Tên hiển thị *</Text>
              <Input
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Ví dụ: Về chúng tôi"
                bg={t.inputBg}
                border="1px solid"
                borderColor={t.inputBorder}
                borderRadius="10px"
                color={t.textPrimary}
                _placeholder={{ color: t.textMuted }}
                _focus={{ borderColor: t.accent, boxShadow: `0 0 0 2px rgba(249,115,22,0.2)` }}
              />
            </Box>
            <Box>
              <Text fontSize="xs" color={t.textSecondary} mb="6px" fontWeight="600">Đường dẫn (URL)</Text>
              <Input
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="/ve-chung-toi"
                bg={t.inputBg}
                border="1px solid"
                borderColor={t.inputBorder}
                borderRadius="10px"
                color={t.textPrimary}
                _placeholder={{ color: t.textMuted }}
                _focus={{ borderColor: t.accent, boxShadow: `0 0 0 2px rgba(249,115,22,0.2)` }}
              />
            </Box>
          </SimpleGrid>
          <Flex gap="8px" justify="flex-end">
            <Button size="sm" variant="ghost" color={t.textSecondary} onClick={() => setShowAddForm(false)} borderRadius="8px">
              Huỷ
            </Button>
            <Button size="sm" bg={t.accent} color="white" _hover={{ bg: t.accentHover }} borderRadius="8px"
              onClick={handleAddItem} isDisabled={!newLabel.trim()}>
              Thêm mục
            </Button>
          </Flex>
        </Box>
      )}

      {/* ── TABLE ── */}
      <Box
        bg={t.cardBg}
        border="1px solid"
        borderColor={t.cardBorder}
        borderRadius="20px"
        overflow="hidden"
        boxShadow={t.shadow}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0, left: 0, right: 0,
          h: "2px",
          bgGradient: "linear(to-r, transparent, #f97316, transparent)",
        }}
      >
        {/* Table header */}
        <Flex
          align="center"
          px="20px" py="12px"
          bg={useColorModeValue("rgba(249,115,22,0.04)", "rgba(249,115,22,0.06)")}
          borderBottom="1px solid"
          borderColor={t.divider}
          gap="14px"
        >
          <Box w="28px" />
          <Box w="18px" />
          <Box w="36px" />
          <Text flex="1" fontSize="11px" fontWeight="700" color={t.textMuted} textTransform="uppercase" letterSpacing="0.1em">
            Tên mục menu
          </Text>
          <Text fontSize="11px" fontWeight="700" color={t.textMuted} textTransform="uppercase" letterSpacing="0.1em"
            display={{ base: "none", lg: "block" }} minW="160px">
            Đường dẫn
          </Text>
          <Box w="80px" />
          <Text fontSize="11px" fontWeight="700" color={t.textMuted} textTransform="uppercase" letterSpacing="0.1em">
            Hiển thị
          </Text>
          <Box w="72px" />
        </Flex>

        {/* Rows */}
        {filtered.length === 0 ? (
          <Flex direction="column" align="center" justify="center" py="60px" gap="12px">
            <Icon as={MdSearch} boxSize="40px" color={t.textMuted} opacity={0.3} />
            <Text color={t.textMuted} fontSize="sm">Không tìm thấy mục menu nào</Text>
          </Flex>
        ) : (
          filtered.map((item, idx) => (
            <MenuRow
              key={item.id}
              item={item}
              index={idx}
              total={filtered.length}
              editingId={editingId}
              onEdit={(id) => setEditingId(prev => prev === id ? null : id)}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => setEditingId(null)}
              onToggle={handleToggle}
              onToggleChild={handleToggleChild}
              onDelete={handleDelete}
              t={t}
            />
          ))
        )}

        {/* Footer */}
        <Flex
          align="center" justify="space-between"
          px="20px" py="12px"
          bg={useColorModeValue("gray.50", "rgba(255,255,255,0.02)")}
          borderTop="1px solid"
          borderColor={t.divider}
          flexWrap="wrap"
          gap="8px"
        >
          <Text fontSize="xs" color={t.textMuted}>
            Hiển thị <Text as="span" fontWeight="700" color={t.textPrimary}>{filtered.length}</Text> / {items.length} mục menu
          </Text>
          <Flex align="center" gap="6px">
            <Icon as={MdWarning} boxSize="13px" color="#f59e0b" />
            <Text fontSize="xs" color={t.textMuted}>
              Kéo thả để thay đổi thứ tự hiển thị
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* ── PREVIEW HINT ── */}
      <Box
        mt="20px"
        bg={t.cardBg}
        border="1px solid"
        borderColor={t.cardBorder}
        borderRadius="16px"
        p="16px"
        boxShadow={t.shadow}
      >
        <Flex align="center" gap="10px" mb="14px">
          <Flex w="32px" h="32px" borderRadius="9px" bg={t.accentLight} border={`1px solid ${t.accentBorder}`}
            align="center" justify="center">
            <Icon as={MdMenu} boxSize="16px" color={t.accent} />
          </Flex>
          <Box>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>Xem trước menu website</Text>
            <Text fontSize="xs" color={t.textMuted}>Menu hiển thị theo thứ tự hiện tại</Text>
          </Box>
        </Flex>

        <Flex
          align="center"
          gap="4px"
          flexWrap="wrap"
          bg={useColorModeValue("gray.50", "rgba(255,255,255,0.03)")}
          border="1px solid"
          borderColor={t.cardBorder}
          borderRadius="12px"
          px="16px" py="12px"
        >
          {items
            .filter(i => i.visible)
            .sort((a, b) => a.order - b.order)
            .map((item, idx, arr) => {
              const IconComp = ICON_MAP[item.icon] || MdMenu;
              return (
                <React.Fragment key={item.id}>
                  <Flex align="center" gap="6px" py="4px" px="8px" borderRadius="8px"
                    _hover={{ bg: t.accentLight }} cursor="pointer" transition="background 0.15s">
                    <Icon as={IconComp} boxSize="14px" color={t.accent} />
                    <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>{item.label}</Text>
                    {item.badge && <MenuBadge badge={item.badge} t={t} />}
                    {item.children.filter(c => c.visible).length > 0 && (
                      <Icon as={MdExpandMore} boxSize="14px" color={t.textMuted} />
                    )}
                  </Flex>
                  {idx < arr.length - 1 && (
                    <Box w="1px" h="16px" bg={t.divider} />
                  )}
                </React.Fragment>
              );
            })}
        </Flex>
      </Box>
    </Box>
  );
}