import React from 'react';

/**
 * Curated knowledge base of high-converting PAS (Problem-Agitation-Solution)
 * and "Para Qué Sirve" data for all store catalog items.
 */
const CURATED_PAS_CATALOG = [
    {
        matches: ['esponja', 'vidrio', 'oil film', 'parabrisas'],
        headline: 'Vidrios cristalinos en 30 segundos',
        problem: 'Tus vidrios acumulan una película invisible de grasa y lluvia ácida que no se quita con limpiaparabrisas normal. De noche o bajo lluvia, cada faro te encandila y pierdes visibilidad.',
        agitation: 'Manejar con vidrios sucios o empañados es incómodo y sumamente peligroso. Los trapos normales solo mueven la grasa de lugar sin eliminarla desde la raíz.',
        benefits: [
            'Limpieza profunda sin químicos agresivos — solo necesitas agua',
            'Elimina 100% la película de grasa invisible y marcas de agua seca',
            'Doble cara: espuma de alta densidad para limpieza + pulido de cristales',
            'Mango ergonómico que facilita alcanzar las esquinas del parabrisas',
            'Reutilizable para más de 200 usos — una sola esponja te dura meses'
        ]
    },
    {
        matches: ['compresor', 'inflador', 'aire'],
        headline: 'Neumáticos inflados en minutos sin depender de una cauchera',
        problem: 'Quedarse accidentado por un caucho bajo o espichado de noche, en una vía solitaria o de camino al trabajo es una situación estresante.',
        agitation: 'Rodar con baja presión daña tus rines, desgasta los cauchos antes de tiempo y buscar una estación de servicio con aire disponible te hace perder horas.',
        benefits: [
            'Inflado digital automático: programas los PSI exactos y se detiene solo al alcanzar la presión',
            'Batería recargable de alta capacidad con linterna LED de emergencia integrada para la noche',
            'Multifuncional: incluye boquillas para carros, camionetas, motos, bicicletas y balones',
            'Pantalla digital LCD que mide la presión de tus neumáticos en tiempo real',
            'Compacto y ultra portátil: guárdalo fácilmente en la guantera o maletera'
        ]
    },
    {
        matches: ['cargador', 'bateria', '12v', 'arrancador'],
        headline: 'Recupera baterías descargadas y arranca tu vehículo al instante',
        problem: 'Dejar una luz encendida, escuchar música con el motor apagado o dejar el carro estacionado por varios días puede dejar la batería completamente descargada.',
        agitation: 'Quedar varado sin poder encender el motor arruina tu día, te obliga a pedir auxilio a desconocidos o pagar costosos servicios de grúa.',
        benefits: [
            'Carga inteligente por pulsos de alta frecuencia que desulfata y repara baterías con desgaste',
            'Pantalla digital LCD retroiluminada con lectura exacta de voltaje, amperaje y temperatura',
            'Protección automática avanzada contra sobrecarga, polaridad invertida y cortocircuito',
            'Conexión directa a toma corriente 110V para usar en casa, garaje o taller',
            'Compatible con baterías de 12V de carros, camionetas, motos y plantas eléctricas'
        ]
    },
    {
        matches: ['nox', 'nasal', 'ronquido', 'roncar', 'respirar'],
        headline: 'Respira 100% mejor y dile adiós a los ronquidos nocturnos',
        problem: 'La congestión nasal, el tabique desviado o la respiración por la boca provocan ronquidos fuertes, sequedad de garganta y despertares continuos.',
        agitation: 'Dormir mal drena tu energía diaria, afecta tu concentración y arruina la calidad del descanso de tu pareja.',
        benefits: [
            'Abre las fosas nasales al instante aumentando el flujo de aire oxigenado hasta en un 31%',
            'Reduce o elimina los ronquidos molestos desde la primera noche de uso',
            'Hipoalergénicas y de grado médico con adhesivo flexible que no maltrata la piel ni deja residuos',
            'Ideales para dormir profundamente o potenciar el rendimiento físico durante entrenamientos',
            'Diseño discreto y cómodo que se adapta a cualquier tamaño de nariz'
        ]
    },
    {
        matches: ['pomo', 'palanca', 'cambios'],
        headline: 'Dale un look exótico y moderno al interior de tu vehículo',
        problem: 'El pomo de cambios original desgastado, descolorido o aburrido le quita valor y estilo a la cabina de tu carro.',
        agitation: 'Pasas horas dentro de tu vehículo todos los días; manejar con un interior descuidado arruina la experiencia de conducir.',
        benefits: [
            'Sensor táctil inteligente: se ilumina automáticamente al contacto de tu mano y se apaga al soltar',
            '7 colores RGB fluidos y vibrantes con acabado premium tipo cristal facetado',
            'Rosca universal adaptable a cajas manuales y automáticas sin botón de bloqueo',
            'Batería recargable vía cable USB con semanas de autonomía por carga',
            'Instalación fácil en menos de 3 minutos sin cables a la vista ni herramientas especiales'
        ]
    },
    {
        matches: ['reloj', 'smartwatch', 't900', 'z59', 'ultra', 'inteligente'],
        headline: 'Tu salud, notificaciones y llamadas en tu muñeca en todo momento',
        problem: 'Sacar el teléfono en la calle o mientras manejas es incómodo, arriesgado y te hace perder mensajes o llamadas de urgencia.',
        agitation: 'No tener registro de tu actividad física, pulsaciones y descanso dificulta llevar un estilo de vida saludable y productivo.',
        benefits: [
            'Realiza y responde llamadas Bluetooth con micrófono y altavoz HD integrados',
            'Monitoreo 24/7 de ritmo cardíaco, oxígeno en sangre (SpO2) y conteo de pasos diarios',
            'Notificaciones en tiempo real de WhatsApp, Instagram, llamadas y recordatorios',
            'Múltiples modos deportivos para entrenamiento y registro de calorías quemadas',
            'Batería de larga duración con carga inalámbrica rápida'
        ]
    },
    {
        matches: ['calabaza', 'semilla', 'natural', 'aceite', 'salud'],
        headline: 'Nutrición concentrada y bienestar natural para tu organismo',
        problem: 'La falta de nutrientes esenciales, zinc y magnesio en la dieta diaria debilita el sistema inmune y la salud prostática.',
        agitation: 'El estrés y los alimentos ultraprocesados desgastan tu vitalidad y energía con el paso de los años.',
        benefits: [
            '100% natural, prensada en frío conservando todos sus fitoesteroles y antioxidantes activos',
            'Rica en ácidos grasos esenciales Omega 3 y 6 para la salud cardiovascular y cerebral',
            'Apoyo comprobado para la función urinaria, prostática y equilibrio hormonal',
            'Fácil de consumir a diario en ensaladas, batidos o como snack nutritivo',
            'Sin conservantes químicos ni aditivos artificiales'
        ]
    },
    {
        matches: ['toalla', 'microfibra', 'secado', 'pulir'],
        headline: 'Secado y brillo perfecto en una sola pasada sin rayas',
        problem: 'Los trapos comunes y franelas viejas dejan pelusas, marcas de agua y pueden rayar la pintura o cristales con micro-arañazos.',
        agitation: 'Dedicar tiempo a lavar tu carro o limpiar el hogar para que quede opaco y manchado es una pérdida de esfuerzo.',
        benefits: [
            'Microfibra de ultra alta densidad que absorbe hasta 8 veces su peso en agua',
            'Bordes suaves reforzados que garantizan 0 rayas en pintura, barniz y vidrios',
            'Atrapa el polvo y la suciedad por magnetismo electrostático sin esparcirla',
            'Lavable a máquina y reutilizable por cientos de lavadas sin perder suavidad',
            'Ideal para secado rápido, aplicación de ceras y limpieza de interiores'
        ]
    },
    {
        matches: ['foco', 'bombillo', 'h4', 'led', 'luz'],
        headline: 'Iluminación ultra brillante para manejar seguro de noche y bajo lluvia',
        problem: 'Las luces halógenas amarillas tradicionales alumbran poco y no te permiten anticipar baches, huecos u obstáculos en la carretera.',
        agitation: 'Manejar de noche en calles oscuras sin visibilidad adecuada es uno de los mayores peligros al volante en Venezuela.',
        benefits: [
            'Luz blanca pura de alta intensidad con hasta 300% más alcance que bombillos estándar',
            'Haz de luz enfocado con línea de corte perfecta que no encandila al tráfico contrario',
            'Cuerpo de aluminio de aviación con disipación térmica y turbo ventilador silencioso',
            'Conexión directa Plug & Play sin necesidad de balastros ni modificar el sistema eléctrico',
            'Resistencia total IP68 contra agua, lluvia torrencial, barro y vibraciones de carretera'
        ]
    }
];

/**
 * Clean dropshipping or supplier jargon from raw text
 */
function sanitizeText(str) {
    if (!str) return '';
    return str
        .replace(/dropshipping|proveedor|bodega central|dropanas|aliexpress|importación directa|china|fábrica/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Intelligent helper to extract/generate PAS data for ANY product
 */
function getProductPAS(product) {
    // 1. If product has its own custom PAS data in DB
    if (product.pas_headline && product.pas_problem) {
        return {
            headline: product.pas_headline,
            problem: product.pas_problem,
            agitation: product.pas_agitation || 'No te conformes con soluciones temporales que no resuelven el problema de fondo.',
            benefits: product.pas_benefits || []
        };
    }

    const s = `${product?.slug || ''} ${product?.name || ''} ${product?.category || ''}`.toLowerCase();

    // 2. Search curated knowledge base by keywords
    for (const item of CURATED_PAS_CATALOG) {
        if (item.matches.some(m => s.includes(m))) {
            return {
                headline: item.headline,
                problem: item.problem,
                agitation: item.agitation,
                benefits: item.benefits
            };
        }
    }

    // 3. Smart dynamic extraction from existing description or category
    const cleanName = sanitizeText(product.name || 'este producto');
    const category = sanitizeText(product.category || 'Hogar y Uso Diario');
    
    // Extract bullets from description if available
    let dynamicBenefits = [];
    if (product.description) {
        const lines = product.description.split('\n');
        for (const line of lines) {
            const cleanLine = sanitizeText(line.replace(/^[-*•→\d.]+\s*/, ''));
            if (cleanLine.length > 15 && cleanLine.length < 120 && !cleanLine.includes('#')) {
                dynamicBenefits.push(cleanLine);
                if (dynamicBenefits.length >= 5) break;
            }
        }
    }

    if (dynamicBenefits.length === 0) {
        dynamicBenefits = [
            `Diseño ergonómico y materiales de alta durabilidad diseñados para el uso diario`,
            `Fácil de usar desde el primer momento, sin configuraciones complejas`,
            `Ahorro comprobado de tiempo y esfuerzo en tus tareas cotidianas`,
            `Garantía de satisfacción: producto probado con altos estándares de calidad`,
            `Entrega inmediata con envío gratuito y pago contra entrega en toda Venezuela`
        ];
    }

    return {
        headline: `Solución práctica y efectiva para ${category}`,
        problem: `En el día a día, perder tiempo con productos de baja calidad o métodos tradicionales poco eficientes genera frustración y gastos innecesarios.`,
        agitation: `Contar con una herramienta confiable y duradera marca la diferencia entre resolver una necesidad al instante o lidiar con complicaciones constantes.`,
        benefits: dynamicBenefits
    };
}

/**
 * PASBlock Component - Product Bible 2026 Standard
 * Implements PAS (Problem-Agitation-Solution) framework for 100% of products.
 */
export default function PASBlock({ product }) {
    if (!product) return null;

    const pas = getProductPAS(product);

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
            {/* 1. Problem Headline & Context */}
            <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 tracking-tight leading-snug">
                    {pas.headline}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                    {pas.problem}
                </p>
            </div>

            {/* 2. Agitation Highlight Box */}
            <div className="pl-4 sm:pl-5 border-l-4 border-amber-400 bg-amber-50/80 py-3.5 px-4 rounded-r-2xl text-amber-950 italic text-xs sm:text-sm font-medium leading-relaxed">
                {pas.agitation}
            </div>

            {/* 3. Solution Header & Benefit Bullets */}
            <div className="space-y-3.5 pt-2">
                <h4 className="text-base sm:text-lg font-black text-emerald-700 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    <span>Solución: {product.name}</span>
                </h4>

                <ul className="space-y-2.5 sm:space-y-3">
                    {pas.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-800">
                            <span className="text-emerald-600 font-black text-base leading-none mt-0.5 shrink-0">→</span>
                            <span className="leading-relaxed font-medium">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
