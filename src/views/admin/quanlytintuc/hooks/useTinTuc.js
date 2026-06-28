// views/admin/quanlytintuc/hooks/useTinTuc.js

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import NewsApi from "../../../../api/NewApi";

export function useTinTuc() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterCategory, setFilterCategory] = useState("Tất cả");
  const toast = useToast();

  // Lấy dữ liệu từ API
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await NewsApi.getAll();
      const data = response.data.data || response.data || [];
      
      const transformed = data.map((item) => ({
        ...item,
        id: item.NewsId || item.id,
        title: item.Title || item.title || "",
        slug: item.Slug || item.slug || "",
        category: item.Category || item.category || "Tin tức",
        tags: item.Tags || item.tags || [],
        status: item.Status || item.status || "Draft",
        author: item.Author || item.author || "",
        publishDate: item.PublishDate || item.publishDate || "",
        scheduledDate: item.ScheduledDate || item.scheduledDate || "",
        imageUrl: item.ImageUrl || item.imageUrl || "",
        excerpt: item.Excerpt || item.excerpt || "",
        content: item.Content || item.content || "",
        linkedMovie: item.LinkedMovie || item.linkedMovie || "",
        featured: item.Featured || item.featured || false,
        views: item.Views || item.views || 0,
        likes: item.Likes || item.likes || 0,
        comments: item.Comments || item.comments || 0,
        createdAt: item.CreatedAt || item.createdAt || "",
        updatedAt: item.UpdatedAt || item.updatedAt || "",
        userId: item.UserId || item.userId || "",
      }));
      setArticles(transformed);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tin tức:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tin tức",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter
  const filtered = useMemo(() => {
    return articles
      .filter((a) => {
        const q = search.toLowerCase();
        const matchSearch = (a.title || "").toLowerCase().includes(q) ||
          (a.author || "").toLowerCase().includes(q) ||
          (a.linkedMovie || "").toLowerCase().includes(q);
        const matchStatus = filterStatus === "Tất cả" || a.status === filterStatus;
        const matchCategory = filterCategory === "Tất cả" || a.category === filterCategory;
        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [articles, search, filterStatus, filterCategory]);

  // Stats
  const counts = useMemo(() => ({
    total: articles.length,
    published: articles.filter((a) => a.status === "Published").length,
    draft: articles.filter((a) => a.status === "Draft").length,
    scheduled: articles.filter((a) => a.status === "Scheduled").length,
    hidden: articles.filter((a) => a.status === "Hidden").length,
  }), [articles]);

  const totalViews = useMemo(() => 
    articles.reduce((s, a) => s + (a.views || 0), 0),
  [articles]);

  // Toggle status
  const toggleStatus = useCallback(async (article) => {
    const id = article.NewsId || article.id;
    const newStatus = article.status === "Published" ? "Hidden" : "Published";
    
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      
      const userId = localStorage.getItem("UserId") || "";
      formData.append("UserId", userId || article.userId || "");
      formData.append("Status", newStatus);
      formData.append("Title", article.title || "");
      formData.append("Slug", article.slug || "");
      formData.append("Content", article.content || "");
      formData.append("Category", article.category || "Tin tức");
      formData.append("Author", article.author || "");
      formData.append("Excerpt", article.excerpt || "");
      formData.append("LinkedMovie", article.linkedMovie || "");
      formData.append("Featured", article.featured ? "1" : "0");
      formData.append("Tags", JSON.stringify(article.tags || []));
      
      if (article.imageUrl && article.imageUrl.startsWith("http")) {
        formData.append("ImageUrl", article.imageUrl);
      }
      
      await NewsApi.update(id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setArticles((prev) =>
        prev.map((a) =>
          (a.NewsId || a.id) === id 
            ? { 
                ...a, 
                status: newStatus, 
                publishDate: newStatus === "Published" ? new Date().toISOString().slice(0, 10) : a.publishDate 
              } 
            : a
        )
      );
      
      toast({
        title: "Thành công",
        description: `Bài viết đã ${newStatus === "Published" ? "đăng" : "ẩn"}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật trạng thái bài viết",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Delete
  const deleteArticle = useCallback(async (id) => {
    try {
      await NewsApi.delete(id);
      setArticles((prev) => prev.filter((a) => (a.NewsId || a.id) !== id));
      toast({
        title: "Thành công",
        description: "Bài viết đã được xóa",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa bài viết",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Create
  const createArticle = useCallback(async (formData) => {
    try {
      const data = new FormData();
      const userId = localStorage.getItem("UserId") || "";
      
      if (!userId) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để thêm bài viết",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      
      data.append("UserId", userId);
      data.append("Title", formData.Title || "");
      data.append("Slug", formData.Slug || "");
      data.append("Content", formData.Content || "");
      data.append("Status", formData.Status || "Draft");
      data.append("Category", formData.Category || "Tin tức");
      data.append("Author", formData.Author || "");
      data.append("Excerpt", formData.Excerpt || "");
      data.append("LinkedMovie", formData.LinkedMovie || "");
      data.append("Featured", formData.Featured ? "1" : "0");
      data.append("Tags", JSON.stringify(formData.Tags || []));
      
      if (formData.PublishDate) {
        data.append("PublishDate", formData.PublishDate);
      }
      
      if (formData.ScheduledDate) {
        data.append("ScheduledDate", formData.ScheduledDate);
      }
      
      // ⚠️ CHỈ GỬI FILE ẢNH, KHÔNG GỬI URL
      if (formData.ImageFile instanceof File) {
        data.append("ImageUrl", formData.ImageFile);
      } else if (formData.ImageUrl instanceof File) {
        data.append("ImageUrl", formData.ImageUrl);
      }

      console.log("=== 📤 TẠO MỚI ===");
      for (let pair of data.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: [FILE] ${pair[1].name}`);
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await NewsApi.create(data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const newArticle = response.data.data || response.data;
      
      setArticles((prev) => [
        {
          ...newArticle,
          id: newArticle.NewsId || newArticle.id,
          title: newArticle.Title || newArticle.title,
          status: newArticle.Status || newArticle.status,
          views: 0,
          likes: 0,
          comments: 0,
        },
        ...prev
      ]);
      
      toast({
        title: "Thành công",
        description: "Thêm bài viết mới thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("❌ Lỗi khi thêm bài viết:", error);
      
      const errorMessage = error.response?.data?.message || "Không thể thêm bài viết mới";
      const errors = error.response?.data?.errors;
      
      let errorDetail = errorMessage;
      if (errors) {
        const errorList = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join("\n");
        errorDetail = `${errorMessage}\n\n${errorList}`;
      }
      
      toast({
        title: "Lỗi",
        description: errorDetail,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [toast]);

  // Update - SỬA HOÀN CHỈNH
  const updateArticle = useCallback(async (id, formData) => {
    try {
      const currentArticle = articles.find(a => (a.NewsId || a.id) === id);
      
      if (!currentArticle) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy bài viết cần cập nhật",
          status: "error",
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
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
        };
        slug = generateSlug(formData.Title);
      }
      
      const data = new FormData();
      data.append("_method", "PUT");
      
      const userId = localStorage.getItem("UserId") || "";
      
      // Gửi TẤT CẢ các trường
      data.append("UserId", userId || currentArticle.userId || "");
      data.append("Title", formData.Title || currentArticle.title || "");
      data.append("Slug", slug);
      data.append("Content", formData.Content || currentArticle.content || "");
      data.append("Status", formData.Status || currentArticle.status || "Draft");
      data.append("Category", formData.Category || currentArticle.category || "Tin tức");
      data.append("Author", formData.Author || currentArticle.author || "");
      data.append("Excerpt", formData.Excerpt || currentArticle.excerpt || "");
      data.append("LinkedMovie", formData.LinkedMovie || currentArticle.linkedMovie || "");
      data.append("Featured", formData.Featured ? "1" : "0");
      data.append("Tags", JSON.stringify(formData.Tags || currentArticle.tags || []));
      
      if (formData.PublishDate) {
        data.append("PublishDate", formData.PublishDate);
      } else if (formData.Status === "Published") {
        data.append("PublishDate", new Date().toISOString().slice(0, 10));
      } else {
        data.append("PublishDate", currentArticle.publishDate || "");
      }
      
      if (formData.ScheduledDate) {
        data.append("ScheduledDate", formData.ScheduledDate);
      } else {
        data.append("ScheduledDate", currentArticle.scheduledDate || "");
      }
      
      // ⚠️ QUAN TRỌNG: Xử lý ImageUrl - CHỈ GỬI FILE, KHÔNG GỬI URL
      if (formData.ImageFile instanceof File) {
        // Nếu có file mới
        data.append("ImageUrl", formData.ImageFile);
      } else if (formData.ImageUrl instanceof File) {
        // Nếu có file mới
        data.append("ImageUrl", formData.ImageUrl);
      }
      // ❌ KHÔNG gửi ImageUrl nếu là string (URL)
      // Server sẽ giữ nguyên ảnh cũ

      console.log("=== 📤 CẬP NHẬT ===");
      for (let pair of data.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: [FILE] ${pair[1].name} (${pair[1].size} bytes)`);
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await NewsApi.update(id, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("✅ Update response:", response.data);
      
      const updatedData = response.data.data || response.data;
      setArticles((prev) =>
        prev.map((a) =>
          (a.NewsId || a.id) === id ? { 
            ...a, 
            ...updatedData,
            title: updatedData.Title || updatedData.title || formData.Title || a.title,
            slug: updatedData.Slug || updatedData.slug || slug || a.slug,
            content: updatedData.Content || updatedData.content || formData.Content || a.content,
            status: updatedData.Status || updatedData.status || formData.Status || a.status,
            category: updatedData.Category || updatedData.category || formData.Category || a.category,
            author: updatedData.Author || updatedData.author || formData.Author || a.author,
            excerpt: updatedData.Excerpt || updatedData.excerpt || formData.Excerpt || a.excerpt,
            linkedMovie: updatedData.LinkedMovie || updatedData.linkedMovie || formData.LinkedMovie || a.linkedMovie,
            featured: updatedData.Featured !== undefined ? updatedData.Featured : (formData.Featured !== undefined ? formData.Featured : a.featured),
            tags: updatedData.Tags || updatedData.tags || formData.Tags || a.tags,
            imageUrl: updatedData.ImageUrl || updatedData.imageUrl || formData.ImageUrl || a.imageUrl,
            publishDate: updatedData.PublishDate || updatedData.publishDate || formData.PublishDate || a.publishDate,
            scheduledDate: updatedData.ScheduledDate || updatedData.scheduledDate || formData.ScheduledDate || a.scheduledDate,
          } : a
        )
      );
      
      toast({
        title: "Thành công",
        description: "Cập nhật bài viết thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("❌ LỖI KHI CẬP NHẬT:", error);
      console.error("❌ Response status:", error.response?.status);
      console.error("❌ Response data:", error.response?.data);
      
      let errorMessage = "Không thể cập nhật bài viết";
      let errorDetail = "";
      
      if (error.response?.data) {
        const errData = error.response.data;
        if (errData.message) {
          errorMessage = errData.message;
        }
        if (errData.errors) {
          const errorList = Object.entries(errData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("\n");
          errorDetail = errorList;
        }
      }
      
      toast({
        title: "Lỗi",
        description: errorDetail ? `${errorMessage}\n\n${errorDetail}` : errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [articles, toast]);

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
  };
}