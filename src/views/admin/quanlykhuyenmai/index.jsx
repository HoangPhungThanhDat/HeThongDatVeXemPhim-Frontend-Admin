// views/admin/quanlykhuyenmai/index.jsx

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { KhuyenMaiList } from "./components/KhuyenMaiList";
import { KhuyenMaiForm } from "./components/KhuyenMaiForm";
import { KhuyenMaiDetail } from "./components/KhuyenMaiDetail";
import { useKhuyenMai } from "./hooks/useKhuyenMai";

export default function QuanLyKhuyenMai() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  
  const {
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
    toggleStatus,
    deletePromo,
    createPromo,
    updatePromo,
  } = useKhuyenMai();

  const handleSave = async (formData) => {
    let success = false;
    if (view === "add") {
      success = await createPromo(formData);
    } else {
      const id = selected.PromotionId || selected.id;
      success = await updatePromo(id, formData);
    }
    if (success) {
      setView("list");
    }
  };

  if (view === "list") {
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiList
          promos={promos}
          loading={loading}
          filtered={filtered}
          counts={counts}
          total={promos.length}
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          onAdd={() => setView("add")}
          onView={(p) => { setSelected(p); setView("detail"); }}
          onEdit={(p) => { setSelected(p); setView("edit"); }}
          onToggle={toggleStatus}
          onDelete={deletePromo}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const promo = promos.find((p) => (p.PromotionId || p.id) === (selected.PromotionId || selected.id)) || selected;
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiDetail
          promo={promo}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => {
            deletePromo(promo.PromotionId || promo.id);
            setView("list");
          }}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiForm
          isAdd
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const promo = promos.find((p) => (p.PromotionId || p.id) === (selected.PromotionId || selected.id)) || selected;
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiForm
          promo={promo}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}