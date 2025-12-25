import Swal from "sweetalert2";
import MovieApi from "../../api/MovieApi";

/**
 * Hàm xóa banner
 * @param {int} MovieId - Id của banner cần xóa
 * @param {Function} setMovies - Hàm setState cập nhật danh sách banners
 */
export const deleteMovie = async (MovieId, setMovies) => {
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
        await MovieApi.delete(MovieId);

        // Cập nhật lại danh sách banners
        setMovies((prev) =>
          prev.filter((movie) => movie.MovieId !== MovieId)
        );

        Swal.fire("Đã xóa!", "phim đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa phim:", error);
        Swal.fire("Lỗi!", "Xóa phim thất bại.", "error");
      }
    }
  });
};
