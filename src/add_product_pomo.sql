-- Script para insertar el producto "Pomo Táctil Iluminado"
-- Ejecuta esto en el Editor SQL de Supabase

INSERT INTO products (
    name, 
    description, 
    category, 
    price, 
    compare_at_price, 
    stock, 
    is_active, 
    featured, 
    image_url, 
    additional_images, 
    tags, 
    bundle_2_discount, 
    bundle_3_discount
) VALUES (
    'Pomo Táctil Iluminado (Universal) | Nuevo Estilo',
    E'¿Cansado de que tu carro luzca común y corriente?\n\nCada vez que subes, sientes que falta "algo" que lo haga especial... Mientras otros carros destacan con detalles premium, el tuyo pasa desapercibido.\n\n✅ Solución: Pomo LED Táctil KiplyStart\n\nEste pomo inteligente se ilumina SOLO cuando lo tocas, dándole a tu carro un look exótico y moderno al instante.\n\n✨ Beneficios Clave:\n- 🌈 7 Colores RGB (cambian fluidamente al tacto)\n- 👆 Sensor Táctil Inteligente (se enciende al tocar, se apaga al soltar)\n- 🔋 Batería Recargable de Larga Duración (incluye cable USB)\n- 🛠️ Instalación en 3 Minutos (Rosca universal para mecánicos y automáticos sin botón)\n- 💎 Acabado Premium tipo Cristal\n\n📦 Incluye: Pomo, Cable de carga, Adaptadores de rosca.',
    'Accesorios para Carros',
    35.00,
    49.90,
    50,
    true,
    true,
    -- IMÁGENES: Reemplaza estas URL con las fotos reales subidas a tu Storage
    'https://placehold.co/600x600/10b981/ffffff?text=Pomo+Tactil+Principal', 
    ARRAY[
        'https://placehold.co/600x600/gray/white?text=Pomo+RGB+Colores', 
        'https://placehold.co/600x600/gray/white?text=Pomo+Instalado', 
        'https://placehold.co/600x600/gray/white?text=Pomo+Caja+Accesorios'
    ],
    ARRAY['pomo', 'led', 'táctil', 'tuning', 'accesorios', 'carro', 'interior'],
    10,
    20
);
