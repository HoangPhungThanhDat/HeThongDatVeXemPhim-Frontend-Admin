import React, { useState, useEffect, useCallback } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import { BannerList } from './components/BannerList';
import { BannerForm } from './components/BannerForm';
import { BannerDetail } from './components/BannerDetail';
import BannerApi from 'api/marketing/BannerApi';

export default function QuanLyBanner() {
  const [view, setView] = useState('list');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State theo dõi banner đang cập nhật trạng thái
  const [updatingIds, setUpdatingIds] = useState(() => new Set());

  const toast = useToast();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await BannerApi.getAll();
      const data = response.data.data || response.data || [];

      // ✅ Chỉ giữ key lowercase — bỏ ...item để tránh key viết hoa gây bug
      const transformed = data.map((item, index) => ({
        id: item.BannerId || item.id,
        order: item.Order || item.order || index + 1,
        title: item.Title || item.title || '',
        image: item.ImageUrl || item.image || '',
        status: item.Status || item.status || 'Inactive',
        linkType: item.LinkType || item.linkType || 'None',
        linkTarget: item.LinkUrl || item.linkUrl || '',
        scheduleStart: item.ScheduleStart || item.scheduleStart || '',
        scheduleEnd: item.ScheduleEnd || item.scheduleEnd || '',
        scheduledOn:
          item.ScheduledOn !== undefined
            ? item.ScheduledOn
            : item.scheduledOn || false,
        note: item.Note || item.note || '',
        position: item.Position || item.position || '',
        userId: item.UserId || item.userId || '',
        createdAt: item.CreatedAt || item.createdAt || '',
        updatedAt: item.UpdatedAt || item.updatedAt || '',
      }));

      setBanners(transformed);
    } catch (error) {
      console.error('Lỗi khi tải danh sách banner:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách banner',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Filter banners
  const filtered = banners
    .filter((b) => {
      const matchSearch =
        (b.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.linkTarget || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === 'Tất cả' || b.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Thống kê
  const counts = {
    total: banners.length,
    showing: banners.filter((b) => b.status === 'Active').length,
    hidden: banners.filter((b) => b.status === 'Inactive').length,
    scheduled: banners.filter((b) => b.scheduledOn).length,
  };

  // ✅ Ẩn/hiện banner — optimistic update + loading indicator
  const handleHide = async (bannerId) => {
    const banner = banners.find((b) => (b.BannerId || b.id) === bannerId);
    if (!banner) return;

    const currentStatus = banner.status || banner.Status || 'Inactive';
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    // Đánh dấu đang cập nhật
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.add(bannerId);
      return next;
    });

    // Optimistic update: đổi status ngay trên UI
    const prevBanners = banners;
    setBanners((prev) =>
      prev.map((b) =>
        (b.BannerId || b.id) === bannerId
          ? { ...b, status: newStatus, Status: newStatus } // ✅ cập nhật cả 2 key
          : b,
      ),
    );

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('Status', newStatus);

      await BannerApi.update(bannerId, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        title: 'Thành công',
        description: `Banner đã ${newStatus === 'Active' ? 'hiển thị' : 'ẩn'}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      // Rollback nếu API fail
      setBanners(prevBanners);

      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast({
        title: 'Lỗi',
        description:
          error.response?.data?.message ||
          'Không thể cập nhật trạng thái banner',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Bỏ đánh dấu
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(bannerId);
        return next;
      });
    }
  };

  // Xử lý xóa banner
  const handleDelete = async (bannerId) => {
    try {
      await BannerApi.delete(bannerId);
      setBanners((prev) =>
        prev
          .filter((b) => (b.BannerId || b.id) !== bannerId)
          .map((b, i) => ({ ...b, order: i + 1 })),
      );
      toast({
        title: 'Thành công',
        description: 'Banner đã được xóa',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Lỗi khi xóa banner:', error);
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa banner',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Xử lý thêm banner
  const handleAdd = async (formData) => {
    setIsSubmitting(true);
    try {
      const data = formData instanceof FormData ? formData : new FormData();

      if (!data.has('UserId')) {
        data.append('UserId', localStorage.getItem('UserId') || '');
      }

      const response = await BannerApi.create(data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newBanner = response.data.data || response.data;

      setBanners((prev) => [
        ...prev,
        {
          id: newBanner.BannerId || newBanner.id,
          order: prev.length + 1,
          title: newBanner.Title || newBanner.title || '',
          image: newBanner.ImageUrl || newBanner.image || '',
          status: newBanner.Status || newBanner.status || 'Inactive',
          linkType: newBanner.LinkType || newBanner.linkType || 'None',
          linkTarget: newBanner.LinkUrl || newBanner.linkUrl || '',
          scheduleStart:
            newBanner.ScheduleStart || newBanner.scheduleStart || '',
          scheduleEnd: newBanner.ScheduleEnd || newBanner.scheduleEnd || '',
          scheduledOn:
            newBanner.ScheduledOn !== undefined
              ? newBanner.ScheduledOn
              : newBanner.scheduledOn || false,
          note: newBanner.Note || newBanner.note || '',
          position: newBanner.Position || newBanner.position || '',
          userId: newBanner.UserId || newBanner.userId || '',
          createdAt: newBanner.CreatedAt || newBanner.createdAt || '',
          updatedAt: newBanner.UpdatedAt || newBanner.updatedAt || '',
        },
      ]);

      toast({
        title: 'Thành công',
        description: 'Thêm banner mới thành công',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setView('list');
    } catch (error) {
      console.error('Lỗi khi thêm banner:', error);
      toast({
        title: 'Lỗi',
        description:
          error.response?.data?.message || 'Không thể thêm banner mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý cập nhật banner
  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      const bannerId = selectedBanner.BannerId || selectedBanner.id;

      const data = formData instanceof FormData ? formData : new FormData();

      if (!data.has('_method')) {
        data.append('_method', 'PUT');
      }

      if (!data.has('UserId')) {
        data.append('UserId', localStorage.getItem('UserId') || '');
      }

      const response = await BannerApi.update(bannerId, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedBanner = response.data.data || response.data;

      setBanners((prev) =>
        prev.map((b) =>
          (b.BannerId || b.id) === bannerId
            ? {
                ...b,
                ...updatedBanner,
                id: updatedBanner.BannerId || updatedBanner.id || b.id,
                status:
                  updatedBanner.Status ||
                  updatedBanner.status ||
                  b.status, // ✅ đồng bộ status
                title: updatedBanner.Title || updatedBanner.title || b.title,
                image:
                  updatedBanner.ImageUrl || updatedBanner.image || b.image,
                linkTarget:
                  updatedBanner.LinkUrl ||
                  updatedBanner.linkUrl ||
                  b.linkTarget,
                scheduleStart:
                  updatedBanner.ScheduleStart ||
                  updatedBanner.scheduleStart ||
                  b.scheduleStart,
                scheduleEnd:
                  updatedBanner.ScheduleEnd ||
                  updatedBanner.scheduleEnd ||
                  b.scheduleEnd,
                scheduledOn:
                  updatedBanner.ScheduledOn !== undefined
                    ? updatedBanner.ScheduledOn
                    : updatedBanner.scheduledOn !== undefined
                    ? updatedBanner.scheduledOn
                    : b.scheduledOn,
              }
            : b,
        ),
      );

      toast({
        title: 'Thành công',
        description: 'Cập nhật banner thành công',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setView('list');
    } catch (error) {
      console.error('Lỗi khi cập nhật banner:', error);
      toast({
        title: 'Lỗi',
        description:
          error.response?.data?.message || 'Không thể cập nhật banner',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = (formData) => {
    if (view === 'add') {
      handleAdd(formData);
    } else {
      handleUpdate(formData);
    }
  };

  if (view === 'list') {
    return (
      <Box pt={{ base: '120px', md: '80px' }}>
        <BannerList
          banners={banners}
          setBanners={setBanners}
          loading={loading}
          onAdd={() => setView('add')}
          onView={(b) => {
            setSelectedBanner(b);
            setView('detail');
          }}
          onEdit={(b) => {
            setSelectedBanner(b);
            setView('edit');
          }}
          onHide={handleHide}
          onDelete={handleDelete}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          search={search}
          setSearch={setSearch}
          counts={counts}
          filtered={filtered}
          updatingIds={updatingIds}
        />
      </Box>
    );
  }

  if (view === 'detail' && selectedBanner) {
    return (
      <Box pt={{ base: '120px', md: '80px' }}>
        <BannerDetail
          banner={selectedBanner}
          onBack={() => setView('list')}
          onEdit={() => setView('edit')}
        />
      </Box>
    );
  }

  if (view === 'add') {
    return (
      <Box pt={{ base: '120px', md: '80px' }}>
        <BannerForm
          isAdd
          onCancel={() => setView('list')}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      </Box>
    );
  }

  if (view === 'edit' && selectedBanner) {
    return (
      <Box pt={{ base: '120px', md: '80px' }}>
        <BannerForm
          banner={selectedBanner}
          onCancel={() => setView('detail')}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      </Box>
    );
  }

  return null;
}