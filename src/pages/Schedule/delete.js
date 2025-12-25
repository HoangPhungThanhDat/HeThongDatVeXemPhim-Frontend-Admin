import Swal from "sweetalert2";
import ScheduleApi from "../../api/ScheduleApi";

/**
 * Hàm xóa lịch chiếu
 * @param {int} ScheduleId - Id của lịch chiếu cần xóa
 * @param {Function} setSchedules - Hàm setState cập nhật danh sách lịch chiếu
 */
export const deleteSchedule = async (ScheduleId, setSchedules) => {
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
        await ScheduleApi.delete(ScheduleId);

        // Cập nhật lại danh sách lịch chiếu
        setSchedules((prev) => prev.filter((schedule) => schedule.ScheduleId !== ScheduleId));

        Swal.fire("Đã xóa!", "Lịch chiếu định kỳ đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa lịch chiếu:", error);
        Swal.fire("Lỗi!", "Xóa lịch chiếu định kỳ thất bại.", "error");
      }
    }
  });
};
