//src/pages/CharityProfileEdit/CharityProfileEdit.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [profileId, setProfileId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const hasProfile = Boolean(profileId);

  const pageDescription = useMemo(() => {
    if (isLoading) return "در حال دریافت اطلاعات نمایه خیریه...";
    if (!hasProfile) return "برای این حساب هنوز نمایه خیریه‌ای ساخته نشده است.";
    return "اطلاعات نمایه عمومی خیریه خود را تکمیل و ویرایش کنید.";
  }, [isLoading, hasProfile]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await charityProfileService.getMyProfile();

      const profile = data?.profile;

      if (!data?.has_profile || !profile) {
        setProfileId(null);
        setFormData(initialFormState);
        return;
      }

      setProfileId(profile.id);

      setFormData({
        charity_name: profile.charity_name || "",
        logo_file_id: profile.logo_file_id || "",
        cover_file_id: profile.cover_file_id || "",
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
      setErrorMessage("دریافت اطلاعات نمایه با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
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

  const buildPayload = () => {
  return {
    charity_name: formData.charity_name.trim(),

    logo_file_id: formData.logo_file_id
      ? Number(formData.logo_file_id)
      : null,

    cover_file_id: formData.cover_file_id
      ? Number(formData.cover_file_id)
      : null,

    short_description: formData.short_description.trim(),
    about_text: formData.about_text.trim(),
    vision_text: formData.vision_text.trim(),
    website: formData.website.trim() || null,
    phone: formData.phone.trim(),
    province: formData.province.trim(),
    city: formData.city.trim(),
    full_address: formData.full_address.trim(),

    social_links: {
      instagram: formData.social_links.instagram.trim(),
      telegram: formData.social_links.telegram.trim(),
      linkedin: formData.social_links.linkedin.trim(),
      x: formData.social_links.x.trim(),
      aparat: formData.social_links.aparat.trim(),
    },
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

  const handleSave = async (event) => {
    event.preventDefault();

    if (!profileId) {
      setErrorMessage("شناسه نمایه پیدا نشد. لطفاً دوباره وارد حساب شوید.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = buildPayload();

      await charityProfileService.updateProfile(profileId, payload);

      setSuccessMessage("تغییرات نمایه با موفقیت ذخیره شد.");
    } catch (error) {
      setErrorMessage("ذخیره تغییرات با خطا مواجه شد.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitProfile = async () => {
    if (!profileId) {
      setErrorMessage("شناسه نمایه پیدا نشد. لطفاً دوباره وارد حساب شوید.");
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

      await charityProfileService.updateProfile(profileId, payload);
      await charityProfileService.submitProfile(profileId);

      setSuccessMessage("نمایه با موفقیت ذخیره و برای بررسی ارسال شد.");
    } catch (error) {
      setErrorMessage("ارسال نمایه برای بررسی با خطا مواجه شد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="charity-profile-edit">
      <section className="charity-profile-edit__hero">
        <div>
          <span className="charity-profile-edit__eyebrow">
            نمایه خیریه
          </span>

          <h1>ویرایش نمایه خیریه</h1>

          <p>{pageDescription}</p>
        </div>

        <button
          type="button"
          className="charity-profile-edit__back-button"
          onClick={() => navigate("/charity")}
        >
          بازگشت به داشبورد
        </button>
      </section>

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

      {isLoading ? (
        <section className="charity-profile-edit__state">
          در حال دریافت اطلاعات...
        </section>
      ) : !hasProfile ? (
        <section className="charity-profile-edit__state">
          <h2>نمایه‌ای برای ویرایش وجود ندارد</h2>
          <p>
            هنوز برای این حساب خیریه، نمایه‌ای ثبت نشده است. ابتدا باید فرآیند
            ثبت خیریه تکمیل و تأیید شود.
          </p>

          <button
            type="button"
            onClick={() => navigate("/charity-register")}
          >
            رفتن به ثبت خیریه
          </button>
        </section>
      ) : (
        <form className="charity-profile-edit__form" onSubmit={handleSave}>
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
                />
              </label>
            </div>
          </section>

          <section className="charity-profile-edit__actions">
            <button
              type="button"
              className="charity-profile-edit__secondary-button"
              onClick={() => navigate("/charity")}
            >
              انصراف
            </button>

            <div>
              <button
                type="submit"
                className="charity-profile-edit__primary-button"
                disabled={isSaving || isSubmitting}
              >
                {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>

              <button
                type="button"
                className="charity-profile-edit__submit-button"
                disabled={isSaving || isSubmitting}
                onClick={handleSubmitProfile}
              >
                {isSubmitting ? "در حال ارسال..." : "ذخیره و ارسال برای بررسی"}
              </button>
            </div>
          </section>
        </form>
      )}
    </main>
  );
}
