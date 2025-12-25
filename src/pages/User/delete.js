import Swal from "sweetalert2";
import UserApi from "../../api/UserApi";

/**
 * Hàm xóa Role
 * @param {int} UserId - Id của user cần xóa
 * @param {Function} setUsers - Hàm setState cập nhật danh sách user
 */
export const deleteUser = async (UserId, setUsers) => {
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
        await UserApi.delete(UserId);

        // Cập nhật lại danh sách user
        setUsers((prev) => prev.filter((user) => user.UserId !== UserId));

        Swal.fire("Đã xóa!", "Người dùng đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        Swal.fire("Lỗi!", "Xóa người dùngg thất bại.", "error");
      }
    }
  });
};