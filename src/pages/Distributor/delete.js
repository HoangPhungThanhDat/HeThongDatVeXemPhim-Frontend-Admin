import Swal from "sweetalert2";
import DistributorApi from "../../api/DistributorApi";

/**
 * Hàm xóa Distributor
 * @param {int} DistributorId - Id của Distributor cần xóa
 * @param {Function} setDistributors - Hàm setState cập nhật danh sách distributors
 */
export const deleteDistributor = async (DistributorId, setDistributors) => {
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
        await DistributorApi.delete(DistributorId);

        // Cập nhật lại danh sách distributors
        setDistributors((prev) => prev.filter((distributor) => distributor.DistributorId !== DistributorId));

        Swal.fire("Đã xóa!", "Nhà phát hành đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa nhà phát hành:", error);
        Swal.fire("Lỗi!", "Xóa nhà phát hành thất bại.", "error");
      }
    }
  });
};
