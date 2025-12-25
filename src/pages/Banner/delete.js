import Swal from "sweetalert2";
import BannerApi from "../../api/BannerApi";

/**
 * Hàm xóa banner
 * @param {int} BannerId - Id của banner cần xóa
 * @param {Function} setBanners - Hàm setState cập nhật danh sách banners
 */
export const deleteBanner = async (BannerId, setBanners) => {
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
        await BannerApi.delete(BannerId);

        // Cập nhật lại danh sách banners
        setBanners((prev) =>
          prev.filter((banner) => banner.BannerId !== BannerId)
        );

        Swal.fire("Đã xóa!", "banner đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa banner:", error);
        Swal.fire("Lỗi!", "Xóa banner thất bại.", "error");
      }
    }
  });
};
