import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, Loader2, LogIn, UserPlus, User } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      } else {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'membro'
            },
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setSuccess("Conta criada com sucesso! Por favor, verifique sua caixa de entrada para confirmar o email.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-sm backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00dbe9] via-[#bd00ff] to-[#ff4b89]"></div>
            <div className="p-6 sm:p-8">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-extrabold text-white mb-2">
                  {isLogin ? "Bem-vindo!" : "Criar conta"}
                </h2>
                <p className="text-gray-400 font-body text-sm">
                  {isLogin 
                    ? "Faça login para salvar seus animes." 
                    : "Cadastre-se para começar a organizar."}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-body">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm font-body">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Nome completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        id="fullName"
                        required={!isLogin}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#bd00ff]/50 focus:ring-1 focus:ring-[#bd00ff]/50 font-body shadow-inner transition-colors"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#bd00ff]/50 focus:ring-1 focus:ring-[#bd00ff]/50 font-body shadow-inner transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#bd00ff]/50 focus:ring-1 focus:ring-[#bd00ff]/50 font-body shadow-inner transition-colors"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 font-body">Confirmação de Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        id="confirmPassword"
                        required={!isLogin}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#bd00ff]/50 focus:ring-1 focus:ring-[#bd00ff]/50 font-body shadow-inner transition-colors"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#bd00ff] to-[#ff4b89] text-white font-bold tracking-wide shadow-[0_0_15px_rgba(189,0,255,0.3)] hover:shadow-[0_0_25px_rgba(189,0,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />
                    )}
                    <span>{isLogin ? "Entrar" : "Cadastrar"}</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccess("");
                    setFullName("");
                    setConfirmPassword("");
                  }}
                  className="text-sm text-gray-400 hover:text-white font-body transition-colors focus:outline-none"
                >
                  {isLogin 
                    ? "Não tem uma conta? Cadastre-se" 
                    : "Já tem uma conta? Faça login"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
