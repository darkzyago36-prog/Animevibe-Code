import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center group">
        <Search className="absolute left-5 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar animes por título ou gênero..."
          className="w-full pl-14 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 font-body shadow-lg backdrop-blur-md transition-all text-sm md:text-base"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            aria-label="Limpar busca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
