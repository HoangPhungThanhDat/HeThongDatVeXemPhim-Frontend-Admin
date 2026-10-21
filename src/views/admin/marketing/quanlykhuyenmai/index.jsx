
import { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { KhuyenMaiList } from "./components/KhuyenMaiList";
import { KhuyenMaiForm } from "./components/KhuyenMaiForm";
import { KhuyenMaiDetail } from "./components/KhuyenMaiDetail";
import { useKhuyenMai } from "./hooks/useKhuyenMai";

export default function QuanLyKhuyenMai() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const {
    promos, loading, search, setSearch,
    filterStatus, setFilterStatus,
    filterType, setFilterType,
    filtered, counts, updatingIds,
    toggleStatus, deletePromo, createPromo, updatePromo, refreshPromos,
  } = useKhuyenMai();

  const handleSave = async (formData) => {
    try {
      let success = false;
      if (view === "add") {
        success = await createPromo(formData);
      } else {
        const id = selected?.id || selected?.PromotionId;
        if (!id) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy ID khuyến mãi",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        success = await updatePromo(id, formData);
      }
      if (success) {
        setView("list");
        await refreshPromos();
      }
    } catch (error) {
      console.error("Lỗi khi lưu khuyến mãi:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi lưu",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này?")) {
      deletePromo(id);
      setView("list");
    }
  };

  const handleView = (promo) => { setSelected(promo); setView("detail"); };
  const handleEdit = (promo) => { setSelected(promo); setView("edit"); };
  const handleAdd = () => { setSelected(null); setView("add"); };

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
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onToggle={toggleStatus}
          onDelete={handleDelete}
          updatingIds={updatingIds}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const promo = promos.find((p) => (p.id || p.PromotionId) === (selected.id || selected.PromotionId)) || selected;
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiDetail
          promo={promo}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => handleDelete(promo.id || promo.PromotionId)}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiForm isAdd onCancel={() => setView("list")} onSave={handleSave} />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const promo = promos.find((p) => (p.id || p.PromotionId) === (selected.id || selected.PromotionId)) || selected;
    return (
      <Box pt={{ base: "120px", md: "80px" }} minH="100vh">
        <KhuyenMaiForm promo={promo} onCancel={() => setView("detail")} onSave={handleSave} />
      </Box>
    );
  }

  return null;
}