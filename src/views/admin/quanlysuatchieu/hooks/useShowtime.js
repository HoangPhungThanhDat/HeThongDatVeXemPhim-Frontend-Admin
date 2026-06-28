

import { useState, useEffect, useCallback, useMemo } from "react";
import ShowtimeApi from "../../../../api/ShowtimeApi";
import MovieApi from "../../../../api/MovieApi";
import RoomApi from "../../../../api/RoomApi";
import { PAGE_SIZE, STATUS_LABELS } from "../constants";
import Swal from "sweetalert2";

export const useShowtime = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [showDetail, setShowDetail] = useState(false);

  // Load dữ liệu ban đầu
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Gọi API song song
      const [showtimeRes, movieRes, roomRes] = await Promise.all([
        ShowtimeApi.getPaged({ 
          page, 
          limit: PAGE_SIZE, 
          search, 
          status: filterStatus 
        }),
        MovieApi.getAll(),
        RoomApi.getAll(),
      ]);

      // Xử lý showtimes
      let showtimeData = showtimeRes.data.data || showtimeRes.data || [];
      // Nếu API trả về dạng { data: [...], total, totalPages }
      if (showtimeRes.data && showtimeRes.data.data) {
        showtimeData = showtimeRes.data.data;
        setTotal(showtimeRes.data.total || 0);
        setTotalPages(showtimeRes.data.totalPages || 1);
      } else if (Array.isArray(showtimeRes.data)) {
        setTotal(showtimeData.length);
        setTotalPages(Math.ceil(showtimeData.length / PAGE_SIZE));
      } else {
        setTotal(showtimeData.length || 0);
        setTotalPages(Math.ceil((showtimeData.length || 0) / PAGE_SIZE));
      }

      setShowtimes(showtimeData);
      setMovies(movieRes.data.data || movieRes.data || []);
      setRooms(roomRes.data.data || roomRes.data || []);
    } catch (error) {
      console.error("❌ Lỗi load dữ liệu:", error);
      setShowtimes([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  // Load khi page, search, filter thay đổi
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Helper: Lấy tên phim
  const getMovieTitle = useCallback((id) => {
    if (!id) return "N/A";
    if (typeof id === 'object' && id.Title) return id.Title;
    const movie = movies.find(m => m.MovieId === id || m.MovieId === parseInt(id));
    return movie?.Title || id || "N/A";
  }, [movies]);

  // Helper: Lấy tên phòng
  const getRoomName = useCallback((id) => {
    if (!id) return "N/A";
    if (typeof id === 'object' && id.Name) return id.Name;
    const room = rooms.find(r => r.RoomId === id || r.RoomId === parseInt(id));
    return room?.Name || id || "N/A";
  }, [rooms]);

  // Helper: Lấy label trạng thái
  const getStatusLabel = useCallback((status) => {
    return STATUS_LABELS[status] || status || "N/A";
  }, []);

  // Tạo suất chiếu mới
  const handleAdd = useCallback(async (newShowtime, onClose) => {
    try {
      const payload = {
        MovieId: Number(newShowtime.movieId),
        RoomId: Number(newShowtime.roomId),
        StartTime: newShowtime.startTime,
        EndTime: newShowtime.endTime,
        Price: Number(newShowtime.price),
        Status: newShowtime.status || "Scheduled",
      };

      const res = await ShowtimeApi.create(payload);
      const created = res.data.data || res.data;
      
      setShowtimes(prev => [created, ...prev]);
      setTotal(prev => prev + 1);
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🎉 Thêm suất chiếu thành công!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      onClose();
      return created;
    } catch (error) {
      console.error("❌ Lỗi tạo suất chiếu:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "❌ Thêm thất bại!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      throw error;
    }
  }, []);

  // Cập nhật suất chiếu
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

      const res = await ShowtimeApi.update(editingData.showtimeId, payload);
      const updated = res.data.data || res.data;
      
      setShowtimes(prev => prev.map(s => 
        s.ShowtimeId === editingData.showtimeId ? updated : s
      ));
      
      if (selected?.ShowtimeId === editingData.showtimeId) {
        setSelected(updated);
      }
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "✅ Cập nhật suất chiếu thành công!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      
      onClose();
      return updated;
    } catch (error) {
      console.error("❌ Lỗi cập nhật suất chiếu:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.response?.data?.message || "❌ Cập nhật thất bại!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      throw error;
    }
  }, [selected]);

  // Xóa suất chiếu
  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await ShowtimeApi.delete(id);
        setShowtimes(prev => prev.filter(s => s.ShowtimeId !== id));
        setTotal(prev => prev - 1);
        
        if (selected?.ShowtimeId === id) {
          setSelected(null);
          setShowDetail(false);
        }
        
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "🗑️ Đã xóa suất chiếu thành công!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return true;
      } catch (error) {
        console.error("❌ Lỗi xóa suất chiếu:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "❌ Xóa suất chiếu thất bại!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        throw error;
      }
    }
    return false;
  }, [selected]);

  // Chuyển trạng thái
  const handleToggleStatus = useCallback(async (id) => {
    const showtime = showtimes.find(s => s.ShowtimeId === id);
    if (!showtime) return;

    const newStatus = showtime.Status === "Scheduled" ? "Cancelled" : "Scheduled";
    
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
      
      setShowtimes(prev => prev.map(s => 
        s.ShowtimeId === id ? { ...s, Status: newStatus } : s
      ));
      
      if (selected?.ShowtimeId === id) {
        setSelected({ ...selected, Status: newStatus });
      }
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `✅ Đã ${newStatus === "Scheduled" ? "kích hoạt" : "hủy"} suất chiếu!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Không thể cập nhật trạng thái!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }, [showtimes, selected]);

  // Xem chi tiết
  const handleView = useCallback((s) => {
    setSelected(s);
    setShowDetail(true);
  }, []);

  // Chuyển trang
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  // Refresh dữ liệu
  const reload = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Tính toán counts
  const counts = useMemo(() => ({
    total: total,
    scheduled: showtimes.filter(s => s.Status === "Scheduled").length,
    cancelled: showtimes.filter(s => s.Status === "Cancelled").length,
    finished: showtimes.filter(s => s.Status === "Finished").length,
  }), [showtimes, total]);

  // Lọc dữ liệu (client-side fallback)
  const filtered = useMemo(() => {
    if (!search && !filterStatus) return showtimes;
    return showtimes.filter(s => {
      const title = getMovieTitle(s.MovieId).toLowerCase();
      const matchSearch = !search || title.includes(search.toLowerCase());
      const matchStatus = !filterStatus || s.Status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [showtimes, search, filterStatus, getMovieTitle]);

  return {
    showtimes,
    setShowtimes,
    movies,
    rooms,
    loading,
    total,
    totalPages,
    page,
    goToPage,
    search,
    setSearch,
    searchInput,
    setSearchInput,
    filterStatus,
    setFilterStatus,
    selected,
    setSelected,
    editing,
    setEditing,
    viewMode,
    setViewMode,
    showDetail,
    setShowDetail,
    filtered,
    counts,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
    handleView,
    reload,
    getMovieTitle,
    getRoomName,
    getStatusLabel,
  };
};