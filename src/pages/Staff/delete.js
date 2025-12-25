import Swal from "sweetalert2";
import StaffApi from "../../api/StaffApi";

/**
 * Hàm xóa Staff
 * @param {int} StaffId - Id của Staff cần xóa
 * @param {Function} setStaffs - Hàm setState để cập nhật danh sách staff
 */
export const deleteStaff = async (StaffId, setStaffs) => {
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
        await StaffApi.delete(StaffId);

        // Đảm bảo filter đúng key và đúng kiểu dữ liệu
        setStaffs((prev) =>
          prev.filter((staff) => Number(staff.StaffId) !== Number(StaffId))
        );

        Swal.fire("Đã xóa!", "Nhân viên đã được xóa thành công.", "success");
      } catch (error) {
        Swal.fire("Lỗi!", "Xóa nhân viên thất bại.", "error");
      }
    }
  });
};

