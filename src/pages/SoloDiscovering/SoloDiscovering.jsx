import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/useTranslation';
import './SoloDiscovering.css';


// ==========================================
// 1. Mock Data
// ==========================================
const MOCK_LOCATIONS = [
  {
    id: 1, title: "Hang Out & Study Time", category: "Cafenele", rating: 4.8,
    distance: "0.5 km", schedule: "10:00 - 18:00", address: "Strada Grigore Ureche 18, Iași 700259",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    description: "Vibe de învățat, dar fără stres. Ne adunăm la Zbor Hub.",
    longDescription: "Vibe de învățat, dar fără stres. Ne adunăm, scoatem laptopurile, punem o cafea bună și ne apucăm de treabă. Fiecare cu ce are de făcut, dar într-un mediu productiv și prietenos. La final, prindem un networking la o prăjitură bună. Locuri limitate!"
  },
  {
    id: 2, title: "Spatiul este dedicat...", category: "Parcuri", rating: 4.9,
    distance: "1.2 km", schedule: "11:00 - 14:00", address: "Palas Campus, Sf. Andrei",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    description: "Zona dedicată activităților din cadrul CJE Iași.",
    longDescription: "Un eveniment de weekend dedicat studenților și asociațiilor din zona tineretului. Vino cu noi pentru o gură de aer curat, sesiuni de mentoring și multă recreere la bază."
  },
  {
    id: 3, title: "Muzeul de Artă Modernă", category: "Muzee", rating: 4.6,
    distance: "2.0 km", schedule: "09:00 - 17:00", address: "Piața Unirii 2, Iași",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    description: "Colecție vastă de artă contemporană și expoziții temporare.",
    longDescription: "Ai poftă să te pierzi puțin în gânduri artistice? Muzeul găzduiește expoziția temporală de fotografie și o colecție permanentă spectaculoasă."
  },
  {
    id: 4, title: "La Trattoria", category: "Restaurante", rating: 4.5,
    distance: "0.8 km", schedule: "12:00 - 23:00", address: "Strada Lăpușneanu 14, Iași",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800",
    description: "Restaurant cu specific italian recunoscut pentru pizza autentică.",
    longDescription: "Un restaurant intim ideal atunci când simți că meriți o cină fantastică – doar pentru tine. Scaun la geam cu un pahar de vin și faimoasa pizza Neapolitană gătită curat pe vatră."
  }
];

const AVAILABLE_FILTERS = [
  { id: 1, labelKey: "solo.filter_restaurante", groupKey: "solo.filter_group_location" },
  { id: 2, labelKey: "solo.filter_cafenele",    groupKey: "solo.filter_group_location" },
  { id: 3, labelKey: "solo.filter_parcuri",     groupKey: "solo.filter_group_location" },
  { id: 4, labelKey: "solo.filter_muzee",       groupKey: "solo.filter_group_location" },
  { id: 5, labelKey: "solo.filter_sport",       groupKey: "solo.filter_group_activity" },
  { id: 6, labelKey: "solo.filter_cultura",     groupKey: "solo.filter_group_activity" },
  { id: 7, labelKey: "solo.filter_relaxare",    groupKey: "solo.filter_group_activity" },
  { id: 8, labelKey: "solo.filter_educatie",    groupKey: "solo.filter_group_activity" },
];

// ==========================================
// 2. FilterPanel (panou glisant dreapta)
// ==========================================
function FilterPanel({ isOpen, onClose, selectedFilters, onToggleFilter, onClearAll }) {
  const { t } = useTranslation();
  const groupKeys = [...new Set(AVAILABLE_FILTERS.map(f => f.groupKey))];
  return createPortal(
    <>
      {isOpen && <div className="sd-panel-overlay" onClick={onClose} />}
      <div className={"sd-filter-panel" + (isOpen ? ' open' : '')}>
        <div className="sd-filter-panel-header">
          <h3 className="sd-filter-panel-title">{t('solo.filters_title')}</h3>
          <button className="sd-filter-panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="sd-filter-panel-body">
          {groupKeys.map(groupKey => (
            <div key={groupKey} className="sd-filter-group">
              <p className="sd-filter-group-label">{t(groupKey)}</p>
              <div className="sd-filter-chips">
                {AVAILABLE_FILTERS.filter(f => f.groupKey === groupKey).map(filter => (
                  <button
                    key={filter.id}
                    className={"sd-filter-chip" + (selectedFilters.includes(filter.id) ? ' active' : '')}
                    onClick={() => onToggleFilter(filter.id)}
                  >
                    {t(filter.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="sd-filter-panel-footer">
          <button className="sd-filter-clear-btn" onClick={onClearAll}>{t('solo.filters_reset')}</button>
          <button className="sd-filter-apply-btn" onClick={onClose}>{t('solo.filters_apply')}</button>
        </div>
      </div>
    </>,
    document.body  // ← portalu renderează direct în body, DEASUPRA oricărui element
  );
}

// ==========================================
// 3. DiscoveryScreen
// ==========================================
function DiscoveryScreen({ location, onAction, onOpenDetails }) {
  const { t } = useTranslation();
  const [animationClass, setAnimationClass] = useState("");

  const handleAction = (action, e) => {
    e.stopPropagation();
    if (animationClass) return;
    setAnimationClass(action === 'like' ? 'swipe-right' : 'swipe-left');
    setTimeout(() => { onAction(location, action); }, 300);
  };

  if (!location) {
    return (
      <div className="sd-no-more fade-in">
        <span className="sd-no-more-icon">🎉</span>
        <h3>{t('solo.no_more_title')}</h3>
        <p>{t('solo.no_more_desc')}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
          <button className="btn btn--secondary" onClick={() => onAction(null, 'reset')}>{t('solo.reset_btn')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={"sd-card " + animationClass} onClick={() => onOpenDetails(location)}>
      <div className="sd-card-image-wrapper">
        <img src={location.image} alt={location.title} className="sd-card-image" />
        <div className="sd-card-badge">{location.distance}</div>
      </div>
      <div className="sd-card-info">
        <div className="sd-card-header">
          <h2 className="sd-card-title">{location.title}</h2>
          <span className="sd-card-rating">⭐ {location.rating}</span>
        </div>
        <span className="sd-card-schedule">🕒 {location.schedule}</span>
        <span className="sd-card-category">{location.category}</span>
        <p className="sd-card-desc">{location.description}</p>
      </div>
      <div className="sd-card-actions">
        <button className="sd-action-btn dislike" onClick={(e) => handleAction('dislike', e)}>✕</button>
        <button className="sd-action-btn like" onClick={(e) => handleAction('like', e)}>♥️</button>
      </div>
    </div>
  );
}

// ==========================================
// 4. FavoritesScreen
// ==========================================
function FavoritesScreen({ likedPlaces, onRemove, onOpenDetails }) {
  const { t } = useTranslation();
  if (likedPlaces.length === 0) {
    return (
      <div className="sd-no-more">
        <span className="sd-no-more-icon">📭</span>
        <h3>{t('solo.no_saved_title')}</h3>
        <p>{t('solo.no_saved_desc')}</p>
      </div>
    );
  }
  return (
    <div className="sd-favorites-grid fade-in">
      {likedPlaces.map(place => (
        <div key={place.id} className="sd-fav-card" onClick={() => onOpenDetails(place)}>
          <img src={place.image} alt={place.title} className="sd-fav-image" />
          <div className="sd-fav-info">
            <h4 className="sd-fav-title">{place.title}</h4>
            <span className="sd-fav-category">{place.category}</span>
            <button className="sd-fav-remove-btn" onClick={(e) => { e.stopPropagation(); onRemove(place.id); }}>{t('solo.delete')}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 5. MyEventsScreen
// ==========================================
function MyEventsScreen({ events, onOpenDetails }) {
  const { t } = useTranslation();
  if (!events || events.length === 0) {
    return (
      <div className="sd-no-more fade-in">
        <span className="sd-no-more-icon">📝</span>
        <h3>{t('solo.my_events_empty_title')}</h3>
        <p>{t('solo.my_events_empty_desc')}</p>
      </div>
    );
  }
  return (
    <div className="sd-favorites-grid fade-in">
      {events.map(place => (
        <div key={place.id} className="sd-fav-card" onClick={() => onOpenDetails(place)}>
          <img src={place.image} alt={place.title} className="sd-fav-image" />
          <div className="sd-fav-info">
            <h4 className="sd-fav-title">{place.title}</h4>
            <span className="sd-fav-category">{place.schedule}</span>
            <span className="sd-fav-category" style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--color-primary)' }}>{t('solo.organized_by_you')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 6. PlaceDetails
// ==========================================
function PlaceDetails({ place, onClose, onCancel }) {
  const { t } = useTranslation();
  if (!place) return null;
  return (
    <div className="sd-place-details fade-in-fast">
      <div className="sd-pd-header" style={{ backgroundImage: `url(${place.image})` }}>
        <button className="sd-pd-back-btn" onClick={onClose}>✕</button>
        <div className="sd-pd-header-overlay"></div>
      </div>
      <div className="sd-pd-content">
        <h1 className="sd-pd-title">{place.title}</h1>
        <div className="sd-pd-top-meta">
          {place.rating && <span className="sd-pd-meta-badge rating">⭐ {place.rating}</span>}
          {place.distance && <span className="sd-pd-meta-badge distance">🚶 {place.distance}</span>}
          {place.category && <span className="sd-pd-meta-badge category">{place.category}</span>}
        </div>
        <div className="sd-pd-info-clean">
          <div className="sd-pd-info-row">
            <div className="icon">📅</div>
            <div><strong>{t('solo.schedule')}</strong><p>{place.schedule}</p></div>
          </div>
          <div className="sd-pd-info-row sd-clickable-address"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`, '_blank')}>
            <div className="icon">📍</div>
            <div><strong>{t('solo.address')}</strong><p className="sd-address-link">{place.address}</p></div>
          </div>
        </div>
        <div className="sd-pd-description">{place.longDescription}</div>
      </div>
      <div className="sd-pd-footer-action">
        {place.isMine ? (
          <div className="sd-pd-action-group">
            <Link to={`/discover/edit/${place.id}`} className="btn btn--primary sd-pd-edit-btn">{t('solo.edit_event')}</Link>
            <button className="btn btn--secondary sd-pd-cancel-btn" onClick={() => onCancel(place.id)}>{t('solo.cancel_event')} ✕</button>
          </div>
        ) : (
          <button className="btn btn--primary btn--full sd-pd-reserve-btn" onClick={() => alert('Acțiune Rezervare Placeholder')}>{t('solo.reserve')}</button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 7. Root: SoloDiscovering
// ==========================================
function SoloDiscovering() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('list');
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Search state — NU filtrează cardurile live, doar la Enter
  const [searchString, setSearchString] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [maxDays, setMaxDays] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedSearch, setAppliedSearch] = useState('');


  const [likedPlaces, setLikedPlaces] = useState(() => {
    const s = localStorage.getItem('socially_likedPlaces');
    return s ? JSON.parse(s) : [];
  });
  const [dislikedIds, setDislikedIds] = useState(() => {
    const s = localStorage.getItem('socially_dislikedIds');
    return s ? JSON.parse(s) : [];
  });
  const [myEvents] = useState(() => {
    const s = localStorage.getItem('socially_myEvents');
    return s ? JSON.parse(s) : [];
  });

  // Cardurile afișate
  const availablePlaces = useMemo(() => {
      // 1. Excludem ce userul a dat like/dislike deja
      let filteredList = MOCK_LOCATIONS.filter(loc =>
        !likedPlaces.some(lp => lp.id === loc.id) && !dislikedIds.includes(loc.id)
      );

      // 2. Aplicăm filtrul de căutare dacă utilizatorul a apăsat Enter
      if (appliedSearch) {
        const query = appliedSearch.toLowerCase();
        filteredList = filteredList.filter(loc =>
          loc.title.toLowerCase().includes(query) ||
          loc.category.toLowerCase().includes(query) ||
          loc.description.toLowerCase().includes(query)
        );
      }

      return filteredList;
    }, [likedPlaces, dislikedIds, appliedSearch]);


  const handleCardAction = (location, action) => {
    if (action === 'reset') { setDislikedIds([]); return; }
    if (action === 'like') {
      const updated = likedPlaces.some(p => p.id === location.id) ? likedPlaces : [...likedPlaces, location];
      setLikedPlaces(updated);
      localStorage.setItem('socially_likedPlaces', JSON.stringify(updated));
    } else {
      const updated = dislikedIds.includes(location.id) ? dislikedIds : [...dislikedIds, location.id];
      setDislikedIds(updated);
      localStorage.setItem('socially_dislikedIds', JSON.stringify(updated));
    }
  };

  // La apăsarea Enter → redirect cu parametrii de căutare
  const handleSearch = (e) => {
    if (e.key !== 'Enter') return;
    if (!searchString.trim()) return;

    const params = new URLSearchParams();
    params.set('q', searchString.trim());
    if (maxDistance) params.set('maxDistance', maxDistance);
    if (maxDays)     params.set('maxDays', maxDays);
    if (selectedFilters.length > 0) params.set('filters', selectedFilters.join(','));

    setAppliedSearch(searchString.trim());
  };

  const toggleFilter = (id) =>
    setSelectedFilters(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  useEffect(() => {
          if (isFilterPanelOpen) {
              document.body.style.overflow = 'hidden';
          } else {
              document.body.style.overflow = '';
          }

          return () => {
              document.body.style.overflow = '';
          };
      }, [isFilterPanelOpen]);



  if (selectedPlace) {
    return <PlaceDetails place={selectedPlace} onClose={() => setSelectedPlace(null)} onCancel={(id) => {
      const updated = myEvents.filter(p => p.id !== id);
      localStorage.setItem('socially_myEvents', JSON.stringify(updated));
      setSelectedPlace(null);
    }} />;

  }

  return (
    <div className="solo-discovering container">
      <header className="sd-header">
        <div className="sd-header-top">
          <h1 className="sd-title">{t('solo.title')}</h1>
          <Link to="/discover/create" className="sd-create-btn-small">{t('solo.add_event')}</Link>
        </div>

        {/* Rând unic: toggle + searchbar */}
        <div className="sd-controls-row">
          <div className="sd-toggle">
            <button className={"sd-toggle-btn" + (viewMode === 'list'  ? ' active' : '')} onClick={() => setViewMode('list')}>{t('solo.explore')}</button>
            <button className={"sd-toggle-btn" + (viewMode === 'saved' ? ' active' : '')} onClick={() => setViewMode('saved')}>{t('solo.saved')}{likedPlaces.length > 0 && ` (${likedPlaces.length})`}</button>
            <button className={"sd-toggle-btn" + (viewMode === 'mine'  ? ' active' : '')} onClick={() => setViewMode('mine')}>{t('solo.my_events')}{myEvents.length > 0 && ` (${myEvents.length})`}</button>
          </div>

          {/* Searchbar — vizibil mereu, nu numai în tab-ul Explorează */}
          <div className="sd-searchbar-row">
            <div className="sd-searchbar-main">
              <span className="sd-searchbar-icon">🔍</span>
              <input
                type="text"
                className="sd-searchbar-input"
                placeholder={t('solo.search_placeholder')}
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            <div className="sd-inline-param">
              <span className="sd-inline-label">{t('solo.km_label')}</span>
              <input
                type="number" min="0" max="100"
                className="sd-inline-input"
                value={maxDistance}
                onChange={e => setMaxDistance(e.target.value)}
                placeholder="10"
                title="Distanța maximă (km)"
              />
            </div>

            <div className="sd-inline-param">
              <span className="sd-inline-label">{t('solo.days_label')}</span>
              <input
                type="number" min="0" max="365"
                className="sd-inline-input"
                value={maxDays}
                onChange={e => setMaxDays(e.target.value)}
                placeholder="30"
                title="Numărul maxim de zile"
              />
            </div>

            <button
              className={"sd-filter-toggle-btn" + (selectedFilters.length > 0 ? ' has-filters' : '')}
              onClick={() => setIsFilterPanelOpen(true)}
              title="Filtre avansate"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              {selectedFilters.length > 0 && <span className="sd-filter-badge">{selectedFilters.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="sd-content">
        {viewMode === 'mine'  && <MyEventsScreen events={myEvents} onOpenDetails={setSelectedPlace} />}
        {viewMode === 'saved' && <FavoritesScreen likedPlaces={likedPlaces} onRemove={(id) => setLikedPlaces(prev => prev.filter(p => p.id !== id))} onOpenDetails={setSelectedPlace} />}
        {viewMode === 'list'  && (
          <div className="sd-cards-container">
            <DiscoveryScreen key={availablePlaces[0]?.id || 'empty'} location={availablePlaces[0]} onAction={handleCardAction} onOpenDetails={setSelectedPlace} />
          </div>
        )}
      </div>


      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        selectedFilters={selectedFilters}
        onToggleFilter={toggleFilter}
        onClearAll={() => setSelectedFilters([])}
      />
    </div>
  );
}

export default SoloDiscovering;