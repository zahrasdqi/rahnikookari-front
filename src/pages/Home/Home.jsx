import { useEffect, useState } from "react";
import Hero from '../../components/features/Hero/Hero';
import CampaignSlider from '../../components/features/CampaignSlider/CampaignSlider';
import Footer from '../../components/layout/Footer/Footer';
import WhyHero from '../../components/features/WhyHero/WhyHero';
import { campaignService } from "../../services/campaign.service";
import './Home.scss';

export default function Home() {

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {

        const data = await campaignService.getPublicCampaigns({
          skip: 0,
          limit: 10
        });

        setCampaigns(data);

      } catch (error) {
        console.error("خطا در دریافت پویش‌ها:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="home-page">

      <main>
        <Hero />
        <WhyHero />

        <CampaignSlider campaigns={campaigns} />

      </main>

      <Footer />
    </div>
  );
}
