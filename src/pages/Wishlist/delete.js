import Swal from "sweetalert2";
import WishlistApi from "../../api/WishlistApi";

/**
 * Hàm xóa Role
 * @param {int} WishlistId - Id của Role cần xóa
 * @param {Function} setWishlists - Hàm setState cập nhật danh sách roles
 */
export const deleteWishlist= async (WishlistId, setWishlists) => {
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
        await WishlistApi.delete(WishlistId);

        // Cập nhật lại danh sách roles
        setWishlists((prev) => prev.filter((wishlist) => wishlist.WishlistId !== WishlistId));

        Swal.fire("Đã xóa!", "Danh sách yêu thích đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa danh sách yêu thích:", error);
        Swal.fire("Lỗi!", "Xóa danh sách yêu thích thất bại.", "error");
      }
    }
  });
};
