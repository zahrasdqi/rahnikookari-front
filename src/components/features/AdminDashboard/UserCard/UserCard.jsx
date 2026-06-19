//rahnikookari-front\src\components\features\AdminDashboard\UserCard\UserCard.jsx
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

function getRoleCardClass(role, status) {
  if (isSuspended(status)) return "user-card--suspended";

  const value = String(role || "").toLowerCase();

  if (value === "admin") return "user-card--admin";
  if (value === "verifier") return "user-card--verifier";

  return "user-card--regular";
}

function getRoleIcon(role, status) {
  if (isSuspended(status)) return "⛔";

  const value = String(role || "").toLowerCase();

  if (value === "admin") return "🛡️";
  if (value === "verifier") return "✓";

  return "👤";
}

function getRoleTitle(role, status) {
  if (isSuspended(status)) return "Suspended";

  const value = String(role || "").toLowerCase();

  if (value === "admin") return "Admin";
  if (value === "verifier") return "Verifier";

  return "User";
}

export default function UserCard({
  user = {},
  roles = [],
  onSuspend,
  onActivate,
  onChangeRole,
  loadingActionId,
}) {
  const userId = getUserId(user);
  const userRole = getUserRole(user);
  const isActionLoading = String(loadingActionId || "") === String(userId || "");
  const actionsDisabled = !userId || isActionLoading;

  return (
    <article className={`user-card ${getRoleCardClass(userRole, user.status)}`}>
      <div className="user-card__cover">
        <div className="user-card__role-icon" aria-hidden="true">
          {getRoleIcon(userRole, user.status)}
        </div>
      </div>

      <div className="user-card__header">
        <div className="user-card__identity">
          <span className="user-card__role-label">
            {getRoleTitle(userRole, user.status)}
          </span>

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
        <div className="user-card__meta-item user-card__meta-item--wide">
          <span>شناسه</span>
          <strong>{userId || "UUID نامعتبر/ناموجود"}</strong>
        </div>

        <div className="user-card__meta-item">
          <span>نقش</span>
          <strong>{userRole || "—"}</strong>
        </div>

        <div className="user-card__meta-item">
          <span>تأیید شده</span>
          <strong>{user.is_verified || user.isVerified ? "بله" : "خیر"}</strong>
        </div>

        <div className="user-card__meta-item">
          <span>آخرین ورود</span>
          <strong>{formatDate(user.last_login || user.lastLogin)}</strong>
        </div>

        <div className="user-card__meta-item">
          <span>ایجاد شده</span>
          <strong>{formatDate(user.created_at || user.createdAt)}</strong>
        </div>
      </div>

      <div className="user-card__actions">
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
