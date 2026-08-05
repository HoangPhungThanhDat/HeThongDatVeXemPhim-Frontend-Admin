// src/api/TicketManagementApi.js

import axios from './AxiosAdmin';

class TicketManagementApi {
    /**
     * 📊 Lấy toàn bộ dữ liệu dashboard (1 lần gọi duy nhất)
     * GET: /api/admin/ticket-management/dashboard
     */
    static async getDashboard() {
        try {
            const response = await axios.get('/admin/ticket-management/dashboard');
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi load dashboard vé:', error);
            throw error;
        }
    }

    /**
     * 📊 Lấy thống kê vé
     * GET: /api/admin/ticket-management/statistics
     */
    static async getStatistics() {
        try {
            const response = await axios.get('/admin/ticket-management/statistics');
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi load statistics:', error);
            throw error;
        }
    }

    /**
     * 🎯 Lấy chi tiết vé
     * GET: /api/admin/ticket-management/tickets/{ticketId}
     */
    static async getTicketDetail(ticketId) {
        try {
            const response = await axios.get(`/admin/ticket-management/tickets/${ticketId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi load chi tiết vé:', error);
            throw error;
        }
    }

    /**
     * ➕ Tạo nhiều vé cùng lúc
     * POST: /api/admin/ticket-management/tickets
     */
    static async createTickets(data) {
        try {
            const response = await axios.post('/admin/ticket-management/tickets', data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo vé:', error);
            throw error;
        }
    }

    /**
     * ✏️ Cập nhật vé
     * PUT: /api/admin/ticket-management/tickets/{ticketId}
     */
    static async updateTicket(ticketId, data) {
        try {
            const response = await axios.put(`/admin/ticket-management/tickets/${ticketId}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi cập nhật vé:', error);
            throw error;
        }
    }

    /**
     * 🗑️ Xóa vé
     * DELETE: /api/admin/ticket-management/tickets/{ticketId}
     */
    static async deleteTicket(ticketId) {
        try {
            const response = await axios.delete(`/admin/ticket-management/tickets/${ticketId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi xóa vé:', error);
            throw error;
        }
    }
}

export default TicketManagementApi;