import Swal from "sweetalert2";
import OrderDetailApi from "../../api/OrderDetailApi";

/**
 * Hàm xóa OrderDetai
 * @param {int} OrderDetailId - Id của OrderDetail cần xóa
 * @param {Function} setOrderDetails - Hàm setState cập nhật danh sách OrderDetail
 */
export const deleteOrderDetail= async (OrderDetailId, setOrderDetails) => {
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
        await OrderDetailApi.delete(OrderDetailId);

        // Cập nhật lại danh sách Order
        setOrderDetails((prev) => prev.filter((orderdetail) => orderdetail.OrderDetailId !== OrderDetailId));

        Swal.fire("Đã xóa!", "Chi tiết đơn hàng đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
        Swal.fire("Lỗi!", "Xóa chi tiết đơn hàng thất bại.", "error");
      }
    }
  });
};
