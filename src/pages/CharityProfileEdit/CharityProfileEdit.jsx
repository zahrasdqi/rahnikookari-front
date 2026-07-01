//rahnikookari-front\src\pages\CharityProfileEdit\CharityProfileEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { charityProfileService } from "../../services/charityProfile.service";
import "./CharityProfileEdit.scss";

const initialFormState = {
  charity_name: "",
  logo_file_id: "",
  cover_file_id: "",
  short_description: "",
  about_text: "",
  vision_text: "",
  website: "",
  phone: "",
  province: "",
  city: "",
  full_address: "",
  social_links: {
    instagram: "",
    telegram: "",
    linkedin: "",
    x: "",
    aparat: "",
  },
};

export default function CharityProfileEdit() {
  const navigate = useNavigate();
  const { profileId: routeProfileId } = useParams();

  const [formData, setFormData] = useState(initialFormState);
  const [resolvedProfileId, setResolvedProfileId] = useState(routeProfileId || "");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const pageDescription =
    "اطلاعات نمایه عمومی خیریه خود را تکمیل و ویرایش کنید.";

  const activeProfileId = resolvedProfileId || routeProfileId;

  useEffect(() => {
    const loadMyProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setErrorMessage("");
        setSuccessMessage("");

        const data = await charityProfileService.getMyProfile();

        if (!data?.has_profile || !data?.profile) {
          setErrorMessage(
            "پروفایل شما هنوز ساخته نشده است. ابتدا باید درخواست احراز خیریه شما تأیید شود."
          );
          return;
        }

        const profile = data.profile;

        if (!profile?.id) {
          setErrorMessage("شناسه نمایه در پاسخ سرور پیدا نشد.");
          return;
        }

        setResolvedProfileId(profile.id);

        setFormData({
          charity_name: profile.charity_name || "",
          logo_file_id: profile.logo_file_id ? String(profile.logo_file_id) : "",
          cover_file_id: profile.cover_file_id ? String(profile.cover_file_id) : "",
          short_description: profile.short_description || "",
          about_text: profile.about_text || "",
          vision_text: profile.vision_text || "",
          website: profile.website || "",
          phone: profile.phone || "",
          province: profile.province || "",
          city: profile.city || "",
          full_address: profile.full_address || "",
          social_links: {
            instagram: profile.social_links?.instagram || "",
            telegram: profile.social_links?.telegram || "",
            linkedin: profile.social_links?.linkedin || "",
            x: profile.social_links?.x || "",
            aparat: profile.social_links?.aparat || "",
          },
        });
      } catch (error) {
        console.error("[CharityProfileEdit] Load profile error:", error);
        console.error(
          "[CharityProfileEdit] Load profile response:",
          error?.response?.data
        );

        const backendMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "دریافت اطلاعات نمایه با خطا مواجه شد.";

        setErrorMessage(
          typeof backendMessage === "string"
            ? backendMessage
            : "دریافت اطلاعات نمایه با خطا مواجه شد."
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadMyProfile();
  }, []);

  const toNullableTrimmedString = (value) => {
    const trimmed = String(value || "").trim();
    return trimmed || null;
  };

  const toOptionalTrimmedString = (value) => {
    return String(value || "").trim();
  };

  const toNullableFileId = (value) => {
    const trimmed = String(value || "").trim();
    return trimmed || null;
  };

  const buildSocialLinksPayload = () => {
    return {
      instagram: toNullableTrimmedString(formData.social_links.instagram),
      telegram: toNullableTrimmedString(formData.social_links.telegram),
      linkedin: toNullableTrimmedString(formData.social_links.linkedin),
      x: toNullableTrimmedString(formData.social_links.x),
      aparat: toNullableTrimmedString(formData.social_links.aparat),
    };
  };

  const buildPayload = () => {
    return {
      charity_name: toOptionalTrimmedString(formData.charity_name),

      logo_file_id: toNullableFileId(formData.logo_file_id),
      cover_file_id: toNullableFileId(formData.cover_file_id),

      short_description: toOptionalTrimmedString(formData.short_description),
      about_text: toNullableTrimmedString(formData.about_text),
      vision_text: toNullableTrimmedString(formData.vision_text),

      website: toNullableTrimmedString(formData.website),
      phone: toOptionalTrimmedString(formData.phone),

      province: toOptionalTrimmedString(formData.province),
      city: toOptionalTrimmedString(formData.city),
      full_address: toOptionalTrimmedString(formData.full_address),

      social_links: buildSocialLinksPayload(),
    };
  };

  const validateForm = () => {
    if (!formData.charity_name.trim()) {
      return "نام خیریه الزامی است.";
    }

    if (!formData.short_description.trim()) {
      return "توضیح کوتاه خیریه الزامی است.";
    }

    if (!formData.phone.trim()) {
      return "شماره تماس الزامی است.";
    }

    if (!formData.province.trim()) {
      return "استان الزامی است.";
    }

    if (!formData.city.trim()) {
      return "شهر الزامی است.";
    }

    if (!formData.full_address.trim()) {
      return "آدرس کامل الزامی است.";
    }

    return "";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
    }));
  };

  const handleSubmitProfile = async (event) => {
    event?.preventDefault();

    if (!activeProfileId) {
      setErrorMessage("شناسه نمایه پیدا نشد. لطفاً دوباره وارد حساب شوید.");
      setSuccessMessage("");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = buildPayload();

      console.log("[CharityProfileEdit] Submit profile id:", activeProfileId);
      console.log("[CharityProfileEdit] Submit profile payload:", payload);

      await charityProfileService.updateProfile(activeProfileId, payload);
      await charityProfileService.submitProfile(activeProfileId);

      setSuccessMessage("نمایه با موفقیت برای بررسی ارسال شد.");
    } catch (error) {
      console.error("[CharityProfileEdit] Submit profile error:", error);
      console.error(
        "[CharityProfileEdit] Submit profile response:",
        error?.response?.data
      );

      const backendMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "ارسال نمایه برای بررسی با خطا مواجه شد.";

      setErrorMessage(
        typeof backendMessage === "string"
          ? backendMessage
          : "ارسال نمایه برای بررسی با خطا مواجه شد."
      );

      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="charity-profile-edit">
      <section className="charity-profile-edit__hero">
        <div>
          <span className="charity-profile-edit__eyebrow">نمایه خیریه</span>
          <h1>ویرایش نمایه خیریه</h1>
          <p>{pageDescription}</p>
        </div>

        <button
          type="button"
          className="charity-profile-edit__back-button"
          onClick={() => navigate("/charity")}
          disabled={isSubmitting}
        >
          بازگشت به داشبورد
        </button>
      </section>

      {isLoadingProfile && (
        <div className="charity-profile-edit__alert">
          در حال دریافت اطلاعات نمایه...
        </div>
      )}

      {errorMessage && (
        <div className="charity-profile-edit__alert charity-profile-edit__alert--error">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="charity-profile-edit__alert charity-profile-edit__alert--success">
          {successMessage}
        </div>
      )}

      <form className="charity-profile-edit__form" onSubmit={handleSubmitProfile}>
        <section className="charity-profile-edit__card">
          <div className="charity-profile-edit__card-header">
            <h2>اطلاعات اصلی</h2>
            <p>این اطلاعات در صفحه عمومی خیریه نمایش داده می‌شود.</p>
          </div>

          <div className="charity-profile-edit__grid">
            <label className="charity-profile-edit__field">
              <span>نام خیریه *</span>
              <input
                type="text"
                name="charity_name"
                value={formData.charity_name}
                onChange={handleInputChange}
                placeholder="مثلاً مؤسسه نیکوکاری راه نیک"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>شماره تماس *</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="مثلاً 02112345678"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>وب‌سایت</span>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.org"
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>شناسه فایل لوگو</span>
              <input
                type="text"
                name="logo_file_id"
                value={formData.logo_file_id}
                onChange={handleInputChange}
                placeholder="Logo file ID"
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>شناسه فایل کاور</span>
              <input
                type="text"
                name="cover_file_id"
                value={formData.cover_file_id}
                onChange={handleInputChange}
                placeholder="Cover file ID"
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>
          </div>

          <label className="charity-profile-edit__field">
            <span>توضیح کوتاه *</span>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              placeholder="یک معرفی کوتاه و جذاب از فعالیت خیریه بنویسید."
              rows={3}
              disabled={isLoadingProfile || isSubmitting}
            />
          </label>
        </section>

        <section className="charity-profile-edit__card">
          <div className="charity-profile-edit__card-header">
            <h2>درباره خیریه</h2>
            <p>اینجا بهتر است شفاف، انسانی و دقیق بنویسی؛ اعتمادساز است.</p>
          </div>

          <label className="charity-profile-edit__field">
            <span>درباره ما</span>
            <textarea
              name="about_text"
              value={formData.about_text}
              onChange={handleInputChange}
              placeholder="درباره تاریخچه، مأموریت و حوزه فعالیت خیریه بنویسید."
              rows={6}
              disabled={isLoadingProfile || isSubmitting}
            />
          </label>

          <label className="charity-profile-edit__field">
            <span>چشم‌انداز</span>
            <textarea
              name="vision_text"
              value={formData.vision_text}
              onChange={handleInputChange}
              placeholder="چشم‌انداز و هدف بلندمدت خیریه را توضیح دهید."
              rows={5}
              disabled={isLoadingProfile || isSubmitting}
            />
          </label>
        </section>

        <section className="charity-profile-edit__card">
          <div className="charity-profile-edit__card-header">
            <h2>موقعیت و آدرس</h2>
            <p>برای اعتبار و دسترسی بهتر کاربران، اطلاعات مکانی را کامل کن.</p>
          </div>

          <div className="charity-profile-edit__grid">
            <label className="charity-profile-edit__field">
              <span>استان *</span>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="مثلاً تهران"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>شهر *</span>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="مثلاً تهران"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>
          </div>

          <label className="charity-profile-edit__field">
            <span>آدرس کامل *</span>
            <textarea
              name="full_address"
              value={formData.full_address}
              onChange={handleInputChange}
              placeholder="آدرس کامل خیریه را وارد کنید."
              rows={4}
              disabled={isLoadingProfile || isSubmitting}
            />
          </label>
        </section>

        <section className="charity-profile-edit__card">
          <div className="charity-profile-edit__card-header">
            <h2>شبکه‌های اجتماعی</h2>
            <p>لینک شبکه‌های اجتماعی به افزایش اعتماد کمک می‌کند.</p>
          </div>

          <div className="charity-profile-edit__grid">
            <label className="charity-profile-edit__field">
              <span>اینستاگرام</span>
              <input
                type="url"
                name="instagram"
                value={formData.social_links.instagram}
                onChange={handleSocialLinkChange}
                placeholder="https://instagram.com/..."
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>تلگرام</span>
              <input
                type="url"
                name="telegram"
                value={formData.social_links.telegram}
                onChange={handleSocialLinkChange}
                placeholder="https://t.me/..."
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>لینکدین</span>
              <input
                type="url"
                name="linkedin"
                value={formData.social_links.linkedin}
                onChange={handleSocialLinkChange}
                placeholder="https://linkedin.com/..."
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>ایکس / توییتر</span>
              <input
                type="url"
                name="x"
                value={formData.social_links.x}
                onChange={handleSocialLinkChange}
                placeholder="https://x.com/..."
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>

            <label className="charity-profile-edit__field">
              <span>آپارات</span>
              <input
                type="url"
                name="aparat"
                value={formData.social_links.aparat}
                onChange={handleSocialLinkChange}
                placeholder="https://aparat.com/..."
                dir="ltr"
                disabled={isLoadingProfile || isSubmitting}
              />
            </label>
          </div>
        </section>

        <section className="charity-profile-edit__actions">
          <button
            type="button"
            className="charity-profile-edit__secondary-button"
            onClick={() => navigate("/charity")}
            disabled={isSubmitting}
          >
            انصراف
          </button>

          <div>
            <button
              type="submit"
              className="charity-profile-edit__submit-button"
              disabled={isLoadingProfile || isSubmitting}
            >
              {isSubmitting ? "در حال ارسال..." : "ارسال برای بررسی"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
