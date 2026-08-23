import { describe, it, expect } from 'vitest';
import {
    isValidVenezuelaPhone,
    formatWhatsAppPhone,
    isValidCI,
    isValidDeliveryZone,
    generateOrderId
} from '../utils/codValidation';

describe('COD Form & Venezuelan Validation Harness', () => {
    describe('isValidVenezuelaPhone', () => {
        it('validates 11-digit local mobile numbers (e.g. 04141234567)', () => {
            expect(isValidVenezuelaPhone('04141234567')).toBe(true);
            expect(isValidVenezuelaPhone('04241234567')).toBe(true);
            expect(isValidVenezuelaPhone('04121234567')).toBe(true);
            expect(isValidVenezuelaPhone('04161234567')).toBe(true);
        });

        it('validates numbers with hyphens, spaces or parentheses', () => {
            expect(isValidVenezuelaPhone('(0414) 123-4567')).toBe(true);
            expect(isValidVenezuelaPhone('0412 123 4567')).toBe(true);
        });

        it('validates 10-digit numbers without leading zero (4141234567)', () => {
            expect(isValidVenezuelaPhone('4141234567')).toBe(true);
        });

        it('validates international format (584141234567 or +584141234567)', () => {
            expect(isValidVenezuelaPhone('+584141234567')).toBe(true);
            expect(isValidVenezuelaPhone('584141234567')).toBe(true);
        });

        it('rejects too short or invalid numbers', () => {
            expect(isValidVenezuelaPhone('12345')).toBe(false);
            expect(isValidVenezuelaPhone('')).toBe(false);
            expect(isValidVenezuelaPhone(null)).toBe(false);
        });
    });

    describe('formatWhatsAppPhone', () => {
        it('formats any valid Venezuelan number to 584XXXXXXXXX', () => {
            expect(formatWhatsAppPhone('04141234567')).toBe('584141234567');
            expect(formatWhatsAppPhone('4141234567')).toBe('584141234567');
            expect(formatWhatsAppPhone('+584141234567')).toBe('584141234567');
            expect(formatWhatsAppPhone('584141234567')).toBe('584141234567');
        });
    });

    describe('isValidCI', () => {
        it('validates Venezuelan ID (Cédula de Identidad between 6 and 9 digits)', () => {
            expect(isValidCI('12345678')).toBe(true);
            expect(isValidCI('V-12345678')).toBe(true);
            expect(isValidCI('E-28123456')).toBe(true);
            expect(isValidCI('123456')).toBe(true);
        });

        it('rejects invalid CI strings', () => {
            expect(isValidCI('123')).toBe(false);
            expect(isValidCI('')).toBe(false);
            expect(isValidCI(null)).toBe(false);
        });
    });

    describe('isValidDeliveryZone', () => {
        it('validates correct state and city combinations', () => {
            expect(isValidDeliveryZone('Distrito Capital', 'Caracas')).toBe(true);
            expect(isValidDeliveryZone('Carabobo', 'Valencia')).toBe(true);
            expect(isValidDeliveryZone('Zulia', 'Maracaibo')).toBe(true);
            expect(isValidDeliveryZone('Miranda', 'Los Teques')).toBe(true);
        });

        it('rejects invalid city for a given state or non-existent zones', () => {
            expect(isValidDeliveryZone('Distrito Capital', 'Valencia')).toBe(false);
            expect(isValidDeliveryZone('Carabobo', 'Caracas')).toBe(false);
            expect(isValidDeliveryZone('NonExistentState', 'FakeCity')).toBe(false);
            expect(isValidDeliveryZone('', '')).toBe(false);
        });
    });

    describe('generateOrderId', () => {
        it('generates KS-YYYYMMDD-XXXX format deterministically with a given date & seed', () => {
            const fixedDate = new Date('2026-08-22T12:00:00Z');
            const orderId = generateOrderId(fixedDate, 5432);
            expect(orderId).toBe('KS-20260822-5432');
        });

        it('generates a 16-character string starting with KS-', () => {
            const orderId = generateOrderId();
            expect(orderId).toMatch(/^KS-\d{8}-\d{4}$/);
        });
    });
});
