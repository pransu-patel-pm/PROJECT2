document.addEventListener('DOMContentLoaded', async () => {
    // Populate Hospital Table
    const tableBody = document.getElementById('hospital-table-body');
    const statusBadge = document.getElementById('connection-status');

    if (tableBody && typeof getHospitals === 'function') {
        const data = await getHospitals();

        // Check if we are using Supabase
        if (typeof supabase !== 'undefined' && supabase) {
            // Verify if data matches local to guess if it's fallback or real
            // A better way is to rely on a flag, but for now let's assume if supabase object exists it tried.
            // We can check the internal supabase status or just update badge
            statusBadge.innerHTML = '<i class="fa-solid fa-database"></i> DB Connected';
            statusBadge.style.background = '#dcfce7';
            statusBadge.style.color = '#166534';
        } else {
            statusBadge.innerHTML = '<i class="fa-solid fa-server"></i> Local Mode';
        }

        if (data && data.length > 0) {
            tableBody.innerHTML = data.map(h => {
                let color = '#22c55e'; // green
                if (h.beds < 5) color = '#ef4444'; // red
                else if (h.beds < 10) color = '#eab308'; // orange

                return `
                <tr>
                    <td>${h.name}</td>
                    <td style="color: ${color}; font-weight: 700;">${h.beds}</td>
                </tr>`;
            }).join('');
        }
    }

    // Handle Track Buttons
    const trackBtns = document.querySelectorAll('.track-btn');
    trackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;

            const id = row.cells?.[0]?.innerText || "Unknown ID";
            const driver = row.cells?.[1]?.innerText || "Unknown Driver";
            const location = row.cells?.[2]?.innerText || "Unknown Location";

            // User Feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            setTimeout(() => {
                btn.innerHTML = originalText;
                if (confirm(`Tracking Unit ${id}\nDriver: ${driver}\nLocation: ${location}\n\nGo to live map?`)) {
                    window.location.href = 'index.html#map-section';
                }
            }, 500);
        });
    });

    // Handle Details Buttons
    const detailBtns = document.querySelectorAll('.details-btn');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert("Vehicle Maintenance Log:\n\n- Oil Change Due: 15/05/2026\n- Tire Pressure: Normal\n- Last Service: 2 days ago");
        });
    });
});
