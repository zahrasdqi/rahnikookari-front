
//C:\Users\zahra\Desktop\rahe-nik\front\rahnikookari-front\src\pages\Home\Home.jsx
import { useState } from 'react';
import Header from '../../components/layout/Header/Header';
import Hero from '../../components/features/Hero/Hero';
import CampaignSlider from '../../components/features/CampaignSlider/CampaignSlider';
import ProfileDrawer from '../../components/layout/ProfileDrawer/ProfileDrawer';
import Footer from '../../components/layout/Footer/Footer';
import './Home.scss';
import WhyHero from '../../components/features/WhyHero/WhyHero';

export default function Home() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="home-page">
      <Header onMenuClick={() => setDrawerOpen(true)} />

      <main>
        <Hero />
        <WhyHero/>
        <CampaignSlider />
      </main>

      <Footer />

      <ProfileDrawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
