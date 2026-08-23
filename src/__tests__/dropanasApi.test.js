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
        expect(body.cliente.nombre).toBe('Juan');
        expect(body.cliente.apellido).toBe('Perez');
        expect(body.cliente.telefono).toBe('04141234567');
        expect(body.direccion.state_id).toBe(7); // Carabobo
        expect(body.direccion.city_id).toBe(127); // Valencia
        expect(body.productos.length).toBe(1);
        expect(body.productos[0].producto_id).toBe(101);

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

    it('normalizes product names correctly', async () => {
        const { normalizeProductName } = await import('../lib/dropanasApi');
        const raw = '⚡ Pomo táctil iluminado para todo tipo de carro | Nuevo Pro — Performance Valencia';
        expect(normalizeProductName(raw)).toBe('pomo táctil iluminado para todo tipo de carro');
    });

    it('formats DroPanas image URLs correctly', async () => {
        const { formatDroPanasImageUrl } = await import('../lib/dropanasApi');
        expect(formatDroPanasImageUrl('storage/images/sample.jpg')).toBe('https://app.dropanas.com/storage/images/sample.jpg');
        expect(formatDroPanasImageUrl('sample.png')).toBe('https://app.dropanas.com/storage/images/sample.png');
        expect(formatDroPanasImageUrl('https://cdn.example.com/pic.jpg')).toBe('https://cdn.example.com/pic.jpg');
    });

    it('classifies new, out-of-stock, price outdated, and synchronized products accurately', async () => {
        const { compareDroPanasWithSupabase } = await import('../lib/dropanasApi');
        const droProducts = [
            {
                id: 101,
                nombre: 'Nuevo Difusor LED',
                descripcion: 'Difusor de aromas',
                precio_costo_usd: '10',
                precio_sugerido_usd: '25',
                stock_fisico_total: 50,
                imagen: 'diffuser.jpg',
                galeria: []
            },
            {
                id: 102,
                nombre: 'Cable Carga Rápida 4 en 1',
                descripcion: 'Cable usb',
                precio_costo_usd: '5',
                precio_sugerido_usd: '15',
                stock_fisico_total: 100,
                imagen: 'cable.jpg',
                galeria: []
            },
            {
                id: 103,
                nombre: 'Reloj Curren 8274',
                descripcion: 'Reloj de lujo',
                precio_costo_usd: '20',
                precio_sugerido_usd: '40',
                stock_fisico_total: 10,
                imagen: 'watch.jpg',
                galeria: []
            }
        ];

        const supabaseProducts = [
            {
                id: 'k-1',
                name: 'Cable Carga Rápida 4 en 1 | Nuevo Pro — Performance',
                price: 19, // Calculated: 5 + 8 shipping + 6 profit = 19 -> In Sync
                compare_at_price: 26.90,
                stock: 100,
                is_active: true,
                dropanas_url: 'https://dropanas.com/details/product/102',
                category: 'Tecnología'
            },
            {
                id: 'k-2',
                name: 'Reloj Curren 8274 | Nuevo Elite',
                price: 25, // Outdated price (Ideal is max(20+8+6=34, 40) = 40)
                compare_at_price: 35.00,
                stock: 10,
                is_active: true,
                dropanas_url: 'https://dropanas.com/details/product/103',
                category: 'Relojes'
            },
            {
                id: 'k-3',
                name: 'Producto Descontinuado en DroPanas',
                price: 30,
                stock: 0,
                is_active: true, // Still active in KiplyStart, but missing in DroPanas -> should be flagged in eliminados
                dropanas_url: 'https://dropanas.com/details/product/999',
                category: 'Varios'
            }
        ];

        const result = compareDroPanasWithSupabase(droProducts, supabaseProducts, {
            shippingCost: 8,
            profitMargin: 6,
            markup: 1.4
        });

        // 1. Should detect 1 new product (Nuevo Difusor LED)
        expect(result.nuevos.length).toBe(1);
        expect(result.nuevos[0].dropanas_id).toBe(101);
        expect(result.nuevos[0].precio_venta_ideal).toBe(25); // max(10+8+6=24, 25) = 25

        // 2. Should detect 1 out-of-stock / discontinued product in Supabase
        expect(result.eliminados.length).toBe(1);
        expect(result.eliminados[0].id).toBe('k-3');

        // 3. Should detect 1 price discrepancy
        expect(result.precios_desactualizados.length).toBe(1);
        expect(result.precios_desactualizados[0].id).toBe('k-2');
        expect(result.precios_desactualizados[0].precio_kiplystart_ideal).toBe(40);

        // 4. Should detect 1 fully synced product
        expect(result.sincronizados.length).toBe(1);
        expect(result.sincronizados[0].id).toBe('k-1');
    });
});
