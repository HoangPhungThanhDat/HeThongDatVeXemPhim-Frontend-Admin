import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@chakra-ui/react';
import MovieCastApi from 'api/catalog/MovieCastApi';
import MovieApi from 'api/catalog/MovieApi';

const PAGE_SIZE = 10;

export function useDienVien() {
  const [movies, setMovies] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [artists, setArtists] = useState([]);
  
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const toast = useToast();

  // Lấy danh sách phim
  const fetchMovies = useCallback(async () => {
    try {
      const response = await MovieApi.getAll();
      setMovies(response.data.data || response.data || []);
    } catch (error) {
      console.error('Lỗi tải phim:', error);
    }
  }, []);

  // Lấy tất cả diễn viên (để map thông tin)
  const fetchAllArtists = useCallback(async () => {
    try {
      const response = await MovieCastApi.getAll();
      setAllArtists(response.data.data || response.data || []);
    } catch (error) {
      console.error('Lỗi tải toàn bộ nghệ sĩ:', error);
    }
  }, []);

  // ✅ Hàm gọi API phân trang có lọc (Viết trực tiếp)
  const fetchPagedArtists = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: PAGE_SIZE,
      };
      
      if (search && search.trim() !== '') params.search = search.trim();
      if (filterRole !== 'Tất cả') params.role = filterRole;
      if (filterStatus !== 'Tất cả') params.status = filterStatus;

      // Log ra để kiểm tra (F12 -> Console)
      console.log("🚀 Gửi params lên API:", params); 

      const response = await MovieCastApi.getPaged(params);
      
      const resData = response.data.data || response.data;
      const items = resData.data || resData || [];
      const totalCount = resData.total || items.length;
      
      setArtists(items);
      setTotal(totalCount);
      setTotalPages(Math.ceil(totalCount / PAGE_SIZE) || 1);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nghệ sĩ phân trang:', error);
      toast({
        title: 'Lỗi tải dữ liệu',
        description: 'Không thể lấy danh sách nghệ sĩ',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRole, filterStatus, toast]);

  // Gọi lại API mỗi khi bộ lọc hoặc trang thay đổi
  useEffect(() => {
    if (page !== 1) {
      setPage(1); // Reset về trang 1 khi đổi bộ lọc
    } else {
      fetchPagedArtists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterRole, filterStatus, page]);

  // Khởi tạo dữ liệu phụ
  useEffect(() => {
    fetchMovies();
    fetchAllArtists();
  }, [fetchMovies, fetchAllArtists]);

  // ✅ Map tên phim vào nghệ sĩ
  const artistsWithMovies = useMemo(() => {
    return artists.map((artist) => {
      const fullArtist = allArtists.find(
        (a) => (a.CastId || a.id) === (artist.CastId || artist.id),
      );

      const movieId = artist.MovieId || artist.movieId || fullArtist?.MovieId || fullArtist?.movieId;
      const movieTitle = movies.find((m) => (m.MovieId || m.id) === movieId)?.Title || null;

      let movieList = [];
      if (movieTitle) movieList.push(movieTitle);

      if (fullArtist?.movies && Array.isArray(fullArtist.movies)) {
        fullArtist.movies.forEach((m) => {
          if (!movieList.includes(m)) movieList.push(m);
        });
      }

      return {
        ...artist,
        movies: movieList,
        movieTitle: movieTitle || 'N/A',
      };
    });
  }, [artists, allArtists, movies]);

  // ✅ Thống kê (Lấy từ allArtists để đếm chuẩn xác toàn bộ)
  const counts = useMemo(() => {
    return {
      total: allArtists.length || total,
      actors: allArtists.filter((a) => a.Role === 'Actor').length,
      directors: allArtists.filter((a) => a.Role === 'Director').length,
      both: allArtists.filter((a) => a.Role === 'Producer' || a.Role === 'Writer').length,
    };
  }, [allArtists, total]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Toggle status
  const toggleStatus = useCallback(async (artist) => {
    const id = artist.CastId || artist.id;
    const newStatus = artist.Status === 'Active' ? 'Inactive' : 'Active';

    try {
      await MovieCastApi.update(id, { Status: newStatus });
      fetchPagedArtists();
      fetchAllArtists();
      toast({ title: 'Thành công', description: `Đã đổi trạng thái`, status: 'success', duration: 2000 });
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật trạng thái', status: 'error', duration: 3000 });
    }
  }, [fetchPagedArtists, fetchAllArtists, toast]);

  // Delete
  const deleteArtist = useCallback(async (id) => {
    try {
      await MovieCastApi.delete(id);
      fetchPagedArtists();
      fetchAllArtists();
      toast({ title: 'Thành công', description: 'Đã xóa nghệ sĩ', status: 'success', duration: 2000 });
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể xóa', status: 'error', duration: 3000 });
    }
  }, [fetchPagedArtists, fetchAllArtists, toast]);

  // Create & Update
  const createArtist = useCallback(async (formData) => {
    try {
      await MovieCastApi.create(formData);
      fetchPagedArtists();
      fetchAllArtists();
      toast({ title: 'Thành công', description: 'Đã thêm nghệ sĩ', status: 'success' });
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể thêm', status: 'error' });
      return false;
    }
  }, [fetchPagedArtists, fetchAllArtists, toast]);

  const updateArtist = useCallback(async (id, formData) => {
    try {
      await MovieCastApi.update(id, formData);
      fetchPagedArtists();
      fetchAllArtists();
      toast({ title: 'Thành công', description: 'Đã cập nhật', status: 'success' });
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật', status: 'error' });
      return false;
    }
  }, [fetchPagedArtists, fetchAllArtists, toast]);

  return {
    artists: artistsWithMovies,
    movies,
    loading,
    total,
    totalPages,
    page,
    goToPage: handlePageChange,
    search, setSearch,
    filterRole, setFilterRole,
    filterStatus, setFilterStatus,
    counts,
    toggleStatus,
    deleteArtist,
    createArtist,
    updateArtist,
    reload: fetchPagedArtists,
  };
}