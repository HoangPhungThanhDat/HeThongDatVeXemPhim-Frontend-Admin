import { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { PhimList } from "./components/PhimList";
import { PhimForm } from "./components/PhimForm";
import { PhimDetail } from "./components/PhimDetail";
import { usePhim } from "./hooks/usePhim";

export default function QuanLyPhim() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const toast = useToast();
  
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
    deleteMovie,
    createMovie,
    updateMovie,
    updateMovieStatus, // ✅ Lấy hàm cập nhật trạng thái
  } = usePhim();

  const handleSave = async (formData) => {
    try {
      let success = false;
      if (view === "add") {
        success = await createMovie(formData);
      } else {
        const id = selected?.MovieId || selected?.id;
        if (!id) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy ID phim",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        success = await updateMovie(id, formData);
      }
      if (success) {
        setView("list");
      }
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
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
    if (window.confirm("Bạn có chắc muốn xóa phim này?")) {
      deleteMovie(id);
      setView("list");
    }
  };

  const handleView = (movie) => {
    setSelected(movie);
    setView("detail");
  };

  const handleEdit = (movie) => {
    setSelected(movie);
    setView("edit");
  };

  const handleAdd = () => {
    setSelected(null);
    setView("add");
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
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStatus={updateMovieStatus} // ✅ Truyền xuống
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
          onDelete={() => handleDelete(movie.MovieId || movie.id)}
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