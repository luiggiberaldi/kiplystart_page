import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://gqtjsicdnwkdsfwqzwho.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdGpzaWNkbndrZHNmd3F6d2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzM2NTcsImV4cCI6MjA4NTc0OTY1N30.XTQtspxwiLWWGL24nKvu5oQEBVNVGQX5iOeESynpy4k'
);

async function fetchTowelProduct() {
    // Search for towel/toalla products
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('name.ilike.%toalla%,name.ilike.%towel%,slug.ilike.%toalla%')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n=== PRODUCTOS ENCONTRADOS ===\n');
    data.forEach(product => {
        console.log(`ID: ${product.id}`);
        console.log(`Nombre: ${product.name}`);
        console.log(`Slug: ${product.slug}`);
        console.log(`Precio: $${product.price}`);
        console.log(`Imagen principal: ${product.image_url}`);
        if (product.images && product.images.length > 0) {
            console.log(`Imágenes adicionales (${product.images.length}):`);
            product.images.forEach((img, idx) => {
                console.log(`  ${idx + 1}. ${img}`);
            });
        }
        console.log('---\n');
    });
}

fetchTowelProduct();
