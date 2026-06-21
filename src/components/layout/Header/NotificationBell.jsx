// src/components/layout/Header/NotificationBell.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../../services/notification.service";
import "./NotificationBell.scss";

export default function NotificationBell() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const lastFetchedAtRef = useRef(0);

  const normalizeNotificationsResponse = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.notifications)) return data.notifications;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;

    return [];
  };

  const fetchNotifications = useCallback(
    async ({ force = false } = {}) => {
      const now = Date.now();

      // جلوگیری از fetch پشت‌سرهم روی hoverهای مکرر
      if (!force && now - lastFetchedAtRef.current < 30000) {
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await notificationService.getMyNotifications({
          skip: 0,
          limit: 20,
        });

        const normalizedNotifications = normalizeNotificationsResponse(data);

        setNotifications(normalizedNotifications);
        lastFetchedAtRef.current = now;
      } catch (error) {
        setErrorMessage("دریافت پیام‌ها ناموفق بود.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNotifications({ force: true });
  }, [fetchNotifications]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter((item) => !item.is_read);
  }, [notifications]);

  const unreadCount = unreadNotifications.length;

  const previewNotifications = useMemo(() => {
    if (unreadNotifications.length > 0) {
      return unreadNotifications.slice(0, 3);
    }

    return notifications.slice(0, 3);
  }, [notifications, unreadNotifications]);

  const handleOpenInbox = () => {
    navigate("/notifications");
  };

  const handleMouseEnter = () => {
    fetchNotifications();
  };

  return (
    <div className="notification-bell" onMouseEnter={handleMouseEnter}>
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

          {unreadCount > 0 ? (
            <span className="notification-bell__unread">
              {unreadCount} خوانده‌نشده
            </span>
          ) : (
            <span className="notification-bell__read-state">
              بدون پیام خوانده‌نشده
            </span>
          )}
        </div>

        <div className="notification-bell__body">
          {isLoading && notifications.length === 0 ? (
            <p className="notification-bell__empty">در حال دریافت پیام‌ها...</p>
          ) : errorMessage ? (
            <p className="notification-bell__error">{errorMessage}</p>
          ) : previewNotifications.length === 0 ? (
            <p className="notification-bell__empty">پیامی موجود نیست</p>
          ) : (
            previewNotifications.map((item) => (
              <div
                key={item.id}
                className={`notification-bell__item ${
                  item.is_read ? "" : "notification-bell__item--unread"
                }`}
                onClick={handleOpenInbox}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleOpenInbox();
                  }
                }}
              >
                <div className="notification-bell__item-top">
                  {!item.is_read && (
                    <span className="notification-bell__dot" />
                  )}

                  <strong>{item.title}</strong>
                </div>

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
