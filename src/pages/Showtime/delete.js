import Swal from "sweetalert2";
import ShowtimeApi from "../../api/ShowtimeApi";

/**
 * Hàm xóa Showtime
 * @param {int} ShowtimeId - Id của Showtime cần xóa
 * @param {Function} setShowtimes - Hàm setState cập nhật danh sách Showtime
 */
export const deleteShowtime= async (ShowtimeId, setShowtimes) => {
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
        await ShowtimeApi.delete(ShowtimeId);

        // Cập nhật lại danh sách showtime
        setShowtimes((prev) => prev.filter((showtime) => showtime.ShowtimeId !== ShowtimeId));

        Swal.fire("Đã xóa!", "Xuất chiếu đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa xuất chiếu :", error);
        Swal.fire("Lỗi!", "Xóa xuất chiếu thất bại.", "error");
      }
    }
  });
};
