import Image from "next/image";
import Link from "next/link";
import { Star, Trash2, Pencil } from "lucide-react";

export interface Anime {
  id: number;
  slug: string;
  titulos: string;
  nota: number;
  genero: string;
  capa_url: string;
  novo: boolean;
  destaque: boolean;
  tags?: string[];
}

export function AnimeCard({ anime, onDelete, onEdit }: { anime: Anime; onDelete?: (id: number) => void; onEdit?: (anime: Anime) => void }) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(anime.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(anime);
  };

  return (
    <Link href={`/anime/${anime.slug}`} className="group relative flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div className="relative w-full aspect-[2/3] rounded-2xl bg-gray-800 overflow-hidden shadow-lg border border-white/10 group-hover:border-pink-500/50 transition-colors duration-300">
        <Image
            src={anime.capa_url}
            alt={anime.titulos}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
         />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 bg-black/60 hover:bg-blue-500/80 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label="Editar Anime"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 bg-black/60 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label="Deletar Anime"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {anime.novo && (
            <div className="bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase shadow-md">
              NOVO
            </div>
          )}
          {anime.destaque && (
            <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase shadow-md">
              DESTAQUE
            </div>
          )}
          {anime.tags && anime.tags.length > 0 && anime.tags.map((tag, idx) => {
            let colorClass = "bg-pink-600";
            if (tag === "DUBLADO") colorClass = "bg-purple-600";
            else if (tag === "LEGENDADO") colorClass = "bg-cyan-600";
            else if (tag === "4K") colorClass = "bg-amber-600";
            else if (tag === "HD") colorClass = "bg-blue-600";
            else if (tag === "SD") colorClass = "bg-gray-600";
            else if (tag === "DESTAQUE") colorClass = "bg-rose-600";
            
            return (
              <div key={idx} className={`${colorClass} text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase shadow-md`}>
                {tag}
              </div>
            );
          })}
        </div>
        
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 z-10 pointer-events-none">
           <Star className="w-3 h-3 text-pink-500 fill-pink-500" />
           <span className="text-white text-xs font-bold font-heading">{anime.nota}</span>
        </div>
      </div>
      <div className="mt-3 px-1">
         <h3 className="text-white font-heading font-bold text-sm truncate group-hover:text-pink-400 transition-colors duration-300">{anime.titulos}</h3>
         <p className="text-gray-400 font-body text-xs mt-0.5 truncate">{anime.genero}</p>
      </div>
    </Link>
  );
}
