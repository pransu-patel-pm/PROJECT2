document.addEventListener('DOMContentLoaded', () => {
    const acceptBtn = document.querySelector('.btn-primary');
    const declineBtn = document.querySelector('.btn-outline');
    const requestCard = document.querySelector('.request-card');
    const mapPlaceholder = document.querySelector('.dashboard-grid .content > div:last-child');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            // Update Interface
            acceptBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            setTimeout(() => {
                acceptBtn.innerHTML = '<i class="fa-solid fa-location-arrow"></i> Navigate to Patient';
                acceptBtn.style.background = '#2563eb';

                if (declineBtn) declineBtn.style.display = 'none';

                // Show Notification
                alert("Request Accepted! Navigation starting...");

                // Initialize Map
                initDashboardMap(mapPlaceholder);
            }, 1000);
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to decline this request?")) {
                requestCard.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #64748b;">
                        <i class="fa-solid fa-check-circle" style="font-size: 3rem; margin-bottom: 20px; color: #10b981;"></i>
                        <h3>Request Declined</h3>
                        <p>You are now marked as Available for other requests.</p>
                    </div>
                `;
                mapPlaceholder.style.display = 'none';
            }
        });
    }

    // Status Toggle
    const statusBtns = document.querySelectorAll('.toggle-btn');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            statusBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#1e293b';
                b.style.borderColor = '#e2e8f0';
            });
            e.target.classList.add('active');
            if (e.target.innerText === 'Available') {
                e.target.style.background = '#10b981';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#10b981';
            } else {
                e.target.style.background = '#64748b';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#64748b';
            }
        });
    });
});

function initDashboardMap(placeholderElement) {
    // Clear placeholder content
    placeholderElement.innerHTML = '<div id="driver-map" style="width: 100%; height: 100%; border-radius: 12px;"></div>';

    // Initialize Leaflet
    const map = L.map('driver-map').setView([22.6010, 72.8220], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Route Simulation (Straight line for demo)
    const driverPos = [22.6010, 72.8220];
    const patientPos = [22.5950, 72.8300];

    L.marker(driverPos).addTo(map).bindPopup("You").openPopup();
    L.marker(patientPos).addTo(map).bindPopup("Patient").openPopup();

    L.polyline([driverPos, patientPos], { color: 'blue' }).addTo(map);

    alert("Route calculated to patient location.");
}
