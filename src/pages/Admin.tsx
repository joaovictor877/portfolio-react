import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { LogOut, Plus, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { AdminProjectForm } from "../components/AdminProjectForm";
import { AdminProjectList } from "../components/AdminProjectList";
import { toast } from "sonner";

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
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigate("/login");
      return;
    }

    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      const sorted = (data.projects || []).sort(
        (a: Project, b: Project) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      );
      setProjects(sorted);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      toast.error("Erro ao carregar projetos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUser");
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: projectId }),
      });

      if (!response.ok) throw new Error("Falha ao deletar");

      toast.success("Projeto deletado com sucesso! ✅");
      await loadProjects();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar projeto");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#00ffc8]/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#00b8ff]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] text-transparent bg-clip-text flex items-center gap-3">
              📱 Gerenciador de Projetos
            </h1>
            <p className="text-slate-400 mt-2">Olá, {localStorage.getItem("adminUser")}</p>
          </div>

          <div className="flex gap-3">
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] hover:from-[#00e6b0] hover:to-[#00a0e6] text-slate-950 font-bold transition-all hover:shadow-lg hover:shadow-[#00ffc8]/30"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Projeto
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Form Section */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
              <button
                onClick={handleCancelEdit}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-[#00ffc8] mb-6">
                {editingProject ? "Editar Projeto" : "Adicionar Novo Projeto"}
              </h2>

              <AdminProjectForm
                editingProject={editingProject}
                onSuccess={handleFormSuccess}
                onCancel={handleCancelEdit}
              />
            </div>
          </motion.div>
        )}

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-[#00ffc8] mb-6">
            Meus Projetos ({projects.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-12 h-12 border-4 border-[#00ffc8]/20 border-t-[#00ffc8] rounded-full animate-spin mx-auto mb-4" />
              Carregando projetos...
            </div>
          ) : (
            <AdminProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
