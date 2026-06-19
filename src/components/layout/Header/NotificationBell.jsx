//src/components/layout/Header/NotificationBell.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../../services/notification.service";
import "./NotificationBell.scss";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await notificationService.getMyNotifications({
          skip: 0,
          limit: 5,
        });

        if (isMounted) {
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenInbox = () => {
    navigate("/notifications");
  };

  return (
    <div className="notification-bell">
      <button
        type="button"
        className="notification-bell__button"
        onClick={handleOpenInbox}
        aria-label="پیام‌ها"
      >
        <span className="notification-bell__icon">✉</span>

        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div className="notification-bell__popover">
        <div className="notification-bell__header">
          <span>پیام‌ها</span>

          {unreadCount > 0 && (
            <span className="notification-bell__unread">
              {unreadCount} خوانده‌نشده
            </span>
          )}
        </div>

        <div className="notification-bell__body">
          {isLoading ? (
            <p className="notification-bell__empty">در حال دریافت پیام‌ها...</p>
          ) : notifications.length === 0 ? (
            <p className="notification-bell__empty">پیامی موجود نیست</p>
          ) : (
            notifications.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className={`notification-bell__item ${
                  item.is_read ? "" : "notification-bell__item--unread"
                }`}
                onClick={handleOpenInbox}
              >
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          className="notification-bell__view-all"
          onClick={handleOpenInbox}
        >
          مشاهده همه پیام‌ها
        </button>
      </div>
    </div>
  );
}
