import { FaBell } from "react-icons/fa";
import { useEffect } from "react"; // Import useEffect for real-time notification handling
import axiosInstance from "../services/axiosConfig";
import { getSocket } from "../services/socket"; // Import the socket service

const NotificationDropdown = ({
  notifications,
  dropdownOpen,
  toggleDropdown,
  setNotifications,
}) => {
  const unseenCount = notifications.filter((n) => !n.seen).length;

  // Real-time notifications with Socket.IO
  useEffect(() => {
    const socket = getSocket();
    // Listen for real-time notifications from the server

    socket.on("notification", (notification) => {
      // console.log(`Notification: ${JSON.stringify(notification)}`);

      // Update notifications in the state with the new notification
      setNotifications((prev) => {
        // console.log(`prev: ${JSON.stringify(prev)}`);
        const notificationIndex = prev.findIndex(
          (n) =>
            n._id === notification._id && n.message === notification.message
        );

        if (notificationIndex !== -1) {
          const updatedNotifications = [...prev];
          updatedNotifications[notificationIndex] = notification;
          return updatedNotifications;
        } else {
          return [...prev, notification];
        }
      });
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off("notification");
    };
  }, [setNotifications]);

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

  const markAll = async (notifications) => {
    // Optimistically update the state first
    setNotifications(
      notifications.map((n) => ({
        ...n,
        seen: true,
      }))
    );

    try {
      // Use a map to create an array of promises for marking notifications as seen in the backend
      const markPromises = notifications.map((notification) =>
        axiosInstance.put(`/api/notifications/mark-seen/${notification._id}`)
      );

      // Await all promises to resolve
      await Promise.all(markPromises);
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
      // Optional: handle reverting the state if any API call fails
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
            <div>
              <button
                onClick={() => markAll(notifications)}
                className="mb-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded transition duration-200 ease-in-out"
              >
                Mark All
              </button>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
