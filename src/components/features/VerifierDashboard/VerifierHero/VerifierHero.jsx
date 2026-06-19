import React from 'react';
import './VerifierHero.scss';

const VerifierHero = ({ title, description }) => (
  <section className="verifier-hero">
    <div className="verifier-hero__content">
      <span className="verifier-hero__badge">پرونده‌های تخصیص داده شده</span>
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
