import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env vars from .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function main() {
    const jsonFile = process.argv[2];
    if (!jsonFile) {
        console.error("Please provide the path to the reporte_dropanas_*.json file.");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    console.log(`Loaded report with ${data.nuevos.length} new products and ${data.eliminados.length} removed ones.`);

    // 1. Desactivar eliminados
    if (data.eliminados && data.eliminados.length > 0) {
        console.log(`\nDeactivating ${data.eliminados.length} products...`);
        let deactCount = 0;
        for (const p of data.eliminados) {
            const { error } = await supabase.from('products').update({ is_active: false }).eq('id', p.id);
            if (error) {
                console.error(`Error deactivating ${p.name}:`, error);
            } else {
                deactCount++;
            }
        }
        console.log(`Deactivated ${deactCount} products.`);
    }

    // 2. Añadir nuevos
    if (data.nuevos && data.nuevos.length > 0) {
        console.log(`\nAdding ${data.nuevos.length} new products...`);
        let newCount = 0;
        for (const p of data.nuevos) {
            const productData = {
                name: p.name,
                slug: slugify(p.name) + '-' + Math.floor(Math.random() * 1000),
                description: p.description || '<p>Descripción pendiente...</p>',
                price: p.precio_venta_ideal || 0,
                compare_at_price: p.compare_at_ideal || 0,
                stock: p.stock || 0,
                images: p.images || [],
                category: 'Nuevos',
                is_active: p.stock > 0 && p.images && p.images.length > 0,
                dropanas_price: p.precio_proveedor || 0,
                dropanas_url: p.url,
                featured: false
            };

            // Only add if it has stock and pictures as requested "quita los que tienen stock 0 o no tienen foto" (scraper already did this, but just to be sure)
            if (productData.is_active) {
                const { error } = await supabase.from('products').insert(productData);
                if (error) {
                    console.error(`Error inserting ${p.name}:`, error);
                } else {
                    newCount++;
                    console.log(`  Added: ${p.name}`);
                }
            } else {
                console.log(`  Skipped (Inactive/No stock/No photos): ${p.name}`);
            }
        }
        console.log(`Added ${newCount} new products.`);
    }

    console.log("\nDone!");
}

main();
