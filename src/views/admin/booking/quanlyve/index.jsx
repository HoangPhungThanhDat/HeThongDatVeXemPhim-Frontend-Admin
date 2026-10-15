// src/views/admin/quanlyve/index.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Icon,
  useColorModeValue,
  useColorMode,
  Badge,
  HStack,
  VStack,
  Divider,
  Progress,
  Button,
  Input,
  Select,
  useDisclosure,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import {
  MdAdd,
  MdSearch,
  MdFilterAlt,
  MdDarkMode,
  MdLightMode,
} from 'react-icons/md';
import { FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTicket } from './hooks/useTicket';
import { PageHeader } from './components/PageHeader';
import { StatCard } from './components/StatCard';
import { TicketTable } from './components/TicketTable';
import { MobileTicketList } from './components/MobileTicketList';
import { TicketDetail } from './components/TicketDetail';
import { TicketEdit } from './components/TicketEdit';
import { QRModal } from './components/QRModal';
import { FilterDrawer } from './components/FilterDrawer';
import Loader from 'layouts/Loader'; // ✅ Sử dụng Loader từ layouts
import ShowtimeSeatApi from 'api/booking/ShowtimeSeatApi';

export default function QuanLyVe() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const navigate = useNavigate();

  const {
    tickets,
    loading,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    cancelTicket,
  } = useTicket();

  const [view, setView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [qrTicket, setQrTicket] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    isOpen: isFilterOpen,
    onOpen: openFilter,
    onClose: closeFilter,
  } = useDisclosure();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    console.log('📊 Current tickets:', tickets);
  }, [tickets]);

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.code?.toLowerCase().includes(q) ||
      t.customer?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.movie?.toLowerCase().includes(q) ||
      t.seat?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'Tất cả' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: tickets.length,
    paid: tickets.filter(
      (t) => t.status === 'Đã thanh toán' || t.status === 'Paid',
    ).length,
    checkin: tickets.filter((t) => t.status === 'Đã check-in').length,
    cancel: tickets.filter(
      (t) => t.status === 'Đã hủy' || t.status === 'Cancelled',
    ).length,
    expired: tickets.filter((t) => t.status === 'Hết hạn').length,
    pending: tickets.filter(
      (t) => t.status === 'Chờ xử lý' || t.status === 'Pending',
    ).length,
  };

  // ✅ Xử lý lưu thay đổi khi chỉnh sửa vé
  const handleSave = async (updated) => {
    try {
      console.log('📤 Saving updated ticket:', updated);

      // ✅ Nếu có thay đổi ghế, xử lý cập nhật trạng thái ghế
      if (
        updated.seatId &&
        updated.oldSeatId &&
        updated.seatId !== updated.oldSeatId
      ) {
        console.log(
          '🔄 Seat changed from',
          updated.oldSeatId,
          'to',
          updated.seatId,
        );

        // 1️⃣ Trả ghế cũ về Available
        if (updated.oldShowtimeSeatId) {
          try {
            await ShowtimeSeatApi.update(updated.oldShowtimeSeatId, {
              Status: 'Available',
            });
            console.log('✅ Old seat restored to Available');
          } catch (err) {
            console.error('❌ Lỗi trả ghế cũ:', err);
          }
        }

        // 2️⃣ Đặt ghế mới thành Reserved
        if (updated.newShowtimeSeatId) {
          try {
            await ShowtimeSeatApi.update(updated.newShowtimeSeatId, {
              Status: 'Reserved',
            });
            console.log('✅ New seat set to Reserved');
          } catch (err) {
            console.error('❌ Lỗi đặt ghế mới:', err);
          }
        }
      }

      // 3️⃣ Cập nhật vé
      const updateData = {
        showtimeId: updated.showtimeId,
        seatId: updated.seatId,
        userId: updated.userId,
        status: updated.status,
        note: updated.note,
        seat: updated.seat,
        oldShowtimeSeatId: updated.oldShowtimeSeatId,
        newShowtimeSeatId: updated.newShowtimeSeatId,
      };

      console.log('📤 Update data sent to API:', updateData);

      await updateTicket(updated.id, updateData);
      setSelectedTicket(updated);
      setView('detail');

      // Refresh danh sách vé để cập nhật UI
      await fetchTickets();

      toast({
        title: 'Thành công',
        description: 'Cập nhật vé thành công',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('❌ Lỗi cập nhật vé:', err);
      console.error('❌ Error response:', err.response?.data);
      toast({
        title: 'Lỗi cập nhật',
        description: err.response?.data?.message || 'Không thể cập nhật vé',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreate = () => {
    navigate('/admin/ve-don-hang/ve/tao-moi');
  };

  const handleDelete = async (id, showtimeSeatId) => {
    try {
      if (showtimeSeatId) {
        await cancelTicket(id, showtimeSeatId);
      } else {
        await deleteTicket(id);
      }
      setView('list');
      await fetchTickets();
      toast({
        title: 'Thành công',
        description: 'Xóa vé thành công',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('❌ Lỗi xóa vé:', err);
      toast({
        title: 'Lỗi xóa',
        description: err.response?.data?.message || 'Không thể xóa vé',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = async (id, showtimeSeatId) => {
    try {
      await cancelTicket(id, showtimeSeatId);
      setView('list');
      await fetchTickets();
      toast({
        title: 'Thành công',
        description: 'Hủy vé thành công',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('❌ Lỗi hủy vé:', err);
      toast({
        title: 'Lỗi hủy vé',
        description: err.response?.data?.message || 'Không thể hủy vé',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bg = useColorModeValue('#f8fafc', '#0a0a18');

  // ✅ Sử dụng Loader component
  if (loading && tickets.length === 0) {
    return <Loader />;
  }

  if (view === 'detail' && selectedTicket) {
    const live =
      tickets.find((t) => t.id === selectedTicket.id) || selectedTicket;
    return (
      <Box
        pt={{ base: '80px', md: '80px' }}
        px={{ base: '12px', md: '0' }}
        bg={bg}
        minH="100vh"
      >
        <TicketDetail
          ticket={live}
          onBack={() => setView('list')}
          onEdit={(tk) => {
            setSelectedTicket(tk);
            setView('edit');
          }}
          onDelete={() => handleDelete(live.id, live.showtimeSeatId)}
          onCancel={() => handleCancel(live.id, live.showtimeSeatId)}
          isDark={isDark}
        />
      </Box>
    );
  }

  if (view === 'edit' && selectedTicket) {
    const live =
      tickets.find((t) => t.id === selectedTicket.id) || selectedTicket;
    return (
      <Box
        pt={{ base: '80px', md: '80px' }}
        px={{ base: '12px', md: '0' }}
        bg={bg}
        minH="100vh"
      >
        <TicketEdit
          ticket={live}
          onBack={() => setView('detail')}
          onSave={handleSave}
          isDark={isDark}
        />
      </Box>
    );
  }

  return (
    <Box
      pt={{ base: '80px', md: '80px' }}
      px={{ base: '0', md: '0' }}
      bg={bg}
      minH="100vh"
    >
      {qrTicket && (
        <QRModal
          ticket={qrTicket}
          onClose={() => setQrTicket(null)}
          isDark={isDark}
        />
      )}

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={closeFilter}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        isDark={isDark}
      />

      <PageHeader
        isDark={isDark}
        toggleColorMode={toggleColorMode}
        onCreateTicket={handleCreate}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        isMobile={isMobile}
        openFilter={openFilter}
      />

      <Box px={{ base: '16px', md: '0' }} mb="16px">
        <SimpleGrid
          columns={{ base: 3, sm: 5, md: 6 }}
          spacing={{ base: '8px', md: '14px' }}
        >
          <StatCard
            label="Tổng vé"
            value={counts.total}
            icon={FaTicketAlt}
            accent="#ea580c"
            delay={0}
            isDark={isDark}
          />
          <StatCard
            label="Thanh toán"
            value={counts.paid}
            icon={FaTicketAlt}
            accent="#10b981"
            delay={0.04}
            isDark={isDark}
          />
          <StatCard
            label="Check-in"
            value={counts.checkin}
            icon={FaTicketAlt}
            accent="#ea580c"
            delay={0.08}
            isDark={isDark}
          />
          <StatCard
            label="Chờ xử lý"
            value={counts.pending}
            icon={FaTicketAlt}
            accent="#f59e0b"
            delay={0.1}
            isDark={isDark}
          />
          <StatCard
            label="Đã hủy"
            value={counts.cancel}
            icon={FaTicketAlt}
            accent="#ef4444"
            delay={0.12}
            isDark={isDark}
          />
          <StatCard
            label="Hết hạn"
            value={counts.expired}
            icon={FaTicketAlt}
            accent="#9ca3af"
            delay={0.16}
            isDark={isDark}
          />
        </SimpleGrid>
      </Box>

      <Box
        bg={isDark ? '#1a202c' : 'white'}
        borderRadius={{ base: '16px 16px 0 0', md: '16px' }}
        border={isDark ? '1px solid #4a5568' : '1px solid #f1f5f9'}
        boxShadow={
          isDark ? '0 1px 4px rgba(0,0,0,.3)' : '0 1px 4px rgba(0,0,0,.04)'
        }
        mx={{ base: '0', md: '0' }}
      >
        {isMobile ? (
          <MobileTicketList
            tickets={filtered}
            onView={(tk) => {
              setSelectedTicket(tk);
              setView('detail');
            }}
            onEdit={(tk) => {
              setSelectedTicket(tk);
              setView('edit');
            }}
            onQR={(tk) => setQrTicket(tk)}
            isDark={isDark}
            loading={loading}
          />
        ) : (
          <TicketTable
            tickets={filtered}
            onView={(tk) => {
              setSelectedTicket(tk);
              setView('detail');
            }}
            onEdit={(tk) => {
              setSelectedTicket(tk);
              setView('edit');
            }}
            onQR={(tk) => setQrTicket(tk)}
            isDark={isDark}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
}
