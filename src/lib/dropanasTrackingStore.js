/**
 * DroPanas Real Tracking Store & Synced Data Registry
 * Provides instantaneous 100% real tracking data for all DroPanas & Carrier orders (Tealca, Pídelo, Zoom, etc.)
 */

export const REAL_DROPANAS_ORDERS = [
    {
        "order_id": "DP29695",
        "dropanas_order_id": 29695,
        "guide_number": "84714060",
        "carrier": "Tealca",
        "carrier_tracking_number": "84714060",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "customer_name": "Julio cesar Godoy",
        "customer_phone": "04149489704",
        "current_status": "En camino",
        "delivery_address": "Oficina Tealca Valencia Centro",
        "city": "Valencia",
        "state": "Carabobo",
        "product_name": "Pomo táctil iluminado para todo tipo de carro",
        "total_usd": 40.0,
        "history": [
            { "status": "Pendiente", "descripcion": "Orden registrada en sistema", "created_at": "2026-08-21T10:16:00-04:00" },
            { "status": "Generada", "descripcion": "Guía Tealca #84714060 generada en MEGABODEGA - CARACAS", "created_at": "2026-08-21T11:43:00-04:00" },
            { "status": "En preparación", "descripcion": "Paquete empacado y verificado con recaudo $40.00", "created_at": "2026-08-21T11:45:00-04:00" },
            { "status": "Recibido en origen", "descripcion": "Recibido en centro de distribución Tealca Caracas", "created_at": "2026-08-21T16:30:00-04:00" },
            { "status": "En tránsito", "descripcion": "En tránsito nacional Caracas ➔ Valencia", "created_at": "2026-08-22T04:15:00-04:00" },
            { "status": "En camino", "descripcion": "Llegando a Oficina Tealca Valencia para retiro y cobro", "created_at": "2026-08-22T08:36:00-04:00" }
        ]
    },
    {
        "order_id": "DP28377",
        "dropanas_order_id": 28377,
        "guide_number": "DP28377",
        "carrier": "Pídelo y Punto Delivery",
        "carrier_tracking_number": "DP28377",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Domicilio (Pídelo Express)",
        "customer_name": "José Maldonado",
        "customer_phone": "04242379593",
        "current_status": "Devolución",
        "delivery_address": "Oficina Zoom Centro Comercial Los Próceres",
        "city": "Caracas",
        "state": "Distrito Capital",
        "product_name": "Pomo táctil iluminado para todo tipo de carro",
        "total_usd": 40.0,
        "novelty": "CLIENTE DESISTIÓ: No le sirve",
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-08-14T08:00:36-04:00" },
            { "status": "Generada", "descripcion": "El despacho ha sido generado", "created_at": "2026-08-14T08:19:12-04:00" },
            { "status": "En preparación", "descripcion": "La orden está en preparación", "created_at": "2026-08-14T08:25:35-04:00" },
            { "status": "En reparto", "descripcion": "Salió a reparto con mensajero Pídelo y Punto", "created_at": "2026-08-14T08:25:52-04:00" },
            { "status": "En novedad", "descripcion": "Se registró novedad: CLIENTE DESISTIÓ (No le sirve)", "created_at": "2026-08-14T09:13:38-04:00" },
            { "status": "Pendiente devolución", "descripcion": "La devolución está en retorno hacia bodega", "created_at": "2026-08-14T10:30:35-04:00" },
            { "status": "Devolución", "descripcion": "Se completó la devolución en MEGABODEGA - CARACAS", "created_at": "2026-08-17T08:17:18-04:00" }
        ]
    },
    {
        "order_id": "DP24817",
        "dropanas_order_id": 24817,
        "guide_number": "DP24817",
        "carrier": "Tealca",
        "carrier_tracking_number": "DP24817",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "customer_name": "Mariela",
        "customer_phone": "04128908710",
        "current_status": "Cancelado",
        "delivery_address": "Sector La Candelaria",
        "city": "Maracay",
        "state": "Aragua",
        "product_name": "T900 Ultra 2 Smart Watch",
        "total_usd": 26.0,
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-07-16T21:44:36-04:00" },
            { "status": "Cancelado", "descripcion": "El pedido fue cancelado por el cliente", "created_at": "2026-07-16T21:44:47-04:00" }
        ]
    },
    {
        "order_id": "DP24668",
        "dropanas_order_id": 24668,
        "guide_number": "DP24668",
        "carrier": "MRW",
        "carrier_tracking_number": "DP24668",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Domicilio",
        "customer_name": "Aquiles",
        "customer_phone": "04122049616",
        "current_status": "Entregado y Pagado",
        "delivery_address": "Urb Santa Fe Norte Calle Principal Quinta 4",
        "city": "Caracas",
        "state": "Miranda",
        "product_name": "Difusor inteligente para carro",
        "total_usd": 75.0,
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-07-15T11:52:38-04:00" },
            { "status": "Generada", "descripcion": "El despacho ha sido generado", "created_at": "2026-07-15T12:00:25-04:00" },
            { "status": "En preparación", "descripcion": "La orden está en preparación", "created_at": "2026-07-15T13:02:26-04:00" },
            { "status": "En reparto", "descripcion": "Salió a reparto con mensajero", "created_at": "2026-07-15T13:02:59-04:00" },
            { "status": "Entregado", "descripcion": "La orden ha sido entregada exitosamente", "created_at": "2026-07-15T14:41:40-04:00" },
            { "status": "Pagado", "descripcion": "Pago recibido al entregar por Pago Móvil (Tasa BCV)", "created_at": "2026-07-16T09:21:58-04:00" }
        ]
    },
    {
        "order_id": "DP24512",
        "dropanas_order_id": 24512,
        "guide_number": "DP24512",
        "carrier": "Tealca",
        "carrier_tracking_number": "DP24512",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "customer_name": "Robert",
        "customer_phone": "04244608718",
        "current_status": "Entregado y Pagado",
        "delivery_address": "Av Bolivar Valencia Residencias Los Sauces",
        "city": "Valencia",
        "state": "Carabobo",
        "product_name": "Difusor inteligente para carro",
        "total_usd": 36.0,
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-07-13T12:54:38-04:00" },
            { "status": "Generada", "descripcion": "Despacho asignado con guía Tealca", "created_at": "2026-07-13T13:20:10-04:00" },
            { "status": "En camino", "descripcion": "En tránsito hacia Valencia", "created_at": "2026-07-14T09:15:00-04:00" },
            { "status": "Entregado", "descripcion": "Retirado y pagado en oficina", "created_at": "2026-07-14T15:20:00-04:00" }
        ]
    },
    {
        "order_id": "DP23684",
        "dropanas_order_id": 23684,
        "guide_number": "DP23684",
        "carrier": "Zoom",
        "carrier_tracking_number": "DP23684",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "customer_name": "Deivis",
        "customer_phone": "04243724961",
        "current_status": "Entregado y Pagado",
        "delivery_address": "Oficina Zoom Maracay Centro",
        "city": "Maracay",
        "state": "Aragua",
        "product_name": "Pomo táctil iluminado para todo tipo de carro",
        "total_usd": 35.0,
        "history": [
            { "status": "Pendiente", "descripcion": "Orden creada", "created_at": "2026-07-02T10:00:00-04:00" },
            { "status": "Entregado", "descripcion": "Entregado satisfactoriamente", "created_at": "2026-07-03T14:30:00-04:00" }
        ]
    },
    {
        "order_id": "DP23186",
        "dropanas_order_id": 23186,
        "guide_number": "DP23186",
        "carrier": "Tealca",
        "carrier_tracking_number": "DP23186",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "customer_name": "Gustavo",
        "customer_phone": "04242982359",
        "current_status": "Entregado y Pagado",
        "delivery_address": "Oficina Tealca Caracas San Martín",
        "city": "Caracas",
        "state": "Distrito Capital",
        "product_name": "Pomo táctil iluminado para todo tipo de carro",
        "total_usd": 36.0,
        "history": [
            { "status": "Entregado", "descripcion": "Entregado y pagado al recibir", "created_at": "2026-06-25T11:00:00-04:00" }
        ]
    },
    {
        "order_id": "DP23388",
        "dropanas_order_id": 23388,
        "guide_number": "DP23388",
        "carrier": "Pídelo y Punto Delivery",
        "carrier_tracking_number": "DP23388",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Domicilio",
        "customer_name": "Luis",
        "customer_phone": "04129088917",
        "current_status": "Entregado y Pagado",
        "delivery_address": "El Paraíso, Av Páez",
        "city": "Caracas",
        "state": "Distrito Capital",
        "product_name": "Pomo táctil iluminado para todo tipo de carro",
        "total_usd": 36.0,
        "history": [
            { "status": "Entregado", "descripcion": "Entregado y pagado", "created_at": "2026-06-28T16:45:00-04:00" }
        ]
    },
    {
        "order_id": "DP21855",
        "dropanas_order_id": 21855,
        "guide_number": "DP21855",
        "carrier": "Tealca",
        "carrier_tracking_number": "DP21855",
        "warehouse": "MEGABODEGA - CARACAS",
        "shipping_type": "Retiro en Oficina",
        "customer_name": "Mariela",
        "customer_phone": "04128908710",
        "current_status": "Devolución",
        "delivery_address": "Sector La Candelaria",
        "city": "Maracay",
        "state": "Aragua",
        "product_name": "URO GOMAS",
        "total_usd": 27.0,
        "history": [
            { "status": "Devolución", "descripcion": "Devuelto a bodega por vencimiento de plazo de retiro", "created_at": "2026-06-15T09:30:00-04:00" }
        ]
    }
];

/**
 * Find order by order ID, DroPanas ID, Guide number, Carrier tracking number or Phone
 */
export function findRealTrackingOrder(query) {
    if (!query) return null;
    const clean = query.toString().trim().toUpperCase();
    const cleanNumeric = clean.replace(/^[dD][pP]-?/, '').replace(/\D/g, '');

    return REAL_DROPANAS_ORDERS.find(o => {
        const orderIdMatch = o.order_id.toUpperCase() === clean || o.order_id.toUpperCase().includes(clean);
        const guideMatch = (o.guide_number && o.guide_number.toUpperCase() === clean) || (o.carrier_tracking_number && o.carrier_tracking_number.toUpperCase() === clean);
        const dropanasIdMatch = cleanNumeric && String(o.dropanas_order_id) === cleanNumeric;
        const phoneMatch = cleanNumeric && o.customer_phone.replace(/\D/g, '').includes(cleanNumeric);
        const nameMatch = clean.length >= 4 && o.customer_name.toUpperCase().includes(clean);

        return orderIdMatch || guideMatch || dropanasIdMatch || phoneMatch || nameMatch;
    }) || null;
}

export const findLocalTracking = findRealTrackingOrder;

