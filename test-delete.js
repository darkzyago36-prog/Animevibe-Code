require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.com', '.supabase.co');
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const {data: allData} = await supabase.from('animes').select('*').limit(1);
  if (!allData || allData.length === 0) return console.log('no data');
  const id = allData[0].id;
  console.log('id is', id);
  const {data, error} = await supabase.from('animes').delete().eq('id', id).select();
  console.log('Delete res:', data, error);
}
run();
