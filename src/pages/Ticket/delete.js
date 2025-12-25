import Swal from "sweetalert2";
import TicketApi from "../../api/TicketApi";

/**
 * Hàm xóa Ticket
 * @param {int} TicketId - Id của Ticket cần xóa
 * @param {Function} setTickets - Hàm setState cập nhật danh sách Ticket
 */
export const deleteTicket= async (TicketId, setTickets) => {
  Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await TicketApi.delete(TicketId);

        // Cập nhật lại danh sách Ticket
        setTickets((prev) => prev.filter((ticket) => ticket.TicketId !== TicketId));

        Swal.fire("Đã xóa!", "Vé đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa vé:", error);
        Swal.fire("Lỗi!", "Xóa vé thất bại.", "error");
      }
    }
  });
};
