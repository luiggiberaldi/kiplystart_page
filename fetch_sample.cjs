const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const { data } = await supabase.from('products').select('name, description').eq('category', 'Accesorios para Carros').limit(3);
    console.log(JSON.stringify(data, null, 2));
}

run();
