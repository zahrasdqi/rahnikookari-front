import "./UserCard.scss";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusClass(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("suspend") || value.includes("ban")) {
    return "user-card__badge--danger";
  }

  if (value.includes("active")) return "user-card__badge--success";
  if (value.includes("pending")) return "user-card__badge--warning";
  if (value.includes("inactive")) return "user-card__badge--muted";

  return "user-card__badge--default";
}

function getUserId(user) {
  const candidates = [user?.user_id, user?.id, user?._id];

  return (
    candidates
      .map((value) => String(value || "").trim())
      .find((value) => UUID_PATTERN.test(value)) || ""
  );
}

function getUserRole(user) {
  if (typeof user?.role === "string") return user.role;
  return user?.role?.name || user?.role?.value || user?.role?.key || "";
}

function getRoleValue(role) {
  if (typeof role === "string") return role;
  return role?.name || role?.value || role?.key || role?.slug || role?.id || "";
}

function getRoleLabel(role) {
  if (typeof role === "string") return role;
  return role?.label || role?.title || role?.name || role?.value || role?.key || "—";
}

function isSuspended(status) {
  const value = String(status || "").toLowerCase();
  return value.includes("suspend") || value.includes("ban");
}

export default function UserCard({
  user = {},
  roles = [],
  onSuspend,
  onActivate,
  onChangeRole,
  onCopyLink,
  loadingActionId,
}) {
  const userId = getUserId(user);
  const userRole = getUserRole(user);
  const onboardingLink = user.onboarding_link || user.onboardingLink || "";
  const isActionLoading = String(loadingActionId || "") === String(userId || "");
  const actionsDisabled = !userId || isActionLoading;

  return (
    <article className="user-card">
      <div className="user-card__header">
        <div>
          <h3 className="user-card__name">
            {user.full_name || user.fullName || user.username || "—"}
          </h3>
          <p className="user-card__email">{user.email || "—"}</p>
        </div>

        <div className={`user-card__badge ${getStatusClass(user.status)}`}>
          {user.status || "unknown"}
        </div>
      </div>

      <div className="user-card__meta">
        <div>
          <span>شناسه</span>
          <strong>{userId || "UUID نامعتبر/ناموجود"}</strong>
        </div>

        <div>
          <span>نقش</span>
          <strong>{userRole || "—"}</strong>
        </div>

        <div>
          <span>تأیید شده</span>
          <strong>{user.is_verified || user.isVerified ? "بله" : "خیر"}</strong>
        </div>

        <div>
          <span>آخرین ورود</span>
          <strong>{formatDate(user.last_login || user.lastLogin)}</strong>
        </div>

        <div>
          <span>ایجاد شده</span>
          <strong>{formatDate(user.created_at || user.createdAt)}</strong>
        </div>
      </div>

      <div className="user-card__links">
        <div>
          <span>Onboarding Token</span>
          <code>{user.onboarding_token || user.onboardingToken || "—"}</code>
        </div>

        <div>
          <span>Onboarding Link</span>
          <code className="user-card__link">{onboardingLink || "—"}</code>
        </div>
      </div>

      <div className="user-card__actions">
        <button
          type="button"
          className="user-card__button user-card__button--ghost"
          onClick={() => onCopyLink?.(onboardingLink)}
          disabled={!onboardingLink}
        >
          کپی لینک
        </button>

        <select
          className="user-card__select"
          value={userRole}
          onChange={(event) => onChangeRole?.(userId, event.target.value)}
          disabled={actionsDisabled || !roles.length}
        >
          <option value="">تغییر نقش</option>

          {roles.map((role) => {
            const value = getRoleValue(role);

            if (!value) return null;

            return (
              <option key={value} value={value}>
                {getRoleLabel(role)}
              </option>
            );
          })}
        </select>

        {isSuspended(user.status) ? (
          <button
            type="button"
            className="user-card__button user-card__button--success"
            onClick={() => onActivate?.(userId)}
            disabled={actionsDisabled}
          >
            {isActionLoading ? "در حال انجام..." : "فعال‌سازی"}
          </button>
        ) : (
          <button
            type="button"
            className="user-card__button user-card__button--danger"
            onClick={() => onSuspend?.(userId)}
            disabled={actionsDisabled}
          >
            {isActionLoading ? "در حال انجام..." : "تعلیق"}
          </button>
        )}
      </div>
    </article>
  );
}
