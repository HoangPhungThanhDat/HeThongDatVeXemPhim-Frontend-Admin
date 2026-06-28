

import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { TinTucList } from "./components/TinTucList";
import { TinTucForm } from "./components/TinTucForm";
import { TinTucDetail } from "./components/TinTucDetail";
import { useTinTuc } from "./hooks/useTinTuc";

export default function QuanLyTinTuc() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  
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
  } = useTinTuc();

  // Auto publish scheduled articles (simulate cron job)
  useEffect(() => {
    const autoPublish = () => {
      const now = new Date();
      // In real app, this would be handled by server cron job
      // We just check if any article status needs to change
    };
    autoPublish();
    const id = setInterval(autoPublish, 30000);
    return () => clearInterval(id);
  }, []);

  const handleSave = async (formData) => {
    let success = false;
    if (view === "add") {
      success = await createArticle(formData);
    } else {
      const id = selected.NewsId || selected.id;
      success = await updateArticle(id, formData);
    }
    if (success) {
      setView("list");
    }
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
          onAdd={() => setView("add")}
          onView={(a) => { setSelected(a); setView("detail"); }}
          onEdit={(a) => { setSelected(a); setView("edit"); }}
          onToggleStatus={toggleStatus}
          onDelete={deleteArticle}
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