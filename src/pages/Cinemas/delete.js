import Swal from "sweetalert2";
import CinemasApi from "../../api/CinemasApi";

/**
 * Hàm xóa cinema
 * @param {int} CinemaId - Id của cinema cần xóa
 * @param {Function} setCinemas - Hàm setState cập nhật danh sách cinemas
 */
export const deleteCinema = async (CinemaId, setCinemas) => {
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
        await CinemasApi.delete(CinemaId);

        // Cập nhật lại danh sách cinemas
        setCinemas((prev) =>
          prev.filter((cinema) => cinema.CinemaId !== CinemaId)
        );

        Swal.fire("Đã xóa!", "rạp chiếu đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa rạp chiếu:", error);
        Swal.fire("Lỗi!", "Xóa rạp chiếu thất bại.", "error");
      }
    }
  });
};
