/**
 * Pure pricing calculations and formatters for KiplyStart dropshipping.
 * Deterministic business logic used across admin, product forms, catalog and tests.
 */

/**
 * Calculates selling price for dropshipping products
 * @param {number} supplierCost - DroPanas supplier cost
 * @param {number} suggestedPrice - Minimum suggested retail price
 * @param {number} shippingCost - Shipping cost (default $8)
 * @param {number} profitMargin - Profit margin (default $6)
 * @returns {number} Final calculated price (rounded up)
 */
export function calculateSellingPrice(supplierCost = 0, suggestedPrice = 0, shippingCost = 8, profitMargin = 6) {
    const cost = parseFloat(supplierCost) || 0;
    const suggested = parseFloat(suggestedPrice) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const profit = parseFloat(profitMargin) || 0;

    if (cost === 0 && suggested === 0) return 0;
    const raw = cost + shipping + profit;
    return Math.ceil(Math.max(raw, suggested));
}

/**
 * Calculates anchor / compare-at price (e.g. $40 -> $56.90)
 * @param {number} price - Current selling price
 * @param {number} markup - Multiplier (default 1.4 for 40% markup)
 * @returns {string} Compare-at price formatted with .90 ending
 */
export function calculateCompareAtPrice(price, markup = 1.4) {
    const p = parseFloat(price) || 0;
    if (p <= 0) return '';
    return `${Math.floor(p * markup)}.90`;
}

/**
 * Calculates bundle price based on bundle size and discount model
 * @param {number} basePrice - Base single unit price
 * @param {number} bundleSize - Number of units in bundle (1, 2, 3, etc.)
 * @param {string} bundleType - 'discount' or 'quantity'
 * @param {number} discount2 - Discount % for 2 units (default 10)
 * @param {number} discount3 - Discount % for 3 units (default 20)
 * @returns {number} Total bundle price (rounded up)
 */
export function calculateBundlePrice(basePrice, bundleSize = 1, bundleType = 'discount', discount2 = 10, discount3 = 20) {
    const price = parseFloat(basePrice) || 0;
    if (price <= 0 || bundleSize <= 1) return price;

    if (bundleType === 'quantity') {
        // Buy 2 get 1 free: every 3rd item is free
        const freeItems = Math.floor(bundleSize / 3);
        const paidItems = bundleSize - freeItems;
        return Math.ceil(paidItems * price);
    }

    // Default % discount
    const discount = bundleSize >= 3 ? discount3 : bundleSize === 2 ? discount2 : 0;
    if (discount <= 0) return Math.ceil(price * bundleSize);
    return Math.ceil((price * bundleSize) * (1 - discount / 100));
}

/**
 * Formats amount in USD
 * @param {number} amount - Amount in USD
 * @returns {string} e.g. "$25" or "$25.50"
 */
export function formatUSD(amount) {
    const val = parseFloat(amount) || 0;
    if (val === 0) return '$0';
    const hasDecimals = val % 1 !== 0;
    return `$${val.toLocaleString('en-US', {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2
    })}`;
}

/**
 * Formats amount in Venezuelan Bolivars (VES) using BCV exchange rate
 * @param {number} amountUSD - Amount in USD
 * @param {number} exchangeRate - VES/USD exchange rate
 * @returns {string} e.g. "Bs 1.750,00"
 */
export function formatBs(amountUSD, exchangeRate) {
    const usd = parseFloat(amountUSD) || 0;
    const rate = parseFloat(exchangeRate) || 0;
    if (usd <= 0 || rate <= 0) return '';
    const amountVES = usd * rate;
    return `Bs ${amountVES.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
