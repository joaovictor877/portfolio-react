import { motion } from 'motion/react';
import { Edit2, Trash2, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
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
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Nenhum projeto ainda</h3>
        <p className="text-slate-500">Clique em "Adicionar Novo Projeto" para começar</p>
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-slate-950/50 border border-slate-800/50 hover:border-[#00ffc8]/30 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-[#00ffc8]/5"
        >
          {(() => {
            const thumbnailUrl = project.imageUrl || project.imageUrls?.[0];
            return (
          <div className="flex flex-row gap-4 p-4 items-start">
            {/* Image */}
            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
              {thumbnailUrl ? (
                <>
                  <img
                    src={thumbnailUrl}
                    alt={project.title || "Projeto"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-700" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Title and Category */}
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-[#00ffc8] transition-colors">
                {project.title || "(Sem título)"}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ffc8]/10 text-[#00ffc8] rounded-md border border-[#00ffc8]/20">
                  <Tag className="w-3 h-3" />
                  {project.category || "(Sem categoria)"}
                </span>
                {project.createdAt && (
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.createdAt)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 line-clamp-3 mb-3">
                {project.description || "(Sem descrição)"}
              </p>

              {/* Tech Stack */}
              {project.tech && project.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.tech.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-800/70 text-slate-300 text-xs rounded-md border border-slate-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-800/50 text-slate-500 text-xs rounded-md">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                onClick={() => onEdit(project)}
                size="sm"
                className="h-8 px-3 bg-[#00ffc8]/10 hover:bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/20 hover:border-[#00ffc8]/40"
                variant="outline"
              >
                <Edit2 className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline text-xs">Editar</span>
              </Button>
              <Button
                onClick={() => onDelete(project.id)}
                size="sm"
                className="h-8 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40"
                variant="outline"
              >
                <Trash2 className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline text-xs">Excluir</span>
              </Button>
            </div>
          </div>
            );
          })()}

          {/* Hover Effect Border */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </motion.div>
      ))}
    </div>
  );
}
