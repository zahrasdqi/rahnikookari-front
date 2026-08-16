import { useState } from 'react';
import { Link } from 'react-router-dom';
import CampaignCard from '../CampaignCard/CampaignCard';
import './CampaignSlider.scss';

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    category: 'دسته‌بندی',
    image: null,
    title: 'عنوان پویش',
    org: 'نام موسسه',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. این متن برای نمایش نمونه کارت پویش در اسلایدر صفحه اصلی استفاده می‌شود.',
    raised: 100000,
    goal: 1000000,
    daysLeft: 10,
  },
  {
    id: 2,
    category: 'دسته‌بندی',
    image: null,
    title: 'پویش حمایت از کودکان',
    org: 'موسسه راه نیک',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. این متن صرفاً برای تست ساختار کارت قرار داده شده است.',
    raised: 250000,
    goal: 1200000,
    daysLeft: 8,
  },
  {
    id: 3,
    category: 'درمانی',
    image: null,
    title: 'پویش تأمین هزینه درمان',
    org: 'بنیاد مهر',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. اگر بک‌اند آماده شد این داده‌ها را با API واقعی جایگزین کن.',
    raised: 700000,
    goal: 1000000,
    daysLeft: 5,
  },
  {
    id: 4,
    category: 'آموزشی',
    image: null,
    title: 'پویش تهیه لوازم آموزشی',
    org: 'خانه امید',
    description:
      'این متن نمونه است تا ظاهر اسلایدر و کارت‌ها در صفحه اصلی به‌درستی دیده شود.',
    raised: 350000,
    goal: 900000,
    daysLeft: 12,
  },
];

export default function CampaignSlider({ campaigns = MOCK_CAMPAIGNS }) {
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!safeCampaigns.length) return null;

  const prev = () => {
    setActiveIndex((prevIndex) =>
      (prevIndex - 1 + safeCampaigns.length) % safeCampaigns.length
    );
  };

  const next = () => {
    setActiveIndex((prevIndex) =>
      (prevIndex + 1) % safeCampaigns.length
    );
  };

  const getVisibleCampaigns = () => {
    const len = safeCampaigns.length;

    if (len === 1) {
      return [
        { campaign: safeCampaigns[0], isCenter: true },
      ];
    }

    if (len === 2) {
      return safeCampaigns.map((campaign, index) => ({
        campaign,
        isCenter: index === activeIndex,
      }));
    }

    return [
      {
        campaign: safeCampaigns[(activeIndex - 1 + len) % len],
        isCenter: false,
      },
      {
        campaign: safeCampaigns[activeIndex],
        isCenter: true,
      },
      {
        campaign: safeCampaigns[(activeIndex + 1) % len],
        isCenter: false,
      },
    ];
  };

  const visibleCampaigns = getVisibleCampaigns();

  return (
    <section className="campaign-slider">
      <div className="campaign-slider__inner">
        <button
          type="button"
          className="campaign-slider__arrow campaign-slider__arrow--prev"
          onClick={prev}
          aria-label="قبلی"
        >
          ‹
        </button>

        <div className="campaign-slider__track">
          {visibleCampaigns.map(({ campaign, isCenter }) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isCenter={isCenter}
            />
          ))}
        </div>

        <button
          type="button"
          className="campaign-slider__arrow campaign-slider__arrow--next"
          onClick={next}
          aria-label="بعدی"
        >
          ›
        </button>
      </div>

      <div className="campaign-slider__more">
        <Link to="/campaigns" className="campaign-slider__more-btn">
          مشاهده همه پویش‌ها
        </Link>
      </div>
    </section>
  );
}
