// src/pages/Institutions/Institutions.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { charityService } from '../../services/charity.service';
import Container from '../../components/ui/Container/Container';
import CharityCard from '../../components/features/CharityCard/CharityCard';
import './Institutions.scss';

const ACTIVITY_FIELDS = [
  { value: '', label: 'همه زمینه‌ها' },
  { value: 'health', label: 'بهداشت و درمان' },
  { value: 'education', label: 'آموزش و پرورش' },
  { value: 'environment', label: 'محیط زیست' },
  { value: 'disability', label: 'کمک به معلولین' },
  { value: 'children', label: 'حمایت از کودکان' },
  { value: 'women', label: 'توانمندسازی زنان' },
  { value: 'rescue', label: 'امداد و نجات' },
  { value: 'other', label: 'سایر' },
];

const PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
  'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
  'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
  'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
  'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'
];

const SORT_OPTIONS = [
  { value: '', label: 'پیش‌فرض' },
  { value: '-created_at', label: 'جدیدترین' },
  { value: 'created_at', label: 'قدیمی‌ترین' },
  { value: 'name', label: 'الفبایی (الف-ی)' },
  { value: '-name', label: 'الفبایی (ی-الف)' },
];

export default function Institutions() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // استیت‌های مربوط به dropdown استان
  const [provinceSearch, setProvinceSearch] = useState('');
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
  const provinceRef = useRef(null);
  
  const [filters, setFilters] = useState({
    search: '',
    province: '',
    activity_field: '',
    ordering: '',
  });

  // Debounce برای سرچ
  const searchTimeout = useRef(null);

  const fetchCharities = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      const data = await charityService.getPublicCharities(currentFilters);
      setCharities(data);
    } catch (error) {
      console.error('خطا در دریافت موسسات:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchCharities(filters);
    }, filters.search ? 400 : 0);

    return () => clearTimeout(searchTimeout.current);
  }, [filters, fetchCharities]);

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (provinceRef.current && !provinceRef.current.contains(e.target)) {
        setProvinceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleProvinceSelect = (province) => {
    handleFilterChange('province', province);
    setProvinceDropdownOpen(false);
    setProvinceSearch('');
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      province: '',
      activity_field: '',
      ordering: '',
    });
    setProvinceSearch('');
  };

  const filteredProvinces = PROVINCES.filter(province =>
    province.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const hasActiveFilters = filters.search || filters.province || filters.activity_field || filters.ordering;

  return (
    <div className="institutions-page">
      <Container>
        {/* Header با سرچ */}
        <div className="institutions-header">
          <div className="header-content">
            <h1>موسسات خیریه</h1>
            <p>با حمایت از موسسات خیریه، در تحقق آرزوهای نیازمندان سهیم شوید</p>
          </div>

          {/* سرچ بار اصلی */}
          <div className="main-search">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="جستجو در موسسات..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              {filters.search && (
                <button
                  className="clear-search"
                  onClick={() => handleFilterChange('search', '')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <button
              className={`filters-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              فیلترها
              {hasActiveFilters && <span className="filter-badge" />}
            </button>
          </div>
        </div>

        {/* پنل فیلترها */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              {/* فیلتر زمینه فعالیت */}
              <div className="filter-group">
                <label>زمینه فعالیت</label>
                <select
                  value={filters.activity_field}
                  onChange={(e) => handleFilterChange('activity_field', e.target.value)}
                  className="filter-select"
                >
                  {ACTIVITY_FIELDS.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* فیلتر استان با جستجو */}
              <div className="filter-group" ref={provinceRef}>
                <label>استان</label>
                <div className="province-dropdown">
                  <button
                    className="province-trigger"
                    onClick={() => setProvinceDropdownOpen(!provinceDropdownOpen)}
                  >
                    <span>{filters.province || 'همه استان‌ها'}</span>
                    <ChevronDown size={16} className={provinceDropdownOpen ? 'rotated' : ''} />
                  </button>

                  {provinceDropdownOpen && (
                    <div className="province-menu">
                      <div className="province-search">
                        <Search size={16} />
                        <input
                          type="text"
                          placeholder="جستجوی استان..."
                          value={provinceSearch}
                          onChange={(e) => setProvinceSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="province-list">
                        <button
                          className={`province-item ${!filters.province ? 'active' : ''}`}
                          onClick={() => handleProvinceSelect('')}
                        >
                          همه استان‌ها
                        </button>
                        {filteredProvinces.map(province => (
                          <button
                            key={province}
                            className={`province-item ${filters.province === province ? 'active' : ''}`}
                            onClick={() => handleProvinceSelect(province)}
                          >
                            {province}
                          </button>
                        ))}
                        {filteredProvinces.length === 0 && (
                          <div className="no-results">استانی پیدا نشد</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* فیلتر مرتب‌سازی */}
              <div className="filter-group">
                <label>مرتب‌سازی</label>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="filter-select"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                <X size={16} />
                پاک کردن فیلترها
              </button>
            )}
          </div>
        )}

        {/* نتایج */}
        <div className="institutions-content">
          {loading ? (
            <div className="loading">در حال بارگذاری...</div>
          ) : charities.length > 0 ? (
            <>
              <div className="results-info">
                {charities.length} موسسه پیدا شد
              </div>
              <div className="charities-grid">
                {charities.map((charity) => (
                  <CharityCard key={charity.id} charity={charity} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results-message">
              <p>موسسه‌ای با این فیلترها یافت نشد</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="reset-btn">
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
