// src/components/features/CharityDashboard/CharityHero/CharityHero.jsx
import "./CharityHero.scss";

function formatFaDate(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function CharityHero({ charity }) {
  const name = charity?.name ?? charity?.charity_name ?? "نام مؤسسه";
  const description = charity?.description ?? "توضیحات مؤسسه";
  const activity = charity?.activity_field ?? charity?.activity ?? "—";
  const location = charity?.location ?? charity?.city ?? "—";
  const approvedAt = formatFaDate(charity?.approved_at ?? charity?.verified_at);
  const avatar = charity?.logo_url ?? charity?.image_url ?? charity?.avatar_url ?? "";

  return (
    <section className="charity-hero">
      {/* ۱. نوار آبی بالایی */}
      <div className="charity-hero__banner">
        {/* آواتار شناور روی مرز دو بخش */}
        <div className="charity-hero__avatar">
          {avatar ? <img src={avatar} alt={name} /> : <span />}
        </div>

        {/* نام موسسه (راست‌چین و چسبیده به سمت چپ مربع آواتار) */}
        <div className="charity-hero__title-container">
          <h1 className="charity-hero__title">{name}</h1>
        </div>
      </div>

      {/* ۲. نوار سفید پایینی */}
      <div className="charity-hero__body">
        {/* توضیحات موسسه (راست‌چین و هم‌راستای نام موسسه) */}
        <p className="charity-hero__description">{description}</p>

        {/* تگ‌های اطلاعاتی دیتابیس (راست‌چین و هم‌راستای نام و توضیحات) */}
        <div className="charity-hero__badges">
          <span>حوزه فعالیت: {activity}</span>
          <span>{location}</span>
          <span>تاریخ تأیید: {approvedAt}</span>
        </div>
      </div>
    </section>
  );
}
