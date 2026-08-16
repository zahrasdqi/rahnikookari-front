import Container from "../../ui/Container/Container";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__inner">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">
                
                <strong>راهِ نیک</strong>
              </div>
              <p>
                پلتفرم شفاف نیکوکاری و هم‌افزایی خیریه‌ها برای ایجاد ارتباطی
                قابل‌اعتماد، دقیق و انسانی میان نیکوکاران و مجموعه‌های خیریه.
              </p>
            </div>

            <div className="footer__cols">
              <div className="footer__col">
                <h4>دسترسی سریع</h4>
                <div className="footer__links">
                  <a href="#campaigns">پویش‌ها</a>
                  <a href="#features">خدمات</a>
                  <a href="#about">درباره ما</a>
                </div>
              </div>

              <div className="footer__col">
                <h4>ارتباط با ما</h4>
                <div className="footer__contact">
                  <a href="mailto:support@rahenik.ir">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    support@rahenik.ir
                  </a>
                  <a href="tel:021000000">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.62A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    ۰۲۱-۰۰۰۰۰۰
                  </a>
                  <span className="footer__info">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    پشتیبانی همه‌روزه، ۹ تا ۱۸
                  </span>
                </div>
              </div>

              <div className="footer__col">
                <h4>اعتماد و شفافیت</h4>
                <div className="footer__links">
                  <a href="#privacy">حریم خصوصی</a>
                  <a href="#terms">قوانین استفاده</a>
                  <a href="#faq">پرسش‌های متداول</a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p>© ۱۴۰۵ راهِ نیک — تمامی حقوق محفوظ است.</p>
            <div className="footer__bottom-links">
              <a href="#privacy">حریم خصوصی</a>
              <a href="#terms">قوانین</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
