/**
 * Facebook Pixel Event Helpers
 * @description
 * Centralized helpers to fire Meta Pixel standard events.
 * Safe to call even if fbq is not loaded (gracefully no-ops).
 *
 * Standard Events Reference:
 * https://developers.facebook.com/docs/meta-pixel/reference#standard-events
 */

function track(eventName, params = {}) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params);
    }
}

/** Fires when a user views a product page */
export function trackViewContent(product) {
    track('ViewContent', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        content_category: product.category || 'General',
        value: parseFloat(product.price) || 0,
        currency: 'USD',
    });
}

/** Fires when a user adds a product to cart */
export function trackAddToCart(product, quantity, totalValue) {
    track('AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        content_category: product.category || 'General',
        value: totalValue || parseFloat(product.price) || 0,
        currency: 'USD',
        num_items: quantity || 1,
    });
}

/** Fires when a user begins checkout (opens the order form) */
export function trackInitiateCheckout(cartItems, cartTotal) {
    track('InitiateCheckout', {
        content_ids: cartItems.map(item => item.id),
        content_type: 'product',
        value: cartTotal || 0,
        currency: 'USD',
        num_items: cartItems.length,
    });
}

/** Fires when order is successfully placed */
export function trackPurchase(orderId, cartItems, cartTotal) {
    track('Purchase', {
        content_ids: cartItems.map(item => item.id),
        content_type: 'product',
        value: cartTotal || 0,
        currency: 'USD',
        num_items: cartItems.length,
        order_id: orderId,
    });
}
