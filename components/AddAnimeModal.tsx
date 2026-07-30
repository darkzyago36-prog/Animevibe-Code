import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { Anime } from "./AnimeCard";
import { ImageUpload } from "./ImageUpload";

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (anime: Anime) => void;
}

export function AddAnimeModal({ isOpen, onClose, onAdd }: AddAnimeModalProps) {
  const [titulos, setTitulos] = useState("");
  const [genero, setGenero] = useState("");
  const [nota, setNota] = useState<number | "">(10);
  const [capa_url, setCapaUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AVAILABLE_TAGS = ["DUBLADO", "LEGENDADO", "4K", "HD", "SD", "DESTAQUE"];

  const handleTagToggle = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newAnime: Anime = {
      id: Date.now(), // Generate a unique ID
      slug: titulos.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      titulos,
      nota: Number(nota) || 0,
      genero,
      capa_url: capa_url || "https://picsum.photos/seed/anime/300/450", // Fallback image
      novo: true,
      destaque: tags.includes("DESTAQUE"),
      tags: tags.filter(t => t !== "DESTAQUE"),
    };

    setTimeout(() => {
      onAdd(newAnime);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitulos("");
      setGenero("");
      setNota(10);
      setCapaUrl("");
      setTags([]);
    }, 500); // Simulate network request
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00dbe9] via-[#bd00ff] to-[#ff4b89]"></div>
            <div className="p-4 sm:p-5 overflow-y-auto flex-1">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-3">
                <h2 className="text-2xl font-heading font-extrabold text-white mb-2">
                  Adicionar Anime
                </h2>
                <p className="text-gray-400 font-body text-sm">
                  Preencha os detalhes para adicionar um novo anime à coleção.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="titulos" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Título</label>
                  <input
                    type="text"
                    id="titulos"
                    required
                    value={titulos}
                    onChange={(e) => setTitulos(e.target.value)}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 font-body shadow-inner transition-colors"
                    placeholder="Ex: Cyberpunk Edgerunners"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="genero" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Gênero</label>
                    <input
                      type="text"
                      id="genero"
                      required
                      value={genero}
                      onChange={(e) => setGenero(e.target.value)}
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 font-body shadow-inner transition-colors"
                      placeholder="Ex: Ação, Sci-Fi"
                    />
                  </div>
                  <div>
                    <label htmlFor="nota" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Nota</label>
                    <input
                      type="number"
                      id="nota"
                      required
                      min="1"
                      max="10"
                      step="0.1"
                      value={nota}
                      onChange={(e) => setNota(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 font-body shadow-inner transition-colors"
                      placeholder="10.0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="capa_url" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Capa do Anime</label>
                  <div className="space-y-3">
                    <ImageUpload onUploadSuccess={setCapaUrl} currentImageUrl={capa_url} />
                    
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-white/10"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Ou insira a URL</span>
                      <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="url"
                        id="capa_url"
                        value={capa_url}
                        onChange={(e) => setCapaUrl(e.target.value)}
                        className="w-full pl-12 pr-5 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 font-body shadow-inner transition-colors"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 font-body">Tags (Opcional)</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                          tags.includes(tag) 
                            ? "bg-pink-600 border-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                            : "bg-black/20 border-white/10 text-gray-400 hover:border-pink-500/50 hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2 text-sm font-bold tracking-wider uppercase text-gray-400 hover:text-white transition-colors focus:outline-none rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#0f111a]"
                  >
                    {isSubmitting ? (
                      "Adicionando..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Adicionar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
