import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createDroPanasOrder,
    getOrderTracking,
    getDroPanasProducts,
    getWarehouses,
    quoteShipping,
    getLogisticsNovels
} from '../lib/dropanasApi';

describe('DroPanas API Client Tests', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('creates an order payload correctly for DroPanas API', async () => {
        const mockOrder = {
            orderId: 'KS-20260822-1234',
            customerName: 'Juan Perez',
            customerPhone: '04141234567',
            customerDocument: 'V-12345678',
            deliveryAddress: 'Av Bolivar edif 4 apt 2',
            city: 'Valencia',
            state: 'Carabobo',
            notes: 'Frente a la panaderia',
            totalAmount: 35.0,
            items: [
                { id: 101, name: 'Masajeador de Pies', quantity: 1, price: 35.0 }
            ]
        };

        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({ id: 'dp_order_999', status: 'created', tracking: 'TRK-999' })
        });

        const res = await createDroPanasOrder(mockOrder);

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const [calledUrl, options] = fetchSpy.mock.calls[0];
        expect(calledUrl).toBe('https://app.dropanas.com/api/v1/ordenes');
        expect(options.method).toBe('POST');

        const body = JSON.parse(options.body);
        expect(body.cliente_nombre).toBe('Juan Perez');
        expect(body.monto_total).toBe(35.0);
        expect(body.metodo_pago).toBe('COD');
        expect(body.productos.length).toBe(1);
        expect(body.productos[0].id).toBe(101);

        expect(res.success).toBe(true);
        expect(res.data.id).toBe('dp_order_999');
    });

    it('queries tracking status correctly', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: true, data: { estado: 'En Reparto', guia: 'DP-7788', ciudad: 'Caracas' } })
        });

        const res = await getOrderTracking('DP28377');
        expect(res.success).toBe(true);
        expect(res.data.estado).toBe('En Reparto');
        expect(fetchSpy).toHaveBeenCalledWith(
            '/api/tracking?id=DP28377'
        );
    });

    it('handles empty tracking lookup without network call', async () => {
        const res = await getOrderTracking('');
        expect(res.success).toBe(false);
        expect(res.message).toContain('Se requiere un ID');
    });

    it('fetches products and bodegas lists', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => [{ id: 1, name: 'Bodega Central Caracas' }]
        });

        const res = await getWarehouses();
        expect(res.success).toBe(true);
        expect(res.data.length).toBe(1);
    });
});
