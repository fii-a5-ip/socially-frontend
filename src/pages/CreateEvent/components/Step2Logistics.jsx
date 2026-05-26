import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, MapPin, Loader2, ThermometerSun, Wind, Droplets } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { API_URL } from '../../../api/config';

export function Step2Logistics({ values, errors, touched, handleChange, handleBlur, setValues }) {
    const { t } = useTranslation();
    
    // Autocomplete state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    
    // Weather state
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState('');

    // Geolocation state
    const [userLocation, setUserLocation] = useState(null);

    const debounceTimer = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            console.log("Requesting geolocation...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    console.log("Geolocation success:", pos.coords.latitude, pos.coords.longitude);
                    setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                },
                (err) => console.error("Geolocation error:", err)
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
        }
    }, []);

    // Fetch autocomplete suggestions
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
            
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleAddressChange = (e) => {
        handleChange(e);
        const val = e.target.value;
        
        // Reset locationId if user starts typing manually again
        if (values.locationId) {
            setValues(prev => ({ ...prev, locationId: null, mapHtml: '' }));
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(val);
        }, 500);
    };

    const handleSelectSuggestion = async (suggestion) => {
        // Update input field
        setValues(prev => ({ ...prev, address: suggestion.fullAddress }));
        setShowSuggestions(false);
        setSuggestions([]);

        try {
            const token = localStorage.getItem('token');
            
            // 1. Get full details from backend AI
            const findRes = await fetch(`${API_URL}/api/locations/find`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ placeId: suggestion.placeId })
            });

            if (!findRes.ok) throw new Error("Failed to find location details");
            const locDetail = await findRes.json();

            // 2. Save/Get location from our local database to get a real locationId
            const payload = {
                name: locDetail.name || suggestion.name,
                formattedAddress: locDetail.formattedAddress,
                latitude: locDetail.lat,
                longitude: locDetail.lon,
                country: locDetail.country,
                city: locDetail.city,
                street: locDetail.street,
                streetNumber: locDetail.streetNumber,
                postalcode: locDetail.postcode,
                phoneNumber: locDetail.phone,
                contact: locDetail.website,
                tags: locDetail.tags
            };

            const createRes = await fetch(`${API_URL}/api/locations`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!createRes.ok) throw new Error("Failed to create location in db");
            const savedLoc = await createRes.json();

            // 3. Update form state with the real ID and map HTML
            setValues(prev => ({ 
                ...prev, 
                locationId: savedLoc.id,
                mapHtml: locDetail.mapHtml 
            }));

        } catch (err) {
            console.error(err);
            alert("A apărut o eroare la salvarea locației.");
        }
    };

    const handleCheckWeather = async (e) => {
        e.preventDefault();
        setWeatherError('');
        setWeatherData(null);

        if (!values.date) {
            setWeatherError("Te rugăm să selectezi mai întâi data evenimentului.");
            return;
        }
        if (!values.locationId) {
            setWeatherError("Te rugăm să selectezi și să validezi o locație din listă.");
            return;
        }

        setWeatherLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Format ISO date for backend
            const isoDate = new Date(values.date).toISOString();
            
            const res = await fetch(`${API_URL}/api/events/weather-check?locationId=${values.locationId}&date=${encodeURIComponent(isoDate)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 204) {
                setWeatherError("Nu există date meteo disponibile pentru această dată/locație (prea departe în viitor?).");
            } else if (res.ok) {
                const data = await res.json();
                setWeatherData(data);
            } else {
                setWeatherError("Eroare la obținerea datelor meteo.");
            }
        } catch (err) {
            console.error(err);
            setWeatherError("A apărut o eroare de rețea.");
        } finally {
            setWeatherLoading(false);
        }
    };

    // Funcție helper pentru a extrage o medie a zilei (sau prima oră) din array-uri
    const getAvg = (arr) => {
        if (!arr || arr.length === 0) return 0;
        // Preluăm valoarea de la ora 12:00 (index 12) sau prima dacă nu există
        return arr.length > 12 ? arr[12] : arr[0];
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
                {errors.date && <span className="ce-error-text">{errors.date}</span>}

                {/* Weather display block */}
                <AnimatePresence>
                    {weatherError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="ce-weather-error">
                            {weatherError}
                        </motion.div>
                    )}
                    {weatherData && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="ce-weather-card">
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
                        // Delay hiding to allow click on suggestion
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
                            {suggestions.map((sug, idx) => (
                                <li key={idx} onClick={() => handleSelectSuggestion(sug)} className="ce-autocomplete-item">
                                    <MapPin size={16} className="ce-autocomplete-icon" />
                                    <div>
                                        <strong>{sug.name}</strong>
                                        <div className="ce-autocomplete-sub">
                                            {sug.fullAddress} 
                                            {sug.distanceMeters != null && ` • ${(sug.distanceMeters / 1000).toFixed(1)} km`}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
                {errors.address && <span className="ce-error-text">{errors.address}</span>}
            </div>

            <div className="ce-map-placeholder" style={values.mapHtml ? { padding: 0, border: 'none', height: '200px' } : {}}>
                {values.mapHtml ? (
                    <iframe 
                        srcDoc={values.mapHtml} 
                        title="Location Map" 
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px', background: '#fff' }}
                        sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                ) : (
                    <span>📍 Harta va apărea aici după selecția unei adrese</span>
                )}
            </div>
        </motion.div>
    );
}