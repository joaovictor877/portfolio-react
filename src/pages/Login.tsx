import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, LogIn, User, Lock, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', username);
        
        toast.success('Login realizado com sucesso! 🎉');
        setTimeout(() => navigate('/admin'), 500);
      } else {
        toast.error(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro ao fazer login. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ffc8]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00b8ff]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-br from-[#00ffc8]/10 via-[#00b8ff]/10 to-transparent p-8 sm:p-10 border-b border-slate-800/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffc8]/10 rounded-full blur-2xl" />
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ffc8] to-[#00b8ff] flex items-center justify-center shadow-lg shadow-[#00ffc8]/25">
                  <Shield className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Área Restrita</h1>
                  <p className="text-sm text-slate-400">Painel Administrativo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-[#00ffc8]/70">
                <Zap className="w-3 h-3" />
                <span>Acesso seguro e criptografado</span>
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-8 sm:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00ffc8]" />
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 bg-slate-950/50 border-slate-700/50 focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 text-white placeholder:text-slate-500 rounded-xl transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#00ffc8]" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-slate-950/50 border-slate-700/50 focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 text-white placeholder:text-slate-500 rounded-xl pr-12 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00ffc8] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950/50 text-[#00ffc8] focus:ring-[#00ffc8]/20 focus:ring-2 transition-all"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Lembrar-me</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => toast.info('Entre em contato com o administrador')}
                  className="text-sm text-[#00ffc8] hover:text-[#00b8ff] transition-colors font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] hover:from-[#00e6b0] hover:to-[#00a0e6] text-slate-950 font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#00ffc8]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                    Autenticando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Acessar Painel
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Footer */}
          <div className="px-8 sm:px-10 pb-8 sm:pb-10">
            <div className="pt-6 border-t border-slate-800/50">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-[#00ffc8] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Portfólio
              </Link>
            </div>
          </div>
        </div>

        {/* Version Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <span className="text-xs text-slate-600">Admin Panel v2.0</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
