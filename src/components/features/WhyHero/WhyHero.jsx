//front\rahnikookari-front\src\components\features\WhyHero
import Container from "../../ui/Container/Container";
import "./WhyHero.scss";

export default function WhyHero() {
  return (
    <section className="why-hero">
      <Container>
        <div className="why-hero__content">
          <h2 className="why-hero__title">چرا راه نیک؟</h2>
          <p className="why-hero__desc">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده
            از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و
            سطرآنچنان که لازم است.
          </p>
        </div>

        <div className="why-hero__cards">
          <article className="why-hero__card">
            <div className="why-hero__icon-placeholder" />
            <h3 className="why-hero__card-title">موسسات تایید شده</h3>
            <p className="why-hero__card-desc">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده از طراحان گرافیک است.
            </p>
          </article>

          <article className="why-hero__card">
            <div className="why-hero__icon-placeholder" />
            <h3 className="why-hero__card-title">کمک سریع و ساده</h3>
            <p className="why-hero__card-desc">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده از طراحان گرافیک است.
            </p>
          </article>

          <article className="why-hero__card">
            <div className="why-hero__icon-placeholder" />
            <h3 className="why-hero__card-title">نیکوکاری مهارتی</h3>
            <p className="why-hero__card-desc">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده از طراحان گرافیک است.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
