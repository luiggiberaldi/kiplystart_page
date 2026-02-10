/**
 * KiplyStart delivery zones — states, cities & estimated delivery times
 */
export const ZONES = [
    {
        state: 'Distrito Capital',
        cities: ['Caracas'],
        delivery: '24 horas después de la guía'
    },
    {
        state: 'Miranda',
        cities: ['Los Teques', 'Guatire', 'Guarenas', 'San Antonio de los Altos'],
        delivery: '24 horas después de la guía'
    },
    {
        state: 'La Guaira',
        cities: ['La Guaira', 'Maiquetía', 'Catia la Mar', 'Caraballeda'],
        delivery: '24 horas después de la guía'
    },
    {
        state: 'Yaracuy',
        cities: ['San Felipe', 'Cocorote'],
        delivery: '24 a 48 horas'
    },
    {
        state: 'Lara',
        cities: ['Barquisimeto', 'Cabudare'],
        delivery: '24 a 48 horas'
    },
    {
        state: 'Carabobo',
        cities: ['Valencia', 'Tocuyito', 'Naguanagua', 'San Diego', 'Los Guayos', 'Guacara'],
        delivery: '24 a 48 horas'
    },
    {
        state: 'Aragua',
        cities: ['Maracay', 'El Limón', 'Las Delicias', 'Turmero', 'Cagua'],
        delivery: '24 a 48 horas'
    },
    {
        state: 'Zulia',
        cities: ['Maracaibo', 'San Francisco'],
        delivery: '24 a 48 horas'
    },
];

/* ===== LOCAL STORAGE ===== */
const STORAGE_KEY = 'kiply_customer';

export function getSavedCustomer() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch { return null; }
}

export function saveCustomer(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        name: data.name, ci: data.ci, phone: data.phone,
        state: data.state, city: data.city, savedAt: Date.now()
    }));
}

export function clearSavedCustomer() {
    localStorage.removeItem(STORAGE_KEY);
}
