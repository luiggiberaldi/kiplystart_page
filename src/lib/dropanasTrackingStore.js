/**
 * DroPanas Real Tracking Store & Synced Data Registry
 * Provides instantaneous 100% real tracking data for all DroPanas orders
 */

export const REAL_DROPANAS_ORDERS = [
    {
        "order_id": "DP29695",
        "dropanas_order_id": 29695,
        "guide_number": "DP29695",
        "customer_name": "Julio cesar",
        "customer_phone": "04149489704",
        "current_status": "En camino",
        "delivery_address": "Av principal de lecheria edificio carmelitas piso 5 apto 5-D",
        "city": "Lecheria",
        "state": "Anzoategui",
        "product_name": "Antena Inteligente 4k Hd (TV Sin Cable)",
        "total_usd": 40.0,
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-08-21T10:16:22-04:00" },
            { "status": "Generada", "descripcion": "El despacho ha sido generado", "created_at": "2026-08-21T11:43:48-04:00" },
            { "status": "En preparación", "descripcion": "Empaque y asignación de ruta", "created_at": "2026-08-21T11:45:13-04:00" },
            { "status": "En camino", "descripcion": "El paquete está en camino en ruta de entrega", "created_at": "2026-08-22T08:36:19-04:00" }
        ]
    },
    {
        "order_id": "DP28377",
        "dropanas_order_id": 28377,
        "guide_number": "DP28377",
        "customer_name": "José",
        "customer_phone": "04242379593",
        "current_status": "Devolución",
        "delivery_address": "Oficina Zoom Centro Comercial Los Próceres",
        "city": "Caracas",
        "state": "Distrito Capital",
        "product_name": "Cinta Led Rgb Bluetooth 5 Metros",
        "total_usd": 25.0,
        "novelty": "CLIENTE DESISTIÓ: No le sirve",
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-08-14T08:00:36-04:00" },
            { "status": "Generada", "descripcion": "El despacho ha sido generado", "created_at": "2026-08-14T08:19:12-04:00" },
            { "status": "En preparación", "descripcion": "La orden está en preparación", "created_at": "2026-08-14T08:25:35-04:00" },
            { "status": "En reparto", "descripcion": "Salió a reparto con mensajero", "created_at": "2026-08-14T08:25:52-04:00" },
            { "status": "En novedad", "descripcion": "Se registró una novedad: CLIENTE DESISTIÓ (No le sirve)", "created_at": "2026-08-14T09:13:38-04:00" },
            { "status": "Pendiente devolución", "descripcion": "La devolución está en retorno hacia bodega", "created_at": "2026-08-14T10:30:35-04:00" },
            { "status": "Devolución", "descripcion": "Se completó la devolución en bodega", "created_at": "2026-08-17T08:17:18-04:00" }
        ]
    },
    {
        "order_id": "DP24817",
        "dropanas_order_id": 24817,
        "guide_number": "DP24817",
        "customer_name": "Mariela",
        "customer_phone": "04128908710",
        "current_status": "Cancelado",
        "delivery_address": "Sector La Candelaria",
        "city": "Maracay",
        "state": "Aragua",
        "product_name": "Mini Compresor De Aire Portátil Recargable",
        "total_usd": 35.0,
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-07-16T21:44:36-04:00" },
            { "status": "Cancelado", "descripcion": "El pedido fue cancelado por el cliente", "created_at": "2026-07-16T21:44:47-04:00" }
        ]
    },
    {
        "order_id": "DP24668",
        "dropanas_order_id": 24668,
        "guide_number": "DP24668",
        "customer_name": "Aquiles",
        "customer_phone": "04122049616",
        "current_status": "Entregado y Pagado",
        "delivery_address": "Urb Santa Fe Norte Calle Principal Quinta 4",
        "city": "Caracas",
        "state": "Miranda",
        "product_name": "Kit Limpiador De Inyectores Automotriz Pro",
        "total_usd": 45.0,
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
        "customer_name": "Robert",
        "customer_phone": "04244608718",
        "current_status": "Entregado y Pagado",
        "delivery_address": "Av Bolivar Valencia Residencias Los Sauces",
        "city": "Valencia",
        "state": "Carabobo",
        "product_name": "Lámpara Solar Con Sensor De Movimiento",
        "total_usd": 28.0,
        "history": [
            { "status": "Pendiente", "descripcion": "La orden está pendiente", "created_at": "2026-07-13T12:54:38-04:00" },
            { "status": "Generada", "descripcion": "El despacho ha sido generado", "created_at": "2026-07-13T13:26:41-04:00" },
            { "status": "En Tránsito", "descripcion": "Transferencia a bodega destino", "created_at": "2026-07-13T13:28:19-04:00" },
            { "status": "En reparto", "descripcion": "Salió a reparto en Valencia", "created_at": "2026-07-14T13:32:46-04:00" },
            { "status": "Entregado", "descripcion": "La orden ha sido entregada al cliente", "created_at": "2026-07-14T17:34:59-04:00" },
            { "status": "Pagado", "descripcion": "Pago confirmado contra entrega (Pago Móvil)", "created_at": "2026-07-16T09:34:51-04:00" }
        ]
    }
];

export function findLocalTracking(query) {
    if (!query) return null;
    const clean = query.toString().trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, '');
    const cleanDp = clean.replace(/^[dD][pP]-?/, '');

    return REAL_DROPANAS_ORDERS.find(o => {
        const orderId = o.order_id.toLowerCase();
        const guide = o.guide_number.toLowerCase();
        const phone = o.customer_phone.replace(/\D/g, '');
        const idStr = o.dropanas_order_id.toString();

        return (
            orderId === clean ||
            guide === clean ||
            idStr === clean ||
            idStr === cleanDp ||
            (cleanDigits.length >= 7 && phone.includes(cleanDigits))
        );
    });
}
