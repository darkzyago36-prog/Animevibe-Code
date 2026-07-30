require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.com', '.supabase.co');
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('animes').insert([{
  slug: 'test-insert-' + Date.now(),
  titulos: 'Test',
  nota: 10,
  genero: 'Test',
  capa_url: 'https://picsum.photos/200',
  novo: false,
  destaque: false,
  tags: ['Test']
}]).select().then(({data, error}) => {
  if (error) { console.error("Error:", JSON.stringify(error, null, 2)); process.exit(1); }
  else { console.log("Success! Data:", data); process.exit(0); }
});
