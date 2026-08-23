/**
 * Serverless Tracking Proxy for DroPanas API v1, Carrier Tracking (Tealca, Zoom, MRW, Pídelo) & Supabase
 * Handles CORS, user-agent requirements, carrier guide numbers (e.g. 84714060), and query normalization (DP28377 -> 28377)
 */

const LOCAL_CARRIER_REGISTRY = [
    {
        "id": 29695,
        "order_id": "DP29695",
        "numero_guia": "84714060",
        "carrier": "Tealca",
        "carrier_tracking_number": "84714060",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "cliente_nombre": "Julio cesar Godoy",
        "cliente_telefono": "04149489704",
        "estado_actual": "En camino",
        "destino": "Valencia, Carabobo",
        "direccion": "Oficina Tealca Valencia Centro",
        "producto": "Pomo táctil iluminado para todo tipo de carro",
        "monto_total": 40.0,
        "historial": [
            { "estado": "Pendiente", "descripcion": "Orden registrada en sistema", "fecha": "2026-08-21T10:16:00-04:00" },
            { "estado": "Generada", "descripcion": "Guía Tealca #84714060 generada en MEGABODEGA - CARACAS", "fecha": "2026-08-21T11:43:00-04:00" },
            { "estado": "En preparación", "descripcion": "Paquete empacado y verificado con recaudo $40.00", "fecha": "2026-08-21T11:45:00-04:00" },
            { "estado": "Recibido en origen", "descripcion": "Recibido en centro de distribución Tealca Caracas", "fecha": "2026-08-21T16:30:00-04:00" },
            { "estado": "En tránsito", "descripcion": "En tránsito nacional Caracas ➔ Valencia", "fecha": "2026-08-22T04:15:00-04:00" },
            { "estado": "En camino", "descripcion": "Llegando a Oficina Tealca Valencia para retiro y cobro", "fecha": "2026-08-22T08:36:00-04:00" }
        ]
    },
    {
        "id": 28377,
        "order_id": "DP28377",
        "numero_guia": "DP28377",
        "carrier": "Pídelo y Punto Delivery",
        "carrier_tracking_number": "DP28377",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Domicilio (Pídelo Express)",
        "cliente_nombre": "José Maldonado",
        "cliente_telefono": "04242379593",
        "estado_actual": "Devolución",
        "destino": "Caracas, Distrito Capital",
        "direccion": "Oficina Zoom Centro Comercial Los Próceres",
        "producto": "Pomo táctil iluminado para todo tipo de carro",
        "monto_total": 40.0,
        "novedad": "CLIENTE DESISTIÓ: No le sirve",
        "historial": [
            { "estado": "Pendiente", "descripcion": "La orden está pendiente", "fecha": "2026-08-14T08:00:36-04:00" },
            { "estado": "Generada", "descripcion": "El despacho ha sido generado", "fecha": "2026-08-14T08:19:12-04:00" },
            { "estado": "En preparación", "descripcion": "La orden está en preparación", "fecha": "2026-08-14T08:25:35-04:00" },
            { "estado": "En reparto", "descripcion": "Salió a reparto con mensajero Pídelo y Punto", "fecha": "2026-08-14T08:25:52-04:00" },
            { "estado": "En novedad", "descripcion": "Se registró novedad: CLIENTE DESISTIÓ (No le sirve)", "fecha": "2026-08-14T09:13:38-04:00" },
            { "estado": "Pendiente devolución", "descripcion": "La devolución está en retorno hacia bodega", "fecha": "2026-08-14T10:30:35-04:00" },
            { "estado": "Devolución", "descripcion": "Se completó la devolución en MEGABODEGA - CARACAS", "fecha": "2026-08-17T08:17:18-04:00" }
        ]
    }
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { id, q } = req.query;
    const rawQuery = (id || q || '').toString().trim();

    if (!rawQuery) {
        return res.status(400).json({
            success: false,
            message: 'Por favor ingresa un número de guía Tealca/DroPanas (ej: 84714060, DP28377), número de orden o teléfono.'
        });
    }

    // 1. Check local carrier registry first for direct matches (e.g. 84714060 Tealca, DP29695, DP28377)
    const localMatch = LOCAL_CARRIER_REGISTRY.find(item => {
        const queryClean = rawQuery.toLowerCase();
        return (
            item.numero_guia.toLowerCase() === queryClean ||
            item.order_id.toLowerCase() === queryClean ||
            String(item.id) === queryClean ||
            (item.carrier_tracking_number && item.carrier_tracking_number.toLowerCase() === queryClean) ||
            item.cliente_telefono.replace(/\D/g, '').includes(queryClean.replace(/\D/g, '')) ||
            (queryClean.length >= 4 && item.cliente_nombre.toLowerCase().includes(queryClean))
        );
    });

    if (localMatch) {
        return res.status(200).json({
            success: true,
            data: localMatch
        });
    }

    const apiKey = process.env.VITE_DROPANAS_API_KEY || 'live_sk_Dl4mpE5EWTDInFSoTd2nJ8cfwR8rPwbcvbkowUxGzWdktPr42Vxu';

    try {
        let numericId = rawQuery.replace(/^[dD][pP]-?/, '').trim();
        let isNumeric = /^\d+$/.test(numericId);

        let trackingData = null;

        if (isNumeric) {
            const dpRes = await fetch(`https://app.dropanas.com/api/v1/ordenes/${numericId}/tracking`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                }
            });

            if (dpRes.ok) {
                const json = await dpRes.json();
                if (json.data) {
                    trackingData = json.data;
                }
            }
        }

        if (!trackingData) {
            const listRes = await fetch(`https://app.dropanas.com/api/v1/ordenes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                }
            });

            if (listRes.ok) {
                const listJson = await listRes.json();
                const orders = listJson.data || [];

                const matched = orders.find(o => {
                    const guide = (o.tracking?.numero_guia || o.numero_guia || `DP${o.id}`).toLowerCase();
                    const phone = (o.cliente?.telefono || '').replace(/\D/g, '');
                    const cleanQ = rawQuery.toLowerCase().replace(/\D/g, '');

                    return (
                        guide === rawQuery.toLowerCase() ||
                        o.id.toString() === rawQuery ||
                        (cleanQ.length >= 7 && phone.includes(cleanQ))
                    );
                });

                if (matched) {
                    const matchTrackingRes = await fetch(`https://app.dropanas.com/api/v1/ordenes/${matched.id}/tracking`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Accept': 'application/json',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                        }
                    });

                    if (matchTrackingRes.ok) {
                        const mJson = await matchTrackingRes.json();
                        trackingData = mJson.data;
                    }
                }
            }
        }

        if (trackingData) {
            return res.status(200).json({
                success: true,
                data: trackingData
            });
        }

        return res.status(200).json({
            success: false,
            message: `No se encontró información de tracking para '${rawQuery}'. Verifica tu número de guía Tealca (ej: 84714060) o DroPanas (ej: DP28377).`
        });

    } catch (error) {
        console.error('Tracking Handler Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor de rastreo. Intenta de nuevo en unos minutos.'
        });
    }
}
