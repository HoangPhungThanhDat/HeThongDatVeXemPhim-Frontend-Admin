// src/views/admin/quanlylichchieudinhky/hooks/useSchedule.js

import { useState, useEffect } from 'react';
import ScheduleApi from 'api/booking/ScheduleApi';
import MovieApi from 'api/catalog/MovieApi';
import RoomApi from 'api/cinema/RoomApi';
import CinemaApi from 'api/cinema/CinemasApi'; 
import { REVERSE_DAYS_MAP, DAYS_MAP } from '../constants';
import Swal from 'sweetalert2';

export const useSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scheduleRes, movieRes, roomRes, cinemaRes] = await Promise.all([
          ScheduleApi.getAll(),
          MovieApi.getAll(),
          RoomApi.getAll(),
          CinemaApi.getAll(),
        ]);

        let scheduleData = scheduleRes.data.data || scheduleRes.data || [];
        scheduleData = scheduleData.map((s) => ({
          ...s,
          DaysOfWeek: normalizeDaysOfWeek(s.DaysOfWeek),
          Price: typeof s.Price === 'string' ? parseFloat(s.Price.replace(/[^\d]/g, '')) : s.Price,
        }));

        setSchedules(scheduleData);
        setMovies(movieRes.data.data || movieRes.data || []);
        setRooms(roomRes.data.data || roomRes.data || []);
        setCinemas(cinemaRes.data.data || cinemaRes.data || []);
      } catch (error) {
        console.error('❌ Lỗi load dữ liệu:', error);
        showToast('error', 'Không thể tải dữ liệu lịch chiếu!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const normalizeDaysOfWeek = (days) => {
    if (!days) return [];
    if (Array.isArray(days)) return days;
    if (typeof days === 'string') {
      try { return JSON.parse(days); } 
      catch { return days.split(',').map((d) => d.trim()).filter((d) => d); }
    }
    return [];
  };

  const convertDaysToEnglish = (days) => days.map((d) => DAYS_MAP[d] || d);

  const showToast = (icon, message) => {
    setToast({ icon, message });
    setTimeout(() => setToast(null), 3200);
  };

  const showSwalToast = (icon, message, timer = 3000) => {
    Swal.fire({
      toast: true, position: 'top-end', icon, title: message,
      showConfirmButton: false, timer, timerProgressBar: true,
    });
  };

  const addSchedule = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        MovieId: Number(formData.movieId),
        RoomId: Number(formData.roomId),
        StartDate: formData.startDate,
        EndDate: formData.endDate,
        DaysOfWeek: convertDaysToEnglish(formData.days),
        StartTime: formData.startTime,
        EndTime: formData.endTime,
        Price: Number(formData.priceBase),
        Status: formData.status || 'Active',
      };

      const res = await ScheduleApi.create(payload);
      const newSchedule = res.data.data || res.data;
      newSchedule.DaysOfWeek = normalizeDaysOfWeek(newSchedule.DaysOfWeek);

      setSchedules((prev) => [...prev, newSchedule]);
      showSwalToast('success', '🎉 Tạo lịch chiếu định kỳ thành công!');
      return newSchedule;
    } catch (error) {
      console.error('❌ Lỗi tạo lịch chiếu:', error);
      showSwalToast('error', `❌ ${error.response?.data?.message || 'Tạo lịch chiếu thất bại!'}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSchedule = async (id, formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        MovieId: Number(formData.movieId),
        RoomId: Number(formData.roomId),
        StartDate: formData.startDate,
        EndDate: formData.endDate,
        DaysOfWeek: convertDaysToEnglish(formData.days),
        StartTime: formData.startTime,
        EndTime: formData.endTime,
        Price: Number(formData.priceBase),
        Status: formData.status || 'Active',
      };

      const res = await ScheduleApi.update(id, payload);
      const updatedSchedule = res.data.data || res.data;
      updatedSchedule.DaysOfWeek = normalizeDaysOfWeek(updatedSchedule.DaysOfWeek);

      setSchedules((prev) => prev.map((s) => (s.ScheduleId === id ? updatedSchedule : s)));
      showSwalToast('success', '✅ Cập nhật lịch chiếu thành công!');
      return updatedSchedule;
    } catch (error) {
      console.error('❌ Lỗi cập nhật lịch chiếu:', error);
      showSwalToast('error', `❌ ${error.response?.data?.message || 'Cập nhật thất bại!'}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSchedule = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa', cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await ScheduleApi.delete(id);
        setSchedules((prev) => prev.filter((s) => s.ScheduleId !== id));
        showSwalToast('success', '🗑️ Đã xóa lịch chiếu thành công!');
        return true;
      } catch (error) {
        console.error('❌ Lỗi xóa lịch chiếu:', error);
        showSwalToast('error', '❌ Xóa lịch chiếu thất bại!');
        throw error;
      }
    }
    return false;
  };

  const toggleScheduleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const schedule = schedules.find((s) => s.ScheduleId === id);
    if (!schedule) return;

    try {
      const payload = {
        MovieId: Number(schedule.MovieId),
        RoomId: Number(schedule.RoomId),
        StartDate: schedule.StartDate?.split('T')[0] || schedule.StartDate,
        EndDate: schedule.EndDate?.split('T')[0] || schedule.EndDate,
        DaysOfWeek: normalizeDaysOfWeek(schedule.DaysOfWeek),
        StartTime: schedule.StartTime?.slice(0, 5) || schedule.StartTime,
        EndTime: schedule.EndTime?.slice(0, 5) || schedule.EndTime,
        Price: Number(schedule.Price),
        Status: newStatus,
      };

      await ScheduleApi.update(id, payload);
      setSchedules((prev) => prev.map((s) => s.ScheduleId === id ? { ...s, Status: newStatus } : s));
      showToast('success', `⏯ Đã ${newStatus === 'Active' ? 'kích hoạt' : 'tạm dừng'} lịch chiếu!`);
    } catch (error) {
      console.error('❌ Lỗi cập nhật trạng thái:', error);
      showToast('error', '❌ Không thể cập nhật trạng thái!');
    }
  };

  const getStats = () => ({
    total: schedules.length,
    active: schedules.filter((s) => s.Status === 'Active').length,
    paused: schedules.filter((s) => s.Status === 'Inactive').length,
    slots: schedules.reduce((a, s) => a + (s.DaysOfWeek?.length || 0), 0),
  });

  const getFiltered = (filterStatus, filterCinema, filterMovie) => {
    return schedules.filter((s) => {
      const statusMatch =
        filterStatus === 'Tất cả' ||
        (filterStatus === 'Đang hoạt động' && s.Status === 'Active') ||
        (filterStatus === 'Tạm dừng' && s.Status === 'Inactive') ||
        (filterStatus === 'Hết hạn' && s.Status === 'Deleted');
      
      const roomObj = rooms.find(r => r.RoomId === s.RoomId);
      const cinemaMatch = filterCinema === 'all' || (roomObj && roomObj.CinemaId === parseInt(filterCinema));
      const movieMatch = filterMovie === 'all' || s.MovieId === parseInt(filterMovie);

      return statusMatch && cinemaMatch && movieMatch;
    });
  };

  const getScheduleById = (id) => schedules.find((s) => s.ScheduleId === id);
  const getMovieTitle = (id) => movies.find((m) => m.MovieId === id)?.Title || id || 'N/A';
  const getRoomName = (id) => rooms.find((r) => r.RoomId === id)?.Name || id || 'N/A';

  return {
    schedules, setSchedules, movies, rooms, cinemas, loading, isSubmitting, toast, setToast,
    addSchedule, updateSchedule, deleteSchedule, toggleScheduleStatus,
    getStats, getFiltered, getScheduleById, getMovieTitle, getRoomName,
    convertDaysToVietnamese: (days) => days.map((d) => REVERSE_DAYS_MAP[d] || d),
    normalizeDaysOfWeek,
  };
};