import { useState, useMemo } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useSettings } from '../../context/SettingsContext';
import { 
    Copy, Check, ExternalLink, Sparkles, Zap, 
    ShoppingBag, Tag, Image, ArrowRight, Share2, 
    Search, DollarSign, ShieldCheck, Download, RefreshCw 
} from 'lucide-react';

/**
 * Intelligent Neuromarketing Copywriting Engine for Facebook Marketplace (Venezuela COD)
 */
function generateMarketplacePack(product, exchangeRate, whatsappNumber) {
    if (!product) return null;

    const name = product.name || 'Producto KiplyStart';
    const category = product.category || 'General';
    const priceUsd = Number(product.price) || 0;
    const priceBs = exchangeRate ? (priceUsd * exchangeRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    const slug = product.slug || '';
    const cleanWa = (whatsappNumber || '584124340546').replace(/\D/g, '');

    // 1. Títulos de alto impacto SEO para el buscador de Facebook Marketplace
    const titles = [
        `${name} - ¡Envío Gratis y Pagas Al Recibir!`,
        `${name} Original (Garantía y Pago Contra Entrega)`,
        `${name} Para ${category} - Entrega Inmediata`
    ];

    // 2. Extracción de beneficios clave
    const s = `${slug} ${name} ${category}`.toLowerCase();
    let hook = '¿Buscas una solución práctica, duradera y de excelente calidad?';
    let benefits = [
        '✅ Materiales de alta resistencia diseñados para uso continuo',
        '✅ Fácil de usar e instalar desde el primer minuto',
        '✅ Producto 100% nuevo en su caja sellada con garantía'
    ];

    if (s.includes('esponja') || s.includes('vidrio') || s.includes('parabrisas')) {
        hook = '¿Vidrios manchados o con grasa que no se quitan con nada?';
        benefits = [
            '✅ Elimina 100% la película de grasa y lluvia ácida del parabrisas',
            '✅ Visibilidad cristalina y segura al manejar de noche o bajo lluvia',
            '✅ No raya ni daña los cristales: solo necesitas agua',
            '✅ Reutilizable para más de 200 lavadas (te dura meses)'
        ];
    } else if (s.includes('compresor') || s.includes('inflador')) {
        hook = '¿Te quedaste sin aire en un caucho de noche o en plena vía?';
        benefits = [
            '✅ Inflado digital automático: programas los PSI y se detiene solo',
            '✅ Batería recargable + Linterna LED de emergencia para la noche',
            '✅ Sirve para cauchos de carro, camioneta, moto, bicis y balones',
            '✅ Cabe en la guantera: tranquilidad total en cualquier viaje'
        ];
    } else if (s.includes('cargador') || s.includes('bateria') || s.includes('12v')) {
        hook = '¿Tu batería se descargó y el carro no enciende?';
        benefits = [
            '✅ Carga inteligente y repara baterías con desgaste por pulsos',
            '✅ Pantalla digital LCD con voltaje, amperaje y temperatura en vivo',
            '✅ Protección total contra sobrecarga y cortocircuito',
            '✅ Conexión directa a 110V para usar en casa o garaje'
        ];
    } else if (s.includes('nox') || s.includes('nasal') || s.includes('ronquido')) {
        hook = '¿Cansado de roncar y levantarte con la boca seca y sin energía?';
        benefits = [
            '✅ Abre las vías nasales al instante (+31% más flujo de aire)',
            '✅ Reduce o elimina los ronquidos desde la primera noche',
            '✅ Hipoalergénico de grado médico: no irrita ni deja marcas',
            '✅ Descanso profundo para ti y para tu pareja'
        ];
    } else if (s.includes('pomo') || s.includes('palanca')) {
        hook = '¿Quieres que el interior de tu carro luzca moderno y de lujo?';
        benefits = [
            '✅ Sensor táctil inteligente: se ilumina al tocarlo y se apaga al soltar',
            '✅ 7 Colores RGB fluidos con acabado tipo cristal premium',
            '✅ Batería recargable vía USB (dura semanas por carga)',
            '✅ Rosca universal fácil de instalar en menos de 3 minutos'
        ];
    } else if (s.includes('reloj') || s.includes('smartwatch') || s.includes('t900')) {
        hook = '¿Quieres contestar llamadas y ver mensajes sin sacar el teléfono?';
        benefits = [
            '✅ Recibe y responde llamadas Bluetooth con micrófono y altavoz HD',
            '✅ Notificaciones de WhatsApp, redes sociales y recordatorios',
            '✅ Monitoreo de salud: pulsaciones, oxígeno y pasos diarios',
            '✅ Batería duradera con cargador magnético inalámbrico'
        ];
    } else if (s.includes('bolso') || s.includes('motorizado') || s.includes('piernera')) {
        hook = '¿Manejas moto o trabajas en la calle y necesitas llevar todo seguro?';
        benefits = [
            '✅ Tela impermeable de alta resistencia contra lluvia y rasgaduras',
            '✅ Ajuste ergonómico a la cintura y pierna: no incomoda al manejar',
            '✅ Múltiples compartimientos para teléfono, llaves, billetera y papeles',
            '✅ Cierres reforzados de máxima seguridad'
        ];
    }

    // 3. Descripción persuasiva con neuromarketing
    const description = 
`${hook}

🔥 ${name.toUpperCase()} 🔥

${benefits.join('\n')}

━━━━━━━━━━━━━━━━━━━━━
💵 PRECIO Y FORMAS DE PAGO:
• $${priceUsd} USD${priceBs ? ` (o Bs. ${priceBs} a Tasa Oficial BCV)` : ''}
• 🛡️ PAGO 100% CONTRA ENTREGA: Primero revisas el producto al recibirlo, y luego pagas con total seguridad.
• Aceptamos Efectivo $, Pago Móvil o Transferencia al recibir.

🚚 ENVÍO Y ENTREGAS:
• 📍 Delivery Express en Caracas (Entrega en pocas horas).
• 📦 Envíos GRATIS a toda Venezuela a través de Tealca a domicilio o agencia.

━━━━━━━━━━━━━━━━━━━━━
📲 ¿CÓMO PEDIR EL TUYO?
Escríbeme un mensaje privado por aquí o directamente a nuestro WhatsApp:
👉 wa.me/${cleanWa}?text=${encodeURIComponent(`Hola, vi tu publicación en Marketplace de ${name} y deseo pedirlo con pago al recibir.`)}

🌐 También puedes ver fotos y pedirlo en nuestra tienda online:
https://www.kiplystart.com/producto/${slug}

⚠️ ¡Pocas unidades disponibles con precio de promoción!`;

    // 4. Etiquetas clave para el algoritmo de Marketplace
    const tags = [
        category.toLowerCase(),
        name.toLowerCase().split(' ').slice(0, 3).join(' '),
        'pago contra entrega',
        'envio gratis venezuela',
        'oferta caracas',
        'articulos caracas',
        'valencia',
        'maracay',
        'barquisimeto',
        'tealca venezuela',
        'garantia',
        'kiplystart'
    ].filter(Boolean).join(', ');

    return {
        titles,
        description,
        tags,
        priceUsd,
        priceBs,
        imageUrl: product.image_url,
        slug
    };
}

export default function MarketplaceGenerator({ products = [] }) {
    const { exchangeRate } = useCurrency();
    const { settings } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
    const [copiedField, setCopiedField] = useState(null);

    // Filter active products
    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return products.slice(0, 24);
        const q = searchTerm.toLowerCase();
        return products.filter(p => 
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q)) ||
            (p.slug && p.slug.toLowerCase().includes(q))
        );
    }, [products, searchTerm]);

    // Set initial product
    const activeProduct = selectedProduct || products[0];
    const pack = useMemo(() => {
        return generateMarketplacePack(activeProduct, exchangeRate, settings?.whatsapp_number);
    }, [activeProduct, exchangeRate, settings?.whatsapp_number]);

    const handleCopy = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2500);
    };

    const handleOpenMarketplace = () => {
        window.open('https://www.facebook.com/marketplace/create/item', '_blank');
    };

    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-black text-gray-900">No hay productos en el catálogo</h3>
                <p className="text-xs text-gray-500 mt-1">Crea o sincroniza productos primero para generar publicaciones de Marketplace.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A2463] via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 z-10">
                    <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Generador Express para Facebook Marketplace</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        Vende en Marketplace con Neuromarketing
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
                        Copia en 1 clic títulos optimizados con SEO, descripciones de alta conversión y etiquetas clave. Abre Marketplace y publica en 15 segundos sin riesgo de baneo.
                    </p>
                </div>

                <div className="shrink-0 z-10">
                    <button
                        onClick={handleOpenMarketplace}
                        className="w-full sm:w-auto px-6 py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    >
                        <span>Abrir Crear Anuncio en FB</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Product Selector Search (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-200/90 shadow-xs space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-gray-950 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-blue-600" />
                            <span>Selecciona un Producto</span>
                        </h3>
                        <p className="text-[11px] text-gray-500">
                            Elige el artículo que deseas publicar hoy en Marketplace.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre o categoría..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Product List Scroll */}
                    <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                        {filteredProducts.map(prod => {
                            const isSelected = activeProduct?.id === prod.id;
                            return (
                                <div
                                    key={prod.id}
                                    onClick={() => { setSelectedProduct(prod); setSelectedTitleIdx(0); }}
                                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                        isSelected 
                                            ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500/20' 
                                            : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <img
                                        src={prod.image_url}
                                        alt={prod.name}
                                        className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-200 p-0.5 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-black text-gray-950 truncate">{prod.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                                            <span className="font-extrabold text-emerald-700">${prod.price} USD</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-400 truncate">{prod.category || 'General'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Marketplace Pack Generator (8 cols) */}
                {pack && (
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Titulo con Variaciones SEO */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-950">Título del Anuncio (Optimizado para Búsquedas)</h4>
                                        <p className="text-[11px] text-gray-500">Selecciona la variante que prefieras y cópiala en 1 clic.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopy(pack.titles[selectedTitleIdx], 'title')}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                        copiedField === 'title'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-gray-800'
                                    }`}
                                >
                                    {copiedField === 'title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedField === 'title' ? '¡Título Copiado!' : 'Copiar Título'}</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {pack.titles.map((t, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedTitleIdx(idx)}
                                        className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                            selectedTitleIdx === idx
                                                ? 'bg-blue-50 border-blue-500 text-blue-950 ring-1 ring-blue-500/20'
                                                : 'bg-slate-50/60 border-slate-200 text-gray-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span>{t}</span>
                                        {selectedTitleIdx === idx && (
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-md shrink-0">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Precio Sugerido & Moneda */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
                                    2
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-950">Precio para Marketplace</h4>
                                    <p className="text-[11px] text-gray-500">Monto exacto en USD y cálculo automático a Tasa Oficial BCV.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
                                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Precio en Dólares ($)</span>
                                    <span className="text-2xl font-black text-emerald-700">${pack.priceUsd} USD</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center">
                                    <span className="text-[10px] font-extrabold text-blue-800 uppercase block">Tasa BCV Oficial</span>
                                    <span className="text-lg font-black text-[#0A2463] font-mono">
                                        {pack.priceBs ? `Bs. ${pack.priceBs}` : 'Calculando...'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center flex flex-col justify-center">
                                    <span className="text-[10px] font-extrabold text-amber-900 uppercase block">Estrategia Gancho</span>
                                    <span className="text-xs font-bold text-amber-800 mt-0.5">Coloca $1 o ${pack.priceUsd} en el campo precio</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Descripción Persuasiva de Neuromarketing */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-950">Descripción de Neuromarketing (Lista para Pegar)</h4>
                                        <p className="text-[11px] text-gray-500">Incluye dolor, beneficios, garantía contra entrega y llamada a la acción.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopy(pack.description, 'desc')}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                        copiedField === 'desc'
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20'
                                    }`}
                                >
                                    {copiedField === 'desc' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copiedField === 'desc' ? '¡Descripción Copiada!' : 'Copiar Descripción'}</span>
                                </button>
                            </div>

                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={pack.description}
                                    rows={13}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-gray-800 leading-relaxed focus:outline-none select-all"
                                />
                            </div>
                        </div>

                        {/* 4. Etiquetas y Fotos */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs">
                                        4
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-950">Etiquetas Clave (Tags de Búsqueda)</h4>
                                        <p className="text-[11px] text-gray-500">Pega esto en la sección "Etiquetas del producto" de Marketplace.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopy(pack.tags, 'tags')}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                        copiedField === 'tags'
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-gray-800'
                                    }`}
                                >
                                    {copiedField === 'tags' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedField === 'tags' ? '¡Etiquetas Copiadas!' : 'Copiar Etiquetas'}</span>
                                </button>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-gray-700 break-words">
                                {pack.tags}
                            </div>

                            {/* Image Preview & Download */}
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={pack.imageUrl}
                                        alt={activeProduct.name}
                                        className="w-14 h-14 rounded-xl object-contain bg-white border border-gray-200 p-1"
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Imagen Principal del Producto</p>
                                        <p className="text-[11px] text-gray-400">Descárgala o arrástrala directo a Facebook.</p>
                                    </div>
                                </div>

                                <a
                                    href={pack.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={`${activeProduct.slug}-marketplace.jpg`}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5 text-gray-600" />
                                    <span>Abrir / Descargar Imagen</span>
                                </a>
                            </div>
                        </div>

                        {/* Bottom Floating Fast Action */}
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-950">
                            <div className="space-y-0.5">
                                <h5 className="text-sm font-black flex items-center gap-1.5 text-emerald-900">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <span>¿Todo listo para publicar?</span>
                                </h5>
                                <p className="text-xs text-emerald-800">
                                    Abre Facebook Marketplace, arrastra la foto y pega el título y descripción que acabas de copiar.
                                </p>
                            </div>

                            <button
                                onClick={handleOpenMarketplace}
                                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                            >
                                <span>Abrir Facebook Marketplace</span>
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
