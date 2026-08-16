import { useNavigate } from 'react-router-dom';
import './CharityCard.scss';

export default function CharityCard({ charity }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/institutions/${charity.slug}`);
  };

  return (
    <div className="charity-card" onClick={handleClick}>
      {/* تصویر کاور */}
      <div className="charity-card__cover">
        {charity.cover_file_id ? (
          <img 
            src={`/api/v1/media/${charity.cover_file_id}`} 
            alt={charity.charity_name}
          />
        ) : (
          <div className="charity-card__cover-placeholder" />
        )}
      </div>

      {/* لوگو */}
      <div className="charity-card__logo">
        {charity.logo_file_id ? (
          <img 
            src={`/api/v1/media/${charity.logo_file_id}`} 
            alt={charity.charity_name}
          />
        ) : (
          <div className="charity-card__logo-placeholder">
            {charity.charity_name.charAt(0)}
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="charity-card__content">
        <h3 className="charity-card__title">{charity.charity_name}</h3>
        
        <div className="charity-card__meta">
          <span className="charity-card__badge">{charity.activity_field}</span>
          <span className="charity-card__location">
            {charity.city}, {charity.province}
          </span>
        </div>

        {charity.short_description && (
          <p className="charity-card__description">
            {charity.short_description}
          </p>
        )}

        <div className="charity-card__footer">
          <button className="charity-card__btn">مشاهده پروفایل</button>
          <button className="charity-card__btn charity-card__btn--secondary">
            مشاهده پویش‌ها
          </button>
        </div>
      </div>
    </div>
  );
}
