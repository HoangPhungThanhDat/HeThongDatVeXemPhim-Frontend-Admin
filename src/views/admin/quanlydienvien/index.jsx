

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { DienVienList } from "./components/DienVienList";
import { DienVienForm } from "./components/DienVienForm";
import { DienVienDetail } from "./components/DienVienDetail";
import { useDienVien } from "./hooks/useDienVien";

export default function QuanLyDienVien() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  
  const {
    artists,
    movies,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    counts,
    toggleStatus,
    deleteArtist,
    createArtist,
    updateArtist,
  } = useDienVien();

  const handleSave = async (formData) => {
    let success = false;
    if (view === "add") {
      success = await createArtist(formData);
    } else {
      const id = selected.CastId || selected.id;
      success = await updateArtist(id, formData);
    }
    if (success) {
      setView("list");
    }
  };

  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DienVienList
          artists={artists}
          movies={movies}
          loading={loading}
          total={total}
          totalPages={totalPages}
          page={page}
          goToPage={goToPage}
          search={search}
          setSearch={setSearch}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          counts={counts}
          onAdd={() => setView("add")}
          onView={(a) => { setSelected(a); setView("detail"); }}
          onEdit={(a) => { setSelected(a); setView("edit"); }}
          onDelete={deleteArtist}
          onToggle={toggleStatus}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const artist = artists.find((a) => (a.CastId || a.id) === (selected.CastId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DienVienDetail
          artist={artist}
          movies={movies}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => {
            deleteArtist(artist.CastId || artist.id);
            setView("list");
          }}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DienVienForm
          isAdd
          movies={movies}
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const artist = artists.find((a) => (a.CastId || a.id) === (selected.CastId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <DienVienForm
          artist={artist}
          movies={movies}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}