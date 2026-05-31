import { campaigns } from '../../../data/campaigns';
import './CampaignSlider.scss';

export default function CampaignSlider() {
  return (
    <section className="campaign-slider">
      <h2>پویش‌های جاری</h2>
      <div className="campaign-slider__track">
        {campaigns.map(item => (
          <div key={item.id} className="campaign-card">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
