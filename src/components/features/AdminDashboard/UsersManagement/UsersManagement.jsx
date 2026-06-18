import { useEffect, useMemo, useState } from "react";
import { adminService } from "../../../../services/admin.service";
import AdminTabs from "../AdminTabs/AdminTabs";
import UserFilters from "../UserFilters/UserFilters";
import UserCard from "../UserCard/UserCard";
import "./UsersManagement.scss";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const defaultFilters = {
  search: "",
  role: "",
  status: "",
  sortBy: "created_at_desc",
};

const tabItems = [
  { value: "users", label: "مدیریت کاربران" },
  { value: "verifier", label: "ایجاد Verifier" },
];

function formatError(error) {
  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") return data;

    if (Array.isArray(data?.detail)) {
      const message = data.detail
        .map((item) => item?.msg || item?.message)
        .filter(Boolean)
        .join("، ");

      return message || "درخواست نامعتبر است.";
    }

    if (typeof data?.detail === "string") return data.detail;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return JSON.stringify(data);
  }

  return error?.message || "خطای ناشناخته رخ داد.";
}

function getUserId(user) {
  const candidates = [user?.user_id, user?.id, user?._id];

  return (
    candidates
      .map((value) => String(value || "").trim())
      .find((value) => UUID_PATTERN.test(value)) || ""
  );
}

function getUserName(user) {
  return user?.full_name || user?.fullName || user?.username || "";
}

function getUserRole(user) {
  if (typeof user?.role === "string") return user.role;

  return user?.role?.name || user?.role?.value || user?.role?.key || "";
}

function getDateValue(user, key) {
  const value = user?.[key] || user?.[toCamelCase(key)];
  if (!value) return 0;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function toCamelCase(value) {
  return value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function sortUsers(users, sortBy) {
  const items = [...users];

  switch (sortBy) {
    case "created_at_asc":
      return items.sort(
        (a, b) => getDateValue(a, "created_at") - getDateValue(b, "created_at")
      );

    case "last_login_desc":
      return items.sort(
        (a, b) => getDateValue(b, "last_login") - getDateValue(a, "last_login")
      );

    case "last_login_asc":
      return items.sort(
        (a, b) => getDateValue(a, "last_login") - getDateValue(b, "last_login")
      );

    case "full_name_asc":
      return items.sort((a, b) => getUserName(a).localeCompare(getUserName(b)));

    case "full_name_desc":
      return items.sort((a, b) => getUserName(b).localeCompare(getUserName(a)));

    case "created_at_desc":
    default:
      return items.sort(
        (a, b) => getDateValue(b, "created_at") - getDateValue(a, "created_at")
      );
  }
}

function normalizeUsersResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.results)) return response.results;

  return [];
}

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [verifierSubmitting, setVerifierSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifierForm, setVerifierForm] = useState({
    full_name: "",
    email: "",
  });

  const tabs = useMemo(
    () =>
      tabItems.map((tab) =>
        tab.value === "users" ? { ...tab, count: users.length } : tab
      ),
    [users.length]
  );

  const roles = useMemo(() => {
    const uniqueRoles = new Set();

    users.forEach((user) => {
      const role = getUserRole(user);
      if (role) uniqueRoles.add(role);
    });

    return Array.from(uniqueRoles);
  }, [users]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminService.listUsers();
      setUsers(normalizeUsersResponse(response));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const search = filters.search.trim().toLowerCase();

    if (search) {
      result = result.filter((user) => {
        const userId = getUserId(user);
        const userName = getUserName(user);
        const userRole = getUserRole(user);

        return (
          String(userName).toLowerCase().includes(search) ||
          String(user?.email || "").toLowerCase().includes(search) ||
          String(userRole).toLowerCase().includes(search) ||
          String(userId).toLowerCase().includes(search)
        );
      });
    }

    if (filters.role) {
      result = result.filter(
        (user) => String(getUserRole(user)) === String(filters.role)
      );
    }

    if (filters.status) {
      result = result.filter(
        (user) =>
          String(user?.status || "").toLowerCase() ===
          String(filters.status).toLowerCase()
      );
    }

    return sortUsers(result, filters.sortBy);
  }, [users, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const updateUserInList = (userId, updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => {
        const currentId = getUserId(user);
        return currentId === userId ? { ...user, ...updatedUser } : user;
      })
    );
  };

  const handleSuspend = async (userId) => {
    if (!userId) {
      setError("شناسه معتبر کاربر پیدا نشد. مقدار user_id باید UUID کامل باشد.");
      return;
    }

    setActionLoadingId(userId);
    setError("");
    setSuccessMessage("");

    try {
      const updatedUser = await adminService.suspendUser(userId);
      updateUserInList(userId, updatedUser || { status: "suspended" });
      setSuccessMessage("کاربر با موفقیت تعلیق شد.");
      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleActivate = async (userId) => {
    if (!userId) {
      setError("شناسه معتبر کاربر پیدا نشد. مقدار user_id باید UUID کامل باشد.");
      return;
    }

    setActionLoadingId(userId);
    setError("");
    setSuccessMessage("");

    try {
      const updatedUser = await adminService.activateUser(userId);
      updateUserInList(userId, updatedUser || { status: "active" });
      setSuccessMessage("کاربر با موفقیت فعال شد.");
      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChangeRole = async (userId, role) => {
    if (!userId) {
      setError("شناسه معتبر کاربر پیدا نشد. مقدار user_id باید UUID کامل باشد.");
      return;
    }

    if (!role) return;

    setActionLoadingId(userId);
    setError("");
    setSuccessMessage("");

    try {
      const updatedUser = await adminService.changeRole(userId, role);
      updateUserInList(userId, updatedUser || { role });
      setSuccessMessage("نقش کاربر با موفقیت تغییر کرد.");
      await loadUsers();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyLink = async (link) => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setSuccessMessage("لینک onboarding کپی شد.");
      setError("");
    } catch {
      setError("کپی لینک انجام نشد. لطفاً دستی کپی کنید.");
    }
  };

  const handleVerifierChange = (field, value) => {
    setVerifierForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateVerifier = async (event) => {
    event.preventDefault();

    const fullName = verifierForm.full_name.trim();
    const email = verifierForm.email.trim();

    if (!fullName || !email) {
      setError("نام کامل و ایمیل verifier الزامی است.");
      return;
    }

    setVerifierSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await adminService.createVerifier({
        full_name: fullName,
        email,
      });

      setVerifierForm({
        full_name: "",
        email: "",
      });

      setSuccessMessage("Verifier با موفقیت ایجاد شد.");
      await loadUsers();
      setActiveTab("users");
    } catch (err) {
      setError(formatError(err));
    } finally {
      setVerifierSubmitting(false);
    }
  };

  return (
    <section className="users-management">
      <div className="users-management__header">
        <div>
          <p className="users-management__eyebrow">Admin Panel</p>
          <h2 className="users-management__title">مدیریت کاربران</h2>
          <p className="users-management__subtitle">
            مشاهده کاربران، تغییر نقش، تعلیق یا فعال‌سازی و ایجاد verifier جدید.
          </p>
        </div>

        <button
          type="button"
          className="users-management__refresh"
          onClick={loadUsers}
          disabled={loading}
        >
          {loading ? "در حال بروزرسانی..." : "بروزرسانی"}
        </button>
      </div>

      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div className="users-management__alert users-management__alert--error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="users-management__alert users-management__alert--success">
          {successMessage}
        </div>
      )}

      {activeTab === "users" && (
        <>
          <UserFilters
            search={filters.search}
            role={filters.role}
            status={filters.status}
            sortBy={filters.sortBy}
            roles={roles}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {loading ? (
            <div className="users-management__state">
              در حال دریافت کاربران...
            </div>
          ) : filteredUsers.length ? (
            <div className="users-management__grid">
              {filteredUsers.map((user, index) => {
                const userId = getUserId(user);

                return (
                  <UserCard
                    key={userId || user?.email || index}
                    user={user}
                    roles={roles}
                    loadingActionId={actionLoadingId}
                    onSuspend={handleSuspend}
                    onActivate={handleActivate}
                    onChangeRole={handleChangeRole}
                    onCopyLink={handleCopyLink}
                  />
                );
              })}
            </div>
          ) : (
            <div className="users-management__state">
              کاربری با این فیلترها پیدا نشد.
            </div>
          )}
        </>
      )}

      {activeTab === "verifier" && (
        <form
          className="users-management__verifier"
          onSubmit={handleCreateVerifier}
        >
          <div className="users-management__form-header">
            <h3>ایجاد Verifier جدید</h3>
            <p>
              طبق Swagger، فقط `full_name` و `email` ارسال می‌شود و پسورد ارسال
              نمی‌شود.
            </p>
          </div>

          <label className="users-management__field">
            <span>نام کامل</span>
            <input
              type="text"
              value={verifierForm.full_name}
              onChange={(event) =>
                handleVerifierChange("full_name", event.target.value)
              }
              placeholder="مثلاً علی رضایی"
            />
          </label>

          <label className="users-management__field">
            <span>ایمیل</span>
            <input
              type="email"
              value={verifierForm.email}
              onChange={(event) =>
                handleVerifierChange("email", event.target.value)
              }
              placeholder="verifier@example.com"
              dir="ltr"
            />
          </label>

          <div className="users-management__form-actions">
            <button
              type="button"
              className="users-management__secondary-button"
              onClick={() =>
                setVerifierForm({
                  full_name: "",
                  email: "",
                })
              }
              disabled={verifierSubmitting}
            >
              پاک کردن
            </button>

            <button
              type="submit"
              className="users-management__primary-button"
              disabled={verifierSubmitting}
            >
              {verifierSubmitting ? "در حال ایجاد..." : "ایجاد verifier"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
