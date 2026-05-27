import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, MapPin, Loader2, ThermometerSun, Wind, Droplets } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { API_URL } from '../../../api/config';

export function Step2Logistics({ values, errors, handleChange, handleBlur, setValues }) {
  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const [userLocation, setUserLocation] = useState(null);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => console.error('Geolocation error:', err)
      );
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/api/locations/autocomplete?query=${encodeURIComponent(query)}`;

      if (userLocation) {
        url += `&lat=${userLocation.lat}&lon=${userLocation.lon}`;
      }

      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddressChange = (event) => {
    handleChange(event);
    const value = event.target.value;

    if (values.locationId) {
      setValues((previousValues) => ({
        ...previousValues,
        locationId: null,
        mapHtml: ''
      }));
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  const handleSelectSuggestion = async (suggestion) => {
    setValues((previousValues) => ({
      ...previousValues,
      address: suggestion.fullAddress
    }));
    setShowSuggestions(false);
    setSuggestions([]);

    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const findResponse = await fetch(`${API_URL}/api/locations/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ placeId: suggestion.placeId })
      });

      if (!findResponse.ok) {
        throw new Error('Failed to find location details');
      }

      const locationDetails = await findResponse.json();

      const payload = {
        name: locationDetails.name || suggestion.name,
        formattedAddress: locationDetails.formattedAddress,
        latitude: locationDetails.lat,
        longitude: locationDetails.lon,
        country: locationDetails.country,
        city: locationDetails.city,
        street: locationDetails.street,
        streetNumber: locationDetails.streetNumber,
        postalcode: locationDetails.postcode,
        phoneNumber: locationDetails.phone,
        contact: locationDetails.website,
        tags: locationDetails.tags
      };

      const createResponse = await fetch(`${API_URL}/api/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(payload)
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create location in db');
      }

      const savedLocation = await createResponse.json();

      setValues((previousValues) => ({
        ...previousValues,
        locationId: savedLocation.id,
        mapHtml: locationDetails.mapHtml
      }));
    } catch (error) {
      console.error(error);
      alert('A apărut o eroare la salvarea locației.');
    }
  };

  const handleCheckWeather = async (event) => {
    event.preventDefault();
    setWeatherError('');
    setWeatherData(null);

    if (!values.date) {
      setWeatherError('Te rugăm să selectezi mai întâi data evenimentului.');
      return;
    }

    if (!values.locationId) {
      setWeatherError('Te rugăm să selectezi și să validezi o locație din listă.');
      return;
    }

    setWeatherLoading(true);

    try {
      const token = localStorage.getItem('token');
      const isoDate = new Date(values.date).toISOString();

      const response = await fetch(
        `${API_URL}/api/events/weather-check?locationId=${values.locationId}&date=${encodeURIComponent(isoDate)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (response.status === 204) {
        setWeatherError('Nu există date meteo disponibile pentru această dată/locație.');
      } else if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        setWeatherError('Eroare la obținerea datelor meteo.');
      }
    } catch (error) {
      console.error(error);
      setWeatherError('A apărut o eroare de rețea.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const getAvg = (valuesList) => {
    if (!valuesList || valuesList.length === 0) {
      return 0;
    }

    return valuesList.length > 12 ? valuesList[12] : valuesList[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="ce-form-section"
    >
      <div className="ce-form-group">
        <div className="ce-label-row">
          <label className="ce-label">
            {t('createevent.form.date')} <span className="ce-required">*</span>
          </label>

          <button
            type="button"
            className="ce-weather-btn"
            onClick={handleCheckWeather}
            title="Verifică vremea"
            disabled={weatherLoading}
          >
            {weatherLoading ? <Loader2 size={16} className="ce-spin" /> : <CloudSun size={16} />}
            <span>Vremea</span>
          </button>
        </div>

        <input
          className={`ce-input ${errors.date ? 'error' : ''}`}
          type="datetime-local"
          name="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.date && (
          <span className="ce-error-text">{errors.date}</span>
        )}

        <AnimatePresence>
          {weatherError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ce-weather-error"
            >
              {weatherError}
            </motion.div>
          )}

          {weatherData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ce-weather-card"
            >
              <div className="ce-weather-header">
                <CloudSun size={20} />
                <strong>Prognoza pentru {weatherData.date}</strong>
              </div>

              <div className="ce-weather-body">
                <div className="ce-weather-item">
                  <ThermometerSun size={16} />
                  <span>{getAvg(weatherData.temp)}°C</span>
                </div>

                <div className="ce-weather-item">
                  <Wind size={16} />
                  <span>{getAvg(weatherData.windSpeed)} km/h</span>
                </div>

                <div className="ce-weather-item">
                  <Droplets size={16} />
                  <span>{getAvg(weatherData.precipitationProbability)}% precipitații</span>
                </div>
              </div>

              <div className="ce-weather-desc">
                <em>Detalii: {weatherData.details}</em>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ce-form-group" style={{ position: 'relative' }}>
        <label className="ce-label">
          {t('createevent.form.address')} <span className="ce-required">*</span>
        </label>

        <input
          className={`ce-input ${errors.address ? 'error' : ''}`}
          type="text"
          name="address"
          placeholder={t('createevent.form.address_ph')}
          value={values.address}
          onChange={handleAddressChange}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
            handleBlur({ target: { name: 'address' } });
          }}
        />

        {loadingSuggestions && (
          <div className="ce-input-loader">
            <Loader2 size={16} className="ce-spin" />
          </div>
        )}

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="ce-autocomplete-dropdown"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.placeId || suggestion.name}-${index}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="ce-autocomplete-item"
                >
                  <MapPin size={16} className="ce-autocomplete-icon" />
                  <div>
                    <strong>{suggestion.name}</strong>
                    <div className="ce-autocomplete-sub">
                      {suggestion.fullAddress}
                      {suggestion.distanceMeters != null
                        && ` • ${(suggestion.distanceMeters / 1000).toFixed(1)} km`}
                    </div>
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {errors.address && (
          <span className="ce-error-text">{errors.address}</span>
        )}
      </div>

      <div
        className="ce-map-placeholder"
        style={values.mapHtml ? { padding: 0, border: 'none', height: '200px' } : {}}
      >
        {values.mapHtml ? (
          <iframe
            srcDoc={values.mapHtml}
            title="Location Map"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              background: '#fff'
            }}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <span>📍 Harta va apărea aici după selecția unei adrese</span>
        )}
      </div>
    </motion.div>
  );
}
