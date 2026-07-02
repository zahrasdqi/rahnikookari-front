import React from 'react';
import './VerifierHero.scss';

const VerifierHero = ({
  title = "داشبورد بررسی پرونده‌ها",
  description = "در این بخش پرونده‌هایی که برای بررسی به شما تخصیص داده شده‌اند نمایش داده می‌شود. با بررسی دقیق اطلاعات و مدارک، نتیجه ارزیابی را ثبت کنید تا فرآیند حمایت از نیازمندان با دقت و شفافیت انجام شود."
}) => (
  <section className="verifier-hero">
    <div className="verifier-hero__content">
      <span className="verifier-hero__badge">
        پرونده‌های تخصیص داده شده
      </span>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>

    <div className="verifier-hero__icon-grid">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </section>
);

export default VerifierHero;
