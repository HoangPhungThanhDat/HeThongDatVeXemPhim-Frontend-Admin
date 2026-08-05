// src/views/admin/quanlytrangthaighe/hooks/useSeatData.js

import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import SeatManagementApi from "../../../../api/SeatManagementApi";

export function useSeatData() {
    const toast = useToast();
    
    // Data states
    const [data, setData] = useState({
        cinemas: [],
        rooms: [],
        showtimes: [],
        seats: [],
        stats: { total: 0, trong: 0, dat: 0, giu: 0, loi: 0, baoTri: 0, room_total: 0 }
    });
    
    // Filter states
    const [filters, setFilters] = useState({
        cinema_id: null,
        room_id: null,
        showtime_id: null
    });
    
    // Loading states
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isLoadingSeats, setIsLoadingSeats] = useState(false);

    // Load dữ liệu ban đầu
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const response = await SeatManagementApi.getData();
                const result = response?.data?.data || response?.data || {};
                
                console.log("📦 Initial data loaded:", result);
                
                setData({
                    cinemas: result.cinemas || [],
                    rooms: result.rooms || [],
                    showtimes: result.showtimes || [],
                    seats: result.seats || [],
                    stats: result.stats || { total: 0, trong: 0, dat: 0, giu: 0, loi: 0, baoTri: 0, room_total: 0 }
                });
                
                if (result.filters) {
                    setFilters({
                        cinema_id: result.filters.cinema_id || null,
                        room_id: result.filters.room_id || null,
                        showtime_id: result.filters.showtime_id || null
                    });
                }
                
                setIsInitialLoad(false);
            } catch (error) {
                console.error("❌ Lỗi tải dữ liệu:", error);
                setIsInitialLoad(false);
            } finally {
                setLoading(false);
            }
        };
        
        loadInitialData();
    }, []);

    // ✅ HÀM LOAD GHẾ - GỌI KHI BẤM NÚT "XEM GHẾ"
    const loadSeats = useCallback(async (showtimeId) => {
        if (!showtimeId) {
            toast({
                title: "Vui lòng chọn suất chiếu",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return null;
        }

        setIsLoadingSeats(true);
        try {
            const response = await SeatManagementApi.getData({ showtime_id: showtimeId });
            const result = response?.data?.data || response?.data || {};
            
            console.log("📦 Seats loaded:", result);
            
            // ✅ Xử lý dữ liệu ghế
            const processedSeats = (result.seats || []).map(seat => ({
                ...seat,
                seat_type: seat.seat_type || seat.originalData?.seat_type || 'normal',
                status: seat.status || 'trong',
            }));
            
            // ✅ Lấy thông tin stats và room_total
            const stats = {
                total: processedSeats.length,
                trong: result.stats?.trong || 0,
                dat: result.stats?.dat || 0,
                giu: result.stats?.giu || 0,
                loi: result.stats?.loi || 0,
                baoTri: result.stats?.baoTri || 0,
                room_total: result.stats?.room_total || result.room?.seat_count || 0,
            };
            
            setData(prev => ({
                ...prev,
                seats: processedSeats,
                stats: stats,
                room: result.room || prev.room,
            }));
            
            // ✅ Hiển thị thông báo với số ghế đã load
            const roomTotal = stats.room_total || processedSeats.length;
            toast({
                title: "Đã tải dữ liệu ghế",
                description: `Có ${processedSeats.length}/${roomTotal} ghế`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            
            return { ...result, seats: processedSeats };
        } catch (error) {
            console.error("❌ Lỗi tải ghế:", error);
            toast({
                title: "Lỗi tải ghế",
                description: error.response?.data?.message || "Không thể tải dữ liệu ghế",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return null;
        } finally {
            setIsLoadingSeats(false);
        }
    }, [toast]);

    // Load dữ liệu với filter
    const loadDataWithFilters = useCallback(async (newFilters) => {
        const mergedFilters = { ...filters, ...newFilters };
        setFilters(mergedFilters);
        
        const params = {};
        Object.keys(mergedFilters).forEach(key => {
            if (mergedFilters[key]) {
                params[key] = mergedFilters[key];
            }
        });
        
        setLoading(true);
        try {
            const response = await SeatManagementApi.getData(params);
            const result = response?.data?.data || response?.data || {};
            
            const processedSeats = (result.seats || []).map(seat => ({
                ...seat,
                seat_type: seat.seat_type || seat.originalData?.seat_type || 'normal',
                status: seat.status || 'trong',
            }));
            
            const stats = {
                total: processedSeats.length,
                trong: result.stats?.trong || 0,
                dat: result.stats?.dat || 0,
                giu: result.stats?.giu || 0,
                loi: result.stats?.loi || 0,
                baoTri: result.stats?.baoTri || 0,
                room_total: result.stats?.room_total || result.room?.seat_count || 0,
            };
            
            setData(prev => ({
                cinemas: result.cinemas || prev.cinemas,
                rooms: result.rooms || prev.rooms,
                showtimes: result.showtimes || prev.showtimes,
                seats: processedSeats,
                stats: stats,
                room: result.room || prev.room,
            }));
            
            return { ...result, seats: processedSeats };
        } catch (error) {
            console.error("❌ Lỗi tải dữ liệu:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Tạo ghế tự động
    const handleGenerateSeats = useCallback(async (showtimeId) => {
        if (!showtimeId) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn suất chiếu",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        
        setIsGenerating(true);
        try {
            await SeatManagementApi.generateSeats(showtimeId);
            
            toast({
                title: "Thành công",
                description: "Đã tạo ghế tự động cho suất chiếu",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            
            await loadSeats(showtimeId);
            return true;
        } catch (error) {
            console.error("❌ Lỗi tạo ghế:", error);
            toast({
                title: "Lỗi tạo ghế",
                description: error.response?.data?.message || "Không thể tạo ghế",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        } finally {
            setIsGenerating(false);
        }
    }, [loadSeats, toast]);

    // Cập nhật trạng thái ghế
    const handleUpdateSeatStatus = useCallback(async (showtimeSeatId, status) => {
        try {
            await SeatManagementApi.updateSeat(showtimeSeatId, status);
            
            setData(prev => ({
                ...prev,
                seats: prev.seats.map(seat => 
                    seat.id === showtimeSeatId ? { ...seat, status: status.toLowerCase() } : seat
                )
            }));
            
            return true;
        } catch (error) {
            console.error("❌ Lỗi cập nhật trạng thái:", error);
            toast({
                title: "Lỗi cập nhật trạng thái",
                description: error.response?.data?.message || "Không thể cập nhật trạng thái ghế",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
    }, [toast]);

    // Reset ghế
    const handleResetSeat = useCallback(async (showtimeSeatId) => {
        try {
            await SeatManagementApi.resetSeat(showtimeSeatId);
            
            setData(prev => ({
                ...prev,
                seats: prev.seats.map(seat => 
                    seat.id === showtimeSeatId ? { ...seat, status: 'trong' } : seat
                )
            }));
            
            toast({
                title: "Thành công",
                description: "Đã reset ghế về trạng thái trống",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            return true;
        } catch (error) {
            console.error("❌ Lỗi reset ghế:", error);
            toast({
                title: "Lỗi reset ghế",
                description: error.response?.data?.message || "Không thể reset ghế",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
    }, [toast]);

    // Xóa ghế
    const handleDeleteSeat = useCallback(async (showtimeSeatId) => {
        try {
            await SeatManagementApi.deleteSeat(showtimeSeatId);
            
            setData(prev => ({
                ...prev,
                seats: prev.seats.filter(seat => seat.id !== showtimeSeatId)
            }));
            
            toast({
                title: "Thành công",
                description: "Đã xóa ghế",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            return true;
        } catch (error) {
            console.error("❌ Lỗi xóa ghế:", error);
            toast({
                title: "Lỗi xóa ghế",
                description: error.response?.data?.message || "Không thể xóa ghế",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
    }, [toast]);

    // Lấy danh sách rooms theo cinema
    const getRoomsByCinema = useCallback((cinemaId) => {
        if (!cinemaId) return data.rooms;
        return data.rooms.filter(room => {
            const roomCinemaId = room.CinemaId || room.cinema_id;
            return String(roomCinemaId) === String(cinemaId);
        });
    }, [data.rooms]);

    // Lấy danh sách showtimes theo room
    const getShowtimesByRoom = useCallback((roomId) => {
        if (!roomId) return data.showtimes;
        return data.showtimes.filter(st => {
            const stRoomId = st.room_id || st.RoomId;
            return String(stRoomId) === String(roomId);
        });
    }, [data.showtimes]);

    // Seat Map Data
    const seatMapData = useMemo(() => {
        return data.seats.map(seat => {
            let seatType = 'normal';
            if (seat.seat_type) {
                seatType = seat.seat_type.toLowerCase();
            } else if (seat.originalData?.seat_type) {
                seatType = seat.originalData.seat_type.toLowerCase();
            }
            
            const typeMap = {
                'vip': 'vip',
                'couple': 'couple',
                'sweetbox': 'sweetbox',
                'accessible': 'accessible',
                'normal': 'normal',
                'regular': 'normal',
                'standard': 'normal',
            };
            
            const mappedType = typeMap[seatType] || 'normal';
            
            return {
                id: seat.id,
                row: seat.row || 'A',
                num: seat.number || 0,
                status: seat.status || 'trong',
                seat_type: mappedType,
                ticket_code: seat.ticket_code || null,
                customer_name: seat.customer_name || null,
                showtime_seat_id: seat.id,
                showtime_id: seat.showtime_id,
                originalData: seat
            };
        });
    }, [data.seats]);

    return {
        // Data
        cinemas: data.cinemas,
        rooms: data.rooms,
        showtimes: data.showtimes,
        seats: data.seats,
        seatMapData,
        seatStats: data.stats,
        room: data.room,
        filters,
        
        // Loading
        loading,
        isGenerating,
        isInitialLoad,
        isLoadingSeats,
        
        // Actions
        loadDataWithFilters,
        loadSeats,
        handleGenerateSeats,
        handleUpdateSeatStatus,
        handleResetSeat,
        handleDeleteSeat,
        getRoomsByCinema,
        getShowtimesByRoom,
        setFilters,
    };
}