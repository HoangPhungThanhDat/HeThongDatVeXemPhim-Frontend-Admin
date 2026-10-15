// views/admin/quanlytintuc/index.jsx

import { useState, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { TinTucList } from "./components/TinTucList";
import { TinTucForm } from "./components/TinTucForm";
import { TinTucDetail } from "./components/TinTucDetail";
import { useTinTuc } from "./hooks/useTinTuc";

export default function QuanLyTinTuc() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const toast = useToast();
  
  const {
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
    toggleStatus,
    deleteArticle,
    createArticle,
    updateArticle,
    refreshArticles,
  } = useTinTuc();

  // Auto publish scheduled articles (simulate cron job)
  useEffect(() => {
    const autoPublish = () => {
      // In real app, this would be handled by server cron job
    };
    autoPublish();
    const id = setInterval(autoPublish, 30000);
    return () => clearInterval(id);
  }, []);

  //  Xử lý lưu (thêm hoặc sửa)
  const handleSave = async (formData) => {
    try {
      let success = false;
      
      if (view === "add") {
        success = await createArticle(formData);
      } else {
        const id = selected?.NewsId || selected?.id;
        if (!id) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy ID bài viết",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        success = await updateArticle(id, formData);
      }
      
      if (success) {
        setView("list");
        await refreshArticles();
      }
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi lưu",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //  Xử lý xóa với xác nhận
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      deleteArticle(id);
      setView("list");
    }
  };

  //  Xử lý khi chọn xem chi tiết
  const handleView = (article) => {
    setSelected(article);
    setView("detail");
  };

  //  Xử lý khi chọn sửa
  const handleEdit = (article) => {
    setSelected(article);
    setView("edit");
  };

  //  Xử lý khi thêm mới
  const handleAdd = () => {
    setSelected(null);
    setView("add");
  };

  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TinTucList
          articles={articles}
          loading={loading}
          filtered={filtered}
          counts={counts}
          totalViews={totalViews}
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={toggleStatus}
          onDelete={handleDelete}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const article = articles.find((a) => (a.NewsId || a.id) === (selected.NewsId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TinTucDetail
          article={article}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TinTucForm
          isAdd
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const article = articles.find((a) => (a.NewsId || a.id) === (selected.NewsId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TinTucForm
          article={article}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}