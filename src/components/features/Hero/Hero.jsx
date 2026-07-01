// front/rahnikookari-front/src/components/features/Hero/Hero.jsx

import Container from "../../ui/Container/Container";
import Button from "../../ui/Button/Button";
import "./Hero.scss";

const PARTICLE_COUNT = 14;

export default function Hero() {
  return (
    <section className="hero">
      {/* لایه‌های تزئینی پس‌زمینه */}
      <div className="hero__bg-shapes" aria-hidden="true">
        <span className="hero__blob hero__blob--1" />
        <span className="hero__blob hero__blob--2" />
        <span className="hero__blob hero__blob--3" />
      </div>

      {/* ذرات شناور هوشمند */}
      <div className="hero__particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <span key={i} className="hero__particle" />
        ))}
      </div>

      <Container>
        <div className="hero__inner">
          {/* نشان (Badge) برای جلب توجه اولیه */}
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            نیکوکاری هوشمند و مدرن
          </div>

          <h1 className="hero__title">
            تجربه‌ای <span className="hero__highlight">شفاف</span> از مهربانی،{" "}
            <br />
            برای هدفی <span className="hero__highlight">اثرگذار</span>
          </h1>

          <p className="hero__subtitle">
            در «راهِ نیک»، ما تلاقی‌گاه تکنولوژی و انسانیت هستیم. مسیر هر ریال
            از کمک‌های شما را تا مقصد نهایی رصد می‌کنیم تا اعتماد، دوباره معنا
            پیدا کند.
          </p>

          <div className="hero__actions">
            <Button className="hero__cta">شروع نیکوکاری</Button>
          </div>
        </div>
      </Container>

      {/* جداکننده نرم پایینی برای اتصال به بخش بعدی */}
      <div className="hero__footer-fade" />
    </section>
  );
}
