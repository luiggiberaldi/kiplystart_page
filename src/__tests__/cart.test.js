import { describe, it, expect } from 'vitest';
import {
    getCartKey,
    calculateItemTotal,
    calculateCartTotals,
    updateCartUnits
} from '../utils/cartCalculations';

describe('Cart Calculations (Deterministic Harness)', () => {
    const sampleItem1 = {
        id: 'prod-1',
        name: 'Reloj Cronógrafo',
        price: 35,
        bundleSize: 1,
        bundleSets: 1,
        bundleTotal: 35,
        discountPct: 0,
        bundleType: 'discount',
        bundle_2_discount: 10,
        bundle_3_discount: 20
    };

    const sampleItem2 = {
        id: 'prod-2',
        name: 'Pomo LED RGB',
        price: 25,
        bundleSize: 2,
        bundleSets: 1,
        bundleTotal: 45, // 25 * 2 * 0.9 = 45
        discountPct: 10,
        bundleType: 'discount',
        bundle_2_discount: 10,
        bundle_3_discount: 20
    };

    it('generates unique cart keys based on ID and bundle size', () => {
        expect(getCartKey(sampleItem1)).toBe('prod-1_1');
        expect(getCartKey(sampleItem2)).toBe('prod-2_2');
    });

    it('calculates individual line item total correctly', () => {
        // 1 set of 1 unit @ $35 = $35
        expect(calculateItemTotal(sampleItem1)).toBe(35);

        // 1 set of 2-pack @ $45 = $45
        expect(calculateItemTotal(sampleItem2)).toBe(45);

        // 2 sets of 2-pack @ $45 = $90
        expect(calculateItemTotal({ ...sampleItem2, bundleSets: 2 })).toBe(90);
    });

    it('calculates aggregate cart total and total unit count', () => {
        const items = [sampleItem1, sampleItem2];
        const { cartTotal, cartCount } = calculateCartTotals(items);

        // Total: 35 + 45 = 80
        expect(cartTotal).toBe(80);
        // Units: 1 + 2 = 3 units
        expect(cartCount).toBe(3);
    });

    it('updates units and recalculates tier discounts dynamically', () => {
        let items = [sampleItem1];

        // Increment to 2 units -> should apply 10% discount ($35 * 0.9 = 31.5 -> $32 unit price)
        items = updateCartUnits(items, 'prod-1_1', 2);
        expect(items[0].bundleSets).toBe(2);
        expect(items[0].discountPct).toBe(10);
        expect(items[0].bundleTotal).toBe(32); // Math.ceil(35 * 0.9)

        // Increment to 3 units -> should apply 20% discount ($35 * 0.8 = $28 unit price)
        items = updateCartUnits(items, 'prod-1_1', 3);
        expect(items[0].bundleSets).toBe(3);
        expect(items[0].discountPct).toBe(20);
        expect(items[0].bundleTotal).toBe(28);
    });

    it('merges duplicate entries when normalizing bundle packs', () => {
        const packItem = {
            ...sampleItem1,
            bundleSize: 2,
            bundleSets: 1,
            bundleTotal: 63
        };
        const singleItem = {
            ...sampleItem1,
            bundleSize: 1,
            bundleSets: 1,
            bundleTotal: 35
        };

        // When changing packItem units to 1, it should merge with singleItem (1 + 1 = 2 units total)
        const items = [packItem, singleItem];
        const updated = updateCartUnits(items, 'prod-1_2', 1);

        expect(updated.length).toBe(1);
        expect(updated[0].bundleSets).toBe(2);
        expect(updated[0].discountPct).toBe(10);
    });
});
