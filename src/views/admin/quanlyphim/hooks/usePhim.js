// views/admin/quanlyphim/hooks/usePhim.js

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import MovieApi from "../../../../api/MovieApi";
import GenreApi from "../../../../api/GenreApi";
import { useServerPagination } from "../../../../hooks/useServerPagination";

const PAGE_SIZE = 10;

export function usePhim() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterGenre, setFilterGenre] = useState("Tất cả");
  const [stats, setStats] = useState({ total: 0, playing: 0, upcoming: 0, ended: 0 });
  const toast = useToast();

  // Lấy danh sách genres
  const fetchGenres = useCallback(async () => {
    try {
      const response = await GenreApi.getAll();
      const data = response.data.data || response.data || [];
      setGenres(data);
    } catch (error) {
      console.error("Lỗi khi tải thể loại:", error);
    }
  }, []);

  // ✅ Lấy thống kê từ API getAll
  const fetchStats = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      const data = response.data.data || response.data || [];
      
      setStats({
        total: data.length,
        playing: data.filter((m) => m.Status === "NowShowing" || m.status === "NowShowing").length,
        upcoming: data.filter((m) => m.Status === "ComingSoon" || m.status === "ComingSoon").length,
        ended: data.filter((m) => m.Status === "Ended" || m.status === "Ended").length,
      });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  }, []);

  // ✅ Tạo params gửi lên server
  const extraParams = useMemo(() => {
    const params = {};
    if (search) params.search = search;
    if (filterStatus && filterStatus !== "Tất cả") params.status = filterStatus;
    return params;
  }, [search, filterStatus]);

  // ✅ Sử dụng useServerPagination
  const {
    data: movies,
    total,
    totalPages,
    page,
    loading,
    goToPage,
    reload,
  } = useServerPagination(MovieApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchGenres();
    fetchStats();
  }, [fetchGenres, fetchStats]);

  // ✅ Reload lại stats khi có thay đổi
  const reloadAll = useCallback(() => {
    reload();
    fetchStats();
  }, [reload, fetchStats]);

  // ✅ Sử dụng stats từ server
  const counts = useMemo(() => ({
    total: stats.total,
    playing: stats.playing,
    upcoming: stats.upcoming,
    ended: stats.ended,
  }), [stats]);

  // Toggle hide
  const toggleHide = useCallback(async (movie) => {
    const id = movie.MovieId || movie.id;
    const newStatus = movie.status === "NowShowing" ? "Ended" : "NowShowing";
    
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      
      const movieData = await MovieApi.getById(id);
      const fullMovie = movieData.data.data || movieData.data;
      
      formData.append("UserId", fullMovie.UserId || localStorage.getItem("UserId") || "");
      formData.append("Title", fullMovie.Title || movie.title || "");
      formData.append("GenreId", fullMovie.GenreId || movie.genreId || "");
      formData.append("Duration", fullMovie.Duration || movie.duration || "");
      formData.append("ReleaseDate", fullMovie.ReleaseDate || movie.releaseDate || "");
      formData.append("Status", newStatus);
      formData.append("Rated", fullMovie.Rated || movie.rated || "P");
      formData.append("Format", fullMovie.Format || movie.format || "2D");
      formData.append("Language", fullMovie.Language || movie.language || "Vietsub");
      
      await MovieApi.update(id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reloadAll(); // ✅ Reload cả dữ liệu và stats
      
      toast({
        title: "Thành công",
        description: `Phim đã ${newStatus === "NowShowing" ? "hiển thị" : "ẩn"}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [reloadAll, toast]);

  // Delete
  const deleteMovie = useCallback(async (id) => {
    try {
      await MovieApi.delete(id);
      reloadAll(); // ✅ Reload cả dữ liệu và stats
      toast({
        title: "Thành công",
        description: "Phim đã được xóa",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa phim",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [reloadAll, toast]);

  // Create
  const createMovie = useCallback(async (formData) => {
    try {
      const data = new FormData();
      const userId = localStorage.getItem("UserId") || "";
      
      if (!userId) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập để thêm phim",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      
      data.append("UserId", userId);
      data.append("Title", formData.Title || "");
      data.append("GenreId", formData.GenreId || "");
      data.append("Duration", formData.Duration || "");
      data.append("ReleaseDate", formData.ReleaseDate || "");
      data.append("Status", formData.Status || "NowShowing");
      data.append("Rated", formData.Rated || "P");
      data.append("Format", formData.Format || "2D");
      data.append("Director", formData.Director || "");
      data.append("Cast", formData.Cast || "");
      data.append("Country", formData.Country || "");
      data.append("Distributor", formData.Distributor || "");
      data.append("TrailerUrl", formData.TrailerUrl || "");
      data.append("Description", formData.Description || "");
      
      let languageValue = formData.Language || "";
      if (Array.isArray(languageValue)) {
        languageValue = languageValue.join(",");
      }
      if (!languageValue) {
        languageValue = "Vietsub";
      }
      data.append("Language", languageValue);
      
      if (formData.PosterFile instanceof File) {
        data.append("PosterUrl", formData.PosterFile);
      }

      await MovieApi.create(data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      reloadAll(); // ✅ Reload cả dữ liệu và stats
      
      toast({
        title: "Thành công",
        description: "Thêm phim mới thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể thêm phim mới",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [reloadAll, toast]);

  // Update
  const updateMovie = useCallback(async (id, formData) => {
    try {
      const data = new FormData();
      data.append("_method", "PUT");
      
      const userId = localStorage.getItem("UserId") || "";
      
      data.append("UserId", userId || "");
      data.append("Title", formData.Title || "");
      data.append("GenreId", formData.GenreId || "");
      data.append("Duration", formData.Duration || "");
      data.append("ReleaseDate", formData.ReleaseDate || "");
      data.append("Status", formData.Status || "NowShowing");
      data.append("Rated", formData.Rated || "P");
      data.append("Format", formData.Format || "2D");
      data.append("Director", formData.Director || "");
      data.append("Cast", formData.Cast || "");
      data.append("Country", formData.Country || "");
      data.append("Distributor", formData.Distributor || "");
      data.append("TrailerUrl", formData.TrailerUrl || "");
      data.append("Description", formData.Description || "");
      
      let languageValue = formData.Language || "";
      if (Array.isArray(languageValue)) {
        languageValue = languageValue.join(",");
      }
      if (!languageValue) {
        languageValue = "Vietsub";
      }
      data.append("Language", languageValue);
      
      if (formData.PosterFile instanceof File) {
        data.append("PosterUrl", formData.PosterFile);
      }

      await MovieApi.update(id, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      reloadAll(); // ✅ Reload cả dữ liệu và stats
      
      toast({
        title: "Thành công",
        description: "Cập nhật phim thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật phim:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật phim",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [reloadAll, toast]);

  return {
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
    counts, // ✅ Thống kê chính xác từ server
    fetchGenres,
    toggleHide,
    deleteMovie,
    createMovie,
    updateMovie,
    reload: reloadAll,
  };
}