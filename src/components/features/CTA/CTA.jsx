import Container from "../../ui/Container/Container";
import Button from "../../ui/Button/Button";
import "./CTA.scss";

export default function CTA() {
  return (
    <section className="cta">
      <Container className="cta__inner">
        <div>
          <h2>آماده‌ای اولین قدم نیکوکاری شفاف را برداری؟</h2>
          <p>به مؤسسات تأییدشده وصل شو، پویش مناسب را پیدا کن و اثر بگذار.</p>
        </div>
        <Button>شروع کن</Button>
      </Container>
    </section>
  );
}
