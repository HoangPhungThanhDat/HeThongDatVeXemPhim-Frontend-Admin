import Swal from "sweetalert2";
import RoomApi from "../../api/RoomApi";

/**
 * Hàm xóa Room
 * @param {int} RoomId - Id của Room cần xóa
 * @param {Function} setRooms - Hàm setState cập nhật danh sách rooms
 */
export const deleteRoom = async (RoomId, setRooms) => {
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
        await RoomApi.delete(RoomId);

        // Cập nhật lại danh sách rooms
        setRooms((prev) => prev.filter((room) => room.RoomId !== RoomId));

        Swal.fire("Đã xóa!", "Phòng chiếu đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa phòng chiếu:", error);
        Swal.fire("Lỗi!", "Xóa phòng chiếu thất bại.", "error");
      }
    }
  });
};
