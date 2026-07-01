//src/pages/Institutions/InstitutionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { charityService } from '../../services/charity.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MapPin, Globe, Phone, Mail, Calendar, Users, Heart, ArrowLeft } from 'lucide-react';
import './InstitutionDetail.scss';

const InstitutionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCharityDetail();
  }, [slug]);

  const fetchCharityDetail = async () => {
    try {
      setLoading(true);
      const response = await charityService.getCharityBySlug(slug);
      setCharity(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching charity detail:', err);
      setError('خطا در بارگذاری اطلاعات موسسه');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/institutions')}>بازگشت به لیست موسسات</button>
      </div>
    );
  }

  if (!charity) return null;

  return (
    <div className="institution-detail">
      {/* Header با تصویر کاور */}
      <div className="institution-header">
        {charity.cover_image && (
          <div 
            className="cover-image"
            style={{ backgroundImage: `url(${charity.cover_image})` }}
          />
        )}
        
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/institutions')}
          >
            <ArrowLeft size={20} />
            بازگشت
          </button>

          <div className="institution-intro">
            {charity.logo && (
              <img 
                src={charity.logo} 
                alt={charity.name}
                className="institution-logo"
              />
            )}
            
            <div className="intro-text">
              <h1>{charity.name}</h1>
              <div className="meta-info">
                <span className="activity-field">
                  {charity.activity_field || 'خیریه'}
                </span>
                <span className="location">
                  <MapPin size={16} />
                  {charity.province || 'ایران'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="institution-content">
        <div className="content-grid">
          {/* ستون اصلی */}
          <div className="main-column">
            {/* درباره موسسه */}
            <section className="content-section">
              <h2>درباره موسسه</h2>
              <p className="description">
                {charity.description || 'توضیحاتی برای این موسسه ثبت نشده است.'}
              </p>
            </section>

            {/* کمپین‌های فعال (اگر داشت) */}
            {charity.active_campaigns && charity.active_campaigns.length > 0 && (
              <section className="content-section">
                <h2>کمپین‌های فعال</h2>
                <div className="campaigns-list">
                  {charity.active_campaigns.map(campaign => (
                    <div key={campaign.id} className="campaign-card">
                      <h3>{campaign.title}</h3>
                      <p>{campaign.short_description}</p>
                      <button 
                        onClick={() => navigate(`/campaigns/${campaign.slug}`)}
                        className="btn-primary"
                      >
                        مشاهده جزئیات
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* اهداف و چشم‌انداز */}
            {charity.goals && (
              <section className="content-section">
                <h2>اهداف و چشم‌انداز</h2>
                <p>{charity.goals}</p>
              </section>
            )}
          </div>

          {/* سایدبار */}
          <aside className="sidebar">
            {/* اطلاعات تماس */}
            <div className="info-card">
              <h3>اطلاعات تماس</h3>
              <div className="contact-list">
                {charity.website && (
                  <a 
                    href={charity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <Globe size={18} />
                    <span>وبسایت</span>
                  </a>
                )}
                
                {charity.phone && (
                  <div className="contact-item">
                    <Phone size={18} />
                    <span dir="ltr">{charity.phone}</span>
                  </div>
                )}
                
                {charity.email && (
                  <a 
                    href={`mailto:${charity.email}`}
                    className="contact-item"
                  >
                    <Mail size={18} />
                    <span>{charity.email}</span>
                  </a>
                )}

                {charity.address && (
                  <div className="contact-item address">
                    <MapPin size={18} />
                    <span>{charity.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* آمار موسسه */}
            <div className="info-card stats">
              <h3>آمار موسسه</h3>
              <div className="stats-list">
                {charity.established_date && (
                  <div className="stat-item">
                    <Calendar size={18} />
                    <div>
                      <span className="label">تاریخ تأسیس</span>
                      <span className="value">{charity.established_date}</span>
                    </div>
                  </div>
                )}
                
                <div className="stat-item">
                  <Users size={18} />
                  <div>
                    <span className="label">تعداد کمپین‌ها</span>
                    <span className="value">
                      {charity.campaigns_count || 0}
                    </span>
                  </div>
                </div>

                <div className="stat-item">
                  <Heart size={18} />
                  <div>
                    <span className="label">حامیان</span>
                    <span className="value">
                      {charity.supporters_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* دکمه حمایت */}
            <button className="support-button">
              <Heart size={20} />
              حمایت از این موسسه
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetail;
