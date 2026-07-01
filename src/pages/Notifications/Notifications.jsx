import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notification.service";
import { charityProfileService } from "../../services/charityProfile.service";
import "./Notifications.scss";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigatingToProfile, setIsNavigatingToProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      console.log("[Notifications] Fetching notifications...");

      const data = await notificationService.getMyNotifications({
        skip: 0,
        limit: 50,
      });

      console.log("[Notifications] Raw API response:", data);

      const normalizedNotifications = Array.isArray(data) ? data : [];

      console.log(
        "[Notifications] Normalized notifications:",
        normalizedNotifications
      );

      normalizedNotifications.forEach((item, index) => {
        console.log(`[Notifications] Item ${index}:`, item);
      });

      setNotifications(normalizedNotifications);
    } catch (error) {
      console.error("[Notifications] Fetch notifications error:", error);
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
      console.log("[Notifications] Mark as read clicked:", notificationId);

      const updatedNotification = await notificationService.markAsRead(
        notificationId
      );

      console.log(
        "[Notifications] Mark as read API response:",
        updatedNotification
      );

      setNotifications((prev) =>
        prev.map((item) =>
          String(item.id) === String(notificationId)
            ? updatedNotification
            : item
        )
      );
    } catch (error) {
      console.error("[Notifications] Mark as read error:", error);
      setErrorMessage("خوانده شدن پیام ثبت نشد.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log("[Notifications] Mark all as read clicked");

      await notificationService.markAllAsRead();

      console.log("[Notifications] Mark all as read completed");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error("[Notifications] Mark all as read error:", error);
      setErrorMessage("خوانده شدن همه پیام‌ها ثبت نشد.");
    }
  };

  
  const handleGoToEditProfile = async () => {
  try {
    setErrorMessage("");
    setIsNavigatingToProfile(true);

    console.log("[Notifications] Fetching charity profile...");

    const data = await charityProfileService.getMyProfile();

    console.log("[Notifications] /charity/profile/me response:", data);

    if (!data?.has_profile || !data?.profile?.id) {
      setErrorMessage(
        "پروفایل شما هنوز ساخته نشده است. ابتدا باید درخواست احراز خیریه شما تأیید شود."
      );
      return;
    }

    const profileId = data.profile.id;

    navigate(`/charity/profile/edit/${profileId}`);

  } catch (error) {
    console.error("[Notifications] Navigate error:", error);

    setErrorMessage(
      "ورود به صفحه تکمیل پروفایل با خطا مواجه شد."
    );
  } finally {
    setIsNavigatingToProfile(false);
  }
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
    const title = String(item?.title || "").toLowerCase();
    const message = String(item?.message || "").toLowerCase();

    const isRejected =
      type.includes("reject") ||
      type.includes("rejected") ||
      type.includes("decline") ||
      type.includes("declined") ||
      status.includes("reject") ||
      status.includes("rejected") ||
      status.includes("decline") ||
      status.includes("declined") ||
      title.includes("رد شد") ||
      message.includes("رد شد");

    const isApproved =
      type.includes("approve") ||
      type.includes("approved") ||
      type.includes("accept") ||
      type.includes("accepted") ||
      status.includes("approve") ||
      status.includes("approved") ||
      status.includes("accept") ||
      status.includes("accepted") ||
      title.includes("تأیید") ||
      title.includes("تایید") ||
      message.includes("تأیید") ||
      message.includes("تایید");

    const result = isApproved && !isRejected;

    console.log("[Notifications] Approve notification check:", {
      notificationId: item?.id,
      type: item?.type,
      status: item?.status,
      title: item?.title,
      isApproved,
      isRejected,
      result,
    });

    return result;
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

                const shouldShowEditProfileButton =
                  isApproveNotification(item);

                console.log("[Notifications] Render notification card:", {
                  notificationId: item.id,
                  notificationTypeClass,
                  shouldShowEditProfileButton,
                  item,
                });

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
                      {shouldShowEditProfileButton && (
                        <button
                          type="button"
                          className="notifications-page__action-button notifications-page__action-button--profile"
                          onClick={handleGoToEditProfile}
                          disabled={isNavigatingToProfile}
                        >
                          {isNavigatingToProfile
                            ? "در حال ورود..."
                            : "تکمیل پروفایل"}
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
