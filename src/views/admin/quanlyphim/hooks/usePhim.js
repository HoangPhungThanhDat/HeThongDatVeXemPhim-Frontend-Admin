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

  // ✅ SỬA: Lấy thống kê từ API getAll - xử lý đúng genre object
  const fetchStats = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      const data = response.data.data || response.data || [];
      
      // ✅ Đảm bảo mỗi movie có genre object và genreName
      const processedData = data.map(movie => ({
        ...movie,
        genre: movie.genre || null,
        genreName: movie.genre?.Name || movie.GenreName || movie.genreName || "",
        genreId: movie.genre?.GenreId || movie.GenreId || movie.genreId || "",
      }));
      
      setStats({
        total: processedData.length,
        playing: processedData.filter((m) => m.Status === "NowShowing" || m.status === "NowShowing").length,
        upcoming: processedData.filter((m) => m.Status === "ComingSoon" || m.status === "ComingSoon").length,
        ended: processedData.filter((m) => m.Status === "Ended" || m.status === "Ended").length,
      });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  }, []);

  // Tạo params gửi lên server
  const extraParams = useMemo(() => {
    const params = {};
    if (search) params.search = search;
    if (filterStatus && filterStatus !== "Tất cả") params.status = filterStatus;
    if (filterGenre && filterGenre !== "Tất cả") params.genre = filterGenre;
    return params;
  }, [search, filterStatus, filterGenre]);

  // Sử dụng useServerPagination
  const {
    data: movies,
    total,
    totalPages,
    page,
    loading,
    goToPage,
    reload,
    prependData,
  } = useServerPagination(MovieApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // ✅ SỬA: Xử lý movies khi có dữ liệu mới - đảm bảo genre object
  const processedMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    
    return movies.map(movie => ({
      ...movie,
      genre: movie.genre || null,
      genreName: movie.genre?.Name || movie.GenreName || movie.genreName || "",
      genreId: movie.genre?.GenreId || movie.GenreId || movie.genreId || "",
      // Đảm bảo các trường cần thiết
      MovieId: movie.MovieId || movie.id,
      Title: movie.Title || movie.title,
      Status: movie.Status || movie.status,
      PosterUrl: movie.PosterUrl || movie.posterUrl,
      Duration: movie.Duration || movie.duration,
      ReleaseDate: movie.ReleaseDate || movie.releaseDate,
      Rated: movie.Rated || movie.rated,
      Language: movie.Language || movie.language,
      Description: movie.Description || movie.description,
      TrailerUrl: movie.TrailerUrl || movie.trailerUrl,
      CreatedAt: movie.CreatedAt || movie.createdAt,
      UpdatedAt: movie.UpdatedAt || movie.updatedAt,
      CreatedBy: movie.CreatedBy || movie.createdBy,
      UpdatedBy: movie.UpdatedBy || movie.updatedBy,
    }));
  }, [movies]);

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchGenres();
    fetchStats();
  }, [fetchGenres, fetchStats]);

  // Reload lại stats khi có thay đổi
  const reloadAll = useCallback(() => {
    reload();
    fetchStats();
  }, [reload, fetchStats]);

  // Stats
  const counts = useMemo(() => ({
    total: stats.total,
    playing: stats.playing,
    upcoming: stats.upcoming,
    ended: stats.ended,
  }), [stats]);

  // Toggle hide
  const toggleHide = useCallback(async (movie) => {
    const id = movie.MovieId || movie.id;
    const currentStatus = movie.Status || movie.status || "NowShowing";
    const newStatus = currentStatus === "NowShowing" ? "Ended" : "NowShowing";
    
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      
      // Lấy dữ liệu đầy đủ của movie
      const movieData = await MovieApi.getById(id);
      const fullMovie = movieData.data.data || movieData.data;
      
      formData.append("UserId", fullMovie.UserId || localStorage.getItem("UserId") || "");
      formData.append("Title", fullMovie.Title || movie.Title || movie.title || "");
      formData.append("GenreId", fullMovie.GenreId || movie.GenreId || movie.genreId || "");
      formData.append("Duration", fullMovie.Duration || movie.Duration || movie.duration || "");
      formData.append("ReleaseDate", fullMovie.ReleaseDate || movie.ReleaseDate || movie.releaseDate || "");
      formData.append("Status", newStatus);
      formData.append("Rated", fullMovie.Rated || movie.Rated || movie.rated || "P");
      formData.append("Format", fullMovie.Format || movie.Format || movie.format || "2D");
      formData.append("Language", fullMovie.Language || movie.Language || movie.language || "Vietsub");
      
      await MovieApi.update(id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reloadAll();
      
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
      reloadAll();
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

  // ✅ CREATE - Nhận FormData và upload ảnh
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
      
      // Xử lý ảnh - gửi file nếu có
      if (formData.PosterFile instanceof File) {
        data.append("PosterUrl", formData.PosterFile);
      }

      const response = await MovieApi.create(data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const newMovie = response.data.data || response.data;
      
      // ✅ Tạo movie item với đầy đủ thông tin, bao gồm genre
      const movieItem = {
        ...newMovie,
        id: newMovie.MovieId || newMovie.id,
        MovieId: newMovie.MovieId || newMovie.id,
        title: newMovie.Title || newMovie.title || "",
        Title: newMovie.Title || newMovie.title || "",
        status: newMovie.Status || newMovie.status || "NowShowing",
        Status: newMovie.Status || newMovie.status || "NowShowing",
        genre: newMovie.genre || null,
        genreName: newMovie.genre?.Name || newMovie.GenreName || newMovie.genreName || "",
        genreId: newMovie.genre?.GenreId || newMovie.GenreId || newMovie.genreId || "",
        GenreId: newMovie.genre?.GenreId || newMovie.GenreId || newMovie.genreId || "",
        duration: newMovie.Duration || newMovie.duration || "",
        Duration: newMovie.Duration || newMovie.duration || "",
        releaseDate: newMovie.ReleaseDate || newMovie.releaseDate || "",
        ReleaseDate: newMovie.ReleaseDate || newMovie.releaseDate || "",
        posterUrl: newMovie.PosterUrl || newMovie.posterUrl || "",
        PosterUrl: newMovie.PosterUrl || newMovie.posterUrl || "",
        description: newMovie.Description || newMovie.description || "",
        Description: newMovie.Description || newMovie.description || "",
        language: newMovie.Language || newMovie.language || "",
        Language: newMovie.Language || newMovie.language || "",
        rated: newMovie.Rated || newMovie.rated || "P",
        Rated: newMovie.Rated || newMovie.rated || "P",
        format: newMovie.Format || newMovie.format || "2D",
        Format: newMovie.Format || newMovie.format || "2D",
        director: newMovie.Director || newMovie.director || "",
        Director: newMovie.Director || newMovie.director || "",
        cast: newMovie.Cast || newMovie.cast || "",
        Cast: newMovie.Cast || newMovie.cast || "",
        country: newMovie.Country || newMovie.country || "",
        Country: newMovie.Country || newMovie.country || "",
        distributor: newMovie.Distributor || newMovie.distributor || "",
        Distributor: newMovie.Distributor || newMovie.distributor || "",
        trailerUrl: newMovie.TrailerUrl || newMovie.trailerUrl || "",
        TrailerUrl: newMovie.TrailerUrl || newMovie.trailerUrl || "",
        createdAt: new Date().toISOString(),
        CreatedAt: new Date().toISOString(),
        createdBy: userId,
        CreatedBy: userId,
      };
      
      prependData(movieItem);
      await fetchStats();
      
      toast({
        title: "Thành công 🎉",
        description: `Đã tạo phim "${movieItem.title}" thành công`,
        status: "success",
        duration: 3000,
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
  }, [prependData, fetchStats, toast]);

  // ✅ UPDATE - Nhận FormData và upload ảnh mới
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
      
      // Xử lý ảnh - gửi file nếu có
      if (formData.PosterFile instanceof File) {
        data.append("PosterUrl", formData.PosterFile);
      }

      await MovieApi.update(id, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      await reloadAll();
      
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
    movies: processedMovies, // ✅ Trả về movies đã xử lý
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
    fetchGenres,
    toggleHide,
    deleteMovie,
    createMovie,
    updateMovie,
    reload: reloadAll,
  };
}