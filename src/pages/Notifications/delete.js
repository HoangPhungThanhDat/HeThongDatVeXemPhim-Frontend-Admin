import Swal from "sweetalert2";
import NotificationApi from "../../api/NotificationApi";

/**
 * Hàm xóa Notification
 * @param {string} NotificationId - Id của Notification cần xóa
 * @param {Function} setNotifications - Hàm setState cập nhật danh sách notifications
 */
export const deleteNotification = async (NotificationId, setNotifications) => {
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
        await NotificationApi.delete(NotificationId);
        // Cập nhật lại danh sách notifications
        setNotifications((prev) => 
          prev.filter((notification) => notification.NotificationId !== NotificationId)
        );
        Swal.fire("Đã xóa!", "Thông báo đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
        Swal.fire("Lỗi!", "Xóa thông báo thất bại.", "error");
      }
    }
  });
};