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
      <div className="text-center py-12 sm:py-16">
        <div className="text-5xl sm:text-6xl mb-4">🚀</div>
        <p className="text-slate-400 text-base sm:text-lg px-4">
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
    <div className="space-y-3 sm:space-y-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-950/50 border border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:border-[#00ffc8]/30 transition-all group"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Cabeçalho Mobile - Imagem + Título */}
            <div className="flex gap-3 sm:gap-4">
              {/* Imagem - Menor em mobile */}
              <div className="w-20 h-20 sm:w-32 sm:h-32 lg:w-48 lg:h-48 flex-shrink-0">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00ffc8]/20 to-[#00b8ff]/20 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500 text-xs sm:text-sm">Sem imagem</span>
                  </div>
                )}
              </div>

              {/* Informações principais */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#00ffc8] mb-1 sm:mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400 mb-2">
                  <span className="capitalize bg-slate-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    {project.category}
                  </span>
                  {project.createdAt && (
                    <span className="hidden sm:flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {formatDate(project.createdAt)}
                    </span>
                  )}
                </div>
                
                {/* Descrição - Escondida em telas muito pequenas */}
                <p className="hidden sm:block text-slate-400 text-sm mb-2 line-clamp-2 lg:line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Descrição Mobile (abaixo da imagem) */}
            <p className="sm:hidden text-slate-400 text-sm line-clamp-2">
              {project.description}
            </p>

            {/* Tecnologias */}
            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.tech.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="bg-[#00ffc8]/10 text-[#00ffc8] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm border border-[#00ffc8]/30"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Data (Mobile apenas) */}
            {project.createdAt && (
              <div className="sm:hidden flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                {formatDate(project.createdAt)}
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <Button
                onClick={() => onEdit(project)}
                size="sm"
                className="flex-1 bg-[#00ffc8] hover:bg-[#00e6b0] text-slate-950 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Editar</span>
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button
                onClick={() => onDelete(project.id)}
                size="sm"
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Deletar</span>
                <span className="sm:hidden">Del</span>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
