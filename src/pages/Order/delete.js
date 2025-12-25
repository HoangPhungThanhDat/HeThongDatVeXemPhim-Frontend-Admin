import Swal from "sweetalert2";
import OrderApi from "../../api/OrderApi";

/**
 * Hàm xóa Ticket
 * @param {int} OrderId - Id của Order cần xóa
 * @param {Function} setOrders - Hàm setState cập nhật danh sách Order
 */
export const deleteOrder= async (OrderId, setOrders) => {
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
        await OrderApi.delete(OrderId);

        // Cập nhật lại danh sách Order
        setOrders((prev) => prev.filter((order) => order.OrderId !== OrderId));

        Swal.fire("Đã xóa!", "Đơn hàng đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        Swal.fire("Lỗi!", "Xóa đơn hàng thất bại.", "error");
      }
    }
  });
};
