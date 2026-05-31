import Container from "../../ui/Container/Container";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <Container className="footer__inner">
        <div className="footer__brand">
          <strong>راهِ نیک</strong>
          <p>پلتفرم شفاف نیکوکاری و هم‌افزایی خیریه‌ها</p>
        </div>

        <div className="footer__cols">
          <div>
            <h4>لینک‌ها</h4>
            <a href="#campaigns">پویش‌ها</a>
            <a href="#features">خدمات</a>
          </div>
          <div>
            <h4>ارتباط</h4>
            <a href="#">support@rahenik.ir</a>
            <a href="#">021-000000</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
