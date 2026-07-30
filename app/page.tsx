"use client";
import { useState, useEffect } from "react";
import { Loader2, Plus, LogIn, LogOut, User } from "lucide-react";
import { getAnimes, createAnime, deleteAnime, updateAnime } from "../lib/animes";
import { AnimeCard, Anime } from "../components/AnimeCard";
import { SearchBar } from "../components/SearchBar";
import { AddAnimeModal } from "../components/AddAnimeModal";
import { EditAnimeModal } from "../components/EditAnimeModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { AuthModal } from "../components/AuthModal";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [recommendedAnimes, setRecommendedAnimes] = useState<Anime[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [animeToEdit, setAnimeToEdit] = useState<Anime | null>(null);
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('membro');

  useEffect(() => {
    const fetchUserAndRole = async (currentUser: any) => {
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        if (data) {
          setUserRole(data.role);
        }
      } else {
        setUserRole('membro');
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndRole(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndRole(session?.user ?? null);
    });

    async function loadAnimes() {
      try {
        const data = await getAnimes();
        if (Array.isArray(data)) {
          setRecommendedAnimes(data);
        }
      } catch (error) {
        console.error("Failed to load animes", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnimes();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'animes',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newAnime = {
              ...payload.new,
              tags: payload.new.tags ?? []
            } as Anime;
            setRecommendedAnimes(prev => {
              if (!prev.find(a => a.id === newAnime.id)) {
                return [newAnime, ...prev];
              }
              return prev;
            });
          } else if (payload.eventType === 'DELETE') {
            setRecommendedAnimes(prev => prev.filter(a => a.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedAnime = {
              ...payload.new,
              tags: payload.new.tags ?? []
            } as Anime;
            setRecommendedAnimes(prev => prev.map(a => a.id === updatedAnime.id ? updatedAnime : a));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, []);

  const handleCrieAnime = async (anime: Omit<Anime, 'id'>) => {
    try {
      const novoAnime = await createAnime(anime);
      setRecommendedAnimes(prev => {
        if (!prev.find(a => a.id === novoAnime.id)) {
           return [novoAnime, ...prev];
        }
        return prev;
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add anime", error);
    }
  };

  const handleDeletarAnime = async (id: number) => {
    try {
      await deleteAnime(id);
      setRecommendedAnimes(prev => prev.filter(a => a.id !== id));
      setIsDeleteModalOpen(false);
      setAnimeToDelete(null);
    } catch (error) {
      console.error("Failed to delete anime", error);
    }
  };

  const openDeleteModal = (anime: Anime) => {
    setAnimeToDelete(anime);
    setIsDeleteModalOpen(true);
  };

  const handleEditAnime = async (id: number, updatedData: Omit<Anime, 'id' | 'slug' | 'novo'>) => {
    try {
      const updatedAnime = await updateAnime(id, updatedData);
      setRecommendedAnimes(prev => prev.map(a => a.id === updatedAnime.id ? updatedAnime : a));
      setIsEditModalOpen(false);
      setAnimeToEdit(null);
    } catch (error) {
      console.error("Failed to update anime", error);
    }
  };

  const openEditModal = (anime: Anime) => {
    setAnimeToEdit(anime);
    setIsEditModalOpen(true);
  };

  const filteredAnimes = recommendedAnimes.filter(anime => 
    anime.titulos.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (anime.tags && anime.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (anime.genero && anime.genero.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen pb-20">
      <nav className="absolute top-0 w-full p-6 flex justify-end items-center z-10">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 font-body text-sm bg-black/20 px-4 py-2 rounded-full border border-white/5">
              <User className="w-4 h-4 text-[#bd00ff]" />
              <span className="hidden sm:inline">{user.email} {isAdmin ? '(Admin)' : '(Membro)'}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 font-body text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 bg-[#bd00ff] hover:bg-[#9900cf] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(189,0,255,0.4)] hover:shadow-[0_0_25px_rgba(189,0,255,0.6)] font-body text-sm uppercase tracking-wider"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
        )}
      </nav>

      <div className="pt-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#bd00ff] via-[#ff4b89] to-[#00dbe9] tracking-tighter">
            AnimeKiwi
          </h1>
          <p className="text-[#d4c0d7] font-body text-lg md:text-xl max-w-2xl">
            A melhor experiência cinematográfica de streaming de animes.
          </p>
        </div>
        
        {user ? (
          <>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold">Catálogo</h2>
              {isAdmin && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold transition-colors font-body text-sm uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Anime
                </button>
              )}
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredAnimes.map((anime) => (
                  <AnimeCard 
                    key={anime.id} 
                    anime={anime} 
                    onDelete={isAdmin ? () => openDeleteModal(anime) : undefined} 
                    onEdit={isAdmin ? () => openEditModal(anime) : undefined} 
                  />
                ))}
                {filteredAnimes.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500 font-body">
                    Nenhum anime encontrado.
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <User className="w-16 h-16 text-gray-600" />
            <p className="text-gray-400 font-body text-lg">
              Faça login para visualizar o catálogo.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body hover:bg-white/10 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        )}
      </div>
      <AddAnimeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleCrieAnime}
      />
      <EditAnimeModal
        key={animeToEdit?.id || 'empty'}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setAnimeToEdit(null);
        }}
        onEdit={handleEditAnime}
        animeToEdit={animeToEdit}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAnimeToDelete(null);
        }}
        onConfirm={handleDeletarAnime}
        animeToDelete={animeToDelete}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
