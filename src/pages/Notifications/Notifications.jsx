import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notification.service";
import "./Notifications.scss";

export default function Notifications() {
  const navigate = useNavigate();

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
          String(item.id) === String(notificationId)
            ? updatedNotification
            : item
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

  const handleGoToEditProfile = () => {
    navigate("/charity/profile/edit");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateValue));
  };

  const getNotificationTypeClass = (type) => {
    if (!type) return "system";

    return String(type)
      .trim()
      .toLowerCase()
      .replaceAll("_", "-");
  };

  const getNotificationIcon = (type) => {
    const normalizedType = getNotificationTypeClass(type);

    if (
      normalizedType.includes("approve") ||
      normalizedType.includes("approved") ||
      normalizedType.includes("accept") ||
      normalizedType.includes("accepted")
    ) {
      return "✅";
    }

    if (
      normalizedType.includes("reject") ||
      normalizedType.includes("rejected") ||
      normalizedType.includes("decline") ||
      normalizedType.includes("declined")
    ) {
      return "❌";
    }

    if (
      normalizedType.includes("warning") ||
      normalizedType.includes("alert")
    ) {
      return "⚠️";
    }

    return "🔔";
  };

  const isApproveNotification = (item) => {
    const type = String(item?.type || "").toLowerCase();
    const status = String(item?.status || "").toLowerCase();

    return (
      type.includes("approve") ||
      type.includes("approved") ||
      type.includes("accept") ||
      type.includes("accepted") ||
      status.includes("approve") ||
      status.includes("approved") ||
      status.includes("accept") ||
      status.includes("accepted")
    );
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
            <div className="notifications-page__state">موردی یافت نشد</div>
          ) : (
            <div className="notifications-page__list">
              {notifications.map((item) => {
                const notificationTypeClass = getNotificationTypeClass(
                  item.type
                );

                return (
                  <article
                    key={item.id}
                    className={`notifications-page__card ${
                      item.is_read ? "" : "notifications-page__card--unread"
                    } notifications-page__card--${notificationTypeClass}`}
                  >
                    <div className="notifications-page__card-main">
                      <div className="notifications-page__card-title">
                        {!item.is_read && (
                          <span className="notifications-page__unread-dot" />
                        )}

                        <span className="notifications-page__type-icon">
                          {getNotificationIcon(item.type)}
                        </span>

                        <h2>{item.title}</h2>
                      </div>

                      <p>{item.message}</p>

                      <time>{formatDate(item.created_at)}</time>
                    </div>

                    <div className="notifications-page__card-actions">

                      {isApproveNotification(item) && (
                        <button
                          type="button"
                          className="notifications-page__action-button notifications-page__action-button--profile"
                          onClick={handleGoToEditProfile}
                        >
                          ویرایش نمایه
                        </button>
                      )}

                      {!item.is_read && (
                        <button
                          type="button"
                          className="notifications-page__action-button notifications-page__action-button--read"
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          خواندم
                        </button>
                      )}

                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
