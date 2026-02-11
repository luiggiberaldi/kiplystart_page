/**
 * Generate a URL-friendly slug from a product name.
 * Handles Spanish accents, special chars, and normalizes whitespace.
 * 
 * @param {string} name - Product name
 * @returns {string} URL slug (e.g. "pomo-led-tactil-rgb")
 */
export function slugify(name) {
    return name
        .normalize('NFD')                     // decompose accents
        .replace(/[\u0300-\u036f]/g, '')      // strip accents
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')         // remove special chars
        .trim()
        .replace(/\s+/g, '-')                 // spaces → hyphens
        .replace(/-+/g, '-');                  // collapse multiple hyphens
}
