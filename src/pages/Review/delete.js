import Swal from "sweetalert2";
import ReviewApi from "../../api/ReviewApi";

/**
 * Hàm xóa Reviews
 * @param {int} ReviewId - Id của Reviews cần xóa
 * @param {Function} setReviews - Hàm setState cập nhật danh sách Reviews
 */
export const deleteReview= async (ReviewId, setReviews) => {
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
        await ReviewApi.delete(ReviewId);

        // Cập nhật lại danh sách Reviews
        setReviews((prev) => prev.filter((review) => review.ReviewId !== ReviewId));

        Swal.fire("Đã xóa!", "Đánh giá đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa đánh giá :", error);
        Swal.fire("Lỗi!", "Xóa đánh giá thất bại.", "error");
      }
    }
  });
};
