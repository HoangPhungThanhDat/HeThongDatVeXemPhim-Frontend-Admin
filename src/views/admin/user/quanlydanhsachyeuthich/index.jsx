import React, { useState, useMemo } from "react";
import {
  Box, Grid, Text, Button, Flex, SimpleGrid, Icon, keyframes, Input, Select,
} from "@chakra-ui/react";
import {
  MdSearch, MdFilterList, MdArrowBack, MdFavorite, MdPerson,
  MdEmail, MdPhone, MdBarChart, MdTrendingUp, MdCalendarToday,
  MdVisibility, MdStar, MdAccessTime, MdMovieFilter, MdLocalMovies,
} from "react-icons/md";
import {
  FaHeart, FaFire, FaUsers, FaFilm, FaCrown, FaTrophy,
  FaEye, FaChartBar, FaRegHeart, FaCoins,
} from "react-icons/fa";
import { GiLaurelCrown, GiDiamondRing, GiMedal } from "react-icons/gi";
import Card from "components/card/Card";

// ─── Keyframes ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  14%  { transform: scale(1.2); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.15); }
  70%  { transform: scale(1); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const slideRight = keyframes`
  from { transform: scaleX(0); transform-origin: left; }
  to   { transform: scaleX(1); transform-origin: left; }
`;

// ─── Rank config (matching member page) ────────────────────────────────────
const RANK_CONFIG = {
  "Đồng":       { color: "#92400e", bg: "#fef3c7", border: "#f59e0b", text: "#78350f", icon: GiMedal,       dot: "#d97706" },
  "Bạc":        { color: "#374151", bg: "#f1f5f9", border: "#94a3b8", text: "#1e293b", icon: GiMedal,       dot: "#64748b" },
  "Vàng":       { color: "#92400e", bg: "#fffbeb", border: "#d97706", text: "#78350f", icon: FaCrown,       dot: "#f59e0b" },
  "Kim cương":  { color: "#1e40af", bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a", icon: GiDiamondRing, dot: "#2563eb" },
};

// ─── Genre color map ────────────────────────────────────────────────────────
const GENRE_COLOR = {
  "Hành động":            { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626" },
  "Khoa học viễn tưởng":  { bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8" },
  "Tình cảm":             { bg: "#fdf2f8", border: "#f0abfc", text: "#a21caf" },
  "Hoạt hình":            { bg: "#fff7ed", border: "#fdba74", text: "#c2410c" },
  "Kinh dị":              { bg: "#1a1a2e", border: "#6b21a8", text: "#c4b5fd" },
  "Hài hước":             { bg: "#f0fdf4", border: "#86efac", text: "#15803d" },
  "Phiêu lưu":            { bg: "#fffbeb", border: "#fcd34d", text: "#b45309" },
  "Tâm lý":               { bg: "#f5f3ff", border: "#c4b5fd", text: "#6d28d9" },
};

// ─── Static data ─────────────────────────────────────────────────────────────
const MOVIES_CATALOG = [
  { id: 1,  title: "Avengers: Infinity War",               genre: "Hành động",           rating: 4.8, poster: "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",              duration: 149, year: 2018 },
  { id: 2,  title: "Spider-Man: No Way Home",              genre: "Hành động",           rating: 4.9, poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_official_poster.jpg",     duration: 148, year: 2021 },
  { id: 3,  title: "Doctor Strange 2",                     genre: "Khoa học viễn tưởng", rating: 4.2, poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg", duration: 126, year: 2022 },
  { id: 4,  title: "Thor: Love and Thunder",               genre: "Hành động",           rating: 3.9, poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/Thor_Love_and_Thunder_poster.jpg",             duration: 119, year: 2022 },
  { id: 5,  title: "Black Panther: Wakanda Forever",       genre: "Hành động",           rating: 4.5, poster: "https://upload.wikimedia.org/wikipedia/en/2/2c/Black_Panther_Wakanda_Forever_poster.jpg",      duration: 161, year: 2022 },
  { id: 6,  title: "The Batman",                           genre: "Hành động",           rating: 4.6, poster: "https://upload.wikimedia.org/wikipedia/en/b/b0/The_Batman_%28film%29_poster.jpg",              duration: 176, year: 2022 },
  { id: 7,  title: "Top Gun: Maverick",                    genre: "Hành động",           rating: 4.7, poster: "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",                  duration: 130, year: 2022 },
  { id: 8,  title: "Everything Everywhere All at Once",    genre: "Khoa học viễn tưởng", rating: 4.8, poster: "https://upload.wikimedia.org/wikipedia/en/b/b3/Everything_Everywhere_All_at_Once_poster.jpg", duration: 139, year: 2022 },
];

const USERS = [
  {
    id: 1, name: "Nguyễn Minh Khoa",  email: "minhkhoa@gmail.com",        phone: "0912 345 678", avatar: "NK", rank: "Kim cương",
    favorites: [1, 2, 5, 7], addedDates: { 1: "22/03/2026", 2: "15/02/2026", 5: "10/01/2026", 7: "05/04/2026" },
    totalTickets: 84, totalSpend: 4200000,
  },
  {
    id: 2, name: "Trần Thị Lan Anh",  email: "lananh.tran@outlook.com",   phone: "0987 654 321", avatar: "LA", rank: "Vàng",
    favorites: [2, 3, 8],    addedDates: { 2: "18/04/2026", 3: "01/03/2026", 8: "12/04/2026" },
    totalTickets: 37, totalSpend: 1850000,
  },
  {
    id: 3, name: "Phạm Đức Hùng",     email: "duchung99@gmail.com",        phone: "0356 789 012", avatar: "DH", rank: "Bạc",
    favorites: [1, 4, 6],    addedDates: { 1: "05/05/2026", 4: "20/04/2026", 6: "02/05/2026" },
    totalTickets: 12, totalSpend: 620000,
  },
  {
    id: 4, name: "Lê Hoàng Vy",        email: "hoangvy.le@gmail.com",       phone: "0777 234 567", avatar: "HV", rank: "Đồng",
    favorites: [2, 7],        addedDates: { 2: "10/05/2026", 7: "18/05/2026" },
    totalTickets: 3, totalSpend: 180000,
  },
  {
    id: 5, name: "Bùi Thanh Tùng",    email: "tungthanh.bui@yahoo.com",    phone: "0909 876 543", avatar: "TT", rank: "Vàng",
    favorites: [1, 2, 3, 7, 8], addedDates: { 1: "08/01/2026", 2: "22/02/2026", 3: "15/03/2026", 7: "10/04/2026", 8: "20/05/2026" },
    totalTickets: 34, totalSpend: 1700000,
  },
  {
    id: 6, name: "Vũ Thị Mai",         email: "vutmai@gmail.com",           phone: "0888 111 222", avatar: "VM", rank: "Kim cương",
    favorites: [5, 6, 7, 8],  addedDates: { 5: "01/04/2026", 6: "05/04/2026", 7: "12/04/2026", 8: "22/05/2026" },
    totalTickets: 61, totalSpend: 3100000,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getMovieById(id) { return MOVIES_CATALOG.find((m) => m.id === id); }

function computeMovieStats() {
  const stats = {};
  MOVIES_CATALOG.forEach((m) => { stats[m.id] = { count: 0, userIds: [] }; });
  USERS.forEach((u) => {
    u.favorites.forEach((fid) => {
      if (stats[fid]) { stats[fid].count++; stats[fid].userIds.push(u.id); }
    });
  });
  return stats;
}
const MOVIE_STATS = computeMovieStats();

// ─── Small Badges ─────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  const cfg = RANK_CONFIG[rank] || RANK_CONFIG["Đồng"];
  const Ic = cfg.icon;
  return (
    <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="7px"
      bg={cfg.bg} border={`1.5px solid ${cfg.border}`} display="inline-flex"
    >
      <Icon as={Ic} boxSize="10px" color={cfg.dot} />
      <Text fontSize="10px" fontWeight="800" color={cfg.text}>{rank}</Text>
    </Flex>
  );
}

function GenreBadge({ genre }) {
  const cfg = GENRE_COLOR[genre] || { bg: "#f1f5f9", border: "#e2e8f0", text: "#475569" };
  return (
    <Box px="7px" py="2px" borderRadius="5px" bg={cfg.bg} border={`1px solid ${cfg.border}`}>
      <Text fontSize="10px" fontWeight="700" color={cfg.text}>{genre}</Text>
    </Box>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ label }) {
  return (
    <Box mb="14px">
      <Flex align="center" gap="8px">
        <Box w="3px" h="14px" borderRadius="full" bg="linear-gradient(180deg, #f97316, #fbbf24)" />
        <Text fontSize="10.5px" fontWeight="800" color="#374151" letterSpacing="1.2px" textTransform="uppercase">
          {label}
        </Text>
      </Flex>
      <Box mt="7px" h="1px" bg="linear-gradient(90deg, #f1f5f9, transparent)" />
    </Box>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, delay = 0 }) {
  return (
    <Box p="18px 20px" borderRadius="14px" bg="white"
      border="1px solid #f1f5f9" boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      sx={{ animation: `${fadeUp} 0.4s ease ${delay}s both` }}
      transition="all 0.25s"
      _hover={{ boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="11px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">{label}</Text>
          <Text fontSize="28px" fontWeight="900" color="#0f172a" lineHeight="1">{value}</Text>
          {sub && <Text fontSize="11px" color="#94a3b8" mt="3px">{sub}</Text>}
        </Box>
        <Box w="44px" h="44px" borderRadius="13px" bg={`${accent}18`}
          display="flex" alignItems="center" justifyContent="center"
          boxShadow={`0 4px 12px ${accent}22`}
        >
          <Icon as={icon} boxSize="20px" color={accent} />
        </Box>
      </Flex>
    </Box>
  );
}

// ─── User Avatar ─────────────────────────────────────────────────────────────
function UserAvatar({ user, size = "md" }) {
  const cfg = RANK_CONFIG[user.rank] || RANK_CONFIG["Đồng"];
  const s = { sm: "32px", md: "40px", lg: "52px" }[size];
  const f = { sm: "10px", md: "13px", lg: "16px" }[size];
  return (
    <Box w={s} h={s} borderRadius="50%" flexShrink="0"
      bg={cfg.bg} border={`2px solid ${cfg.border}`}
      display="flex" alignItems="center" justifyContent="center"
      boxShadow={`0 0 0 3px ${cfg.border}44`}
    >
      <Text fontSize={f} fontWeight="900" color={cfg.text}>{user.avatar}</Text>
    </Box>
  );
}

// ─── Top Movie Chart (analytics) ─────────────────────────────────────────────
function TopMoviesChart() {
  const sorted = MOVIES_CATALOG
    .map((m) => ({ ...m, count: MOVIE_STATS[m.id]?.count || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const maxCount = sorted[0]?.count || 1;

  return (
    <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="20px"
      sx={{ animation: `${fadeUp} 0.4s ease 0.2s both` }}
    >
      <SectionTitle label="Top phim được yêu thích nhất" />
      <Flex direction="column" gap="10px">
        {sorted.map((movie, i) => {
          const pct = Math.round((movie.count / maxCount) * 100);
          const medals = ["🥇", "🥈", "🥉"];
          return (
            <Box key={movie.id}>
              <Flex align="center" gap="10px" mb="5px">
                <Text fontSize="14px" w="20px" textAlign="center">{medals[i] || `${i + 1}.`}</Text>
                <Box w="36px" h="50px" borderRadius="7px" overflow="hidden" flexShrink="0">
                  <img src={movie.poster} alt={movie.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
                <Box flex="1" minW="0">
                  <Text fontSize="12.5px" fontWeight="700" color="#0f172a" noOfLines={1}>{movie.title}</Text>
                  <Flex align="center" gap="6px" mt="2px">
                    <GenreBadge genre={movie.genre} />
                    <Flex align="center" gap="3px">
                      <Icon as={MdStar} boxSize="10px" color="#f59e0b" />
                      <Text fontSize="10px" fontWeight="700" color="#64748b">{movie.rating}</Text>
                    </Flex>
                  </Flex>
                </Box>
                <Flex align="center" gap="4px" flexShrink="0">
                  <Icon as={FaHeart} boxSize="11px" color="#f97316" />
                  <Text fontSize="13px" fontWeight="800" color="#f97316">{movie.count}</Text>
                  <Text fontSize="10px" color="#94a3b8">người</Text>
                </Flex>
              </Flex>
              <Box ml="30px" h="5px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
                <Box
                  h="100%" borderRadius="full"
                  w={`${pct}%`}
                  bg={i === 0
                    ? "linear-gradient(90deg, #f97316, #fbbf24)"
                    : i === 1
                    ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
                    : i === 2
                    ? "linear-gradient(90deg, #d97706, #fcd34d)"
                    : "linear-gradient(90deg, #e2e8f0, #f1f5f9)"}
                  sx={{ animation: `${slideRight} 0.8s ease ${i * 0.1}s both` }}
                />
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

// ─── Genre Distribution ────────────────────────────────────────────────────────
function GenreDistribution() {
  const genreCount = {};
  USERS.forEach((u) => {
    u.favorites.forEach((fid) => {
      const movie = getMovieById(fid);
      if (movie) genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
    });
  });
  const total = Object.values(genreCount).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

  return (
    <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)" p="20px"
      sx={{ animation: `${fadeUp} 0.4s ease 0.25s both` }}
    >
      <SectionTitle label="Phân bổ theo thể loại" />
      <Flex direction="column" gap="9px">
        {sorted.map(([genre, count], i) => {
          const pct = Math.round((count / total) * 100);
          const cfg = GENRE_COLOR[genre] || { bg: "#f1f5f9", border: "#e2e8f0", text: "#475569" };
          return (
            <Flex key={genre} align="center" gap="10px">
              <Box w="80px" flexShrink="0">
                <GenreBadge genre={genre} />
              </Box>
              <Box flex="1" h="6px" borderRadius="full" bg="#f1f5f9" overflow="hidden">
                <Box
                  h="100%" borderRadius="full" w={`${pct}%`}
                  bg={cfg.text}
                  opacity="0.7"
                  sx={{ animation: `${slideRight} 0.7s ease ${i * 0.08}s both` }}
                />
              </Box>
              <Text fontSize="11px" fontWeight="800" color="#0f172a" w="30px" textAlign="right">
                {pct}%
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}

// ─── User Row (list) ─────────────────────────────────────────────────────────
function UserRow({ user, index, onView }) {
  const topMovies = user.favorites.slice(0, 3).map(getMovieById).filter(Boolean);
  return (
    <>
      {/* Mobile */}
      <Box display={{ base: "block", md: "none" }}
        p="14px" borderRadius="14px" bg="white" border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 14px rgba(249,115,22,0.1)" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex gap="12px" align="flex-start" mb="10px">
          <UserAvatar user={user} size="md" />
          <Box flex="1" minW="0">
            <Text fontSize="14px" fontWeight="800" color="#0f172a" noOfLines={1} mb="4px">
              {user.name}
            </Text>
            <Flex gap="5px" flexWrap="wrap" mb="6px">
              <RankBadge rank={user.rank} />
              <Flex align="center" gap="4px" px="8px" py="3px" borderRadius="6px"
                bg="#fff7ed" border="1px solid #fed7aa"
              >
                <Icon as={FaHeart} boxSize="9px" color="#f97316" />
                <Text fontSize="10px" fontWeight="700" color="#f97316">
                  {user.favorites.length} phim yêu thích
                </Text>
              </Flex>
            </Flex>
            {/* Poster strip */}
            <Flex gap="5px">
              {topMovies.map((m) => (
                <Box key={m.id} w="32px" h="44px" borderRadius="5px" overflow="hidden"
                  border="1px solid #f1f5f9" flexShrink="0"
                >
                  <img src={m.poster} alt={m.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
              {user.favorites.length > 3 && (
                <Flex w="32px" h="44px" borderRadius="5px" bg="#f8fafc"
                  border="1px solid #e2e8f0" align="center" justify="center" flexShrink="0"
                >
                  <Text fontSize="9px" fontWeight="800" color="#94a3b8">+{user.favorites.length - 3}</Text>
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
        <Button w="100%" size="sm" h="36px" borderRadius="9px"
          bg="linear-gradient(135deg, #f97316, #fb923c)"
          color="white" fontSize="12px" fontWeight="700"
          leftIcon={<Icon as={MdVisibility} boxSize="13px" />}
          _hover={{ opacity: 0.88 }} boxShadow="0 2px 8px rgba(249,115,22,0.25)"
          onClick={() => onView(user)}
        >Xem chi tiết</Button>
      </Box>

      {/* Desktop */}
      <Box display={{ base: "none", md: "block" }}
        p="13px 18px" borderRadius="12px" bg="white" border="1.5px solid #f1f5f9"
        transition="all 0.2s"
        _hover={{ border: "1.5px solid #f97316", boxShadow: "0 2px 12px rgba(249,115,22,0.08)", bg: "#fffbf7" }}
        sx={{ animation: `${fadeUp} 0.35s ease ${index * 0.05}s both` }}
      >
        <Flex align="center" gap="0">
          <Box w="32px" flexShrink="0">
            <Text fontSize="12px" fontWeight="700" color="#cbd5e1">{String(index + 1).padStart(2, "0")}</Text>
          </Box>
          <Box mr="12px" flexShrink="0">
            <UserAvatar user={user} size="md" />
          </Box>
          <Box flex="1.8" minW="0" pr="12px">
            <Text fontSize="13.5px" fontWeight="800" color="#0f172a" noOfLines={1}>{user.name}</Text>
            <Text fontSize="11px" color="#94a3b8" noOfLines={1}>{user.email}</Text>
          </Box>
          <Box flex="0.7" minW="0" pr="12px">
            <RankBadge rank={user.rank} />
          </Box>
          {/* Poster strip */}
          <Box flex="2" minW="0" pr="12px">
            <Flex gap="5px" align="center">
              {topMovies.map((m) => (
                <Box key={m.id} w="30px" h="42px" borderRadius="5px" overflow="hidden"
                  border="1px solid #f1f5f9" flexShrink="0"
                  title={m.title}
                  transition="transform 0.15s"
                  _hover={{ transform: "scale(1.1)", zIndex: 1 }}
                >
                  <img src={m.poster} alt={m.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
              {user.favorites.length > 3 && (
                <Flex w="30px" h="42px" borderRadius="5px" bg="#f8fafc"
                  border="1px solid #e2e8f0" align="center" justify="center" flexShrink="0"
                >
                  <Text fontSize="9px" fontWeight="800" color="#64748b">
                    +{user.favorites.length - 3}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>
          <Box flex="0.6" minW="0" pr="12px">
            <Flex align="center" gap="5px">
              <Icon as={FaHeart} boxSize="11px" color="#f97316" />
              <Text fontSize="14px" fontWeight="900" color="#f97316">{user.favorites.length}</Text>
            </Flex>
            <Text fontSize="10px" color="#94a3b8">phim</Text>
          </Box>
          <Button size="xs" h="30px" px="14px" borderRadius="8px" flexShrink="0"
            bg="linear-gradient(135deg, #f97316, #fb923c)"
            color="white" fontSize="11.5px" fontWeight="700"
            leftIcon={<Icon as={FaEye} boxSize="11px" />}
            _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
            boxShadow="0 2px 8px rgba(249,115,22,0.25)" transition="all 0.15s"
            onClick={() => onView(user)}
          >Xem</Button>
        </Flex>
      </Box>
    </>
  );
}

// ─── User Detail (favorites list) ────────────────────────────────────────────
function UserDetail({ user, onBack }) {
  const favoriteMovies = user.favorites.map((fid) => ({
    movie: getMovieById(fid),
    addedDate: user.addedDates[fid] || "—",
  })).filter((x) => x.movie);

  const genreDist = {};
  favoriteMovies.forEach(({ movie }) => {
    genreDist[movie.genre] = (genreDist[movie.genre] || 0) + 1;
  });
  const topGenre = Object.entries(genreDist).sort((a, b) => b[1] - a[1])[0];
  const avgRating = favoriteMovies.length
    ? (favoriteMovies.reduce((s, { movie }) => s + movie.rating, 0) / favoriteMovies.length).toFixed(1)
    : "—";

  return (
    <Box sx={{ animation: `${fadeIn} 0.3s ease both` }}>
      {/* Header */}
      <Flex align="center" justify="space-between" mb="18px" gap="10px" flexWrap="wrap">
        <Button leftIcon={<Icon as={MdArrowBack} />} variant="ghost"
          color="#64748b" borderRadius="10px" h="38px" fontSize="13px" fontWeight="600"
          border="1.5px solid #e2e8f0" _hover={{ bg: "#f8fafc" }} onClick={onBack}
        >Quay lại</Button>
        <Flex align="center" gap="6px" px="12px" py="6px" borderRadius="9px"
          bg="#fff7ed" border="1px solid #fed7aa"
        >
          <Icon as={MdVisibility} boxSize="13px" color="#f97316" />
          <Text fontSize="12px" fontWeight="700" color="#92400e">Chỉ xem — không chỉnh sửa</Text>
        </Flex>
      </Flex>

      {/* Hero */}
      <Box bg="white" borderRadius="20px" border="1px solid #f1f5f9"
        boxShadow="0 4px 24px rgba(0,0,0,0.07)" overflow="hidden" mb="16px"
      >
        <Box h="4px" bg="linear-gradient(90deg, #f97316, #fbbf24, #f97316)"
          bgSize="200%" sx={{ animation: `${shimmer} 3s linear infinite` }}
        />
        <Box p={{ base: "20px", md: "26px" }}>
          <Flex gap="18px" align="flex-start" direction={{ base: "column", sm: "row" }}>
            <Box position="relative" flexShrink="0">
              <UserAvatar user={user} size="lg" />
              <Box
                position="absolute" bottom="-4px" right="-4px"
                w="22px" h="22px" borderRadius="50%" bg="#fff7ed"
                border="2px solid #fed7aa" display="flex" alignItems="center" justifyContent="center"
                sx={{ animation: `${heartbeat} 2.5s ease infinite` }}
              >
                <Icon as={FaHeart} boxSize="10px" color="#f97316" />
              </Box>
            </Box>
            <Box flex="1">
              <Flex align="center" gap="10px" mb="8px" flexWrap="wrap">
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="900" color="#0f172a"
                  letterSpacing="-0.4px">
                  {user.name}
                </Text>
                <RankBadge rank={user.rank} />
              </Flex>
              <Flex gap="14px" flexWrap="wrap">
                <Flex align="center" gap="5px">
                  <Icon as={MdEmail} boxSize="12px" color="#94a3b8" />
                  <Text fontSize="12.5px" color="#64748b">{user.email}</Text>
                </Flex>
                <Flex align="center" gap="5px">
                  <Icon as={MdPhone} boxSize="12px" color="#94a3b8" />
                  <Text fontSize="12.5px" color="#64748b">{user.phone}</Text>
                </Flex>
              </Flex>
            </Box>
            {/* Favorites count callout */}
            <Box p="14px 18px" borderRadius="14px"
              bg="linear-gradient(135deg, #fff7ed, #fffbf7)"
              border="1.5px solid #fed7aa" flexShrink="0" textAlign="center"
              boxShadow="0 4px 16px rgba(249,115,22,0.12)"
            >
              <Icon as={FaHeart} boxSize="18px" color="#f97316" mb="4px"
                sx={{ animation: `${heartbeat} 2.5s ease infinite` }}
              />
              <Text fontSize="28px" fontWeight="900" color="#f97316" lineHeight="1">
                {user.favorites.length}
              </Text>
              <Text fontSize="10px" fontWeight="700" color="#92400e"
                letterSpacing="0.8px" textTransform="uppercase" mt="2px">
                Phim yêu thích
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Quick stats */}
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing="12px" mb="16px">
        <Box p="14px 18px" borderRadius="14px" bg="white" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.05)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.05s both` }}
        >
          <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">Thể loại yêu thích</Text>
          <Text fontSize="17px" fontWeight="900" color="#f97316" lineHeight="1.2">
            {topGenre ? topGenre[0] : "—"}
          </Text>
          {topGenre && (
            <Text fontSize="11px" color="#94a3b8" mt="2px">{topGenre[1]} phim</Text>
          )}
        </Box>
        <Box p="14px 18px" borderRadius="14px" bg="white" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.05)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.1s both` }}
        >
          <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">Rating TB</Text>
          <Flex align="center" gap="5px">
            <Icon as={MdStar} boxSize="18px" color="#f59e0b" />
            <Text fontSize="22px" fontWeight="900" color="#0f172a" lineHeight="1">{avgRating}</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt="2px">trên {user.favorites.length} phim</Text>
        </Box>
        <Box p="14px 18px" borderRadius="14px" bg="white" border="1px solid #f1f5f9"
          boxShadow="0 1px 4px rgba(0,0,0,0.05)"
          sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
        >
          <Text fontSize="10px" fontWeight="700" color="#94a3b8" letterSpacing="0.8px"
            textTransform="uppercase" mb="4px">Vé đã mua</Text>
          <Text fontSize="22px" fontWeight="900" color="#10b981" lineHeight="1">{user.totalTickets}</Text>
          <Text fontSize="11px" color="#94a3b8" mt="2px">
            {((user.totalSpend) / 1000000).toFixed(2)}M đã chi tiêu
          </Text>
        </Box>
      </SimpleGrid>

      {/* Favorite movies list */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)" overflow="hidden"
        sx={{ animation: `${fadeUp} 0.4s ease 0.2s both` }}
      >
        <Box p="18px 20px 12px" borderBottom="1px solid #f8fafc">
          <SectionTitle label={`Danh sách ${user.favorites.length} phim yêu thích`} />
        </Box>

        {/* Desktop headers */}
        <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          display={{ base: "none", md: "flex" }}
        >
          <Box w="40px" mr="14px" flexShrink="0" />
          <Box flex="2.5">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
              Phim
            </Text>
          </Box>
          <Box flex="1">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Thể loại</Text>
          </Box>
          <Box flex="0.7">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Rating</Text>
          </Box>
          <Box flex="0.7">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Thời lượng</Text>
          </Box>
          <Box flex="0.8">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Ngày thêm</Text>
          </Box>
        </Flex>

        <Box p="10px">
          <Flex direction="column" gap="8px">
            {favoriteMovies.map(({ movie, addedDate }, i) => (
              <>
                {/* Mobile */}
                <Box key={`m-${movie.id}`}
                  display={{ base: "block", md: "none" }}
                  p="12px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9"
                  sx={{ animation: `${fadeUp} 0.3s ease ${i * 0.04}s both` }}
                >
                  <Flex gap="10px">
                    <Box w="40px" h="56px" borderRadius="7px" overflow="hidden" flexShrink="0">
                      <img src={movie.poster} alt={movie.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                    <Box flex="1" minW="0">
                      <Text fontSize="13px" fontWeight="800" color="#0f172a" noOfLines={2} mb="5px">
                        {movie.title}
                      </Text>
                      <Flex gap="6px" flexWrap="wrap" mb="4px">
                        <GenreBadge genre={movie.genre} />
                        <Flex align="center" gap="3px">
                          <Icon as={MdStar} boxSize="10px" color="#f59e0b" />
                          <Text fontSize="10px" fontWeight="700" color="#64748b">{movie.rating}</Text>
                        </Flex>
                        <Flex align="center" gap="3px">
                          <Icon as={MdAccessTime} boxSize="10px" color="#94a3b8" />
                          <Text fontSize="10px" color="#94a3b8">{movie.duration}p</Text>
                        </Flex>
                      </Flex>
                      <Flex align="center" gap="4px">
                        <Icon as={FaHeart} boxSize="9px" color="#f97316" />
                        <Text fontSize="10px" color="#94a3b8">Thêm: {addedDate}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                {/* Desktop */}
                <Box key={`d-${movie.id}`}
                  display={{ base: "none", md: "block" }}
                  p="10px 18px" borderRadius="10px" bg="#f8fafc" border="1px solid #f1f5f9"
                  transition="all 0.15s"
                  _hover={{ bg: "#fff7ed", border: "1px solid #fed7aa" }}
                  sx={{ animation: `${fadeUp} 0.3s ease ${i * 0.04}s both` }}
                >
                  <Flex align="center" gap="0">
                    <Box w="40px" h="54px" borderRadius="7px" overflow="hidden" flexShrink="0" mr="14px">
                      <img src={movie.poster} alt={movie.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                    <Box flex="2.5" minW="0" pr="12px">
                      <Text fontSize="13px" fontWeight="800" color="#0f172a" noOfLines={1}>{movie.title}</Text>
                      <Text fontSize="11px" color="#94a3b8">{movie.year}</Text>
                    </Box>
                    <Box flex="1" minW="0" pr="12px">
                      <GenreBadge genre={movie.genre} />
                    </Box>
                    <Box flex="0.7" minW="0" pr="12px">
                      <Flex align="center" gap="4px">
                        <Icon as={MdStar} boxSize="12px" color="#f59e0b" />
                        <Text fontSize="12.5px" fontWeight="800" color="#0f172a">{movie.rating}</Text>
                      </Flex>
                    </Box>
                    <Box flex="0.7" minW="0" pr="12px">
                      <Flex align="center" gap="4px">
                        <Icon as={MdAccessTime} boxSize="11px" color="#94a3b8" />
                        <Text fontSize="12px" color="#475569" fontWeight="600">{movie.duration} phút</Text>
                      </Flex>
                    </Box>
                    <Box flex="0.8" minW="0">
                      <Flex align="center" gap="4px">
                        <Icon as={FaHeart} boxSize="10px" color="#f97316" />
                        <Text fontSize="12px" fontWeight="600" color="#64748b">{addedDate}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function QuanlyYeuThich() {
  const [view, setView]             = useState("list");
  const [selectedUser, setSelected] = useState(null);
  const [search, setSearch]         = useState("");
  const [filterRank, setFilterRank] = useState("Tất cả");
  const [showFilter, setShowFilter] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q)
      || u.phone.includes(q);
    const matchRank = filterRank === "Tất cả" || u.rank === filterRank;
    return matchSearch && matchRank;
  });

  const totalFavorites = USERS.reduce((s, u) => s + u.favorites.length, 0);
  const avgPerUser     = (totalFavorites / USERS.length).toFixed(1);
  const topMovie       = MOVIES_CATALOG.reduce((best, m) =>
    (MOVIE_STATS[m.id]?.count || 0) > (MOVIE_STATS[best.id]?.count || 0) ? m : best
  );

  if (view === "detail" && selectedUser) {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <UserDetail user={selectedUser} onBack={() => setView("list")} />
      </Box>
    );
  }

  return (
    <Box pt={{ base: "100px", md: "80px" }}>
      {/* Header */}
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }} mb="18px" gap="12px"
      >
        <Box sx={{ animation: `${fadeUp} 0.4s ease both` }}>
          <Flex align="center" gap="10px" mb="4px">
            <Box w="40px" h="40px" borderRadius="12px"
              bg="linear-gradient(135deg, #f97316, #fb923c)"
              display="flex" alignItems="center" justifyContent="center"
              boxShadow="0 6px 16px rgba(249,115,22,0.4)"
            >
              <Icon as={FaHeart} boxSize="18px" color="white"
                sx={{ animation: `${heartbeat} 2.5s ease infinite` }}
              />
            </Box>
            <Text fontSize={{ base: "22px", md: "26px" }} fontWeight="900" color="#0f172a"
              letterSpacing="-0.5px">
              Danh sách yêu thích
            </Text>
          </Flex>
          <Text color="#94a3b8" fontSize="13px" pl="50px">
            Phân tích hành vi xem phim — chỉ đọc, không chỉnh sửa
          </Text>
        </Box>

        <Flex gap="8px" sx={{ animation: `${fadeIn} 0.4s ease 0.1s both` }}>
          <Button h="38px" px="16px" borderRadius="10px" fontWeight="600" fontSize="13px"
            bg={showAnalytics ? "#fff7ed" : "#f8fafc"}
            color={showAnalytics ? "#f97316" : "#64748b"}
            border={showAnalytics ? "1.5px solid #fed7aa" : "1.5px solid #e2e8f0"}
            leftIcon={<Icon as={FaChartBar} boxSize="13px" />}
            _hover={{ opacity: 0.88 }} transition="all 0.2s"
            onClick={() => setShowAnalytics((v) => !v)}
          >Phân tích</Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing="12px" mb="18px">
        <StatCard label="Tổng người dùng" value={USERS.length}    icon={FaUsers}    accent="#f97316" delay={0}    />
        <StatCard label="Tổng lượt yêu thích" value={totalFavorites} icon={FaHeart} accent="#ef4444" delay={0.05} sub="lần thêm" />
        <StatCard label="TB mỗi người" value={avgPerUser}           icon={FaFilm}    accent="#f59e0b" delay={0.1}  sub="phim/người" />
        <StatCard label="Phim hot nhất" value={MOVIE_STATS[topMovie.id]?.count || 0}
          icon={FaFire} accent="#10b981" delay={0.15} sub={topMovie.title} />
      </SimpleGrid>

      {/* Analytics panels */}
      {showAnalytics && (
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="14px" mb="18px"
          sx={{ animation: `${scaleIn} 0.3s ease both` }}
        >
          <TopMoviesChart />
          <GenreDistribution />
        </Grid>
      )}

      {/* Readonly notice */}
      <Box mb="14px" p="10px 16px" borderRadius="10px"
        bg="#fffbeb" border="1px solid #fcd34d"
        display="flex" alignItems="center" gap="8px"
      >
        <Icon as={MdVisibility} boxSize="15px" color="#b45309" flexShrink="0" />
        <Text fontSize="12px" fontWeight="600" color="#92400e">
          Trang này chỉ dành cho phân tích hành vi khách hàng. Back-office không được chỉnh sửa danh sách yêu thích của người dùng.
        </Text>
      </Box>

      {/* Table card */}
      <Box bg="white" borderRadius="16px" border="1px solid #f1f5f9"
        boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        sx={{ animation: `${fadeUp} 0.4s ease 0.15s both` }}
      >
        <Box p={{ base: "14px 16px", md: "18px 20px 14px" }} borderBottom="1px solid #f8fafc">
          <Flex align="center" justify="space-between" mb="12px">
            <Flex align="center" gap="8px">
              <Text fontWeight="800" fontSize="15px" color="#0f172a">Khách hàng</Text>
              <Box px="8px" py="2px" borderRadius="6px" bg="#fff7ed" border="1px solid #fed7aa">
                <Text fontSize="11px" fontWeight="700" color="#f97316">{filtered.length} người dùng</Text>
              </Box>
            </Flex>
            <Button display={{ base: "flex", md: "none" }}
              size="sm" h="34px" px="12px" borderRadius="9px"
              bg="#f8fafc" color="#64748b" border="1px solid #e2e8f0"
              fontSize="12px" fontWeight="600"
              leftIcon={<Icon as={MdFilterList} boxSize="13px" />}
              _hover={{ bg: "#f1f5f9" }}
              onClick={() => setShowFilter((v) => !v)}
            >Lọc</Button>
          </Flex>

          <Box display={{ base: showFilter ? "block" : "none", md: "block" }}>
            <Flex gap="10px" direction={{ base: "column", sm: "row" }}>
              <Box position="relative" flex="1" w={{ base: "100%", sm: "auto" }}>
                <Icon as={MdSearch} position="absolute" left="10px" top="50%"
                  transform="translateY(-50%)" boxSize="14px" color="#94a3b8" zIndex="1" />
                <Input pl="30px" h="36px" w="100%" fontSize="12.5px" fontWeight="500"
                  placeholder="Tìm tên, email, SĐT..."
                  bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px" color="#374151"
                  _placeholder={{ color: "#b0bac8" }}
                  _focus={{ border: "1.5px solid #f97316", boxShadow: "0 0 0 3px rgba(249,115,22,0.08)", bg: "#fff" }}
                  _hover={{ border: "1px solid #f97316" }}
                  transition="all 0.2s"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <Select h="36px" fontSize="12.5px" fontWeight="600" color="#374151"
                bg="#f8fafc" border="1px solid #e8edf3" borderRadius="9px"
                w={{ base: "100%", sm: "160px" }}
                _focus={{ border: "1.5px solid #f97316" }} _hover={{ border: "1px solid #f97316" }}
                value={filterRank} onChange={(e) => setFilterRank(e.target.value)}
              >
                <option value="Tất cả">Tất cả hạng</option>
                {Object.keys(RANK_CONFIG).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
            </Flex>
          </Box>
        </Box>

        {/* Desktop col headers */}
        <Flex px="18px" py="10px" bg="#fafbfc" borderBottom="1px solid #f1f5f9"
          display={{ base: "none", md: "flex" }}
        >
          <Box w="32px" flexShrink="0" />
          <Box w="52px" mr="12px" flexShrink="0" />
          <Box flex="1.8">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
              Khách hàng
            </Text>
          </Box>
          <Box flex="0.7">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Hạng</Text>
          </Box>
          <Box flex="2">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">
              Phim yêu thích (3 gần nhất)
            </Text>
          </Box>
          <Box flex="0.6">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Tổng</Text>
          </Box>
          <Box w="80px" flexShrink="0" textAlign="right">
            <Text fontSize="10px" fontWeight="800" color="#94a3b8" letterSpacing="1px" textTransform="uppercase">Chi tiết</Text>
          </Box>
        </Flex>

        <Box p="10px">
          {filtered.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="48px">
              <Icon as={FaRegHeart} boxSize="36px" color="#e2e8f0" mb="10px" />
              <Text fontSize="14px" fontWeight="600" color="#94a3b8">Không tìm thấy người dùng nào</Text>
              <Text fontSize="12px" color="#cbd5e1" mt="4px">Thử thay đổi bộ lọc tìm kiếm</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="8px">
              {filtered.map((u, i) => (
                <UserRow key={u.id} user={u} index={i}
                  onView={(usr) => { setSelected(usr); setView("detail"); }}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}