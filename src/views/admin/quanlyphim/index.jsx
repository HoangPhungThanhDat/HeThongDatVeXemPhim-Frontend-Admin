

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { PhimList } from "./components/PhimList";
import { PhimForm } from "./components/PhimForm";
import { PhimDetail } from "./components/PhimDetail";
import { usePhim } from "./hooks/usePhim";

export default function QuanLyPhim() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  
  const {
    movies,
    genres,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterGenre,
    setFilterGenre,
    counts,
    toggleHide,
    deleteMovie,
    createMovie,
    updateMovie,
  } = usePhim();

  const handleSave = async (formData) => {
    let success = false;
    if (view === "add") {
      success = await createMovie(formData);
    } else {
      const id = selected.MovieId || selected.id;
      success = await updateMovie(id, formData);
    }
    if (success) {
      setView("list");
    }
  };

  if (view === "list") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <PhimList
          movies={movies}
          genres={genres}
          loading={loading}
          total={total}
          totalPages={totalPages}
          page={page}
          goToPage={goToPage}
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          counts={counts}
          onAdd={() => setView("add")}
          onView={(m) => { setSelected(m); setView("detail"); }}
          onEdit={(m) => { setSelected(m); setView("edit"); }}
          onHide={toggleHide}
          onDelete={deleteMovie}
        />
      </Box>
    );
  }

  if (view === "detail" && selected) {
    const movie = movies.find((m) => (m.MovieId || m.id) === (selected.MovieId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <PhimDetail
          movie={movie}
          onBack={() => setView("list")}
          onEdit={() => setView("edit")}
          onDelete={() => {
            deleteMovie(movie.MovieId || movie.id);
            setView("list");
          }}
        />
      </Box>
    );
  }

  if (view === "add") {
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <PhimForm
          isAdd
          genres={genres}
          onCancel={() => setView("list")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  if (view === "edit" && selected) {
    const movie = movies.find((m) => (m.MovieId || m.id) === (selected.MovieId || selected.id)) || selected;
    return (
      <Box pt={{ base: "100px", md: "80px" }}>
        <PhimForm
          movie={movie}
          genres={genres}
          onCancel={() => setView("detail")}
          onSave={handleSave}
        />
      </Box>
    );
  }

  return null;
}