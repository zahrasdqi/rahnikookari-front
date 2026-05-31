import Container from "../../ui/Container/Container";
import { stats } from "../../../data/stats";
import "./TrustStats.scss";

export default function TrustStats() {
  return (
    <section className="trust" id="transparency">
      <Container>
        <div className="trust__grid">
          {stats.map((item) => (
            <div className="trust__item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
