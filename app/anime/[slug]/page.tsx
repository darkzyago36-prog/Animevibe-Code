import { supabase } from "../../../lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Play } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('animes').select('slug');
    if (!data) return [];
    return data.map((anime) => ({
      slug: anime.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function AnimePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: results, error } = await supabase
    .from('animes')
    .select('*')
    .eq('slug', slug)
    .limit(1);

  if (error || !results || results.length === 0) {
    notFound();
  }

  const anime = results[0];

  return (
    <div className="min-h-screen bg-[#131316] text-[#e4e1e6] pb-20">
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={anime.capa_url}
          alt={anime.titulos}
          fill
          className="object-cover opacity-40"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/80 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-12 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-body uppercase tracking-wider text-sm font-bold w-fit">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="relative w-48 aspect-[2/3] md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden md:block">
              <Image src={anime.capa_url} alt={anime.titulos} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            
            <div className="space-y-4 pb-4">
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-white">{anime.titulos}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold font-body uppercase tracking-wider">
                <div className="flex items-center gap-1 text-pink-400">
                  <Star className="w-4 h-4 fill-pink-400" />
                  <span>{anime.nota}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-[#00dbe9]">{anime.genero}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {anime.tags && anime.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider font-body text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="pt-6">
                <button className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold font-heading text-lg transition-transform hover:scale-105 shadow-lg shadow-pink-500/20">
                  <Play className="w-5 h-5 fill-current" />
                  Assistir Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-12">
        <h2 className="text-2xl font-heading font-bold mb-4">Sobre o Anime</h2>
        <p className="font-body text-gray-400 leading-relaxed max-w-3xl text-lg">
          Este é um anime focado em {anime.genero.toLowerCase()}. O anime recebeu nota {anime.nota} da comunidade.
          Acompanhe aventuras incríveis e uma animação espetacular!
        </p>
      </div>
    </div>
  );
}
