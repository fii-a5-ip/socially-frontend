import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { API_URL } from '../../api/config';
import './SoloDiscovering.css';

const REGISTERED_EVENTS_STORAGE_KEY = 'socially_registeredEventIds';

const readRegisteredEventIds = () => {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_EVENTS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeRegisteredEventIds = (ids) => {
  localStorage.setItem(REGISTERED_EVENTS_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
};

const applyLocalRegistrationState = (event) => {
  const registeredIds = readRegisteredEventIds().map(String);
  return {
    ...event,
    isJoined: Boolean(event.isJoined) || registeredIds.includes(String(event.id)),
  };
};

// ==========================================
// 1. Mock Data & Filtre Hardcodate
// ==========================================
const MOCK_LOCATIONS = [
  {
    id: 1, title: "Hang Out & Study Time", category: "Cafenele", rating: 4.8,
    distance: "0.5 km", schedule: "10:00 - 18:00", address: "Strada Grigore Ureche 18, Iași 700259",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    description: "Vibe de învățat, dar fără stres. Ne adunăm la Zbor Hub.",
    longDescription: "Vibe de învățat, dar fără stres. Ne adunăm, scoatem laptopurile, punem o cafea bună și ne apucăm de treabă."
  },
  {
    id: 2, title: "Spatiul este dedicat...", category: "Parcuri", rating: 4.9,
    distance: "1.2 km", schedule: "11:00 - 14:00", address: "Palas Campus, Sf. Andrei",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    description: "Zona dedicată activităților din cadrul CJE Iași.",
    longDescription: "Un eveniment de weekend dedicat studenților și asociațiilor din zona tineretului."
    
  },
  {
    id: 3, title: "Muzeul de Artă Modernă", category: "Muzee", rating: 4.6,
    distance: "2.0 km", schedule: "09:00 - 17:00", address: "Piața Unirii 2, Iași",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    description: "Colecție vastă de artă contemporană și expoziții temporare.",
    longDescription: "Ai poftă să te pierzi puțin în gânduri artistice? Muzeul găzduiește expoziția temporală de fotografie."
    
  },
  {
    id: 4, title: "La Trattoria", category: "Restaurante", rating: 4.5,
    distance: "0.8 km", schedule: "12:00 - 23:00", address: "Strada Lăpușneanu 14, Iași",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800",
    description: "Restaurant cu specific italian recunoscut pentru pizza autentică.",
    longDescription: "Un restaurant intim ideal atunci când simți că meriți o cină fantastică – doar pentru tine."
    
  }
];

const AVAILABLE_FILTERS = [
  { id: 175, labelKey: "solo.filter_restaurant", groupKey: "solo.filter_venue_type" },
  { id: 46, labelKey: "solo.filter_cafe",    groupKey: "solo.filter_venue_type" },
  { id: 20, labelKey: "solo.filter_bar",     groupKey: "solo.filter_venue_type" },
  { id: 171, labelKey: "solo.filter_pub",       groupKey: "solo.filter_venue_type" },

  { id: 167, labelKey: "solo.filter_pizza", groupKey: "solo.filter_food" },
  { id: 121, labelKey: "solo.filter_sushi", groupKey: "solo.filter_food" },
  { id: 43, labelKey: "solo.filter_buffet", groupKey: "solo.filter_food" },
  { id: 217, labelKey: "solo.filter_vegetarian",  groupKey: "solo.filter_food" },
  { id: 105, labelKey: "solo.filter_gluten_free", groupKey: "solo.filter_food" },

  { id: 134, labelKey: "solo.filter_live_music", groupKey: "solo.filter_activities" },
  { id: 33, labelKey: "solo.filter_board_games", groupKey: "solo.filter_activities" },
  { id: 135, labelKey: "solo.filter_sports_screening", groupKey: "solo.filter_activities" },

  { id: 101, labelKey: "solo.filter_free_wifi", groupKey: "solo.filter_facilities" },
  { id: 70, labelKey: "solo.filter_power_outlets", groupKey: "solo.filter_facilities" },
  { id: 7, labelKey: "solo.filter_air_conditioning", groupKey: "solo.filter_facilities" },

  { id: 100, labelKey: "solo.filter_free_parking", groupKey: "solo.filter_transport_parking" },
  { id: 161, labelKey: "solo.filter_public_transport_nearby", groupKey: "solo.filter_transport_parking" },

];

// ==========================================
// 2. mapEventDTO — mapează EventResponseDTO → obiect intern
//    Suportă atât răspunsul real de la backend cât și mock data
// ==========================================
const mapEventDTO = (event) => {
  // Dacă evenimentul vine de la backend (EventResponseDTO), câmpurile sunt:
  //   id, name, url, desc, locationId, creatorUserId, groupId,
  //   scheduledDate (ISO string), filterIds, filters (List<FilterDTO>)
  //
  // Dacă vine din mock data, câmpurile sunt deja mapate (title, image, etc.)
  // Funcția gestionează ambele cazuri.

  // --- Titlu ---
  const title = event.name ?? event.title ?? 'Fără titlu';

  // --- Imagine ---
  // Backendul trimite câmpul `url` ca link către imaginea evenimentului
  const image =
    event.url ??
    event.image ??
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800';

  // --- Descriere ---
  const description = event.desc ?? event.description ?? '';
  const longDescription = event.longDescription ?? description;

  // --- Categorie ---
  // Backendul trimite `filters` (List<FilterDTO>). Luăm primul filtru ca și categorie afișată.
  // FilterDTO are cel puțin câmpul `name` (sau `label`).
  let category = event.category ?? '';
  if (!category && Array.isArray(event.filters) && event.filters.length > 0) {
    const f = event.filters[0];
    category = f.name ?? f.label ?? f.labelKey ?? '';
  }

  // --- Distanță ---
  // Backendul poate trimite `distance` (număr în km) sau string gata formatat
  let distance = '';
  if (event.distance !== undefined && event.distance !== null) {
    distance =
      typeof event.distance === 'number'
        ? `${event.distance.toFixed(1)} km`
        : String(event.distance);
  }

  // --- Program / dată ---
  // Backendul trimite `scheduledDate` ca ISO 8601 LocalDateTime string
  // ex: "2025-07-15T18:00:00"
  // Dacă există deja `schedule` (mock), îl păstrăm.
  let schedule = event.schedule ?? '';
  if (!schedule && event.scheduledDate) {
    try {
      const date = new Date(event.scheduledDate);
      // Formatăm: "15 Jul 2025, 18:00"
      schedule = date.toLocaleString('ro-RO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      schedule = event.scheduledDate;
    }
  }

  // --- Adresă ---
  const address = event.address ?? '';

  // --- isMine (eveniment creat de utilizatorul curent) ---
  const isMine = event.isMine ?? false;

  return {
    id: event.id,
    title,
    category,
    distance,
    schedule,
    address,
    image,
    description,
    longDescription,
    isMine,
    isJoined: Boolean(event.isJoined ?? event.joined ?? event.registered ?? false),
  };
};

// ==========================================
// 3. FilterPanel
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
    document.body
  );
}

// ==========================================
// 4. SearchResultsGrid
// ==========================================
function SearchResultsGrid({ results, onOpenDetails }) {
  const { t } = useTranslation();

  if (results.length === 0) {
    return (
      <div className="sd-no-more fade-in">
        <span className="sd-no-more-icon">🔍</span>
        <h3>{t('solo.no_results_title') || 'Niciun rezultat'}</h3>
      </div>
    );
  }

  return (
    <div className="sd-search-results fade-in">
      <div className="sd-results-grid">
        {results.map(place => (
          <div key={place.id} className="sd-result-card" onClick={() => onOpenDetails(place)}>
            <div className="sd-result-info">
              <h4 className="sd-result-title">{place.title}</h4>
              {place.category && <span className="sd-result-category">{place.category}</span>}
              {place.distance && <span className="sd-result-distance">🚶 {place.distance}</span>}
            </div>
            <img
              src={place.image}
              alt={place.title}
              className="sd-result-image"
              onError={e => {
                e.target.src =
                  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. DiscoveryScreen (swipe)
// ==========================================
function DiscoveryScreen({ location, onAction, onOpenDetails }) {
  const { t } = useTranslation();
  const [animationClass, setAnimationClass] = useState('');

  const handleAction = (action, e) => {
    e.stopPropagation();
    if (animationClass) return;
    setAnimationClass(action === 'like' ? 'swipe-right' : 'swipe-left');
    setTimeout(() => { onAction(location, action); setAnimationClass(''); }, 300);
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
    <div className={"sd-card " + animationClass} onClick={() => onOpenDetails(location)}>
      <div className="sd-card-image-wrapper">
        <img src={location.image} alt={location.title} className="sd-card-image" />
        <div className="sd-card-badge">{location.distance}</div>
      </div>
      <div className="sd-card-info">
        <div className="sd-card-header">
          <h2 className="sd-card-title">{location.title}</h2>
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
// 6. FavoritesScreen
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
            {place.distance && <span className="sd-fav-category" style={{marginTop: '4px'}}>📍 {place.distance}</span>}
            <button
              className="sd-fav-remove-btn"
              onClick={(e) => { e.stopPropagation(); onRemove(place.id); }}
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
// 7. MyEventsScreen
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
            {place.distance && <span className="sd-fav-category" style={{marginTop: '4px'}}>📍 {place.distance}</span>}
            <span className="sd-fav-category" style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--color-primary)' }}>
              {t('solo.organized_by_you')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 7.5. RegisteredEventsScreen
// ==========================================
function RegisteredEventsScreen({ registeredEvents, onUnregister, onOpenDetails }) {
  const { t } = useTranslation();
  
  const activeRegistered = registeredEvents.filter(e => e.isJoined);

  if (activeRegistered.length === 0) {
    return (
      <div className="sd-no-more fade-in">
        <span className="sd-no-more-icon">🎟️</span>
        <h3>{t('solo.registered_events_empty_title')}</h3>
        <p>{t('solo.registered_events_empty_desc')}</p>
      </div>
    );
  }

  return (
    <div className="sd-favorites-grid fade-in">
      {activeRegistered.map(place => (
        <div key={place.id} className="sd-fav-card" onClick={() => onOpenDetails(place)}>
          <img src={place.image} alt={place.title} className="sd-fav-image" />
          <div className="sd-fav-info">
            <h4 className="sd-fav-title">{place.title}</h4>
            <span className="sd-fav-category">{place.category}</span>
            {place.distance && <span className="sd-fav-category" style={{marginTop: '4px'}}>📍 {place.distance}</span>}
            <button
              className="sd-fav-remove-btn"
              onClick={(e) => { 
                e.stopPropagation(); 
                onUnregister(place); 
              }}
            >
              {t('solo.cancel_event') || 'Renunță'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 8. PlaceDetails
// ==========================================
function PlaceDetails({ place, onClose, onCancel, onToggleRegistration, registrationPendingId }) {
  const { t } = useTranslation();
  if (!place) return null;
  const isRegistrationPending = registrationPendingId === place.id;
  return (
    <div className="sd-place-details fade-in-fast">
      <div className="sd-pd-header" style={{ backgroundImage: `url(${place.image})` }}>
        <button className="sd-pd-back-btn" onClick={onClose}>✕</button>
        <div className="sd-pd-header-overlay"></div>
      </div>
      <div className="sd-pd-content">
        <h1 className="sd-pd-title">{place.title}</h1>
        <div className="sd-pd-top-meta">
          {place.distance && <span className="sd-pd-meta-badge distance">📍 {place.distance}</span>}
          {place.category && <span className="sd-pd-meta-badge category">{place.category}</span>}
        </div>
        <div className="sd-pd-info-clean">
          <div className="sd-pd-info-row">
            <div className="icon">📅</div>
            <div><strong>{t('solo.schedule')}</strong><p>{place.schedule}</p></div>
          </div>
          {place.address && (
            <div
              className="sd-pd-info-row sd-clickable-address"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`,
                  '_blank'
                )
              }
            >
              <div className="icon">📍</div>
              <div>
                <strong>{t('solo.address')}</strong>
                <p className="sd-address-link">{place.address}</p>
              </div>
            </div>
          )}
        </div>
        <div className="sd-pd-description">{place.longDescription}</div>
      </div>
      <div className="sd-pd-footer-action">
        {place.isMine ? (
          <div className="sd-pd-action-group">
            <Link to={`/discover/edit/${place.id}`} className="btn btn--primary sd-pd-edit-btn">
              {t('solo.edit_event')}
            </Link>
            <button
              className="btn btn--secondary sd-pd-cancel-btn"
              onClick={() => onCancel(place.id)}
            >
              {t('solo.cancel_event')} ✕
            </button>
          </div>
        ) : (
          <button
            className={`btn btn--primary btn--full sd-pd-reserve-btn${place.isJoined ? ' sd-pd-reserve-btn--joined' : ''}`}
            disabled={isRegistrationPending}
            onClick={() => onToggleRegistration(place)}
          >
            {isRegistrationPending
              ? t('solo.register_pending')
              : place.isJoined
                ? t('solo.registered')
                : t('solo.register')}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 9. Root: SoloDiscovering
// ==========================================
function SoloDiscovering() {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState('list');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [searchString, setSearchString] = useState('');
  const [maxDistance, setMaxDistance] = useState('100');
  const [maxDays, setMaxDays] = useState('30');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasMoreData] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  const [likedPlaces, setLikedPlaces] = useState(() => {
    const s = localStorage.getItem('socially_likedPlaces');
    return s ? JSON.parse(s).map(applyLocalRegistrationState) : [];
  });
  const [dislikedIds, setDislikedIds] = useState(() => {
    const s = localStorage.getItem('socially_dislikedIds');
    return s ? JSON.parse(s) : [];
  });
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registrationPendingId, setRegistrationPendingId] = useState(null);

  // Geolocație
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.warn('Geolocația nu a fost permisă sau a eșuat:', error)
      );
    }
  }, []);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const url = `${API_URL}/api/events/saved`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(mapEventDTO).map(applyLocalRegistrationState);
          setLikedPlaces(mapped);
          localStorage.setItem('socially_likedPlaces', JSON.stringify(mapped));
        }
      } catch (err) {
        console.error('Eroare sincronizare salvate:', err);
      }
    };

    const fetchCreatedEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${API_URL}/api/events/created`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(mapEventDTO).map(applyLocalRegistrationState).map(e => ({ ...e, isMine: true }));
          setMyEvents(mapped);
        }
      } catch (err) {
        console.error('Eroare sincronizare evenimente create:', err);
      }
    };

    const fetchRegisteredEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${API_URL}/api/events/registered`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(mapEventDTO).map(applyLocalRegistrationState);
          setRegisteredEvents(mapped);
        }
      } catch (err) {
        console.error('Eroare sincronizare evenimente înscrise:', err);
      }
    };

    fetchSavedEvents();
    fetchCreatedEvents();
    fetchRegisteredEvents();
  }, []);

  // ----------------------------------------
  // Fetch Feed Principal (Explore - swipe mode)
  // Răspuns așteptat: List<EventResponseDTO> (JSON array)
  // ----------------------------------------
  const fetchMainFeed = useCallback(async (background = false) => {
    if (!background) setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (maxDistance) params.append('maxDistance', maxDistance);
      if (maxDays) params.append('maxDays', maxDays);
      if (selectedFilters.length > 0) params.append('filterIds', selectedFilters.join(','));
      if (userLocation.lat && userLocation.lng) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
      }
      params.append('localTime', new Date().toISOString());

      const token = localStorage.getItem('token');

      // const API_BASE_URL = import.meta.env.VITE_API_URL;
      const url = `${API_URL}/api/events/discover?${params.toString()}`;
      console.log('[DISCOVER] GET', url, '| token:', token ? 'prezent' : 'LIPSĂ');

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('[DISCOVER] status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('[DISCOVER] eroare body:', text);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[DISCOVER] date primite:', data);
      
      if (data.length === 0) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
      setPlaces(data.map(mapEventDTO).map(applyLocalRegistrationState));
    } catch (error) {
      console.error('[DISCOVER] EROARE — fallback pe mock:', error);
      setPlaces(MOCK_LOCATIONS);
      } finally {
        if (!background) setIsLoading(false);
      }
    }, [maxDistance, maxDays, selectedFilters, userLocation]);

  // ----------------------------------------
  // Fetch pentru Grid (Search)
  // Răspuns așteptat: List<EventResponseDTO> (JSON array)
  // ----------------------------------------
  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = searchString.trim();
      const params = new URLSearchParams();
      params.append('query', query);
      if (maxDistance) params.append('maxDistance', maxDistance);
      if (maxDays) params.append('maxDays', maxDays);
      if (selectedFilters.length > 0) params.append('filterIds', selectedFilters.join(','));
      if (userLocation.lat && userLocation.lng) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
      }
      params.append('localTime', new Date().toISOString());

      const token = localStorage.getItem('token');
      const url = `${API_URL}/api/events/search?${params.toString()}`;
      console.log('[SEARCH] GET', url, '| token:', token ? 'prezent' : 'LIPSĂ');

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('[SEARCH] status:', response.status, response.headers.get('content-type'));

      // Verifică că răspunsul e JSON înainte să parsezi
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[SEARCH] răspuns non-JSON:', text);
        throw new Error(`Răspuns non-JSON: ${response.status}`);
      }

      if (!response.ok) {
        const text = await response.text();
        console.error('[SEARCH] eroare body:', text);
        throw new Error(`HTTP ${response.status}`);
      }

      console.log('[SEARCH] status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('[SEARCH] eroare body:', text);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[SEARCH] date primite:', data);
      if (data.length === 0) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
      setSearchResults(data.map(mapEventDTO).map(applyLocalRegistrationState));
    } catch (error) {
      console.error('[SEARCH] EROARE — fallback pe mock:', error);
      setSearchResults(MOCK_LOCATIONS);
    } finally {
      setIsLoading(false);
    }
  }, [searchString, maxDistance, maxDays, selectedFilters, userLocation]);

  useEffect(() => {
    if (!isSearchMode) {
      const handler = setTimeout(() => {
        fetchMainFeed();
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [userLocation, fetchMainFeed, isSearchMode]);

  const availablePlaces = useMemo(() => {
    if (isSearchMode) {
      return places;
    }
    return places.filter(
      (loc) =>
        !likedPlaces.some((lp) => lp.id === loc.id) && !dislikedIds.includes(loc.id)
    );
  }, [places, likedPlaces, dislikedIds, isSearchMode]);

  // --- Handlers ---
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const query = searchString.trim();
      if (query.length > 0) {
        setViewMode('list');
        setIsSearchMode(true);
        fetchSearchResults();
      } else {
        setIsSearchMode(false);
        fetchMainFeed();
      }
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchString(val);
    if (val.trim().length === 0 && isSearchMode) {
      setIsSearchMode(false);
      setSearchResults([]);
      fetchMainFeed();
    }
  };

  const handleApplyFilters = () => {
    setIsFilterPanelOpen(false);
    if (isSearchMode && searchString.trim().length > 0) {
      fetchSearchResults();
    } else {
      fetchMainFeed();
    }
  };

  const handleCardAction = async (location, action) => {
    const token = localStorage.getItem('token');
    
    if (action === 'reset') { 
      try {
        await fetch(`${API_URL}/api/events/reset-dislikes`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to reset dislikes', err);
      }
      setDislikedIds([]); 
      localStorage.removeItem('socially_dislikedIds');
      setHasMoreData(true);
      fetchMainFeed();
      return; 
    }
    
    if (action === 'like') {
      const updated = likedPlaces.some((p) => p.id === location.id)
        ? likedPlaces
        : [...likedPlaces, location];
      setLikedPlaces(updated);
      localStorage.setItem('socially_likedPlaces', JSON.stringify(updated));
      
      fetch(`${API_URL}/api/events/${location.id}/vote?type=Da`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error('Failed to send like', err));
      
    } else {
      const updated = dislikedIds.includes(location.id)
        ? dislikedIds
        : [...dislikedIds, location.id];
      setDislikedIds(updated);
      localStorage.setItem('socially_dislikedIds', JSON.stringify(updated));
      
      fetch(`${API_URL}/api/events/${location.id}/vote?type=Nu`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error('Failed to send dislike', err));
    }
  };

  const updateRegistrationState = (eventId, isJoined) => {
    const updateList = (items) =>
      items.map((item) =>
        String(item.id) === String(eventId) ? { ...item, isJoined } : item
      );

    setPlaces(updateList);
    setSearchResults(updateList);
    setLikedPlaces((prev) => {
      const updated = updateList(prev);
      localStorage.setItem('socially_likedPlaces', JSON.stringify(updated));
      return updated;
    });
    setMyEvents(updateList);
    setRegisteredEvents((prev) => {
      const exists = prev.some((item) => String(item.id) === String(eventId));
      if (exists) {
        return updateList(prev);
      } else if (isJoined) {
        const eventObj = places.find((item) => String(item.id) === String(eventId)) ||
                         searchResults.find((item) => String(item.id) === String(eventId)) ||
                         likedPlaces.find((item) => String(item.id) === String(eventId)) ||
                         myEvents.find((item) => String(item.id) === String(eventId)) ||
                         (selectedPlace && String(selectedPlace.id) === String(eventId) ? selectedPlace : null);
        if (eventObj) {
          return [...prev, { ...eventObj, isJoined: true }];
        }
      }
      return prev;
    });
    setSelectedPlace((prev) =>
      prev && String(prev.id) === String(eventId) ? { ...prev, isJoined } : prev
    );

    const currentIds = readRegisteredEventIds();
    const nextIds = isJoined
      ? [...currentIds, eventId]
      : currentIds.filter((id) => String(id) !== String(eventId));
    writeRegisteredEventIds(nextIds);
  };

  const handleToggleRegistration = async (place) => {
    const eventId = place.id;
    const nextIsJoined = !place.isJoined;
    const token = localStorage.getItem('token');

    setRegistrationPendingId(eventId);
    updateRegistrationState(eventId, nextIsJoined);

    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/join`, {
        method: nextIsJoined ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const text = await response.text();
        console.warn('Event registration persisted locally only:', text || response.status);
      }
    } catch (error) {
      console.warn('Event registration persisted locally only:', error);
    } finally {
      setRegistrationPendingId(null);
    }
  };

  const toggleFilter = (id) =>
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  useEffect(() => {
    document.body.style.overflow = isFilterPanelOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFilterPanelOpen]);

  if (selectedPlace) {
    return (
      <PlaceDetails
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        onToggleRegistration={handleToggleRegistration}
        registrationPendingId={registrationPendingId}
        onCancel={async (id) => {
          try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/events/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
              const errTxt = await res.text();
              console.error("Failed to delete event in backend:", errTxt);
              alert("Nu s-a putut șterge evenimentul din baza de date: " + errTxt);
            }
          } catch(err) {
            console.error(err);
          }
          const updated = myEvents.filter((p) => p.id !== id);
          setMyEvents(updated);
          localStorage.setItem('socially_myEvents', JSON.stringify(updated));
          setSelectedPlace(null);
        }}
      />
    );
  }

  return (
    <div className="solo-discovering container">
      <header className="sd-header">
        <div className="sd-header-top">
          <h1 className="sd-title">{t('solo.title')}</h1>
          <Link to="/discover/create" className="sd-create-btn-small">{t('solo.add_event')}</Link>
        </div>

        <div className="sd-controls-row">
          <div className="sd-toggle">
            <button
              className={"sd-toggle-btn" + (viewMode === 'list' ? ' active' : '')}
              onClick={() => { setViewMode('list'); setIsSearchMode(false); }}
            >
              {t('solo.explore')}
            </button>
            <button
              className={"sd-toggle-btn" + (viewMode === 'saved' ? ' active' : '')}
              onClick={() => { setViewMode('saved'); setIsSearchMode(false); }}
            >
              {t('solo.saved')}{likedPlaces.length > 0 && ` (${likedPlaces.length})`}
            </button>
            <button
              className={"sd-toggle-btn" + (viewMode === 'mine' ? ' active' : '')}
              onClick={() => { setViewMode('mine'); setIsSearchMode(false); }}
            >
              {t('solo.my_events')}{myEvents.length > 0 && ` (${myEvents.length})`}
            </button>
            <button
              className={"sd-toggle-btn" + (viewMode === 'registered' ? ' active' : '')}
              onClick={() => { setViewMode('registered'); setIsSearchMode(false); }}
            >
              {t('solo.registered_events')}{registeredEvents.filter(e => e.isJoined).length > 0 && ` (${registeredEvents.filter(e => e.isJoined).length})`}
            </button>
          </div>

          <div className="sd-searchbar-row">
            <div className="sd-searchbar-main">
              <span className="sd-searchbar-icon">🔍</span>
              <input
                type="text"
                className="sd-searchbar-input"
                placeholder={t('solo.search_placeholder')}
                value={searchString}
                onChange={handleSearchChange}
                onKeyDown={handleSearch}
              />
              {isSearchMode && (
                <button
                  className="sd-searchbar-clear"
                  onClick={() => {
                    setSearchString('');
                    setIsSearchMode(false);
                    setSearchResults([]);
                    fetchMainFeed();
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="sd-inline-param">
              <span className="sd-inline-label">{t('solo.km_label')}</span>
              <input
                type="number" min="0" max="1000" className="sd-inline-input"
                value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)}
                placeholder="100" title="Distanța maximă (km)"
              />
            </div>

            <div className="sd-inline-param">
              <span className="sd-inline-label">{t('solo.days_label')}</span>
              <input
                type="number" min="0" max="365" className="sd-inline-input"
                value={maxDays} onChange={(e) => setMaxDays(e.target.value)}
                placeholder="30" title="Numărul maxim de zile"
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
              {selectedFilters.length > 0 && (
                <span className="sd-filter-badge">{selectedFilters.length}</span>
              )}
            </button>
          </div>
        </div>

        {isSearchMode && !isLoading && (
          <p className="sd-search-label fade-in">
            {searchResults.length > 0
              ? `${searchResults.length} ${t('solo.results_for') || 'rezultate pentru'} „${searchString}"`
              : `${t('solo.no_results_for') || 'Niciun rezultat pentru'} „${searchString}"`
            }
          </p>
        )}
      </header>

      <div className={`sd-content${(isSearchMode || viewMode === 'saved' || viewMode === 'mine' || viewMode === 'registered') ? ' sd-content--scrollable' : ''}`}>
        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>Încărcare...</div>
        )}

        {!isLoading && viewMode === 'mine' && !isSearchMode && (
          <MyEventsScreen events={myEvents} onOpenDetails={setSelectedPlace} />
        )}
        {!isLoading && viewMode === 'registered' && !isSearchMode && (
          <RegisteredEventsScreen
            registeredEvents={registeredEvents}
            onUnregister={handleToggleRegistration}
            onOpenDetails={setSelectedPlace}
          />
        )}
        {!isLoading && viewMode === 'saved' && !isSearchMode && (
          <FavoritesScreen
            likedPlaces={likedPlaces}
            onRemove={async (id) => {
              const updated = likedPlaces.filter((p) => p.id !== id);
              setLikedPlaces(updated);
              localStorage.setItem('socially_likedPlaces', JSON.stringify(updated));
              
              const token = localStorage.getItem('token');
              try {
                const API_BASE = window.API_URL || "http://localhost:9090"; // Fallback in case API_URL isn't globally available here
                await fetch(`${API_BASE}/api/events/${id}/vote`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` }
                });
                // Fetch main feed to repopulate the event in the Explore tab if it was empty
                fetchMainFeed(true);
              } catch (err) {
                console.error('Failed to remove vote from backend', err);
              }
            }}
            onOpenDetails={setSelectedPlace}
          />
        )}

        {/* Swipe Cards Mode */}
        {!isLoading && viewMode === 'list' && !isSearchMode && (
          <div className="sd-cards-container">
            <DiscoveryScreen
              key={availablePlaces[0]?.id || 'empty'}
              location={availablePlaces[0]}
              onAction={handleCardAction}
              onOpenDetails={setSelectedPlace}
            />
          </div>
        )}

        {/* Grid Search Results Mode */}
        {!isLoading && viewMode === 'list' && isSearchMode && (
          <SearchResultsGrid results={searchResults} onOpenDetails={setSelectedPlace} />
        )}
      </div>

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleApplyFilters}
        selectedFilters={selectedFilters}
        onToggleFilter={toggleFilter}
        onClearAll={() => setSelectedFilters([])}
      />
    </div>
  );
}

export default SoloDiscovering;
