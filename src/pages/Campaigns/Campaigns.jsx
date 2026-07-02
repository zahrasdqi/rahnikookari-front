import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { campaignService } from '../../services/campaign.service';
import Container from '../../components/ui/Container/Container';
import CharityCampaignCard from '../../components/features/CharityDashboard/CharityCampaignCard/CharityCampaignCard';
import './Campaigns.scss';

const STATUS_OPTIONS = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'active', label: 'فعال' },
  { value: 'pending_review', label: 'در انتظار بررسی' },
  { value: 'completed', label: 'تکمیل شده' },
];

const SORT_OPTIONS = [
  { value: '', label: 'پیش‌فرض' },
  { value: '-created_at', label: 'جدیدترین' },
  { value: 'created_at', label: 'قدیمی‌ترین' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'همه دسته‌بندی‌ها' },
  { value: 'education', label: 'آموزش' },
  { value: 'healthcare', label: 'بهداشت و درمان' },
  { value: 'environment', label: 'محیط زیست' },
  { value: 'children', label: 'کودکان' },
  { value: 'elderly', label: 'سالمندان' },
  { value: 'poverty', label: 'فقر و محرومیت' },
  { value: 'disaster', label: 'بلایا و حوادث' },
  { value: 'culture_arts', label: 'فرهنگ و هنر' },
];

const PROVINCE_OPTIONS = [
  { value: '', label: 'همه استان‌ها' },
  { value: 'alborz', label: 'البرز' },
  { value: 'ardabil', label: 'اردبیل' },
  { value: 'bushehr', label: 'بوشهر' },
  { value: 'chaharmahal_and_bakhtiari', label: 'چهارمحال و بختیاری' },
  { value: 'east_azerbaijan', label: 'آذربایجان شرقی' },
  { value: 'west_azerbaijan', label: 'آذربایجان غربی' },
  { value: 'isfahan', label: 'اصفهان' },
  { value: 'fars', label: 'فارس' },
  { value: 'gilan', label: 'گیلان' },
  { value: 'golestan', label: 'گلستان' },
  { value: 'hamadan', label: 'همدان' },
  { value: 'hormozgan', label: 'هرمزگان' },
  { value: 'ilam', label: 'ایلام' },
  { value: 'kerman', label: 'کرمان' },
  { value: 'kermanshah', label: 'کرمانشاه' },
  { value: 'khorasan_razavi', label: 'خراسان رضوی' },
  { value: 'north_khorasan', label: 'خراسان شمالی' },
  { value: 'south_khorasan', label: 'خراسان جنوبی' },
  { value: 'khuzestan', label: 'خوزستان' },
  { value: 'kohgiluyeh_and_boyer_ahmad', label: 'کهگیلویه و بویراحمد' },
  { value: 'kurdistan', label: 'کردستان' },
  { value: 'lorestan', label: 'لرستان' },
  { value: 'markazi', label: 'مرکزی' },
  { value: 'mazandaran', label: 'مازندران' },
  { value: 'qazvin', label: 'قزوین' },
  { value: 'qom', label: 'قم' },
  { value: 'semnan', label: 'سمنان' },
  { value: 'sistan_and_baluchestan', label: 'سیستان و بلوچستان' },
  { value: 'tehran', label: 'تهران' },
  { value: 'yazd', label: 'یزد' },
  { value: 'zanjan', label: 'زنجان' },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    ordering: '',
    category: '',
    province: '',
    limit: 12,
    skip: 0,
  });

  const fetchCampaigns = useCallback(async (currentFilters) => {
    try {
      setLoading(true);

      const response = await campaignService.getPublicCampaigns(currentFilters);

      const items =
        response?.items ||
        response?.results ||
        response?.campaigns ||
        response?.data?.items ||
        response?.data?.results ||
        response?.data?.campaigns ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setCampaigns(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('خطا در دریافت پویش‌ها:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns(filters);
  }, [filters, fetchCampaigns]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      skip: 0,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      ordering: '',
      category: '',
      province: '',
      limit: 12,
      skip: 0,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.ordering ||
      filters.category ||
      filters.province
  );

  return (
    <div className="campaigns-page">
      <Container>
        
        <div className="campaigns-portal-banner">
          <div className="banner-body">
            <div className="banner-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">جریان کارزار و مؤسسات</span>
            </div>
            <h1 className="banner-title">پویش‌های نیکوکاری</h1>
            <p className="banner-desc">
              لیست و مدیریت کارزارهای فعال نیکوکاری، پایش شفاف مبالغ اهدایی و بستری امن برای اتصال مهربانی‌ها به نیازها.
            </p>
          </div>

          <div className="banner-graphic">
            <div className="grid-icon-container">
              <span className="grid-dot dot-1"></span>
              <span className="grid-dot dot-2"></span>
              <span className="grid-dot dot-3"></span>
              <span className="grid-dot dot-4"></span>
            </div>
          </div>
        </div>


        <div className="campaigns-header">
          <div className="main-search-controls">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="جستجو در عنوان پویش..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => handleFilterChange('search', '')}
                  aria-label="پاک کردن جستجو"
                  className="clear-search-button"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              className={`filters-toggle-button ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <SlidersHorizontal size={20} />
              <span>فیلترها</span>
            </button>
          </div>

          {/* پنل بازشوی فیلترها */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="status-select">وضعیت</label>
                  <select
                    id="status-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="filter-select"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="sort-select">مرتب‌سازی</label>
                  <select
                    id="sort-select"
                    value={filters.ordering}
                    onChange={(e) => handleFilterChange('ordering', e.target.value)}
                    className="filter-select"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="category-select">دسته‌بندی</label>
                  <select
                    id="category-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="filter-select"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="province-select">استان</label>
                  <select
                    id="province-select"
                    value={filters.province}
                    onChange={(e) => handleFilterChange('province', e.target.value)}
                    className="filter-select"
                  >
                    {PROVINCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-filters-button"
                  onClick={clearFilters}
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          )}
        </div>

        {/* بخش رندر کارت‌ها */}
        <div className="campaigns-content">
          {loading ? (
            <div className="loading-indicator">در حال بارگذاری پویش‌ها...</div>
          ) : campaigns.length > 0 ? (
            <div className="campaigns-grid">
              {campaigns.map((campaign) => (
                <CharityCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onViewDetails={(c) => console.log('مشاهده جزئیات:', c)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results-message">
              <p>متأسفانه، هیچ پویشی با معیارهای جستجوی شما یافت نشد.</p>
              <p>لطفاً فیلترها را تغییر دهید یا دوباره جستجو کنید.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
