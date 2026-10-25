

import axios from '../client/AxiosAdmin';

class RoomManagementApi {
  /**
   * 📊 Lấy toàn bộ dữ liệu dashboard (1 lần gọi duy nhất)
   * GET: /api/room-management/dashboard
   */
  static async getDashboard(params = {}) {
    try {
      // ✅ Thêm params để chống cache trình duyệt
      const response = await axios.get('/room-management/dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi load dashboard:', error);
      throw error;
    }
  }

  /**
   * 📊 Lấy thống kê nhanh
   * GET: /api/room-management/statistics
   */
  static async getStatistics() {
    try {
      const response = await axios.get('/room-management/statistics');
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi load statistics:', error);
      throw error;
    }
  }

  /**
   * 🎯 Lấy chi tiết phòng + sơ đồ ghế
   * GET: /api/room-management/rooms/{roomId}/detail
   */
  static async getRoomDetail(roomId) {
    try {
      const response = await axios.get(
        `/room-management/rooms/${roomId}/detail`,
      );
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi load chi tiết phòng:', error);
      throw error;
    }
  }

  /**
   * 🪑 Cập nhật sơ đồ ghế
   * PUT: /api/room-management/rooms/{roomId}/seats
   */
  static async updateSeats(roomId, seats) {
    try {
      const response = await axios.put(
        `/room-management/rooms/${roomId}/seats`,
        { seats },
      );
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi cập nhật ghế:', error);
      throw error;
    }
  }

  /**
   * 📝 Thêm phòng chiếu mới
   * POST: /api/room-management/rooms
   */
  static async createRoom(data) {
    try {
      // ✅ Đổi endpoint cho đồng bộ
      const response = await axios.post('/room-management/rooms', data);
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi thêm phòng:', error);
      throw error;
    }
  }

  /**
   * ✏️ Cập nhật phòng chiếu
   * PUT: /api/room-management/rooms/{roomId}
   */
  static async updateRoom(roomId, data) {
    try {
      const response = await axios.put(`/room-management/rooms/${roomId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi cập nhật phòng:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Xóa phòng chiếu
   * DELETE: /api/room-management/rooms/{roomId}
   */
  static async deleteRoom(roomId) {
    try {
      const response = await axios.delete(`/room-management/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi xóa phòng:', error);
      throw error;
    }
  }
}

export default RoomManagementApi;