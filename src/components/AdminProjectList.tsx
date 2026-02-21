import { motion } from 'motion/react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import type { Project } from '../pages/Admin';

interface AdminProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function AdminProjectList({ projects, onEdit, onDelete }: AdminProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚀</div>
        <p className="text-slate-400 text-lg">
          Nenhum projeto ainda. Crie seu primeiro!
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 sm:p-6 hover:border-[#00ffc8]/30 transition-all group"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Imagem */}
            <div className="w-full lg:w-48 h-48 flex-shrink-0">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00ffc8]/20 to-[#00b8ff]/20 rounded-lg flex items-center justify-center">
                  <span className="text-slate-500 text-sm">Sem imagem</span>
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-[#00ffc8] truncate mb-1">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="capitalize bg-slate-800 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    {project.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(project.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações (Desktop) */}
                <div className="hidden sm:flex gap-2">
                  <Button
                    onClick={() => onEdit(project)}
                    size="sm"
                    className="bg-[#00ffc8] hover:bg-[#00e6b0] text-slate-950"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => onDelete(project.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </div>

              <p className="text-slate-400 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tecnologias */}
              {project.tech && project.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-[#00ffc8]/10 text-[#00ffc8] px-3 py-1 rounded-full text-sm border border-[#00ffc8]/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Ações (Mobile) */}
              <div className="flex sm:hidden gap-2 mt-4">
                <Button
                  onClick={() => onEdit(project)}
                  size="sm"
                  className="flex-1 bg-[#00ffc8] hover:bg-[#00e6b0] text-slate-950"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => onDelete(project.id)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Deletar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
