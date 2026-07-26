// src/views/admin/quanlyve/hooks/useCreateTicketForm.js
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import UserApi from "../../../../api/UserApi";
import MovieApi from "../../../../api/MovieApi";
import ShowtimeApi from "../../../../api/ShowtimeApi";
import ShowtimeSeatApi from "../../../../api/ShowtimeSeatApi";
import FoodAndDrinkApi from "../../../../api/FoodAndDrinkApi";

export const useCreateTicketForm = () => {
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    movies: false,
    showtimes: false,
    seats: false,
    combos: false,
  });
  const toast = useToast();

  // Lấy danh sách users
  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await UserApi.getAll();
      console.log("📦 Users API response:", response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];
      
      console.log("✅ Users data:", data);
      setUsers(data);
    } catch (err) {
      console.error("❌ Lỗi tải users:", err);
      toast({
        title: "Lỗi tải users",
        description: err.response?.data?.message || "Không thể tải danh sách users",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, [toast]);

  // Lấy danh sách phim đang chiếu
  const fetchMovies = useCallback(async () => {
    setLoading(prev => ({ ...prev, movies: true }));
    try {
      const response = await MovieApi.getAll();
      console.log("📦 Movies API response:", response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];
      
      console.log("✅ All movies:", data);
      
      const nowShowing = data.filter(
        (m) => m.Status === "NowShowing" || m.status === "NowShowing"
      );
      console.log("✅ Movies NowShowing:", nowShowing);
      setMovies(nowShowing);
    } catch (err) {
      console.error("❌ Lỗi tải phim:", err);
      toast({
        title: "Lỗi tải phim",
        description: err.response?.data?.message || "Không thể tải danh sách phim",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(prev => ({ ...prev, movies: false }));
    }
  }, [toast]);

  // Lấy tất cả suất chiếu
  const fetchAllShowtimes = useCallback(async () => {
    setLoading(prev => ({ ...prev, showtimes: true }));
    try {
      const response = await ShowtimeApi.getAll();
      console.log("📦 Showtimes API response:", response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];
      
      console.log("✅ All showtimes:", data);
      setAllShowtimes(data);
    } catch (err) {
      console.error("❌ Lỗi tải suất chiếu:", err);
      toast({
        title: "Lỗi tải suất chiếu",
        description: err.response?.data?.message || "Không thể tải danh sách suất chiếu",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(prev => ({ ...prev, showtimes: false }));
    }
  }, [toast]);

  // Lọc suất chiếu theo phim
  const filterShowtimesByMovie = useCallback((movieId) => {
    console.log("🔍 Filter showtimes by movieId:", movieId);
    console.log("🔍 All showtimes count:", allShowtimes.length);
    
    if (!movieId) {
      setShowtimes([]);
      return;
    }
    
    const filtered = allShowtimes.filter((s) => {
      let showMovieId = null;
      if (s.MovieId && typeof s.MovieId === 'object') {
        showMovieId = s.MovieId.MovieId || s.MovieId.id;
      } else if (s.MovieId) {
        showMovieId = s.MovieId;
      } else if (s.movieId && typeof s.movieId === 'object') {
        showMovieId = s.movieId.MovieId || s.movieId.id;
      } else if (s.movieId) {
        showMovieId = s.movieId;
      }
      return String(showMovieId) === String(movieId);
    });
    
    console.log(`✅ Found ${filtered.length} showtimes for movie ${movieId}`);
    
    const sorted = filtered.sort((a, b) => {
      const timeA = new Date(a.StartTime || a.startTime);
      const timeB = new Date(b.StartTime || b.startTime);
      return timeA - timeB;
    });
    
    setShowtimes(sorted);
  }, [allShowtimes]);

  // ✅ Lấy tất cả ghế theo suất chiếu (không lọc status)
  const fetchSeatsByShowtime = useCallback(async (showtimeId) => {
    if (!showtimeId) {
      setSeats([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, seats: true }));
    try {
      const response = await ShowtimeSeatApi.getPaged({
        showtimeId: showtimeId,
        limit: 200
      });
      
      console.log(`📦 ShowtimeSeats API response for showtime ${showtimeId}:`, response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];
      
      console.log(`✅ Found ${data.length} total seats for showtime ${showtimeId}`);
      setSeats(data);
      return data;
    } catch (err) {
      console.error("❌ Lỗi tải ghế:", err);
      toast({
        title: "Lỗi tải ghế",
        description: err.response?.data?.message || "Không thể tải danh sách ghế",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSeats([]);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, seats: false }));
    }
  }, [toast]);

  // ✅ Lấy ghế trống theo suất chiếu (chỉ Available)
  const fetchAvailableSeatsByShowtime = useCallback(async (showtimeId) => {
    if (!showtimeId) {
      setSeats([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, seats: true }));
    try {
      const response = await ShowtimeSeatApi.getPaged({
        showtimeId: showtimeId,
        status: "Available",
        limit: 200
      });
      
      console.log(`📦 Available seats API response for showtime ${showtimeId}:`, response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];
      
      console.log(`✅ Found ${data.length} available seats for showtime ${showtimeId}`);
      setSeats(data);
      return data;
    } catch (err) {
      console.error("❌ Lỗi tải ghế trống:", err);
      toast({
        title: "Lỗi tải ghế",
        description: err.response?.data?.message || "Không thể tải danh sách ghế trống",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSeats([]);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, seats: false }));
    }
  }, [toast]);

  // Lấy danh sách combo
  const fetchCombos = useCallback(async () => {
    setLoading(prev => ({ ...prev, combos: true }));
    try {
      const response = await FoodAndDrinkApi.getAll();
      console.log("📦 Combos API response:", response);
      
      let data = response?.data?.data || response?.data || response || [];
      if (!Array.isArray(data)) data = [];
      
      console.log("✅ All combos:", data);
      
      const available = data.filter(
        (c) => c.IsAvailable === true || c.isAvailable === true || c.Status === "Active" || c.status === "Active"
      );
      console.log("✅ Available combos:", available);
      setCombos(available);
    } catch (err) {
      console.error("❌ Lỗi tải combo:", err);
      toast({
        title: "Lỗi tải combo",
        description: err.response?.data?.message || "Không thể tải danh sách combo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(prev => ({ ...prev, combos: false }));
    }
  }, [toast]);

  // Reset seats
  const resetSeats = useCallback(() => {
    setSeats([]);
  }, []);

  // Load dữ liệu ban đầu
  useEffect(() => {
    console.log("🚀 INIT: Loading data...");
    fetchUsers();
    fetchMovies();
    fetchAllShowtimes();
    fetchCombos();
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log("📊 State users:", users.length);
    console.log("📊 State movies:", movies.length);
    console.log("📊 State allShowtimes:", allShowtimes.length);
    console.log("📊 State showtimes:", showtimes.length);
    console.log("📊 State seats:", seats.length);
    console.log("📊 State combos:", combos.length);
  }, [users, movies, allShowtimes, showtimes, seats, combos]);

  return {
    users,
    movies,
    showtimes,
    seats,
    combos,
    loading,
    filterShowtimesByMovie,
    fetchSeatsByShowtime,
    fetchAvailableSeatsByShowtime,
    resetSeats,
  };
};