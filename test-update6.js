require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.com', '.supabase.co');
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  await supabase.from('animes').delete().eq('id', 6);
  const {data, error} = await supabase.from('animes').insert([{ 
    id: 6, 
    nota: 8.5, 
    slug: 'test-insert-for-upsert', 
    titulos: 'Test Upd',
    genero: 'Test',
    capa_url: 'https://picsum.photos/200',
    novo: false,
    destaque: false,
    tags: []
  }]).select();
  console.log('Insert with explicit ID res:', data, error);
}
run();
