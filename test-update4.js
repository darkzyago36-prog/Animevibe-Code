require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.com', '.supabase.co');
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const {data: ins, error: err1} = await supabase.from('animes').insert([{
    slug: 'test-insert-for-upsert',
    titulos: 'Test Upd',
    nota: 10,
    genero: 'Test',
    capa_url: 'https://picsum.photos/200',
    novo: false,
    destaque: false,
    tags: []
  }]).select();
  if (err1) return console.log(err1);
  const id = ins[0].id;
  console.log('inserted id', id);
  
  const {data, error} = await supabase.from('animes').upsert([{ id, nota: 8, slug: 'test-insert-for-upsert', titulos: 'Test Upd' }]).select();
  console.log('Upsert res:', data, error);
}
run();
