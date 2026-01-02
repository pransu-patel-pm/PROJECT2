// Data loaded from data.js
// Translations loaded from languages.js

let currentLang = 'en';

function changeLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    const t = translations[lang];

    // Update static elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (key.includes('html') || key === 'btn_request' || key === 'hero_title') {
                el.innerHTML = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });

    // Re-render Hospital List
    renderHospitals();


    // Update Map Popups
    if (userMarker) userMarker.setPopupContent(`<b>${t.popup_your_location}</b><br>Near Changa`);
    // Note: Ambulance unit name is hardcoded for now, but status can be translated
    if (ambulanceMarker) ambulanceMarker.setPopupContent(`<b>Ambulance Unit 101</b><br>${t.status_available}`);

    hospitalMarkers.forEach(item => {
        item.marker.setPopupContent(`<b>${item.data.name}</b><br>${t.card_beds}: ${item.data.beds}<br>${item.data.contact}`);
    });
}

// Map Logic
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch latest data from database if available
    if (typeof getHospitals === 'function') {
        try {
            const dbData = await getHospitals();
            if (dbData && dbData.length > 0) {
                hospitals = dbData;
                console.log('Loaded hospitals from database');
            }
        } catch (e) {
            console.error('Failed to load DB data', e);
        }
    }

    initMap();
    renderHospitals();
    handleRequest();

    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.addEventListener('change', (e) => changeLanguage(e.target.value));
    }
});

let map;
let userMarker;
let ambulanceMarker;
let hospitalMarkers = [];

function initMap() {
    // Center map around Changa/Ramol region (Approx 22.60, 72.82)
    // Using Leaflet
    const defaultLocation = [22.6010, 72.8220]; // Near Changa

    map = L.map('map').setView(defaultLocation, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Custom Icons
    const userIcon = L.divIcon({
        html: '<div style="background-color: #0066cc; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3);"></div>',
        className: 'user-marker-icon',
        iconSize: [20, 20]
    });

    const hospitalIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', // Generic Hospital Icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const ambulanceIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2618/2618528.png', // Generic Ambulance Icon
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add User (Mock Location)
    userMarker = L.marker(defaultLocation, { icon: userIcon }).addTo(map)
        .bindPopup("<b>Your Location</b><br>Near Changa").openPopup();

    // Add Hospitals
    hospitals.forEach(h => {
        const marker = L.marker([h.lat, h.lng], { icon: hospitalIcon })
            .addTo(map)
            .bindPopup(`<b>${h.name}</b><br>Beds Available: ${h.beds}<br>${h.contact}`);

        hospitalMarkers.push({ marker: marker, data: h });
    });

    // Add Mock Ambulance
    const ambStart = [22.5900, 72.8100];
    ambulanceMarker = L.marker(ambStart, { icon: ambulanceIcon }).addTo(map)
        .bindPopup("<b>Ambulance Unit 101</b><br>Status: Available");

    // Simulate Ambulance Movement
    let step = 0;
    setInterval(() => {
        step += 0.0001;
        const newLat = 22.5900 + Math.sin(step) * 0.005;
        const newLng = 72.8100 + Math.cos(step) * 0.005;
        ambulanceMarker.setLatLng([newLat, newLng]);
    }, 100);
}

function renderHospitals() {
    const list = document.getElementById('hospital-list');
    if (!list) return;

    const t = translations[currentLang];

    list.innerHTML = hospitals.map(h => `
        <div class="hospital-card">
            <span class="status-badge status-available">
                <i class="fa-solid fa-bed"></i> ${h.beds} ${t.card_beds}
            </span>
            <h3>${h.name}</h3>
            <div class="info-row">
                <i class="fa-solid fa-map-pin"></i>
                <span>${h.location} (${h.distance} ${t.unit_away || ''})</span>
            </div>
            <div class="info-row">
                <i class="fa-solid fa-phone"></i>
                <span>${h.contact}</span>
            </div>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="window.location.href='hospital.html'" class="btn btn-primary" style="flex: 1; border-radius: 8px; padding: 8px; font-size: 0.9rem;">
                    ${t.card_view}
                </button>
                <button onclick="window.location.href='https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}'" class="btn btn-outline" style="flex: 1; border-radius: 8px; padding: 8px; font-size: 0.9rem;">
                    <i class="fa-solid fa-diamond-turn-right"></i> ${t.card_route}
                </button>
            </div>
        </div>
    `).join('');
}

function handleRequest() {
    const btn = document.getElementById('requestBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const t = translations[currentLang];

        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t.btn_contacting}`;
        btn.style.background = '#eab308'; // yellow

        setTimeout(() => {
            btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t.btn_dispatched}`;
            btn.style.background = '#10b981'; // green
            alert(t.alert_request);
        }, 2000);
    });
}
