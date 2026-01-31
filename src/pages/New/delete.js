import Swal from "sweetalert2";
import NewsApi from "../../api/NewApi";

/**
 * Hàm xóa tin tức
 * @param {string} NewsId - Id của tin tức cần xóa
 * @param {Function} setNews - Hàm setState cập nhật danh sách tin tức
 */
export const deleteNews = async (NewsId, setNews) => {
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
        await NewsApi.delete(NewsId);

        // Cập nhật lại danh sách tin tức
        setNews((prev) =>
          prev.filter((news) => news.NewsId !== NewsId)
        );

        Swal.fire("Đã xóa!", "Tin tức đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa tin tức:", error);
        Swal.fire("Lỗi!", "Xóa tin tức thất bại.", "error");
      }
    }
  });
};