import { FaBell } from "react-icons/fa";
import axiosInstance from "../services/axiosConfig";

const NotificationDropdown = ({
  notifications,
  dropdownOpen,
  toggleDropdown,
  setNotifications,
}) => {
  const unseenCount = notifications.filter((n) => !n.seen).length;

  const markAsSeen = async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/mark-seen/${notificationId}`);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, seen: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer text-primary"
        onClick={toggleDropdown}
        style={{ padding: "8px", display: "inline-block" }}
      >
        <FaBell
          className="text-2xl cursor-pointer text-primary"
          onClick={toggleDropdown}
        />
        {unseenCount > 0 && (
          <span
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-sm flex items-center justify-center"
            style={{
              width: "24px", // Increase badge size for better clickability
              height: "24px",
              lineHeight: "24px",
              padding: "4px", // Add padding to increase hitbox
              fontSize: "12px",
              zIndex: 10,
            }}
          >
            {unseenCount}
          </span>
        )}
      </div>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-20">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`p-2 border-b ${
                    notification.seen ? "text-gray-400" : "text-black"
                  }`}
                >
                  <p>{notification.message}</p>
                  {!notification.seen && (
                    <button
                      onClick={() => markAsSeen(notification._id)}
                      className="text-blue-500 text-sm mt-1"
                    >
                      Mark as Seen
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
