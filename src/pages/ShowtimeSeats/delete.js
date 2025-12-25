import Swal from "sweetalert2";
import ShowtimeSeatApi from "../../api/ShowtimeSeatApi";

/**
 * Hàm xóa Role
 * @param {int} ShowtimeSeatId - Id của Role cần xóa
 * @param {Function} setShowtimeSeats - Hàm setState cập nhật danh sách roles
 */
export const deleteShowtimeSeat = async (ShowtimeSeatId, setShowtimeSeats) => {
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
        await ShowtimeSeatApi.delete(ShowtimeSeatId);

        // Cập nhật lại danh sách roles
        setShowtimeSeats((prev) => prev.filter((showtimeSeat) => showtimeSeat.ShowtimeSeatId !== ShowtimeSeatId));

        Swal.fire("Đã xóa!", "Trạng thái ghế suất chiếu đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa trạng thái ghế theo suất chiếu:", error);
        Swal.fire("Lỗi!", "Xóa trạng thái ghế theo suất chiếu thất bại.", "error");
      }
    }
  });
};
