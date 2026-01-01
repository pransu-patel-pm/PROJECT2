document.addEventListener('DOMContentLoaded', () => {
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
