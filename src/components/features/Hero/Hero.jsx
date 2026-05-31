import Container from "../../ui/Container/Container";
import Button from "../../ui/Button/Button";
import "./Hero.scss";

export default function Hero() {
  return (
    <section className="hero">
      <Container>
        <div className="hero__inner">
          <h1 className="hero__title">با «راهِ نیک»، خیر را هدفمند هدایت کن</h1>
          <p className="hero__subtitle">
            شفافیت، اعتماد و مشارکت، سه ستون اصلی ماست.
          </p>
          <div className="hero__actions">
            <Button>مشاهده پویش‌ها</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
