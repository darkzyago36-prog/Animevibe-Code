import { motion, AnimatePresence } from "motion/react";
import { X, Trash2 } from "lucide-react";
import { Anime } from "./AnimeCard";
import { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  animeToDelete: Anime | null;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, animeToDelete }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    if (animeToDelete) {
      setIsDeleting(true);
      setTimeout(() => {
        onConfirm(animeToDelete.id);
        setIsDeleting(false);
        onClose();
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && animeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm backdrop-blur-xl bg-[#1a1a1f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">
                Deletar Anime
              </h2>
              <p className="text-gray-400 font-body text-sm mb-8">
                Tem certeza que deseja deletar o anime <span className="font-bold text-white">&quot;{animeToDelete.titulos}&quot;</span>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold tracking-wider uppercase text-gray-400 hover:text-white transition-colors focus:outline-none rounded-lg disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none"
                >
                  {isDeleting ? "Deletando..." : "Deletar"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
