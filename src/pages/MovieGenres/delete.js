import Swal from "sweetalert2";
import MovieGenresApi from "../../api/MovieGenresApi";

/**
 * Hàm xóa MovieGenres
 * @param {int} MovieGenreId - Id của MovieGenres cần xóa
 * @param {Function} setMovieGenres - Hàm setState cập nhật danh sách MovieGenres
 */
export const deleteMovieGenre = async (MovieGenreId, setMovieGenres) => {
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
        await MovieGenresApi.delete(MovieGenreId);

        // Cập nhật lại danh sách MovieGenres
        setMovieGenres((prev) => prev.filter((movieGenre) => movieGenre.MovieGenreId !== MovieGenreId));

        Swal.fire("Đã xóa!", "Liên kết phim đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa liên kết phim:", error);
        Swal.fire("Lỗi!", "Xóa liên kết phim thất bại.", "error");
      }
    }
  });
};
