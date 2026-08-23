/**
 * DroPanas API Client v1
 * @description
 * Integración oficial con la API REST de DroPanas para automatización de órdenes,
 * consulta de inventario por bodega, rastreo de envíos en tiempo real y gestión de novedades.
 */

const DROPANAS_BASE_URL = 'https://app.dropanas.com/api/v1';
const DROPANAS_API_KEY = import.meta.env.VITE_DROPANAS_API_KEY || 'live_sk_Dl4mpE5EWTDInFSoTd2nJ8cfwR8rPwbcvbkowUxGzWdktPr42Vxu';

/**
 * Realiza una petición autenticada a la API de DroPanas
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${DROPANAS_BASE_URL}${endpoint}`;
    const headers = {
        'Authorization': `Bearer ${DROPANAS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                status: response.status,
                message: errorData.message || `Error ${response.status}: ${response.statusText}`,
                errors: errorData.errors || null
            };
        }

        const data = await response.json().catch(() => ({}));
        return {
            success: true,
            status: response.status,
            data
        };
    } catch (error) {
        console.error(`DroPanas API Request Error [${endpoint}]:`, error);
        return {
            success: false,
            status: 0,
            message: error.message || 'Error de conexión con DroPanas API',
            errors: null
        };
    }
}

/**
 * 📦 1. Crea una orden de despacho en DroPanas
 * @param {Object} orderData Datos del pedido (cliente, dirección, productos, total)
 */
export async function createDroPanasOrder(orderData) {
    const payload = {
        cliente_nombre: orderData.customerName || orderData.user_name,
        cliente_telefono: orderData.customerPhone || orderData.user_phone,
        cliente_documento: orderData.customerDocument || orderData.id_document || '',
        direccion: orderData.deliveryAddress || orderData.delivery_address,
        estado: orderData.state || orderData.delivery_state || '',
        ciudad: orderData.city || orderData.delivery_city || '',
        notas: orderData.notes || orderData.delivery_notes || '',
        metodo_pago: 'COD', // Pago Contra Entrega
        monto_total: parseFloat(orderData.totalAmount || orderData.total_price || 0),
        referencia_interna: orderData.orderId || orderData.order_number || '',
        productos: Array.isArray(orderData.items) ? orderData.items.map(item => ({
            id: item.dropanas_id || item.product_id || item.id,
            nombre: item.name || item.product_name,
            cantidad: parseInt(item.quantity || 1, 10),
            precio_unitario: parseFloat(item.price || 0)
        })) : []
    };

    return await apiRequest('/ordenes', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

/**
 * 📍 2. Consulta el estado de rastreo (Tracking) de una orden
 * @param {string|number} orderId ID o referencia de la orden (ej: DP28377, 28377, KS-...)
 */
export async function getOrderTracking(orderId) {
    if (!orderId) {
        return { success: false, message: 'Se requiere un ID de orden o número de tracking' };
    }

    const cleanQuery = orderId.toString().trim();

    // 1. Try Vercel Serverless Tracking Proxy
    try {
        const proxyRes = await fetch(`/api/tracking?id=${encodeURIComponent(cleanQuery)}`);
        if (proxyRes.ok) {
            const proxyData = await proxyRes.json();
            if (proxyData.success && proxyData.data) {
                return { success: true, data: proxyData.data };
            }
        }
    } catch {
        // Fallback to direct client API request
    }

    // 2. Direct fallback (extract numeric ID if starts with DP)
    const numericId = cleanQuery.replace(/^[dD][pP]-?/, '').trim();
    const lookupTarget = /^\d+$/.test(numericId) ? numericId : cleanQuery;

    return await apiRequest(`/ordenes/${encodeURIComponent(lookupTarget)}/tracking`, {
        method: 'GET'
    });
}

/**
 * 🏪 3. Obtiene la lista de productos e inventario disponible en bodegas
 * @param {Object} params Parámetros de búsqueda / paginación
 */
export async function getDroPanasProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/productos?${query}` : '/productos';
    return await apiRequest(endpoint, {
        method: 'GET'
    });
}

/**
 * 🏬 4. Obtiene las bodegas asignadas
 */
export async function getWarehouses() {
    return await apiRequest('/bodegas', {
        method: 'GET'
    });
}

/**
 * 🚚 5. Cotiza el costo de un envío por destino
 * @param {string} state Estado de Venezuela
 * @param {string} city Ciudad de destino
 */
export async function quoteShipping(state, city) {
    const query = new URLSearchParams({ estado: state, ciudad: city }).toString();
    return await apiRequest(`/cotizar-envio?${query}`, {
        method: 'GET'
    });
}

/**
 * ⚠️ 6. Lista las novedades e incidencias de entrega
 */
export async function getLogisticsNovels() {
    return await apiRequest('/novedades', {
        method: 'GET'
    });
}

/**
 * ✍️ 7. Responde a una novedad de entrega
 * @param {string|number} novelId ID de la novedad
 * @param {string} responseText Instrucciones o aclaratoria para el repartidor
 */
export async function respondLogisticsNovel(novelId, responseText) {
    return await apiRequest(`/novedades/${encodeURIComponent(novelId)}/responder`, {
        method: 'POST',
        body: JSON.stringify({ respuesta: responseText })
    });
}

export default {
    createDroPanasOrder,
    getOrderTracking,
    getDroPanasProducts,
    getWarehouses,
    quoteShipping,
    getLogisticsNovels,
    respondLogisticsNovel
};
