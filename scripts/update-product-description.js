import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://caixlniwegfusbivsjdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaXhsbml3ZWdmdXNiaXZzamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjAzNTEsImV4cCI6MjA4NTc5NjM1MX0.MzfM3P_AiC_XAg2t99xHWzzzvs2TE2y2KMlWPcY95kU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Descripción reformateada según Modern Premium Typography Design System
const newDescription = `# Transforma Tu Carro en Lujo Premium

Efecto LED de $500 por Solo $35

## ¿Por qué es diferente a los pomos normales?

- **Sensor Táctil Inteligente:** Se ilumina SOLO cuando lo agarras. No gasta batería innecesariamente.
- **Efecto Multicolor Fluido:** Crea una atmósfera de "carro exótico" con cambios de color suaves y automáticos.
- **Cristal Premium con Agarre Ergonómico:** No más manos sudadas. Diseño que se siente como los carros alemanes de lujo.
- **100% Recargable:** Olvídate de pilas. Incluye cable USB + adaptador de encendedor.
- **Instalación Express (3 minutos):** Sin mecánico. Incluye 3 adaptadores universales (8mm, 10mm, 12mm).

Compatible con 98% de vehículos (manuales y automáticos sin botón de bloqueo).`;

async function updateProductDescription() {
    console.log('🔄 Aplicando tipografía Modern Premium...\n');

    try {
        const { data, error } = await supabase
            .from('products')
            .update({ description: newDescription })
            .eq('id', 'fcd9bf2d-53e1-4884-83ca-8eb17efa4fab')
            .select();

        if (error) throw error;

        console.log('✅ Descripción actualizada con formato Modern Premium!\n');
        console.log('📦 Producto:', data[0].name);
        console.log('📝 Nueva estructura:');
        console.log('   • Headline (H1): "Transforma Tu Carro..."');
        console.log('   • Price Tag: "Efecto LED de $500..."');
        console.log('   • Section (H2): "¿Por qué es diferente..."');
        console.log('   • Bullets (5): Beneficios clave');
        console.log('   • Footer: Compatibilidad\n');
        console.log('🎨 Formato aplicado según: typography_design_system.md\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateProductDescription();
