import Swal from "sweetalert2";
import MovieCastApi from "../../api/MovieCastApi";

/**
 * Hàm xóa CastId
 * @param {int} CastId - Id của CastId cần xóa
 * @param {Function} setCasts - Hàm setState cập nhật danh sách Cast
 */
export const deleteCast = async (CastId, setCasts) => {
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
        await MovieCastApi.delete(CastId);

        // Cập nhật lại danh sách Cast
        setCasts((prev) => prev.filter((cast) => cast.CastId !== CastId));

        Swal.fire("Đã xóa!", "Đạo diễn / diễn viên đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa cast:", error);
        Swal.fire("Lỗi!", "Xóa Đạo diễn / diễn viên thất bại.", "error");
      }
    }
  });
};
