
//C:\Users\zahra\Desktop\rahe-nik\front\rahnikookari-front\src\pages\Home\Home.jsx
import Header from '../../components/layout/Header/Header';
import Hero from '../../components/features/Hero/Hero';
import CampaignSlider from '../../components/features/CampaignSlider/CampaignSlider';
import Footer from '../../components/layout/Footer/Footer';
import WhyHero from '../../components/features/WhyHero/WhyHero';
import './Home.scss';

export default function Home() {
  // تمام Stateهای مربوط به دراور که اینجا بود رو حذف کردیم
  
  return (
    <div className="home-page">
      {/* هدر رو ساده صدا می‌زنیم، خودش مدیریت دراپ‌داون رو انجام می‌ده */}
      <Header />

      <main>
        <Hero />
        <WhyHero />
        <CampaignSlider />
      </main>

      <Footer />
      
      {/* اون بخش ProfileDrawer که اینجا بود کاملاً حذف شد */}
    </div>
  );
}
