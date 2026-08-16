import "./UserFilters.scss";

const statusOptions = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
  { value: "suspended", label: "تعلیق‌شده" },
  { value: "pending", label: "در انتظار" },
];

export default function UserFilters({
  search,
  role,
  status,
  sortBy,
  roles = [],
  onChange,
  onReset,
}) {
  return (
    <div className="user-filters">
      <div className="user-filters__grid">
        <label className="user-filters__field">
          <span>جست‌وجو</span>
          <input
            type="text"
            value={search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="نام، ایمیل یا شناسه کاربر"
          />
        </label>

        <label className="user-filters__field">
          <span>نقش</span>
          <select
            value={role}
            onChange={(e) => onChange("role", e.target.value)}
          >
            <option value="">همه نقش‌ها</option>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="user-filters__field">
          <span>وضعیت</span>
          <select
            value={status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="user-filters__field">
          <span>مرتب‌سازی</span>
          <select
            value={sortBy}
            onChange={(e) => onChange("sortBy", e.target.value)}
          >
            <option value="created_at_desc">جدیدترین</option>
            <option value="created_at_asc">قدیمی‌ترین</option>
            <option value="last_login_desc">آخرین ورود</option>
            <option value="last_login_asc">قدیمی‌ترین ورود</option>
            <option value="full_name_asc">نام A → Z</option>
            <option value="full_name_desc">نام Z → A</option>
          </select>
        </label>
      </div>

      <div className="user-filters__actions">
        <button type="button" className="user-filters__reset" onClick={onReset}>
          پاک کردن فیلترها
        </button>
      </div>
    </div>
  );
}
