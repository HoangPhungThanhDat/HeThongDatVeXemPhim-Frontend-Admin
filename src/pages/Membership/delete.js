import Swal from "sweetalert2";
import MembershipApi from "../../api/MembershipApi";

/**
 * Hàm xóa 
 * @param {int} MembershipId - Id của Membership cần xóa
 * @param {Function} setMemberships - Hàm setState cập nhật danh sách Membership
 */
export const deleteMembership = async (MembershipId, setMemberships) => {
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
        await MembershipApi.delete(MembershipId);

        // Cập nhật lại danh sách membership
        setMemberships((prev) => prev.filter((membership) => membership.MembershipId !== MembershipId));

        Swal.fire("Đã xóa!", "Hội viên đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa membership:", error);
        Swal.fire("Lỗi!", "Xóa hội viên thất bại.", "error");
      }
    }
  });
};