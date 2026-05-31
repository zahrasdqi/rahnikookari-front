import Container from "../../ui/Container/Container";
import { features } from "../../../data/features";
import "./Features.scss";

export default function Features() {
  return (
    <section className="features" id="features">
      <Container>
        <div className="section-head">
          <span className="section-head__badge">خدمات اصلی</span>
          <h2>چرا راهِ نیک؟</h2>
        </div>

        <div className="features__grid">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <div className="feature-card__icon">
                  <Icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
