//front\rahnikookari-front\src\components\features\CampaignSlider\CampaignSlider.jsx
import { useRef, useState } from 'react';
import './CampaignSlider.scss';

// داده موک - وقتی بکند آماده شد جایگزین API call میشه
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    category: 'دسته بندی',
    image: null,
    title: 'عنوان',
    org: 'نام موسسه',
    description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
    raised: 100000,
    goal: 1000000,
    daysLeft: 10,
  },
  {
    id: 2,
    category: 'دسته بندی',
    image: null,
    title: 'عنوان',
    org: 'نام موسسه',
    description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
    raised: 100000,
    goal: 1000000,
    daysLeft: 10,
  },
  {
    id: 3,
    category: 'دسته بندی',
    image: null,
    title: 'عنوان',
    org: 'نام موسسه',
    description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
    raised: 100000,
    goal: 1000000,
    daysLeft: 10,
  },
  {
    id: 4,
    category: 'دسته بندی',
    image: null,
    title: 'عنوان',
    org: 'نام موسسه',
    description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.',
    raised: 700000,
    goal: 1000000,
    daysLeft: 5,
  },
];

function formatNumber(n) {
  return n.toLocaleString('fa-IR');
}

function CampaignCard({ item, isCenter }) {
  const progress = Math.min((item.raised / item.goal) * 100, 100);

  return (
    <div className={`campaign-card${isCenter ? ' campaign-card--active' : ''}`}>
      {/* تصویر بالا */}
      <div className="campaign-card__image">
        {item.image
          ? <img src={item.image} alt={item.title} />
          : <div className="campaign-card__image-placeholder" />}
        <span className="campaign-card__badge">{item.category}</span>
      </div>

      {/* محتوا */}
      <div className="campaign-card__body">
        <div className="campaign-card__meta">
          <span className="campaign-card__title">{item.title}</span>
          <span className="campaign-card__org">{item.org}</span>
        </div>

        <p className="campaign-card__desc">{item.description}</p>

        {/* اعداد */}
        <div className="campaign-card__amounts">
          <span className="campaign-card__raised">{formatNumber(item.raised)}</span>
          <span className="campaign-card__goal">از {formatNumber(item.goal)}</span>
        </div>

        {/* progress bar */}
        <div className="campaign-card__progress-track">
          <div
            className="campaign-card__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="campaign-card__days">{item.daysLeft} روز مانده</span>

        {/* دکمه‌ها */}
        <div className="campaign-card__actions">
          <button className="campaign-card__btn campaign-card__btn--donate">
            کمک مالی
          </button>
          <button className="campaign-card__btn campaign-card__btn--details">
            مشاهده جزئیات
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const campaigns = MOCK_CAMPAIGNS;

  const prev = () =>
    setActiveIndex(i => (i - 1 + campaigns.length) % campaigns.length);
  const next = () =>
    setActiveIndex(i => (i + 1) % campaigns.length);

  // نمایش سه کارت: قبلی، فعال، بعدی
  const getVisible = () => {
    const len = campaigns.length;
    return [
      campaigns[(activeIndex - 1 + len) % len],
      campaigns[activeIndex],
      campaigns[(activeIndex + 1) % len],
    ];
  };

  const visible = getVisible();

  return (
    <section className="campaign-slider">
      <div className="campaign-slider__inner">
        <button
          className="campaign-slider__arrow campaign-slider__arrow--prev"
          onClick={prev}
          aria-label="قبلی"
        >
          ‹
        </button>

        <div className="campaign-slider__track">
          {visible.map((item, idx) => (
            <CampaignCard
              key={item.id}
              item={item}
              isCenter={idx === 1}
            />
          ))}
        </div>

        <button
          className="campaign-slider__arrow campaign-slider__arrow--next"
          onClick={next}
          aria-label="بعدی"
        >
          ›
        </button>
      </div>

      <div className="campaign-slider__more">
        <button className="campaign-slider__more-btn">جزئیات بیشتر</button>
      </div>
    </section>
  );
}
