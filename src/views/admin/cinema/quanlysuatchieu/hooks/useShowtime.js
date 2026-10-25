import { useState, useEffect, useCallback, useMemo } from 'react';
import ShowtimeApi from 'api/cinema/ShowtimeApi';
import MovieApi from 'api/catalog/MovieApi';
import RoomApi from 'api/cinema/RoomApi';
import { PAGE_SIZE, STATUS_LABELS } from '../constants';
import Swal from 'sweetalert2';

export const useShowtime = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [showDetail, setShowDetail] = useState(false);

  const fetchData = useCallback(async (targetPage = page) => {
    try {
      setLoading(true);
      const [showtimeRes, movieRes, roomRes] = await Promise.all([
        ShowtimeApi.getPaged({
          page: targetPage,
          limit: PAGE_SIZE,
          search,
          status: filterStatus,
        }),
        MovieApi.getAll(),
        RoomApi.getAll(),
      ]);

      let showtimeData = [];
      if (showtimeRes.data && showtimeRes.data.data) {
        showtimeData = showtimeRes.data.data;
        setTotal(showtimeRes.data.total || 0);
        setTotalPages(showtimeRes.data.totalPages || 1);
      } else if (Array.isArray(showtimeRes.data)) {
        showtimeData = showtimeRes.data;
        setTotal(showtimeData.length);
        setTotalPages(Math.ceil(showtimeData.length / PAGE_SIZE));
      } else {
        showtimeData = showtimeRes.data.data || showtimeRes.data || [];
        setTotal(showtimeData.length || 0);
        setTotalPages(Math.ceil((showtimeData.length || 0) / PAGE_SIZE));
      }

      setShowtimes(showtimeData);
      setMovies(movieRes.data.data || movieRes.data || []);
      setRooms(roomRes.data.data || roomRes.data || []);
    } catch (error) {
      console.error('❌ Lỗi load dữ liệu:', error);
      setShowtimes([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const getMovieTitle = useCallback((id) => {
    if (!id) return 'N/A';
    if (typeof id === 'object' && id.Title) return id.Title;
    const movie = movies.find((m) => m.MovieId === id || m.MovieId === parseInt(id));
    return movie?.Title || id || 'N/A';
  }, [movies]);

  const getRoomName = useCallback((id) => {
    if (!id) return 'N/A';
    if (typeof id === 'object' && id.Name) return id.Name;
    const room = rooms.find((r) => r.RoomId === id || r.RoomId === parseInt(id));
    return room?.Name || id || 'N/A';
  }, [rooms]);

  const getStatusLabel = useCallback((status) => {
    return STATUS_LABELS[status] || status || 'N/A';
  }, []);

  const handleAdd = useCallback(async (newShowtime, onClose) => {
    try {
      const payload = {
        MovieId: Number(newShowtime.movieId),
        RoomId: Number(newShowtime.roomId),
        StartTime: newShowtime.startTime,
        EndTime: newShowtime.endTime,
        Price: Number(newShowtime.price),
        Status: newShowtime.status || 'Scheduled',
      };

      await ShowtimeApi.create(payload);

      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: '🎉 Thêm suất chiếu thành công!',
        showConfirmButton: false, timer: 3000, timerProgressBar: true,
      });

      onClose();
      
      // ✅ SỬA LỖI: Quay về trang 1 và load lại để thấy suất chiếu mới
      setPage(1);
      if (page === 1) fetchData(1); // Nếu đang ở trang 1 thì gọi trực tiếp vì useEffect không trigger
      return true;
    } catch (error) {
      console.error('❌ Lỗi tạo suất chiếu:', error);
      Swal.fire({
        toast: true, position: 'top-end', icon: 'error',
        title: error.response?.data?.message || '❌ Thêm thất bại!',
        showConfirmButton: false, timer: 3000, timerProgressBar: true,
      });
      throw error;
    }
  }, [page, fetchData]);

  const handleUpdate = useCallback(async (editingData, onClose) => {
    try {
      const payload = {
        MovieId: Number(editingData.movieId),
        RoomId: Number(editingData.roomId),
        StartTime: editingData.startTime,
        EndTime: editingData.endTime,
        Price: Number(editingData.price),
        Status: editingData.status,
      };

      await ShowtimeApi.update(editingData.showtimeId, payload);

      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: '✅ Cập nhật thành công!',
        showConfirmButton: false, timer: 2000, timerProgressBar: true,
      });

      onClose();
      fetchData(page); // Load lại trang hiện tại
      return true;
    } catch (error) {
      console.error('❌ Lỗi cập nhật:', error);
      Swal.fire({
        toast: true, position: 'top-end', icon: 'error',
        title: error.response?.data?.message || '❌ Cập nhật thất bại!',
        showConfirmButton: false, timer: 3000, timerProgressBar: true,
      });
      throw error;
    }
  }, [page, fetchData]);

  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await ShowtimeApi.delete(id);
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: '🗑️ Đã xóa thành công!',
          showConfirmButton: false, timer: 3000, timerProgressBar: true,
        });
        // Nếu xóa suất chiếu cuối cùng của trang hiện tại, lùi về trang trước
        const isLastItemOnPage = showtimes.length === 1;
        if (isLastItemOnPage && page > 1) {
          setPage(page - 1);
        } else {
          fetchData(page);
        }
        if (selected?.ShowtimeId === id) {
          setSelected(null);
          setShowDetail(false);
        }
        return true;
      } catch (error) {
        console.error('❌ Lỗi xóa:', error);
        Swal.fire({
          toast: true, position: 'top-end', icon: 'error',
          title: '❌ Xóa thất bại!',
          showConfirmButton: false, timer: 3000, timerProgressBar: true,
        });
        throw error;
      }
    }
    return false;
  }, [page, fetchData, showtimes.length, selected]);

  const handleToggleStatus = useCallback(async (id) => {
    const showtime = showtimes.find((s) => s.ShowtimeId === id);
    if (!showtime) return;

    const newStatus = showtime.Status === 'Scheduled' ? 'Cancelled' : 'Scheduled';

    try {
      const payload = {
        MovieId: Number(showtime.MovieId),
        RoomId: Number(showtime.RoomId),
        StartTime: showtime.StartTime,
        EndTime: showtime.EndTime,
        Price: Number(showtime.Price),
        Status: newStatus,
      };

      await ShowtimeApi.update(id, payload);
      
      setShowtimes((prev) => prev.map((s) => s.ShowtimeId === id ? { ...s, Status: newStatus } : s));
      if (selected?.ShowtimeId === id) setSelected({ ...selected, Status: newStatus });

      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: `✅ Đã ${newStatus === 'Scheduled' ? 'kích hoạt' : 'hủy'}!`,
        showConfirmButton: false, timer: 2000, timerProgressBar: true,
      });
    } catch (error) {
      console.error('❌ Lỗi cập nhật trạng thái:', error);
      Swal.fire({
        toast: true, position: 'top-end', icon: 'error',
        title: '❌ Không thể cập nhật trạng thái!',
        showConfirmButton: false, timer: 3000, timerProgressBar: true,
      });
    }
  }, [showtimes, selected]);

  const handleView = useCallback((s) => { setSelected(s); setShowDetail(true); }, []);
  const goToPage = useCallback((newPage) => { if (newPage >= 1 && newPage <= totalPages) setPage(newPage); }, [totalPages]);
  const reload = useCallback(() => { fetchData(page); }, [fetchData, page]);

  const counts = useMemo(() => ({
    total: total,
    scheduled: showtimes.filter((s) => s.Status === 'Scheduled').length,
    cancelled: showtimes.filter((s) => s.Status === 'Cancelled').length,
    finished: showtimes.filter((s) => s.Status === 'Finished').length,
  }), [showtimes, total]);

  const filtered = useMemo(() => {
    if (!search && !filterStatus) return showtimes;
    return showtimes.filter((s) => {
      const title = getMovieTitle(s.MovieId).toLowerCase();
      const matchSearch = !search || title.includes(search.toLowerCase());
      const matchStatus = !filterStatus || s.Status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [showtimes, search, filterStatus, getMovieTitle]);

  return {
    showtimes, setShowtimes, movies, rooms, loading, total, totalPages, page, goToPage,
    search, setSearch, searchInput, setSearchInput, filterStatus, setFilterStatus,
    selected, setSelected, editing, setEditing, viewMode, setViewMode, showDetail, setShowDetail,
    filtered, counts, handleAdd, handleUpdate, handleDelete, handleToggleStatus, handleView, reload,
    getMovieTitle, getRoomName, getStatusLabel,
  };
};