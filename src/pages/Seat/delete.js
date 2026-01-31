import Swal from "sweetalert2";
import "animate.css";
import SeatApi from "../../api/SeatApi";

/**
 * Xử lý xóa ghế
 * @param {number} seatId - ID của ghế cần xóa
 * @param {Function} onSuccess - Callback khi xóa thành công
 * @param {Function} onError - Callback khi xóa thất bại (optional)
 */
export const handleDeleteSeat = async (seatId, onSuccess, onError) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: "Bạn có chắc muốn xóa ghế này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await SeatApi.delete(seatId);
      showToast("success", "🗑️ Xóa ghế thành công!");
      
      // Gọi callback khi xóa thành công
      if (onSuccess) {
        onSuccess(seatId);
      }
    } catch (error) {
      console.error("Lỗi khi xóa ghế:", error);
      showToast("error", "❌ Xóa ghế thất bại!");
      
      // Gọi callback khi xóa thất bại
      if (onError) {
        onError(error);
      }
    }
  }
};

/**
 * Hiển thị toast notification
 * @param {string} icon - Loại icon (success, error, warning, info)
 * @param {string} message - Nội dung thông báo
 */
export const showToast = (icon, message) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showClass: { popup: "animate__animated animate__slideInRight" },
    hideClass: { popup: "animate__animated animate__slideOutRight" },
  });
};

export default {
  handleDeleteSeat,
  showToast,
};