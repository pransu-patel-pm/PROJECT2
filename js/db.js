
// Initialize Supabase Client
// Users need to replace these with their own project details from https://supabase.com
const SUPABASE_URL = 'https://yqlotklnolggzayvbsty.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fFKCcdvr-OST4logRL8_xw_iZz8i-lA';

let supabase = null;

if (typeof createClient !== 'undefined' && SUPABASE_URL.includes('supabase.co')) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase initialized with URL:', SUPABASE_URL);
} else {
    console.warn('Supabase not configured or client library missing. Using local mock data.');
}

// Function to fetch hospitals (tries DB, falls back to local)
async function getHospitals() {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('hospitals')
                .select('*');

            if (error) throw error;
            if (data) return data;
        } catch (err) {
            console.error('Error fetching from Supabase:', err);
        }
    }
    // Fallback to the local variable 'hospitals' defined in data.js
    if (typeof hospitals !== 'undefined') {
        return hospitals;
    }
    return [];
}

// Function to fetch ambulance status
async function getAmbulanceStatus() {
    if (supabase) {
        // Implementation for real-time subscription or fetch
        // For now returning mock
    }
    return 'Available';
}
