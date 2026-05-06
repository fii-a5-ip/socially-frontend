import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import './SoloDiscovering.css';

// ==========================================
// 1. Mock Data
// ==========================================
const MOCK_LOCATIONS = [
  {
    id: 1,
    title: "Hang Out & Study Time",
    category: "Cafenele",
    rating: 4.8,
    distance: "0.5 km",
    schedule: "10:00 - 18:00",
    address: "Strada Grigore Ureche 18, Iași 700259",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    description: "Vibe de învățat, dar fără stres. Ne adunăm la Zbor Hub.",
    longDescription: "Vibe de învățat, dar fără stres. Ne adunăm, scoatem laptopurile, punem o cafea bună și ne apucăm de treabă. Fiecare cu ce are de făcut, dar într-un mediu productiv și prietenos. La final, prindem un networking la o prăjitură bună. Locuri limitate!"
  },
  {
    id: 2,
    title: "Spatiul este dedicat...",
    category: "Parcuri",
    rating: 4.9,
    distance: "1.2 km",
    schedule: "11:00 - 14:00",
    address: "Palas Campus, Sf. Andrei",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    description: "Zona dedicată activităților din cadrul CJE Iași.",
    longDescription: "Un eveniment de weekend dedicat studenților și asociațiilor din zona tineretului. Vino cu noi pentru o gură de aer curat, sesiuni de mentoring și multă recreere la bază. Vom aborda inclusiv metode de educație de vară."
  },
  {
    id: 3,
    title: "Muzeul de Artă Modernă",
    category: "Muzee",
    rating: 4.6,
    distance: "2.0 km",
    schedule: "09:00 - 17:00",
    address: "Piața Unirii 2, Iași",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    description: "Colecție vastă de artă contemporană și expoziții temporare.",
    longDescription: "Ai poftă să te pierzi puțin în gânduri artistice? Muzeul găzduiește expoziția temporală de fotografie și o colecție permanentă spectaculoasă. Un loc absolut perfect să mergi solo, punându-ți o pereche de căști cu o poveste fascinantă pe fundal."
  },
  {
    id: 4,
    title: "La Trattoria",
    category: "Restaurante",
    rating: 4.5,
    distance: "0.8 km",
    schedule: "12:00 - 23:00",
    address: "Strada Lăpușneanu 14, Iași",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800",
    description: "Restaurant cu specific italian recunoscut pentru pizza autentică.",
    longDescription: "Un restaurant intim ideal atunci când simți că meriți o cină fantastică – doar pentru tine. Scaun la geam cu un pahar de vin și faimoasa pizza Neapolitană gătită curat pe vatră. E acel check-in culinar obligatoriu pe lista ta."
  }
];

const CATEGORIES = ["Toate", "Restaurante", "Cafenele", "Parcuri", "Muzee"];

// ==========================================
// 2. Componenta: DiscoveryScreen (Swipe Logica)
// ==========================================
function DiscoveryScreen({ location, onAction, onOpenDetails }) {
  const { t } = useTranslation();
  const [animationClass, setAnimationClass] = useState("");

  const handleAction = (action, e) => {
    e.stopPropagation(); // Evită declanșarea detaliilor când faci swipe/like
    if (animationClass) return;

    setAnimationClass(action === 'like' ? 'swipe-right' : 'swipe-left');
    setTimeout(() => {
      onAction(location, action);
    }, 300);
  };

  if (!location) {
    return (
      <div className="sd-no-more fade-in">
        <span className="sd-no-more-icon">🎉</span>
        <h3>{t('solo.no_more_title')}</h3>
        <p>{t('solo.no_more_desc')}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
          <button className="btn btn--secondary" onClick={() => onAction(null, 'reset')}>
            {t('solo.reset_btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`sd-card ${animationClass}`} onClick={() => onOpenDetails(location)}>
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
        <button
          className="sd-action-btn dislike"
          onClick={(e) => handleAction('dislike', e)}
          aria-label="Nu sunt interesat"
        >
          ✕
        </button>
        <button
          className="sd-action-btn like"
          onClick={(e) => handleAction('like', e)}
          aria-label="Îmi place"
        >
          ♥️
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. Componenta: FavoritesScreen
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
        <div
          key={place.id}
          className="sd-fav-card"
          onClick={() => onOpenDetails(place)}
        >
          <img src={place.image} alt={place.title} className="sd-fav-image" />
          <div className="sd-fav-info">
            <h4 className="sd-fav-title">{place.title}</h4>
            <span className="sd-fav-category">{place.category}</span>
            <button
              className="sd-fav-remove-btn"
              onClick={(e) => {
                e.stopPropagation(); // previne deschiderea detaliilor la remove
                onRemove(place.id);
              }}
            >
              {t('solo.delete')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 3.5. Componenta: MyEventsScreen
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
        <div
          key={place.id}
          className="sd-fav-card"
          onClick={() => onOpenDetails(place)}
        >
          <img src={place.image} alt={place.title} className="sd-fav-image" />
          <div className="sd-fav-info">
            <h4 className="sd-fav-title">{place.title}</h4>
            <span className="sd-fav-category">{place.schedule}</span>
            <span className="sd-fav-category" style={{marginTop: '4px', fontStyle: 'italic', color: 'var(--color-primary)'}}>{t('solo.organized_by_you')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 4. Componenta: PlaceDetails (Pagina Extinsă)
// ==========================================
function PlaceDetails({ place, onClose, onCancel }) {
  const { t } = useTranslation();
  if (!place) return null;

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${place.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="sd-place-details fade-in-fast">
      {/* Imagine de sus tip Header și Buton Back */}
      <div className="sd-pd-header" style={{ backgroundImage: `url(${place.image})` }}>
        <button className="sd-pd-back-btn" onClick={onClose} aria-label="Înapoi">
          ✕
        </button>
        <div className="sd-pd-header-overlay"></div>
      </div>

      {/* Conținutul Scrollabil */}
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
            <div>
              <strong>{t('solo.schedule')}</strong>
              <p>{place.schedule}</p>
            </div>
          </div>

          <div className="sd-pd-info-row sd-clickable-address" onClick={handleOpenMaps}>
            <div className="icon">📍</div>
            <div>
              <strong>{t('solo.address')}</strong>
              <p className="sd-address-link">{place.address}</p>
            </div>
          </div>
        </div>

        <div className="sd-pd-description">
          {place.longDescription}
        </div>

      </div>

      {/* Footer Fixed Action */}
      <div className="sd-pd-footer-action">
        {place.isMine ? (
          <div className="sd-pd-action-group">
            <Link to={`/discover/edit/${place.id}`} className="btn btn--primary sd-pd-edit-btn">
              {t('solo.edit_event')}
            </Link>
            <button className="btn btn--secondary sd-pd-cancel-btn" onClick={() => onCancel(place.id)}>
              {t('solo.cancel_event')} ✕
            </button>
          </div>
        ) : (
          <button className="btn btn--primary btn--full sd-pd-reserve-btn" onClick={() => alert('Acțiune Rezervare Placeholder')}>
            {t('solo.reserve')}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. Root Component: SoloDiscovering
// ==========================================
function SoloDiscovering() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'saved'
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [selectedPlace, setSelectedPlace] = useState(null); // Place pentru pagina extinsă

  // Persistența Listelor în LocalStorage
  const [likedPlaces, setLikedPlaces] = useState(() => {
    const saved = localStorage.getItem('socially_likedPlaces');
    return saved ? JSON.parse(saved) : [];
  });

  const [dislikedIds, setDislikedIds] = useState(() => {
    const saved = localStorage.getItem('socially_dislikedIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [myEvents, setMyEvents] = useState(() => {
    const saved = localStorage.getItem('socially_myEvents');
    return saved ? JSON.parse(saved) : [];
  });

  // Recalcularea listei vizibile (discovery)
  const availablePlaces = useMemo(() => {
    let places = MOCK_LOCATIONS;

    if (activeCategory !== "Toate") {
      places = places.filter(loc => loc.category === activeCategory);
    }

    // Auto-excludem locațiile cărora le-am dat swipe
    return places.filter(loc =>
      !likedPlaces.some(lp => lp.id === loc.id) &&
      !dislikedIds.includes(loc.id)
    );
  }, [activeCategory, likedPlaces, dislikedIds]);

  // Hook pentru LocalStorage sync
  useEffect(() => {
    localStorage.setItem('socially_likedPlaces', JSON.stringify(likedPlaces));
  }, [likedPlaces]);

  useEffect(() => {
    localStorage.setItem('socially_dislikedIds', JSON.stringify(dislikedIds));
  }, [dislikedIds]);

  // Callback la acțiunea finalizată pe cardul Swipe
  const handleCardAction = (location, action) => {
    if (action === 'reset') {
      setDislikedIds([]);
      return;
    }

    if (action === 'like') {
      setLikedPlaces(prev => {
        if (prev.some(p => p.id === location.id)) return prev;
        return [...prev, location];
      });
    } else {
      setDislikedIds(prev => {
        if (prev.includes(location.id)) return prev;
        return [...prev, location.id];
      });
    }
  };

  const removeFromFavorites = (id) => {
    setLikedPlaces(prev => prev.filter(place => place.id !== id));
  };

  const openPlaceDetails = (place) => {
    setSelectedPlace(place);
  };

  const closePlaceDetails = () => {
    setSelectedPlace(null);
  };

  const removeFromMyEvents = (id) => {
    setMyEvents(prev => {
      const updated = prev.filter(place => place.id !== id);
      localStorage.setItem('socially_myEvents', JSON.stringify(updated));
      return updated;
    });
    if (selectedPlace && selectedPlace.id === id) {
      closePlaceDetails();
    }
  };

  // Randare Modal de Detalii pe tot Spațiul (Z-Index sau overlay fix peste flux)
  if (selectedPlace) {
    return <PlaceDetails place={selectedPlace} onClose={closePlaceDetails} onCancel={removeFromMyEvents} />;
  }

  return (
    <div className="solo-discovering container">

      {/* Header General */}
      <header className="sd-header">
        <div className="sd-header-top">
          <h1 className="sd-title">{t('solo.title')}</h1>
          <Link to="/discover/create" className="sd-create-btn-small">
            {t('solo.add_event')}
          </Link>
        </div>
        <div className="sd-controls-row">
          <div className="sd-toggle">
            <button
              className={`sd-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              {t('solo.explore')}
            </button>
            <button
              className={`sd-toggle-btn ${viewMode === 'saved' ? 'active' : ''}`}
              onClick={() => setViewMode('saved')}
            >
              {t('solo.saved')} {likedPlaces.length > 0 && `(${likedPlaces.length})`}
            </button>
            <button
              className={`sd-toggle-btn ${viewMode === 'mine' ? 'active' : ''}`}
              onClick={() => setViewMode('mine')}
            >
              {t('solo.my_events')} {myEvents.length > 0 && `(${myEvents.length})`}
            </button>
          </div>

          {/* Bara Filtrare Categorie */}
          {viewMode === 'list' && (
            <div className="sd-filters fade-in">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`sd-filter-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Switcher Vederi */}
      <div className="sd-content">
        {viewMode === 'mine' && (
          <MyEventsScreen
            events={myEvents}
            onOpenDetails={openPlaceDetails}
          />
        )}

        {viewMode === 'saved' && (
          <FavoritesScreen
            likedPlaces={likedPlaces}
            onRemove={removeFromFavorites}
            onOpenDetails={openPlaceDetails}
          />
        )}

        {viewMode === 'list' && (
          <div className="sd-cards-container">
            <DiscoveryScreen
              key={availablePlaces[0]?.id || 'empty'}
              location={availablePlaces[0]}
              onAction={handleCardAction}
              onOpenDetails={openPlaceDetails}
            />
          </div>
        )}
      </div>

    </div>
  );
}

export default SoloDiscovering;
