import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import PromotionApi from 'api/marketing/PromotionApi';

/**
 * Chuẩn hoá ngày về format Laravel `date` chấp nhận.
 * API có thể trả ISO: "2024-01-01T00:00:00.000Z" → "2024-01-01 00:00:00"
 */
const normalizeDate = (value) => {
  if (!value) return '';
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/.test(str)) return str;
  return str.replace('T', ' ').replace(/\.\d+Z?$/, '').trim();
};

export function useKhuyenMai() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterType, setFilterType] = useState('Tất cả');
  const [updatingIds, setUpdatingIds] = useState(() => new Set());
  const toast = useToast();

  const sortPromos = useCallback((items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt || a.CreatedAt || 0;
      const timeB = b.createdAt || b.CreatedAt || 0;
      if (timeA && timeB) return new Date(timeB) - new Date(timeA);
      const idA = a.PromotionId || a.id || 0;
      const idB = b.PromotionId || b.id || 0;
      return idB - idA;
    });
  }, []);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await PromotionApi.getAll();
      const data = response.data.data || response.data || [];

      const transformed = data.map((item) => ({
        id: item.PromotionId || item.id,
        title: item.Title || item.title || '',
        code: item.Code || item.code || '',
        description: item.Description || item.description || '',
        imageUrl: item.ImageUrl || item.imageUrl || null,
        discountType: item.DiscountType || item.discountType || 'Percentage',
        discountValue: item.DiscountValue ?? item.discountValue ?? 0,
        startDate: item.StartDate || item.startDate || '',
        endDate: item.EndDate || item.endDate || '',
        isActive:
          item.IsActive !== undefined
            ? item.IsActive
            : item.isActive !== undefined
            ? item.isActive
            : true,
        status: item.Status || item.status || 'Inactive',
        applyFor: item.ApplyFor || item.applyFor || 'Tất cả phim',
        applyTarget: item.ApplyTarget || item.applyTarget || '',
        minOrder: item.MinOrder || item.minOrder || 0,
        maxDiscount: item.MaxDiscount || item.maxDiscount || 0,
        usageCount: item.UsageCount ?? item.usageCount ?? 0,
        usageLimit: item.UsageLimit ?? item.usageLimit ?? 0,
        createdAt: item.CreatedAt || item.createdAt || new Date().toISOString(),
        updatedAt: item.UpdatedAt || item.updatedAt || '',
      }));

      setPromos(sortPromos(transformed));
    } catch (error) {
      console.error('Lỗi khi tải danh sách khuyến mãi:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khuyến mãi',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, sortPromos]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const filtered = useMemo(() => {
    return promos.filter((p) => {
      const matchSearch =
        (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.code || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'Tất cả' || p.status === filterStatus;
      const matchType = filterType === 'Tất cả' || p.discountType === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [promos, search, filterStatus, filterType]);

  // ✅ Cách 2: DB chỉ có Active/Inactive/Expired → gộp "đã tắt"
  const counts = useMemo(
    () => ({
      total: promos.length,
      active: promos.filter((p) => p.status === 'Active').length,
      ended: promos.filter(
        (p) =>
          p.status === 'Inactive' ||
          p.status === 'Paused' ||
          p.status === 'Expired',
      ).length,
      totalUsage: promos.reduce((s, p) => s + (p.usageCount || 0), 0),
    }),
    [promos],
  );

  // ✅ Toggle status: optimistic update + loading + rollback
  const toggleStatus = useCallback(
    async (id) => {
      const promo = promos.find((p) => (p.id || p.PromotionId) === id);
      if (!promo) return;

      // ✅ Cách 2: mọi trạng thái "tắt" đều toggle sang Active
      const isOff =
        promo.status === 'Inactive' ||
        promo.status === 'Paused' ||
        promo.status === 'Expired';
      const newStatus = isOff ? 'Active' : 'Inactive';

      const prevPromos = promos;

      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      setPromos((prev) => {
        const updated = prev.map((p) =>
          (p.id || p.PromotionId) === id
            ? { ...p, status: newStatus, Status: newStatus }
            : p,
        );
        return sortPromos(updated);
      });

      try {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('Status', newStatus);

        formData.append('Title', promo.title || '');
        formData.append('Code', promo.code || '');
        formData.append('DiscountType', promo.discountType || 'Percentage');
        formData.append('DiscountValue', String(promo.discountValue ?? 0));
        formData.append('StartDate', normalizeDate(promo.startDate));
        formData.append('EndDate', normalizeDate(promo.endDate));
        formData.append('IsActive', newStatus === 'Active' ? '1' : '0');

        if (!formData.has('UserId')) {
          formData.append('UserId', localStorage.getItem('UserId') || '');
        }

        await PromotionApi.update(id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast({
          title: 'Thành công',
          description: `Chương trình đã ${
            newStatus === 'Active' ? 'bật' : 'tạm dừng'
          }`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        setPromos(prevPromos);
        const errors = error.response?.data?.errors;
        console.error('Lỗi khi cập nhật trạng thái:', errors || error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            (errors ? Object.values(errors).flat().join(', ') : '') ||
            'Không thể cập nhật trạng thái',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [promos, toast, sortPromos],
  );

  const deletePromo = useCallback(
    async (id) => {
      try {
        await PromotionApi.delete(id);
        setPromos((prev) =>
          prev.filter((p) => (p.id || p.PromotionId) !== id),
        );
        toast({
          title: 'Thành công',
          description: 'Chương trình đã được xóa',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể xóa chương trình',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast],
  );

  const createPromo = useCallback(
    async (formData) => {
      try {
        const data = formData instanceof FormData ? formData : new FormData();
        if (!(formData instanceof FormData)) {
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              if (key === 'ImageFile' && value instanceof File) {
                data.append('ImageUrl', value);
              } else if (key !== 'ImageUrl' && key !== 'imageUrl') {
                data.append(key, value);
              }
            }
          });
        }
        if (!data.has('UserId')) {
          data.append('UserId', localStorage.getItem('UserId') || '');
        }

        const response = await PromotionApi.create(data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newPromo = response.data.data || response.data;
        const promoItem = {
          id: newPromo.PromotionId || newPromo.id,
          title: newPromo.Title || newPromo.title || '',
          code: newPromo.Code || newPromo.code || '',
          description: newPromo.Description || newPromo.description || '',
          imageUrl: newPromo.ImageUrl || newPromo.imageUrl || null,
          discountType:
            newPromo.DiscountType || newPromo.discountType || 'Percentage',
          discountValue:
            newPromo.DiscountValue ?? newPromo.discountValue ?? 0,
          startDate: newPromo.StartDate || newPromo.startDate || '',
          endDate: newPromo.EndDate || newPromo.endDate || '',
          isActive:
            newPromo.IsActive !== undefined ? newPromo.IsActive : true,
          status: newPromo.Status || newPromo.status || 'Active',
          applyFor: newPromo.ApplyFor || newPromo.applyFor || 'Tất cả phim',
          applyTarget: newPromo.ApplyTarget || newPromo.applyTarget || '',
          minOrder: newPromo.MinOrder || newPromo.minOrder || 0,
          maxDiscount: newPromo.MaxDiscount || newPromo.maxDiscount || 0,
          usageCount: 0,
          usageLimit: newPromo.UsageLimit ?? newPromo.usageLimit ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPromos((prev) => sortPromos([promoItem, ...prev]));

        toast({
          title: 'Thành công 🎉',
          description: `Đã tạo khuyến mãi "${promoItem.title}" thành công`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        const errors = error.response?.data?.errors;
        console.error('Lỗi khi thêm:', errors || error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            (errors ? Object.values(errors).flat().join(', ') : '') ||
            'Không thể thêm chương trình mới',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast, sortPromos],
  );

  const updatePromo = useCallback(
    async (id, formData) => {
      try {
        const data = formData instanceof FormData ? formData : new FormData();
        if (!data.has('_method')) data.append('_method', 'PUT');
        if (!(formData instanceof FormData)) {
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              if (key === 'ImageFile' && value instanceof File) {
                data.append('ImageUrl', value);
              } else if (
                key !== 'ImageUrl' &&
                key !== 'imageUrl' &&
                key !== '_method'
              ) {
                data.append(key, value);
              }
            }
          });
        }
        if (!data.has('UserId')) {
          data.append('UserId', localStorage.getItem('UserId') || '');
        }

        await PromotionApi.update(id, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setPromos((prev) => {
          const updated = prev.map((p) => {
            if ((p.id || p.PromotionId) === id) {
              const formDataObj = formData instanceof FormData ? {} : formData;
              return {
                ...p,
                ...formDataObj,
                status: formDataObj.Status || formDataObj.status || p.status,
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          });
          return sortPromos(updated);
        });

        toast({
          title: 'Thành công',
          description: 'Cập nhật chương trình thành công',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        const errors = error.response?.data?.errors;
        console.error('Lỗi khi cập nhật:', errors || error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            (errors ? Object.values(errors).flat().join(', ') : '') ||
            'Không thể cập nhật chương trình',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast, sortPromos],
  );

  const moveToTop = useCallback(
    (id) => {
      setPromos((prev) => {
        const item = prev.find((p) => (p.id || p.PromotionId) === id);
        if (!item) return prev;
        const remaining = prev.filter((p) => (p.id || p.PromotionId) !== id);
        return sortPromos([item, ...remaining]);
      });
    },
    [sortPromos],
  );

  const refreshPromos = useCallback(async () => {
    await fetchPromos();
  }, [fetchPromos]);

  return {
    promos,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    filtered,
    counts,
    updatingIds,
    fetchPromos,
    toggleStatus,
    deletePromo,
    createPromo,
    updatePromo,
    moveToTop,
    refreshPromos,
  };
}