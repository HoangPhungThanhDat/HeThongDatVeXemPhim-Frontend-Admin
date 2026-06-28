

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import MovieCastApi from "../../../../api/MovieCastApi";
import MovieApi from "../../../../api/MovieApi";
import { useServerPagination } from "../../../../hooks/useServerPagination";

const PAGE_SIZE = 10;

export function useDienVien() {
  const [movies, setMovies] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const toast = useToast();

  // Lấy danh sách phim
  const fetchMovies = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      const data = response.data.data || response.data || [];
      setMovies(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    }
  }, []);

  // ✅ Lấy tất cả diễn viên để có thông tin phim tham gia
  const fetchAllArtists = useCallback(async () => {
    try {
      const response = await MovieCastApi.getAll();
      const data = response.data.data || response.data || [];
      setAllArtists(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách diễn viên:", error);
    }
  }, []);

  // ✅ Tạo params gửi lên server
  const extraParams = useMemo(() => {
    const params = {};
    if (search) params.search = search;
    if (filterRole && filterRole !== "Tất cả") params.role = filterRole;
    if (filterStatus && filterStatus !== "Tất cả") params.status = filterStatus;
    return params;
  }, [search, filterRole, filterStatus]);

  // ✅ Sử dụng useServerPagination
  const {
    data: artists,
    total,
    totalPages,
    page,
    loading,
    goToPage,
    reload,
  } = useServerPagination(MovieCastApi.getPaged, { limit: PAGE_SIZE, extraParams });

  // ✅ Kết hợp dữ liệu: lấy movies từ allArtists để hiển thị
  const artistsWithMovies = useMemo(() => {
    return artists.map((artist) => {
      // Tìm thông tin đầy đủ của diễn viên này trong allArtists
      const fullArtist = allArtists.find(a => (a.CastId || a.id) === (artist.CastId || artist.id));
      
      // Tìm danh sách phim của diễn viên này
      // Nếu có MovieId, lấy tên phim từ movies
      const movieId = artist.MovieId || artist.movieId || fullArtist?.MovieId || fullArtist?.movieId;
      const movieTitle = movies.find(m => (m.MovieId || m.id) === movieId)?.Title || null;
      
      // Tạo danh sách phim tham gia
      let movieList = [];
      
      // Nếu có phim chính, thêm vào danh sách
      if (movieTitle) {
        movieList.push(movieTitle);
      }
      
      // Nếu có danh sách phim từ fullArtist, thêm vào
      if (fullArtist?.movies && Array.isArray(fullArtist.movies)) {
        fullArtist.movies.forEach(m => {
          if (!movieList.includes(m)) {
            movieList.push(m);
          }
        });
      }
      
      // Nếu có field Movies từ API (có thể là string hoặc array)
      if (fullArtist?.Movies) {
        if (Array.isArray(fullArtist.Movies)) {
          fullArtist.Movies.forEach(m => {
            if (!movieList.includes(m)) {
              movieList.push(m);
            }
          });
        } else if (typeof fullArtist.Movies === "string") {
          fullArtist.Movies.split(",").forEach(m => {
            const trimmed = m.trim();
            if (trimmed && !movieList.includes(trimmed)) {
              movieList.push(trimmed);
            }
          });
        }
      }
      
      return {
        ...artist,
        movies: movieList,
        movieTitle: movieTitle || "N/A",
      };
    });
  }, [artists, allArtists, movies]);

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchMovies();
    fetchAllArtists();
  }, [fetchMovies, fetchAllArtists]);

  // ✅ Stats
  const counts = useMemo(() => ({
    total: total || 0,
    actors: artists.filter((a) => a.Role === "Actor").length,
    directors: artists.filter((a) => a.Role === "Director").length,
    both: artists.filter((a) => a.Role === "Producer" || a.Role === "Writer").length,
  }), [artists, total]);

  // Toggle status
  const toggleStatus = useCallback(async (artist) => {
    const id = artist.CastId || artist.id;
    const newStatus = artist.Status === "Active" ? "Inactive" : "Active";
    
    try {
      await MovieCastApi.update(id, {
        Status: newStatus,
      });

      reload();
      fetchAllArtists(); // ✅ Reload lại allArtists
      
      toast({
        title: "Thành công",
        description: `Nghệ sĩ đã ${newStatus === "Active" ? "hoạt động" : "khóa"}`,
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
  }, [reload, fetchAllArtists, toast]);

  // Delete
  const deleteArtist = useCallback(async (id) => {
    try {
      await MovieCastApi.delete(id);
      reload();
      fetchAllArtists(); // ✅ Reload lại allArtists
      toast({
        title: "Thành công",
        description: "Nghệ sĩ đã được xóa",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa nghệ sĩ:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa nghệ sĩ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [reload, fetchAllArtists, toast]);

  // Create
  const createArtist = useCallback(async (formData) => {
    try {
      await MovieCastApi.create(formData);
      reload();
      fetchAllArtists(); // ✅ Reload lại allArtists
      
      toast({
        title: "Thành công",
        description: "Thêm nghệ sĩ mới thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm nghệ sĩ:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể thêm nghệ sĩ mới",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [reload, fetchAllArtists, toast]);

  // Update
  const updateArtist = useCallback(async (id, formData) => {
    try {
      await MovieCastApi.update(id, formData);
      reload();
      fetchAllArtists(); // ✅ Reload lại allArtists
      
      toast({
        title: "Thành công",
        description: "Cập nhật nghệ sĩ thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật nghệ sĩ:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật nghệ sĩ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  }, [reload, fetchAllArtists, toast]);

  return {
    artists: artistsWithMovies, // ✅ Trả về artists đã có movies
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
    reload,
  };
}