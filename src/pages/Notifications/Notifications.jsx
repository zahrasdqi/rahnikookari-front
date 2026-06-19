//src/pages/Notifications/Notifications.jsx
import { useEffect, useState } from "react";
import { notificationService } from "../../services/notification.service";
import "./Notifications.scss";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await notificationService.getMyNotifications({
        skip: 0,
        limit: 50,
      });

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage("دریافت پیام‌ها با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const updatedNotification = await notificationService.markAsRead(
        notificationId
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? updatedNotification : item
        )
      );
    } catch (error) {
      setErrorMessage("خوانده شدن پیام ثبت نشد.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
        }))
      );
    } catch (error) {
      setErrorMessage("خوانده شدن همه پیام‌ها ثبت نشد.");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateValue));
  };

  const hasUnread = notifications.some((item) => !item.is_read);

  return (
    <main className="notifications-page">
      <section className="notifications-page__panel">
        <aside className="notifications-page__sidebar">
          <div className="notifications-page__sidebar-title">
            صندوق پیام‌ها
          </div>

          <div className="notifications-page__sidebar-item notifications-page__sidebar-item--active">
            <span>📥</span>
            <span>دریافتی</span>
          </div>
        </aside>

        <section className="notifications-page__content">
          <div className="notifications-page__header">
            <div>
              <h1>پیام‌های دریافتی</h1>
              <p>اینجا می‌توانید پیام‌ها و اعلان‌های حساب خود را ببینید.</p>
            </div>

            {hasUnread && (
              <button type="button" onClick={handleMarkAllAsRead}>
                خواندن همه
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="notifications-page__error">{errorMessage}</div>
          )}

          {isLoading ? (
            <div className="notifications-page__state">
              در حال دریافت پیام‌ها...
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-page__state">
              موردی یافت نشد
            </div>
          ) : (
            <div className="notifications-page__list">
              {notifications.map((item) => (
                <article
                  key={item.id}
                  className={`notifications-page__card ${
                    item.is_read ? "" : "notifications-page__card--unread"
                  }`}
                >
                  <div className="notifications-page__card-main">
                    <div className="notifications-page__card-title">
                      {!item.is_read && <span />}
                      <h2>{item.title}</h2>
                    </div>

                    <p>{item.message}</p>

                    <time>{formatDate(item.created_at)}</time>
                  </div>

                  {!item.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      خواندم
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
