import Swal from "sweetalert2";
import FoodAndDrinkApi from "../../api/FoodAndDrinkApi";  // ✅ Sửa tên import

/**
 * Hàm xóa sản phẩm đồ ăn & thức uống
 * @param {int} ItemId - Id của sản phẩm cần xóa
 * @param {Function} setFoodItems - Hàm setState cập nhật danh sách sản phẩm
 */
export const deleteFoodItem = async (ItemId, setFoodItems) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      // ✅ Sửa tên API
      await FoodAndDrinkApi.delete(ItemId);

      // Cập nhật lại danh sách sản phẩm
      setFoodItems((prev) =>
        prev.filter((item) => item.ItemId !== ItemId)
      );

      // Toast thông báo thành công
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "🗑️ Xóa sản phẩm thành công!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "❌ Xóa sản phẩm thất bại!",
        text: error.response?.data?.message || "Vui lòng thử lại sau.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }
};