require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.com', '.supabase.co');
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const {data, error} = await supabase.from('animes').upsert([{ 
    id: 6, 
    nota: 8, 
    slug: 'test-insert-for-upsert', 
    titulos: 'Test Upd',
    genero: 'Test',
    capa_url: 'https://picsum.photos/200',
    novo: false,
    destaque: false,
    tags: []
  }]).select();
  console.log('Upsert res:', data, error);
}
run();
