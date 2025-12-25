import Swal from "sweetalert2";
import PromotionApi from "../../api/PromotionApi";

/**
 * Hàm xóa Promotion
 * @param {int} PromotionId - Id của Promotion cần xóa
 * @param {Function} setPromotions - Hàm setState cập nhật danh sách Promotion
 */
export const deletePromotion = async (PromotionId, setPromotions) => {
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
        await PromotionApi.delete(PromotionId);

        // Cập nhật lại danh sách Promotion
        setPromotions((prev) =>
          prev.filter((promotion) => promotion.PromotionId !== PromotionId)
        );

        Swal.fire("Đã xóa!", "Khuyến mãi đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        Swal.fire("Lỗi!", "Xóa khuyến mãi thất bại.", "error");
      }
    }
  });
};
