/**
 * DroPanas API Client v1
 * @description
 * Integración oficial con la API REST de DroPanas para automatización de órdenes,
 * consulta de inventario por bodega, rastreo de envíos en tiempo real y gestión de novedades.
 */

const DROPANAS_BASE_URL = 'https://app.dropanas.com/api/v1';
const DROPANAS_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DROPANAS_API_KEY) 
    || (typeof process !== 'undefined' && process.env?.VITE_DROPANAS_API_KEY) 
    || 'live_sk_Dl4mpE5EWTDInFSoTd2nJ8cfwR8rPwbcvbkowUxGzWdktPr42Vxu';

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
 * Normaliza nombres de productos para cruces y comparaciones precisas
 */
export function normalizeProductName(name) {
    if (!name) return '';
    let n = String(name).toLowerCase().trim();
    // Eliminar emojis y caracteres especiales
    n = n.replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    // Eliminar sufijos a partir de '|'
    n = n.replace(/\|.*$/g, '');
    // Eliminar ciudades comunes
    const cities = ['valencia', 'maracay', 'barquisimeto', 'maracaibo', 'caracas', 'megabodega'];
    for (const city of cities) {
        n = n.replace(new RegExp(`\\b${city}\\b`, 'gi'), '');
    }
    // Limpiar guiones y espacios extras
    n = n.replace(/[\s\-_]+/g, ' ').trim();
    return n;
}

/**
 * Resuelve y formatea URL de imagen desde DroPanas
 */
export function formatDroPanasImageUrl(rawImage) {
    if (!rawImage) return null;
    if (typeof rawImage === 'object' && rawImage.url) {
        return formatDroPanasImageUrl(rawImage.url);
    }
    const str = String(rawImage).trim();
    if (str.startsWith('http://') || str.startsWith('https://')) {
        return str;
    }
    if (str.startsWith('storage/')) {
        return `https://app.dropanas.com/${str}`;
    }
    if (str.startsWith('/storage/')) {
        return `https://app.dropanas.com${str}`;
    }
    return `https://app.dropanas.com/storage/images/${str}`;
}

/**
 * ⚡ Descarga todo el catálogo completo de DroPanas en lotes con reporte de progreso
 * @param {Object} options { onProgress: ({ current, total, percentage, message }) => void }
 */
export async function fetchAllDroPanasCatalog(options = {}) {
    const { onProgress } = options;
    const allProducts = [];

    if (onProgress) onProgress({ current: 0, total: 100, percentage: 5, message: 'Iniciando conexión con DroPanas...' });

    // 1. Fetch first page with per_page=100
    const firstPageRes = await apiRequest('/productos?per_page=100&page=1');
    if (!firstPageRes.success || !firstPageRes.data) {
        throw new Error(firstPageRes.message || 'No se pudo obtener el catálogo de DroPanas');
    }

    const firstPageData = firstPageRes.data;
    const initialItems = firstPageData.data || [];
    allProducts.push(...initialItems);

    const lastPage = firstPageData.meta?.last_page || 1;
    const totalItems = firstPageData.meta?.total || initialItems.length;

    if (onProgress) {
        const pct = Math.round((1 / lastPage) * 100);
        onProgress({ 
            current: 1, 
            total: lastPage, 
            percentage: pct, 
            message: `Descargados ${allProducts.length} de ${totalItems} productos (Página 1 de ${lastPage})...` 
        });
    }

    // 2. Fetch remaining pages
    if (lastPage > 1) {
        for (let p = 2; p <= lastPage; p++) {
            const pageRes = await apiRequest(`/productos?per_page=100&page=${p}`);
            if (pageRes.success && pageRes.data?.data) {
                allProducts.push(...pageRes.data.data);
            }
            if (onProgress) {
                const pct = Math.round((p / lastPage) * 100);
                onProgress({ 
                    current: p, 
                    total: lastPage, 
                    percentage: pct, 
                    message: `Descargados ${allProducts.length} de ${totalItems} productos (Página ${p} de ${lastPage})...` 
                });
            }
        }
    }

    return allProducts;
}

/**
 * 🧠 Compara catálogo en vivo de DroPanas contra los productos existentes en Supabase
 * @param {Array} droProducts Productos desde la API de DroPanas
 * @param {Array} kiplyProducts Productos desde la base de datos de Supabase
 * @param {Object} pricingSettings { shippingCost: 8, profitMargin: 6, markup: 1.4 }
 */
export function compareDroPanasWithSupabase(droProducts = [], kiplyProducts = [], pricingSettings = {}) {
    const shipping = parseFloat(pricingSettings.shippingCost ?? 8);
    const profit = parseFloat(pricingSettings.profitMargin ?? 6);
    const markup = parseFloat(pricingSettings.markup ?? 1.4);

    const calculatePrice = (cost, suggested = 0) => {
        const c = parseFloat(cost) || 0;
        const s = parseFloat(suggested) || 0;
        if (c === 0 && s === 0) return 0;
        const raw = c + shipping + profit;
        return Math.ceil(Math.max(raw, s));
    };

    const calculateCompareAt = (price) => {
        const p = parseFloat(price) || 0;
        if (p <= 0) return '';
        return `${Math.floor(p * markup)}.90`;
    };

    // Pre-procesar productos locales
    const localMapByDroId = new Map();
    const localMapByNormName = new Map();

    kiplyProducts.forEach(k => {
        const norm = normalizeProductName(k.name);
        if (norm) localMapByNormName.set(norm, k);

        // Extraer dropanas id de la URL si existe (ej. product/21035 o product/353)
        if (k.dropanas_url) {
            const match = k.dropanas_url.match(/product\/(\d+)/i);
            if (match) {
                localMapByDroId.set(match[1], k);
            }
        }
    });

    const nuevos = [];
    const precios_desactualizados = [];
    const stock_desactualizados = [];
    const sincronizados = [];
    const matchedKiplyIds = new Set();

    // Recorrer productos de DroPanas
    droProducts.forEach(dp => {
        const dpId = String(dp.id);
        const dpName = dp.nombre || '';
        const normDpName = normalizeProductName(dpName);
        const dpCost = parseFloat(dp.precio_costo_usd || dp.precio_usd || 0);
        const dpSuggested = parseFloat(dp.precio_sugerido_usd || 0);
        const dpStock = parseInt(dp.stock_fisico_total ?? dp.stock_distribuido ?? dp.stock ?? 0, 10);

        // Galería de imágenes formateada
        const images = [];
        if (dp.imagen) {
            const mainImg = formatDroPanasImageUrl(dp.imagen);
            if (mainImg) images.push(mainImg);
        }
        if (Array.isArray(dp.galeria)) {
            dp.galeria.forEach(g => {
                const img = formatDroPanasImageUrl(g.url || g);
                if (img && !images.includes(img)) images.push(img);
            });
        }

        // Buscar coincidencia en KiplyStart
        let match = localMapByDroId.get(dpId);
        if (!match && normDpName) {
            match = localMapByNormName.get(normDpName);
            if (!match) {
                // Fuzzy fallback: check if one contains the other
                for (const [normK, kProd] of localMapByNormName.entries()) {
                    if (normDpName.length >= 6 && normK.length >= 6 && (normDpName.includes(normK) || normK.includes(normDpName))) {
                        match = kProd;
                        break;
                    }
                }
            }
        }

        const idealSellingPrice = calculatePrice(dpCost, dpSuggested);
        const idealCompareAt = calculateCompareAt(idealSellingPrice);

        if (match) {
            matchedKiplyIds.add(match.id);
            const localPrice = parseFloat(match.price || 0);
            const localStock = parseInt(match.stock || 0, 10);

            // Verificar si el precio difiere
            const priceDiff = Math.abs(localPrice - idealSellingPrice) >= 1;
            if (priceDiff && idealSellingPrice > 0) {
                precios_desactualizados.push({
                    id: match.id,
                    name: match.name,
                    name_dropanas: dpName,
                    precio_actual: localPrice,
                    precio_proveedor: dpCost,
                    precio_sugerido: dpSuggested,
                    precio_kiplystart_ideal: idealSellingPrice,
                    compare_at_ideal: idealCompareAt,
                    ganancia_estimada: idealSellingPrice - (dpCost + shipping)
                });
            }

            // Verificar si el stock difiere
            if (localStock !== dpStock) {
                stock_desactualizados.push({
                    id: match.id,
                    name: match.name,
                    name_dropanas: dpName,
                    stock_actual: localStock,
                    stock_dropanas: dpStock
                });
            }

            if (!priceDiff && localStock === dpStock && match.is_active) {
                sincronizados.push({
                    id: match.id,
                    name: match.name,
                    price: match.price,
                    stock: match.stock,
                    is_active: match.is_active,
                    category: match.category
                });
            }
        } else {
            // Producto nuevo en DroPanas
            // Solo considerar si tiene stock > 0 y tiene al menos 1 imagen
            if (dpStock > 0 && images.length > 0 && idealSellingPrice > 0) {
                nuevos.push({
                    dropanas_id: dp.id,
                    name: dpName,
                    description: dp.descripcion || dp.descripcion_corta || '<p>Producto de alta calidad disponible con despacho inmediato.</p>',
                    precio_proveedor: dpCost,
                    precio_sugerido: dpSuggested,
                    precio_venta_ideal: idealSellingPrice,
                    compare_at_ideal: idealCompareAt,
                    ganancia_estimada: idealSellingPrice - (dpCost + shipping),
                    stock: dpStock,
                    images: images,
                    url: `https://dropanas.com/details/product/${dp.id}`,
                    peso: dp.peso || null
                });
            }
        }
    });

    // Detectar productos que están activos en KiplyStart pero ya NO están en DroPanas o su stock es 0
    const eliminados = [];
    kiplyProducts.forEach(k => {
        if (k.is_active && !matchedKiplyIds.has(k.id)) {
            eliminados.push({
                id: k.id,
                name: k.name,
                price: k.price,
                stock: k.stock || 0,
                category: k.category,
                motivo: 'Agotado o removido de DroPanas'
            });
        }
    });

    return {
        timestamp: new Date().toISOString(),
        total_dropanas: droProducts.length,
        total_kiplystart: kiplyProducts.length,
        nuevos,
        eliminados,
        precios_desactualizados,
        stock_desactualizados,
        sincronizados
    };
}

/**
 * Mapa oficial de State ID y City ID para envíos en DroPanas
 */
const DROPANAS_LOCATION_MAP = {
    'distrito capital': { state_id: 24, default_city_id: 149, cities: { 'caracas': 149, 'el junquito': 150 } },
    'miranda': { state_id: 14, default_city_id: 279, cities: { 'los teques': 279, 'guatire': 276, 'guarenas': 275, 'san antonio de los altos': 284, 'charallave': 266, 'higuerote': 277 } },
    'la guaira': { state_id: 21, default_city_id: 524, cities: { 'maiquetía': 524, 'maiquetia': 524, 'la guaira': 524, 'catia la mar': 524, 'caraballeda': 524 } },
    'carabobo': { state_id: 7, default_city_id: 127, cities: { 'valencia': 127, 'guacara': 114, 'naguanagua': 127, 'san diego': 127, 'tocuyito': 127, 'los guayos': 114 } },
    'aragua': { state_id: 4, default_city_id: 64, cities: { 'maracay': 64, 'cagua': 55, 'turmero': 72, 'la victoria': 61, 'el limón': 64, 'el limon': 64, 'las delicias': 64 } },
    'lara': { state_id: 12, default_city_id: 212, cities: { 'barquisimeto': 212, 'cabudare': 214, 'carora': 215 } },
    'zulia': { state_id: 23, default_city_id: 487, cities: { 'maracaibo': 487, 'san francisco': 487, 'cabimas': 463, 'ciudad ojeda': 470, 'santa bárbara': 317 } },
    'yaracuy': { state_id: 22, default_city_id: 456, cities: { 'san felipe': 456, 'cocorote': 456 } },
    'anzoátegui': { state_id: 2, default_city_id: 20, cities: { 'puerto la cruz': 20, 'lechería': 16, 'lecheria': 16, 'el tigre': 12, 'anaco': 4 } },
    'anzoategui': { state_id: 2, default_city_id: 20, cities: { 'puerto la cruz': 20, 'lechería': 16, 'lecheria': 16, 'el tigre': 12, 'anaco': 4 } },
    'bolívar': { state_id: 6, default_city_id: 100, cities: { 'puerto ordaz': 100, 'ciudad bolívar': 89, 'ciudad bolivar': 89, 'san félix': 101, 'san felix': 101 } },
    'bolivar': { state_id: 6, default_city_id: 100, cities: { 'puerto ordaz': 100, 'ciudad bolívar': 89, 'ciudad bolivar': 89, 'san félix': 101, 'san felix': 101 } }
};

function resolveStateId(stateName) {
    if (!stateName) return 24; // Default Distrito Capital
    const norm = stateName.toLowerCase().trim();
    return DROPANAS_LOCATION_MAP[norm]?.state_id || 24;
}

function resolveCityId(stateName, cityName) {
    if (!stateName) return 149; // Default Caracas
    const normState = stateName.toLowerCase().trim();
    const stateObj = DROPANAS_LOCATION_MAP[normState];
    if (!stateObj) return 149;
    if (!cityName) return stateObj.default_city_id;
    const normCity = cityName.toLowerCase().trim();
    return stateObj.cities[normCity] || stateObj.default_city_id;
}

/**
 * 📦 1. Crea una orden de despacho en DroPanas
 * @param {Object} orderData Datos del pedido (cliente, dirección, productos, total)
 */
export async function createDroPanasOrder(orderData) {
    // Separate full name into first name and last name
    const rawName = (orderData.customerName || orderData.user_name || '').trim();
    const nameParts = rawName.split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'KiplyStart';

    // Location mapping
    const stateName = (orderData.state || orderData.delivery_state || '').trim();
    const cityName = (orderData.city || orderData.delivery_city || '').trim();
    
    const stateId = orderData.state_id || resolveStateId(stateName);
    const cityId = orderData.city_id || resolveCityId(stateName, cityName);

    const payload = {
        tipo_entrega: orderData.tipo_entrega || 'domicilio',
        cliente: {
            nombre: firstName,
            apellido: lastName,
            telefono: orderData.customerPhone || orderData.user_phone || '',
            email: orderData.customerEmail || orderData.user_email || `${(orderData.customerPhone || 'cliente').replace(/\D/g, '')}@kiplystart.com`,
            documento: orderData.customerDocument || orderData.id_document || orderData.user_ci || null
        },
        direccion: {
            state_id: stateId,
            city_id: cityId,
            direccion: orderData.deliveryAddress || orderData.delivery_address || 'Dirección de entrega acordada',
            punto_referencia: orderData.notes || orderData.delivery_ref || orderData.delivery_notes || null
        },
        bodega_origen_id: orderData.bodega_origen_id || 1, // Default Megabodega Caracas (id: 1)
        productos: Array.isArray(orderData.items) ? orderData.items.map(item => ({
            producto_id: parseInt(item.dropanas_id || item.product_id || item.id, 10),
            variante_id: item.variante_id || undefined,
            cantidad: parseInt(item.quantity || 1, 10),
            precio_unitario: parseFloat(item.price || item.unit_price || 0)
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
    fetchAllDroPanasCatalog,
    compareDroPanasWithSupabase,
    normalizeProductName,
    formatDroPanasImageUrl,
    createDroPanasOrder,
    getOrderTracking,
    getDroPanasProducts,
    getWarehouses,
    quoteShipping,
    getLogisticsNovels,
    respondLogisticsNovel
};

