

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { TheLoaiList } from "./components/TheLoaiList";
import { TheLoaiForm } from "./components/TheLoaiForm";
import { TheLoaiDetail } from "./components/TheLoaiDetail";
import { useTheLoai } from "./hooks/useTheLoai";

export default function QuanLyTheLoai() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  
  const {
    genres,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    counts,
    toggleStatus,
    deleteGenre,
    createGenre,
    updateGenre,
  } = useTheLoai();

  const handleSave = async (formData) => {
    let success = false;
    if (view === "add") {
      success = await createGenre(formData);
    } else {
      const id = selected.GenreId || selected.id;
      success = await updateGenre(id, formData);
    }
    if (success) {
      setView("list");
    }
  };

  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TheLoaiList
          genres={genres}
          loading={loading}
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          counts={counts}
          onAdd={() => setView("add")}
          onView={(g) => { setSelected(g); setView("detail"); }}  // ✅ Thêm onView
          onEdit={(g) => { setSelected(g); setView("edit"); }}
          onDelete={deleteGenre}
          onToggle={toggleStatus}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const genre = genres.find((g) => (g.GenreId || g.id) === (selected.GenreId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TheLoaiDetail
          genre={genre}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => {
            deleteGenre(genre.GenreId || genre.id);
            setView("list");
          }}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TheLoaiForm
          isAdd
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const genre = genres.find((g) => (g.GenreId || g.id) === (selected.GenreId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <TheLoaiForm
          genre={genre}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}