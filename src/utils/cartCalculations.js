/**
 * Pure cart logic and calculations for KiplyStart
 */

export function getCartKey(item) {
    return `${item.id}_${item.bundleSize || 1}`;
}

export function calculateItemTotal(item) {
    const sets = item.bundleSets || 1;
    const itemUnitPrice = item.bundleTotal || (item.price * (item.bundleSize || 1));
    return itemUnitPrice * sets;
}

export function calculateCartTotals(cartItems = []) {
    const cartTotal = cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
    const cartCount = cartItems.reduce((count, item) => {
        const bundleSize = item.bundleSize || 1;
        const sets = item.bundleSets || 1;
        return count + (bundleSize * sets);
    }, 0);
    return { cartTotal, cartCount };
}

export function updateCartUnits(cartItems, targetCartKey, newTotalUnits) {
    if (newTotalUnits < 1) return cartItems;

    const targetIdx = cartItems.findIndex(item => getCartKey(item) === targetCartKey);
    if (targetIdx === -1) return cartItems;
    const target = cartItems[targetIdx];

    const d2 = target.bundle_2_discount || 10;
    const d3 = target.bundle_3_discount || 20;
    let unitPrice, discountPct;

    if (target.bundleType === 'quantity') {
        const freeItems = Math.floor(newTotalUnits / 3);
        const paidItems = newTotalUnits - freeItems;
        const total = paidItems * target.price;
        unitPrice = Math.ceil(total / newTotalUnits);
        discountPct = Math.round((1 - unitPrice / target.price) * 100);
    } else {
        discountPct = newTotalUnits >= 3 ? d3 : newTotalUnits === 2 ? d2 : 0;
        unitPrice = discountPct > 0
            ? Math.ceil(target.price * (1 - discountPct / 100))
            : target.price;
    }

    const normalizedKey = `${target.id}_1`;
    const dupeIdx = target.bundleSize > 1
        ? cartItems.findIndex((item, i) => i !== targetIdx && getCartKey(item) === normalizedKey)
        : -1;

    if (dupeIdx >= 0) {
        const dupe = cartItems[dupeIdx];
        const merged = newTotalUnits + (dupe.bundleSets || 1);

        let mPrice, mDiscount;
        if (target.bundleType === 'quantity') {
            const freeItems = Math.floor(merged / 3);
            const paidItems = merged - freeItems;
            const total = paidItems * target.price;
            mPrice = Math.ceil(total / merged);
            mDiscount = Math.round((1 - mPrice / target.price) * 100);
        } else {
            const discount = merged >= 3 ? d3 : merged === 2 ? d2 : 0;
            mPrice = discount > 0 ? Math.ceil(target.price * (1 - discount / 100)) : target.price;
            mDiscount = discount;
        }

        return cartItems
            .filter((_, i) => i !== targetIdx)
            .map(item =>
                getCartKey(item) === normalizedKey
                    ? { ...item, bundleSize: 1, bundleSets: merged, discountPct: mDiscount, bundleTotal: mPrice }
                    : item
            );
    }

    return cartItems.map((item, i) =>
        i === targetIdx
            ? { ...item, bundleSize: 1, bundleSets: newTotalUnits, discountPct, bundleTotal: unitPrice }
            : item
    );
}
