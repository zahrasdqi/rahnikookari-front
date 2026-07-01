import Container from "../../ui/Container/Container";
import { FiShield, FiTarget, FiLink } from "react-icons/fi";
import "./WhyHero.scss";

export default function WhyHero() {
  const features = [
    {
      icon: <FiShield />,
      title: "شفافیت",
      desc: "در «راهِ نیک»، ما معتقدیم که نیکوکاری نباید در هاله‌ای از ابهام باشد. ما از تکنولوژی بهره گرفته‌ایم تا شما بتوانید لحظه به لحظه مسیر کمک‌های خود را رصد کنید.",
      color: "blue"
    },
    {
      icon: <FiTarget />,
      title: "هدفمندی در بخشش",
      desc: "هر نیت خیری، پتانسیل تغییر یک زندگی را دارد. ما با شناسایی دقیق‌ترین نیازها و اولویت‌بندی آن‌ها، به شما کمک می‌کنیم تا تغییر ماندگار ایجاد کنید.",
      color: "peach"
    },
    {
      icon: <FiLink />,
      title: "پیوند مستقیمِ دست‌ها",
      desc: "ما تنها یک واسطه نیستیم؛ ما یک پلتفرمِ پیونددهنده هستیم. با حذف بروکراسی‌های پیچیده، فاصله‌ی بین نیت شما و لبخندِ بهره‌ور را به حداقل رسانده‌ایم.",
      color: "green"
    }
  ];

  return (
    <section className="why-hero">
      <div className="why-hero__bg-decoration" /> 
      
      <Container>
        <div className="why-hero__content">
          <h2 className="why-hero__title">چرا راه نیک؟</h2>
          <p className="why-hero__subtitle">تلاقی تکنولوژی و انسانیت برای ساخت دنیایی شفاف‌تر</p>
        </div>

        <div className="why-hero__cards">
          {features.map((item, index) => (
            <article key={index} className={`why-hero__card why-hero__card--${item.color}`}>
              <div className="why-hero__icon-wrapper">
                {item.icon}
              </div>
              <div className="why-hero__card-body">
                <h3 className="why-hero__card-title">{item.title}</h3>
                <p className="why-hero__card-desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
