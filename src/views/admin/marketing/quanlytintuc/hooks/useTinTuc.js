

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import NewsApi from 'api/catalog/NewApi';

export function useTinTuc() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [updatingIds, setUpdatingIds] = useState(() => new Set());
  const toast = useToast();

  const sortArticles = useCallback((items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt || a.CreatedAt || 0;
      const timeB = b.createdAt || b.CreatedAt || 0;
      if (timeA && timeB) return new Date(timeB) - new Date(timeA);
      const idA = a.NewsId || a.id || 0;
      const idB = b.NewsId || b.id || 0;
      return idB - idA;
    });
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await NewsApi.getAll();
      const data = response.data.data || response.data || [];

      const transformed = data.map((item) => ({
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
        featured: item.Featured ?? item.featured ?? false,
        views: item.Views ?? item.views ?? 0,
        likes: item.Likes ?? item.likes ?? 0,
        comments: item.Comments ?? item.comments ?? 0,
        createdAt: item.CreatedAt || item.createdAt || new Date().toISOString(),
        updatedAt: item.UpdatedAt || item.updatedAt || '',
        userId: item.UserId || item.userId || '',
      }));

      setArticles(sortArticles(transformed));
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

  // ✅ Toggle status: optimistic update + loading + rollback
  const toggleStatus = useCallback(
    async (article) => {
      const id = article.NewsId || article.id;
      const currentStatus = article.status || article.Status || 'Draft';
      const newStatus =
        currentStatus === 'Published' ? 'Hidden' : 'Published';

      const prevArticles = articles;

      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      // Optimistic update — ghi cả 2 key
      setArticles((prev) => {
        const updated = prev.map((a) =>
          (a.NewsId || a.id) === id
            ? {
                ...a,
                status: newStatus,
                Status: newStatus,
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

      try {
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('Status', newStatus);

        // ✅ BẮT BUỘC: UserId (rule required|exists)
        const userId =
          localStorage.getItem('UserId') || article.userId || '';
        if (userId) data.append('UserId', userId);

        // ✅ BẮT BUỘC: Title + Content (rule required)
        data.append('Title', article.title || '');
        data.append('Content', article.content || '');

        // ❌ KHÔNG gửi Slug — tránh fail unique
        // ❌ KHÔNG gửi ImageUrl — tránh fail image khi string URL

        await NewsApi.update(id, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast({
          title: 'Thành công',
          description: `Bài viết đã ${
            newStatus === 'Published' ? 'đăng' : 'ẩn'
          }`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        setArticles(prevArticles);
        const errors = error.response?.data?.errors;
        console.error('Lỗi khi cập nhật trạng thái:', errors || error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            (errors ? Object.values(errors).flat().join(', ') : '') ||
            'Không thể cập nhật trạng thái bài viết',
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
    [articles, toast, sortArticles],
  );

  const deleteArticle = useCallback(
    async (id) => {
      try {
        await NewsApi.delete(id);
        setArticles((prev) =>
          prev.filter((a) => (a.NewsId || a.id) !== id),
        );
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

        if (formData.ImageFile instanceof File) {
          data.append('ImageUrl', formData.ImageFile);
        }

        const response = await NewsApi.create(data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newArticle = response.data.data || response.data;

        const articleItem = {
          id: newArticle.NewsId || newArticle.id,
          title: newArticle.Title || newArticle.title || '',
          slug: newArticle.Slug || newArticle.slug || '',
          category: newArticle.Category || newArticle.category || 'Tin tức',
          tags: newArticle.Tags || newArticle.tags || [],
          status: newArticle.Status || newArticle.status || 'Draft',
          author: newArticle.Author || newArticle.author || '',
          publishDate:
            newArticle.PublishDate || newArticle.publishDate || '',
          scheduledDate:
            newArticle.ScheduledDate || newArticle.scheduledDate || '',
          imageUrl: newArticle.ImageUrl || newArticle.imageUrl || '',
          excerpt: newArticle.Excerpt || newArticle.excerpt || '',
          content: newArticle.Content || newArticle.content || '',
          linkedMovie:
            newArticle.LinkedMovie || newArticle.linkedMovie || '',
          featured: newArticle.Featured ?? newArticle.featured ?? false,
          views: 0,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
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
        const errors = error.response?.data?.errors;
        console.error('Lỗi khi thêm bài viết:', errors || error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            (errors ? Object.values(errors).flat().join(', ') : '') ||
            'Không thể thêm bài viết mới',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [toast, sortArticles],
  );

  const updateArticle = useCallback(
    async (id, formData) => {
      try {
        const currentArticle = articles.find(
          (a) => (a.NewsId || a.id) === id,
        );
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

        const data = new FormData();
        data.append('_method', 'PUT');

        const userId = localStorage.getItem('UserId') || '';
        data.append('UserId', userId || currentArticle.userId || '');
        data.append(
          'Title',
          formData.Title || currentArticle.title || '',
        );
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
        data.append(
          'Author',
          formData.Author || currentArticle.author || '',
        );
        data.append(
          'Excerpt',
          formData.Excerpt || currentArticle.excerpt || '',
        );
        data.append(
          'LinkedMovie',
          formData.LinkedMovie || currentArticle.linkedMovie || '',
        );
        data.append(
          'Featured',
          formData.Featured !== undefined
            ? formData.Featured
              ? '1'
              : '0'
            : currentArticle.featured
            ? '1'
            : '0',
        );
        data.append(
          'Tags',
          JSON.stringify(
            formData.Tags || currentArticle.tags || [],
          ),
        );

        if (formData.Slug) data.append('Slug', formData.Slug);

        if (formData.PublishDate) {
          data.append('PublishDate', formData.PublishDate);
        } else if (formData.Status === 'Published') {
          data.append(
            'PublishDate',
            new Date().toISOString().slice(0, 10),
          );
        } else if (currentArticle.publishDate) {
          data.append('PublishDate', currentArticle.publishDate);
        }

        if (formData.ScheduledDate) {
          data.append('ScheduledDate', formData.ScheduledDate);
        }

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
                  slug:
                    updatedData.Slug ||
                    updatedData.slug ||
                    formData.Slug ||
                    a.slug,
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
        const errors = error.response?.data?.errors;
        console.error('Lỗi khi cập nhật:', errors || error);
        toast({
          title: 'Lỗi',
          description:
            error.response?.data?.message ||
            (errors ? Object.values(errors).flat().join(', ') : '') ||
            'Không thể cập nhật bài viết',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    },
    [articles, toast, sortArticles],
  );

  const moveToTop = useCallback(
    (id) => {
      setArticles((prev) => {
        const item = prev.find((a) => (a.NewsId || a.id) === id);
        if (!item) return prev;
        const remaining = prev.filter(
          (a) => (a.NewsId || a.id) !== id,
        );
        return sortArticles([item, ...remaining]);
      });
    },
    [sortArticles],
  );

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
    updatingIds,
    fetchArticles,
    toggleStatus,
    deleteArticle,
    createArticle,
    updateArticle,
    moveToTop,
    refreshArticles,
  };
}