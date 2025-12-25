import Swal from "sweetalert2";
import RoleApi from "../../api/RoleApi";

/**
 * Hàm xóa Role
 * @param {int} RoleId - Id của Role cần xóa
 * @param {Function} setRoles - Hàm setState cập nhật danh sách roles
 */
export const deleteRole = async (RoleId, setRoles) => {
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
        await RoleApi.delete(RoleId);

        // Cập nhật lại danh sách roles
        setRoles((prev) => prev.filter((role) => role.RoleId !== RoleId));

        Swal.fire("Đã xóa!", "Vai trò đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa role:", error);
        Swal.fire("Lỗi!", "Xóa vai trò thất bại.", "error");
      }
    }
  });
};
