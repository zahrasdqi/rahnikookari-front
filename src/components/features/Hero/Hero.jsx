//front\rahnikookari-front\src\components\features\Hero\Hero.jsx
import Container from "../../ui/Container/Container";
import Button from "../../ui/Button/Button";
import "./Hero.scss";

const PARTICLE_COUNT = 14;

export default function Hero() {
  return (
    <section className="hero">
      {/* Blobs */}
      <div className="hero__bg-shapes" aria-hidden="true">
        <span className="hero__blob hero__blob--1" />
        <span className="hero__blob hero__blob--2" />
        <span className="hero__blob hero__blob--3" />
      </div>

      {/* Floating particles */}
      <div className="hero__particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <span key={i} className="hero__particle" />
        ))}
      </div>

      <Container>
        <div className="hero__inner">
          <h1 className="hero__title">با «راهِ نیک»، خیر را هدفمند هدایت کن</h1>
          <p className="hero__subtitle">
            شفافیت، اعتماد و مشارکت، سه ستون اصلی ماست.
          </p>
          <div className="hero__actions">
            <Button className="hero__cta">مشاهده پویش‌ها</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
