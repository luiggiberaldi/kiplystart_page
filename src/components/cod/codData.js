/**
 * KiplyStart Venezuela delivery zones — all 24 states, cities & coverage modes
 * - Direct Home Delivery (Gran Caracas, Carabobo, Aragua, Lara, Zulia, etc.)
 * - Tealca Agency Pickup / Home Delivery for rest of country
 */
export const ZONES = [
    {
        state: 'Distrito Capital',
        cities: ['Caracas', 'Caracas (Municipio Libertador)', 'Caracas (Chacao / Baruta / Sucre / El Hatillo)'],
        delivery: 'Entrega Express en 60 minutos (Caracas)',
        hasHomeDelivery: true
    },
    {
        state: 'Miranda',
        cities: ['Los Teques', 'Guatire', 'Guarenas', 'San Antonio de los Altos', 'Charallave', 'Cúa', 'Higuerote'],
        delivery: 'Entrega a Domicilio y Oficina (24 a 48h)',
        hasHomeDelivery: true
    },
    {
        state: 'La Guaira',
        cities: ['La Guaira', 'Maiquetía', 'Catia la Mar', 'Caraballeda', 'Macuto'],
        delivery: 'Entrega a Domicilio y Oficina (24 a 48h)',
        hasHomeDelivery: true
    },
    {
        state: 'Carabobo',
        cities: ['Valencia', 'San Diego', 'Naguanagua', 'Guacara', 'Los Guayos', 'Tocuyito', 'Puerto Cabello'],
        delivery: 'Entrega a Domicilio y Oficina Tealca (24-48h)',
        hasHomeDelivery: true
    },
    {
        state: 'Aragua',
        cities: ['Maracay', 'El Limón', 'Turmero', 'Cagua', 'La Victoria', 'Las Delicias', 'Palo Negro'],
        delivery: 'Entrega a Domicilio y Oficina Tealca (24-48h)',
        hasHomeDelivery: true
    },
    {
        state: 'Lara',
        cities: ['Barquisimeto', 'Cabudare', 'Carora', 'Quíbor', 'El Tocuyo'],
        delivery: 'Entrega a Domicilio y Oficina Tealca (24-48h)',
        hasHomeDelivery: true
    },
    {
        state: 'Zulia',
        cities: ['Maracaibo', 'San Francisco', 'Cabimas', 'Ciudad Ojeda', 'La Concepción'],
        delivery: 'Entrega a Domicilio y Oficina Tealca (24-48h)',
        hasHomeDelivery: true
    },
    {
        state: 'Yaracuy',
        cities: ['San Felipe', 'Cocorote', 'Yaritagua', 'Chivacoa', 'Nirgua'],
        delivery: 'Entrega a Domicilio y Oficina Tealca (24-48h)',
        hasHomeDelivery: true
    },
    {
        state: 'Anzoátegui',
        cities: ['Lechería', 'Puerto La Cruz', 'Barcelona', 'Guanta', 'El Tigre', 'Anaco', 'Cantaura'],
        delivery: 'Entrega en Oficina Tealca / Domicilio (24-48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Bolívar',
        cities: ['Puerto Ordaz', 'Ciudad Guayana', 'Ciudad Bolívar', 'Upata', 'San Félix'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Táchira',
        cities: ['San Cristóbal', 'Táriba', 'San Antonio del Táchira', 'Rubio', 'La Fría'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Mérida',
        cities: ['Mérida', 'El Vigía', 'Ejido', 'Tovar'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Falcón',
        cities: ['Punto Fijo', 'Coro', 'Tucacas', 'Chichiriviche'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Monagas',
        cities: ['Maturín', 'Punta de Mata', 'Caripe'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Nueva Esparta',
        cities: ['Porlamar', 'Pampatar', 'La Asunción', 'Juan Griego'],
        delivery: 'Entrega en Oficina Tealca (48-72h)',
        hasHomeDelivery: false
    },
    {
        state: 'Barinas',
        cities: ['Barinas', 'Barinitas', 'Socopó'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Portuguesa',
        cities: ['Acarigua', 'Araure', 'Guanare'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Sucre',
        cities: ['Cumaná', 'Carúpano', 'Güiria'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Guárico',
        cities: ['San Juan de los Morros', 'Calabozo', 'Valle de la Pascua', 'Zaraza'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Trujillo',
        cities: ['Valera', 'Trujillo', 'Boconó'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Cojedes',
        cities: ['San Carlos', 'Tinaquillo', 'Tinaco'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Apure',
        cities: ['San Fernando de Apure', 'Guasdualito'],
        delivery: 'Entrega en Oficina Tealca (48h)',
        hasHomeDelivery: false
    },
    {
        state: 'Delta Amacuro',
        cities: ['Tucupita'],
        delivery: 'Entrega en Oficina Tealca (48-72h)',
        hasHomeDelivery: false
    },
    {
        state: 'Amazonas',
        cities: ['Puerto Ayacucho'],
        delivery: 'Entrega en Oficina Tealca (48-72h)',
        hasHomeDelivery: false
    }
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
