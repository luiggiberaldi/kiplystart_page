import { ZONES } from '../components/cod/codData';

/**
 * Validates Venezuelan phone numbers
 * Accepts formats: 04141234567, 4141234567, 584141234567, +584141234567, 0412-1234567, etc.
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidVenezuelaPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const clean = phone.replace(/\D/g, '');
    // Standard Venezuelan mobile: 10 or 11 digits (e.g. 04141234567 or 4141234567 or 584141234567)
    if (clean.length === 10 || clean.length === 11) return true;
    if (clean.length === 12 && clean.startsWith('58')) return true;
    return false;
}

/**
 * Formats a clean phone number into international format without + for WhatsApp
 * @param {string} phone
 * @returns {string} e.g. "584141234567"
 */
export function formatWhatsAppPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('58')) return clean;
    if (clean.startsWith('0')) return `58${clean.substring(1)}`;
    if (clean.length === 10) return `58${clean}`;
    return clean;
}

/**
 * Validates Venezuelan Identity Card (Cédula de Identidad)
 * @param {string} ci
 * @returns {boolean}
 */
export function isValidCI(ci) {
    if (!ci || typeof ci !== 'string') return false;
    const clean = ci.replace(/[^\d]/g, '');
    return clean.length >= 6 && clean.length <= 9;
}

/**
 * Validates if the selected state and city exist in delivery zones
 * @param {string} state
 * @param {string} city
 * @returns {boolean}
 */
export function isValidDeliveryZone(state, city) {
    if (!state || !city) return false;
    const zone = ZONES.find(z => z.state.toLowerCase() === state.toLowerCase().trim());
    if (!zone) return false;
    return zone.cities.some(c => c.toLowerCase() === city.toLowerCase().trim());
}

/**
 * Generates deterministic order ID formatted as KS-YYYYMMDD-XXXX
 * @param {Date} date
 * @param {number} randomSeed - Optional 4 digit number
 * @returns {string}
 */
export function generateOrderId(date = new Date(), randomSeed = null) {
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = randomSeed !== null
        ? String(randomSeed).padStart(4, '0')
        : String(Math.floor(1000 + Math.random() * 9000));
    return `KS-${datePart}-${rand}`;
}
