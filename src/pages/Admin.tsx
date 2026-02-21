import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { LogOut, Plus, X, Folder, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AdminProjectForm } from '../components/AdminProjectForm';
import { AdminProjectList } from '../components/AdminProjectList';
import { toast } from 'sonner';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  imageUrl?: string;
  imageUrls?: string[];
  createdAt?: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
      navigate('/login');
      return;
    }

    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      const sorted = (data.projects || []).sort(
        (a: Project, b: Project) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setProjects(sorted);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: projectId })
      });

      if (!response.ok) throw new Error('Falha ao deletar');
      
      toast.success('Projeto deletado com sucesso! ✅');
      await loadProjects();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar projeto');
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingProject(null);
    await loadProjects();
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ffc8]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00b8ff]/3 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,200,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ffc8] to-[#00b8ff] flex items-center justify-center">
                <Folder className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Dashboard</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Gerencie seus projetos</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm text-slate-400 hidden md:block">
                {localStorage.getItem('adminUser')}
              </span>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative z-10">
        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total de Projetos</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#00ffc8]">{projects.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00ffc8]/10 flex items-center justify-center">
                <Folder className="w-6 h-6 text-[#00ffc8]" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Adicionados</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#00b8ff]">
                  {projects.filter(p => {
                    const date = new Date(p.createdAt || '');
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return date > thirtyDaysAgo;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00b8ff]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#00b8ff]" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Últimos 30 dias</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Última Atualização</p>
                <p className="text-lg sm:text-xl font-semibold text-white">
                  {projects.length > 0 
                    ? new Date(projects[0].createdAt || '').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    : '--'
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Project Button */}
        {!showForm && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] hover:from-[#00e6b0] hover:to-[#00a0e6] text-slate-950 font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#00ffc8]/20 hover:shadow-[#00ffc8]/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Novo Projeto
            </Button>
          </motion.div>
        )}

        {/* Form Section */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#00ffc8]/10 to-[#00b8ff]/10 px-4 sm:px-6 py-4 border-b border-slate-800/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {editingProject ? 'Atualize as informações do projeto' : 'Preencha os dados do novo projeto'}
                  </p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="w-8 h-8 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                <AdminProjectForm
                  editingProject={editingProject}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden"
        >
          {/* List Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-800/50">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-[#00ffc8]" />
              Meus Projetos
              <span className="ml-2 px-2 py-0.5 bg-[#00ffc8]/10 text-[#00ffc8] text-sm font-semibold rounded-full">
                {projects.length}
              </span>
            </h2>
          </div>

          {/* List Content */}
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-[#00ffc8]/20 border-t-[#00ffc8] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Carregando projetos...</p>
              </div>
            ) : (
              <AdminProjectList
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
