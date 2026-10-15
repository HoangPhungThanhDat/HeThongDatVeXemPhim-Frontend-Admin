// src/views/admin/quanlytintuc/hooks/useTinTuc.js

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import NewsApi from 'api/catalog/NewApi';

export function useTinTuc() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const toast = useToast();

  // Hàm sắp xếp: Mới nhất lên đầu
  const sortArticles = useCallback((items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt || a.CreatedAt || 0;
      const timeB = b.createdAt || b.CreatedAt || 0;

      if (timeA && timeB) {
        return new Date(timeB) - new Date(timeA);
      }

      const idA = a.NewsId || a.id || 0;
      const idB = b.NewsId || b.id || 0;
      return idB - idA;
    });
  }, []);

  // Lấy dữ liệu từ API
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await NewsApi.getAll();
      const data = response.data.data || response.data || [];

      const transformed = data.map((item) => ({
        ...item,
        id: item.NewsId || item.id,
        title: item.Title || item.title || '',
        slug: item.Slug || item.slug || '',
        category: item.Category || item.category || 'Tin tức',
        tags: item.Tags || item.tags || [],
        status: item.Status || item.status || 'Draft',
        author: item.Author || item.author || '',
        publishDate: item.PublishDate || item.publishDate || '',
        scheduledDate: item.ScheduledDate || item.scheduledDate || '',
        imageUrl: item.ImageUrl || item.imageUrl || '',
        excerpt: item.Excerpt || item.excerpt || '',
        content: item.Content || item.content || '',
        linkedMovie: item.LinkedMovie || item.linkedMovie || '',
        featured: item.Featured || item.featured || false,
        views: item.Views || item.views || 0,
        likes: item.Likes || item.likes || 0,
        comments: item.Comments || item.comments || 0,
        createdAt: item.CreatedAt || item.createdAt || new Date().toISOString(),
        updatedAt: item.UpdatedAt || item.updatedAt || '',
        userId: item.UserId || item.userId || '',
      }));

      const sorted = sortArticles(transformed);
      setArticles(sorted);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tin tức:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách tin tức',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, sortArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter
  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        (a.title || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q) ||
        (a.linkedMovie || '').toLowerCase().includes(q);
      const matchStatus =
        filterStatus === 'Tất cả' || a.status === filterStatus;
      const matchCategory =
        filterCategory === 'Tất cả' || a.category === filterCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [articles, search, filterStatus, filterCategory]);

  // Stats
  const counts = useMemo(
    () => ({
      total: articles.length,
      published: articles.filter((a) => a.status === 'Published').length,
      draft: articles.filter((a) => a.status === 'Draft').length,
      scheduled: articles.filter((a) => a.status === 'Scheduled').length,
      hidden: articles.filter((a) => a.status === 'Hidden').length,
    }),
    [articles],
  );

  const totalViews = useMemo(
    () => articles.reduce((s, a) => s + (a.views || 0), 0),
    [articles],
  );

  // Toggle status
  const toggleStatus = useCallback(
    async (article) => {
      const id = article.NewsId || article.id;
      const newStatus = article.status === 'Published' ? 'Hidden' : 'Published';

      try {
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('Status', newStatus);

        // Thêm các field cần thiết khác
        data.append('Title', article.title || '');
        data.append('Slug', article.slug || '');
        data.append('Content', article.content || '');
        data.append('Category', article.category || 'Tin tức');
        data.append('Author', article.author || '');
        data.append('Excerpt', article.excerpt || '');
        data.append('LinkedMovie', article.linkedMovie || '');
        data.append('Featured', article.featured ? '1' : '0');
        data.append('Tags', JSON.stringify(article.tags || []));

        if (article.imageUrl && article.imageUrl.startsWith('http')) {
          data.append('ImageUrl', article.imageUrl);
        }

        await NewsApi.update(id, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setArticles((prev) => {
          const updated = prev.map((a) =>
            (a.NewsId || a.id) === id
              ? {
                  ...a,
                  status: newStatus,
                  publishDate:
                    newStatus === 'Published'
                      ? new Date().toISOString().slice(0, 10)
                      : a.publishDate,
                  updatedAt: new Date().toISOString(),
                }
              : a,
          );
          return sortArticles(updated);
        });

        toast({
          title: 'Thành công',
          description: `Bài viết đã ${newStatus === 'Published' ? 'đăng' : 'ẩn'}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            'Không thể cập nhật trạng thái bài viết',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast, sortArticles],
  );

  // Delete
  const deleteArticle = useCallback(
    async (id) => {
      try {
        await NewsApi.delete(id);
        setArticles((prev) => prev.filter((a) => (a.NewsId || a.id) !== id));
        toast({
          title: 'Thành công',
          description: 'Bài viết đã được xóa',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể xóa bài viết',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast],
  );

  // CREATE - Nhận FormData và upload ảnh
  const createArticle = useCallback(
    async (formData) => {
      try {
        const data = new FormData();
        const userId = localStorage.getItem('UserId') || '';

        if (!userId) {
          toast({
            title: 'Lỗi',
            description: 'Vui lòng đăng nhập để thêm bài viết',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }

        data.append('UserId', userId);
        data.append('Title', formData.Title || '');
        data.append('Slug', formData.Slug || '');
        data.append('Content', formData.Content || '');
        data.append('Status', formData.Status || 'Draft');
        data.append('Category', formData.Category || 'Tin tức');
        data.append('Author', formData.Author || '');
        data.append('Excerpt', formData.Excerpt || '');
        data.append('LinkedMovie', formData.LinkedMovie || '');
        data.append('Featured', formData.Featured ? '1' : '0');
        data.append('Tags', JSON.stringify(formData.Tags || []));

        if (formData.PublishDate) {
          data.append('PublishDate', formData.PublishDate);
        }

        if (formData.ScheduledDate) {
          data.append('ScheduledDate', formData.ScheduledDate);
        }

        // Xử lý ảnh - gửi file nếu có
        if (formData.ImageFile instanceof File) {
          data.append('ImageUrl', formData.ImageFile);
        }

        const response = await NewsApi.create(data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newArticle = response.data.data || response.data;

        const articleItem = {
          ...newArticle,
          id: newArticle.NewsId || newArticle.id,
          title: newArticle.Title || newArticle.title || '',
          slug: newArticle.Slug || newArticle.slug || '',
          category: newArticle.Category || newArticle.category || 'Tin tức',
          tags: newArticle.Tags || newArticle.tags || [],
          status: newArticle.Status || newArticle.status || 'Draft',
          author: newArticle.Author || newArticle.author || '',
          publishDate: newArticle.PublishDate || newArticle.publishDate || '',
          scheduledDate:
            newArticle.ScheduledDate || newArticle.scheduledDate || '',
          imageUrl: newArticle.ImageUrl || newArticle.imageUrl || '',
          excerpt: newArticle.Excerpt || newArticle.excerpt || '',
          content: newArticle.Content || newArticle.content || '',
          linkedMovie: newArticle.LinkedMovie || newArticle.linkedMovie || '',
          featured: newArticle.Featured || newArticle.featured || false,
          views: 0,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
        };

        setArticles((prev) => sortArticles([articleItem, ...prev]));

        toast({
          title: 'Thành công 🎉',
          description: `Đã tạo bài viết "${articleItem.title}" thành công`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        console.error('❌ Lỗi khi thêm bài viết:', error);

        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể thêm bài viết mới',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast, sortArticles],
  );

  // UPDATE - Nhận FormData và upload ảnh mới
  const updateArticle = useCallback(
    async (id, formData) => {
      try {
        const currentArticle = articles.find((a) => (a.NewsId || a.id) === id);

        if (!currentArticle) {
          toast({
            title: 'Lỗi',
            description: 'Không tìm thấy bài viết cần cập nhật',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }

        // Tạo slug mới nếu title thay đổi
        let slug = formData.Slug || currentArticle.slug;
        if (formData.Title && formData.Title !== currentArticle.title) {
          const generateSlug = (title) => {
            return title
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[đĐ]/g, 'd')
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
          };
          slug = generateSlug(formData.Title);
        }

        const data = new FormData();
        data.append('_method', 'PUT');

        const userId = localStorage.getItem('UserId') || '';

        data.append('UserId', userId || currentArticle.userId || '');
        data.append('Title', formData.Title || currentArticle.title || '');
        data.append('Slug', slug);
        data.append(
          'Content',
          formData.Content || currentArticle.content || '',
        );
        data.append(
          'Status',
          formData.Status || currentArticle.status || 'Draft',
        );
        data.append(
          'Category',
          formData.Category || currentArticle.category || 'Tin tức',
        );
        data.append('Author', formData.Author || currentArticle.author || '');
        data.append(
          'Excerpt',
          formData.Excerpt || currentArticle.excerpt || '',
        );
        data.append(
          'LinkedMovie',
          formData.LinkedMovie || currentArticle.linkedMovie || '',
        );
        data.append('Featured', formData.Featured ? '1' : '0');
        data.append(
          'Tags',
          JSON.stringify(formData.Tags || currentArticle.tags || []),
        );

        if (formData.PublishDate) {
          data.append('PublishDate', formData.PublishDate);
        } else if (formData.Status === 'Published') {
          data.append('PublishDate', new Date().toISOString().slice(0, 10));
        } else {
          data.append('PublishDate', currentArticle.publishDate || '');
        }

        if (formData.ScheduledDate) {
          data.append('ScheduledDate', formData.ScheduledDate);
        } else {
          data.append('ScheduledDate', currentArticle.scheduledDate || '');
        }

        // Xử lý ảnh - gửi file nếu có
        if (formData.ImageFile instanceof File) {
          data.append('ImageUrl', formData.ImageFile);
        }

        const response = await NewsApi.update(id, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updatedData = response.data.data || response.data;

        setArticles((prev) => {
          const updated = prev.map((a) =>
            (a.NewsId || a.id) === id
              ? {
                  ...a,
                  ...updatedData,
                  title:
                    updatedData.Title ||
                    updatedData.title ||
                    formData.Title ||
                    a.title,
                  slug: updatedData.Slug || updatedData.slug || slug || a.slug,
                  content:
                    updatedData.Content ||
                    updatedData.content ||
                    formData.Content ||
                    a.content,
                  status:
                    updatedData.Status ||
                    updatedData.status ||
                    formData.Status ||
                    a.status,
                  category:
                    updatedData.Category ||
                    updatedData.category ||
                    formData.Category ||
                    a.category,
                  author:
                    updatedData.Author ||
                    updatedData.author ||
                    formData.Author ||
                    a.author,
                  excerpt:
                    updatedData.Excerpt ||
                    updatedData.excerpt ||
                    formData.Excerpt ||
                    a.excerpt,
                  linkedMovie:
                    updatedData.LinkedMovie ||
                    updatedData.linkedMovie ||
                    formData.LinkedMovie ||
                    a.linkedMovie,
                  featured:
                    updatedData.Featured !== undefined
                      ? updatedData.Featured
                      : formData.Featured !== undefined
                        ? formData.Featured
                        : a.featured,
                  tags:
                    updatedData.Tags ||
                    updatedData.tags ||
                    formData.Tags ||
                    a.tags,
                  imageUrl:
                    updatedData.ImageUrl ||
                    updatedData.imageUrl ||
                    formData.ImageUrl ||
                    a.imageUrl,
                  publishDate:
                    updatedData.PublishDate ||
                    updatedData.publishDate ||
                    formData.PublishDate ||
                    a.publishDate,
                  scheduledDate:
                    updatedData.ScheduledDate ||
                    updatedData.scheduledDate ||
                    formData.ScheduledDate ||
                    a.scheduledDate,
                  updatedAt: new Date().toISOString(),
                }
              : a,
          );
          return sortArticles(updated);
        });

        toast({
          title: 'Thành công',
          description: 'Cập nhật bài viết thành công',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        console.error('❌ Lỗi khi cập nhật:', error);

        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message || 'Không thể cập nhật bài viết',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [articles, toast, sortArticles],
  );

  // Đưa bài viết lên đầu
  const moveToTop = useCallback(
    (id) => {
      setArticles((prev) => {
        const item = prev.find((a) => (a.NewsId || a.id) === id);
        if (!item) return prev;

        const remaining = prev.filter((a) => (a.NewsId || a.id) !== id);
        return sortArticles([item, ...remaining]);
      });
    },
    [sortArticles],
  );

  // Refresh danh sách
  const refreshArticles = useCallback(async () => {
    await fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filtered,
    counts,
    totalViews,
    fetchArticles,
    toggleStatus,
    deleteArticle,
    createArticle,
    updateArticle,
    moveToTop,
    refreshArticles,
  };
}
