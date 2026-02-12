import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

/**
 * Bundle discount logic:
 * - 1 unit:  0% discount  → price × 1
 * - 2 units: 10% discount → price × 2 × 0.90
 * - 3 units: 20% discount → price × 3 × 0.80
 * 
 * Cart items store: { ...product, quantity (bundleSize), bundleSize, bundleTotal, discountPct }
 */
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('kiply_cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('kiply_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Calculate bundle total for a given product and bundle size
    function calcBundleTotal(price, bundleSize, discountPct) {
        if (bundleSize <= 1 || !discountPct) return price;
        return Math.ceil(price * bundleSize * (1 - discountPct / 100));
    }

    function addToCart(product, quantity = 1, bundleInfo = {}) {
        const bundleSize = bundleInfo.bundleSize || quantity;
        const bundleType = bundleInfo.bundleType || 'discount';
        const discountPct = bundleInfo.discountPct || (bundleSize === 3 ? 20 : bundleSize === 2 ? 10 : 0);
        const bundleTotal = bundleInfo.bundleTotal || calcBundleTotal(product.price, bundleSize, discountPct);

        setCartItems(prev => {
            // Check if same product with same bundle size already exists
            const existingIndex = prev.findIndex(item => item.id === product.id && item.bundleSize === bundleSize);
            if (existingIndex >= 0) {
                // Increment bundle count (e.g. 2 sets of "3-pack")
                return prev.map((item, i) =>
                    i === existingIndex
                        ? { ...item, bundleSets: (item.bundleSets || 1) + 1 }
                        : item
                );
            }
            return [...prev, {
                ...product,
                quantity: bundleSize,
                bundleSize,
                bundleTotal,
                discountPct,
                bundleType,
                bundleSets: 1
            }];
        });
        setIsCartOpen(true);
    }

    function removeFromCart(cartKey) {
        setCartItems(prev => prev.filter(item => getCartKey(item) !== cartKey));
    }

    // newTotalUnits = the desired total number of individual units
    function updateBundleSets(cartKey, newTotalUnits) {
        if (newTotalUnits < 1) return;
        setCartItems(prev => {
            const targetIdx = prev.findIndex(item => getCartKey(item) === cartKey);
            if (targetIdx === -1) return prev;
            const target = prev[targetIdx];

            // Calculate discount based on total units
            // Calculate discount based on total units
            const d2 = target.bundle_2_discount || 10;
            const d3 = target.bundle_3_discount || 20;
            let unitPrice, discountPct;

            if (target.bundleType === 'quantity') {
                // Quantity logic: Buy 2 get 1 free (every 3rd item is free)
                const freeItems = Math.floor(newTotalUnits / 3);
                const paidItems = newTotalUnits - freeItems;
                const total = paidItems * target.price;
                unitPrice = Math.ceil(total / newTotalUnits); // effective unit price
                discountPct = Math.round((1 - unitPrice / target.price) * 100);
            } else {
                // Discount logic (default)
                discountPct = newTotalUnits >= 3 ? d3 : newTotalUnits === 2 ? d2 : 0;
                unitPrice = discountPct > 0
                    ? Math.ceil(target.price * (1 - discountPct / 100))
                    : target.price;
            }

            // Check if normalizing to bundleSize=1 would conflict with another entry
            const normalizedKey = `${target.id}_1`;
            const dupeIdx = target.bundleSize > 1
                ? prev.findIndex((item, i) => i !== targetIdx && getCartKey(item) === normalizedKey)
                : -1;

            if (dupeIdx >= 0) {
                // Merge: combine quantities and remove the duplicate
                const dupe = prev[dupeIdx];
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

                return prev
                    .filter((_, i) => i !== targetIdx)
                    .map(item =>
                        getCartKey(item) === normalizedKey
                            ? { ...item, bundleSize: 1, bundleSets: merged, discountPct: mDiscount, bundleTotal: mPrice }
                            : item
                    );
            }

            // No conflict — normalize to bundleSize=1
            return prev.map((item, i) =>
                i === targetIdx
                    ? { ...item, bundleSize: 1, bundleSets: newTotalUnits, discountPct, bundleTotal: unitPrice }
                    : item
            );
        });
    }

    function clearCart() {
        setCartItems([]);
    }

    // Unique key for cart items (product id + bundle size)
    function getCartKey(item) {
        return `${item.id}_${item.bundleSize || 1}`;
    }

    // Total = sum of (bundleTotal × bundleSets) for each item
    const cartTotal = cartItems.reduce((total, item) => {
        const itemTotal = (item.bundleTotal || item.price * (item.bundleSize || 1)) * (item.bundleSets || 1);
        return total + itemTotal;
    }, 0);

    // Count = sum of (bundleSize × bundleSets) for each item
    const cartCount = cartItems.reduce((count, item) => {
        return count + (item.bundleSize || 1) * (item.bundleSets || 1);
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateBundleSets,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            cartCount,
            getCartKey
        }}>
            {children}
        </CartContext.Provider>
    );
}
