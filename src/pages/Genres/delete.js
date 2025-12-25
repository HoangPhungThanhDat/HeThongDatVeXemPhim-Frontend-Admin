import Swal from "sweetalert2";
import GenreApi from "../../api/GenreApi";

/**
 * Hàm xóa Role
 * @param {int} GenreId - Id của Role cần xóa
 * @param {Function} setGenres - Hàm setState cập nhật danh sách roles
 */
export const deleteGenre= async (GenreId, setGenres) => {
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
        await GenreApi.delete(GenreId);

        // Cập nhật lại danh sách 
        setGenres((prev) => prev.filter((genre) => genre.GenreId !== GenreId));

        Swal.fire("Đã xóa!", "Thể loại phim đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa Thể loại phim:", error);
        Swal.fire("Lỗi!", "Xóa Thể loại phim thất bại.", "error");
      }
    }
  });
};
