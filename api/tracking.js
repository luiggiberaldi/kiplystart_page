/**
 * Serverless Tracking Proxy for DroPanas API v1 & Supabase
 * Handles CORS, user-agent requirements, and query normalization (DP28377 -> 28377)
 */

export default async function handler(req, res) {
    // Set CORS headers
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
            message: 'Por favor ingresa un número de guía (ej: DP28377), número de orden o teléfono.'
        });
    }

    const apiKey = process.env.VITE_DROPANAS_API_KEY || 'live_sk_Dl4mpE5EWTDInFSoTd2nJ8cfwR8rPwbcvbkowUxGzWdktPr42Vxu';

    try {
        // 1. If query starts with DP or dp, extract numeric ID (e.g. DP28377 -> 28377)
        let numericId = rawQuery.replace(/^[dD][pP]-?/, '').trim();
        let isNumeric = /^\d+$/.test(numericId);

        let trackingData = null;

        if (isNumeric) {
            // Fetch directly from DroPanas /api/v1/ordenes/{numericId}/tracking
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

        // 2. If not found yet, query DroPanas /api/v1/ordenes list to find matching guide or phone
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
                    const guide = (o.tracking?.numero_guia || `DP${o.id}`).toLowerCase();
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

        return res.status(404).json({
            success: false,
            message: `No se encontró información de tracking para '${rawQuery}'. Verifica tu número de guía (ej: DP28377) o teléfono.`
        });

    } catch (error) {
        console.error('Tracking Handler Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor de rastreo. Intenta de nuevo en unos minutos.'
        });
    }
}
