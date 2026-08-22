import { describe, it, expect } from 'vitest';
import {
    calculateSellingPrice,
    calculateCompareAtPrice,
    calculateBundlePrice,
    formatUSD,
    formatBs
} from '../utils/pricingCalculations';

describe('Pricing Calculations (Deterministic Harness)', () => {
    describe('calculateSellingPrice', () => {
        it('calculates cost + shipping ($8) + profit ($6) rounded up (ceil)', () => {
            // Cost 10 + 8 shipping + 6 profit = 24
            expect(calculateSellingPrice(10, 0, 8, 6)).toBe(24);

            // Cost 10.40 + 8 + 6 = 24.40 -> ceil = 25
            expect(calculateSellingPrice(10.40, 0, 8, 6)).toBe(25);
        });

        it('respects suggested minimum price when suggested > raw cost', () => {
            // Raw: 5 + 8 + 6 = 19, but suggested is 25 -> 25
            expect(calculateSellingPrice(5, 25, 8, 6)).toBe(25);

            // Suggested with decimal: 24.10 -> ceil = 25
            expect(calculateSellingPrice(5, 24.10, 8, 6)).toBe(25);
        });

        it('handles custom business settings from admin panel', () => {
            // Cost 15 + custom shipping 10 + custom profit 12 = 37
            expect(calculateSellingPrice(15, 0, 10, 12)).toBe(37);
        });

        it('returns 0 for empty/zero inputs', () => {
            expect(calculateSellingPrice(0, 0, 8, 6)).toBe(0);
            expect(calculateSellingPrice('', '', 8, 6)).toBe(0);
        });
    });

    describe('calculateCompareAtPrice', () => {
        it('formats anchor price with 1.4x markup ending in .90', () => {
            // $25 * 1.4 = 35 -> "35.90"
            expect(calculateCompareAtPrice(25)).toBe('35.90');

            // $40 * 1.4 = 56 -> "56.90"
            expect(calculateCompareAtPrice(40)).toBe('56.90');
        });

        it('returns empty string for zero/invalid price', () => {
            expect(calculateCompareAtPrice(0)).toBe('');
            expect(calculateCompareAtPrice(-5)).toBe('');
        });
    });

    describe('calculateBundlePrice', () => {
        const basePrice = 30;

        it('returns base price for 1 unit (0% discount)', () => {
            expect(calculateBundlePrice(basePrice, 1, 'discount', 10, 20)).toBe(30);
        });

        it('applies 10% discount for 2 units in discount mode', () => {
            // 30 * 2 * 0.90 = 54
            expect(calculateBundlePrice(basePrice, 2, 'discount', 10, 20)).toBe(54);
        });

        it('applies 20% discount for 3 units in discount mode', () => {
            // 30 * 3 * 0.80 = 72
            expect(calculateBundlePrice(basePrice, 3, 'discount', 10, 20)).toBe(72);
        });

        it('calculates 3x2 (Buy 2 Get 1 Free) in quantity mode', () => {
            // 3 units in quantity mode: pay for 2 -> 30 * 2 = 60
            expect(calculateBundlePrice(basePrice, 3, 'quantity')).toBe(60);

            // 6 units in quantity mode: pay for 4 -> 30 * 4 = 120
            expect(calculateBundlePrice(basePrice, 6, 'quantity')).toBe(120);

            // 2 units in quantity mode: pay for 2 -> 30 * 2 = 60
            expect(calculateBundlePrice(basePrice, 2, 'quantity')).toBe(60);
        });
    });

    describe('Currency Formatters', () => {
        it('formats USD without decimal for integer amounts, with 2 decimals for floats', () => {
            expect(formatUSD(25)).toBe('$25');
            expect(formatUSD(25.5)).toBe('$25.50');
            expect(formatUSD(0)).toBe('$0');
        });

        it('formats Venezuelan Bolivars with BCV exchange rate', () => {
            const exchangeRate = 70.50;
            // $10 * 70.50 = Bs 705,00
            expect(formatBs(10, exchangeRate)).toContain('705,00');
            expect(formatBs(0, exchangeRate)).toBe('');
            expect(formatBs(10, 0)).toBe('');
        });
    });
});
