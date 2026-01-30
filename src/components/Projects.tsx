import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { API_ENDPOINTS, fetchWithTimeout } from "../config/api";

interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageUrls?: string[];
  tech: string[];
  createdAt?: string;
}

const categories = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Web" },
  { id: "backend", label: "Backend" },
  { id: "mobile", label: "Mobile" },
  { id: "arduino", label: "Arduino" },
  { id: "projeto", label: "Projeto" },
];

// Projetos de exemplo (fallback caso a API não funcione)
const exampleProjects: Project[] = [];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<
    Project[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [autoPlayTimers, setAutoPlayTimers] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === selectedCategory),
      );
    }
  }, [selectedCategory, projects]);

  // Auto-play for project images
  useEffect(() => {
    // Clear all timers
    Object.values(autoPlayTimers).forEach((timer) =>
      clearInterval(timer),
    );

    const newTimers: { [key: string]: NodeJS.Timeout } = {};

    filteredProjects.forEach((project) => {
      const images = getProjectImages(project);
      const projectId =
        project.id || `project-${project.title}`;

      if (images.length > 1) {
        newTimers[projectId] = setInterval(() => {
          setCurrentImageIndex((prev) => ({
            ...prev,
            [projectId]:
              ((prev[projectId] || 0) + 1) % images.length,
          }));
        }, 5000); // Change image every 5 seconds
      }
    });

    setAutoPlayTimers(newTimers);

    return () => {
      Object.values(newTimers).forEach((timer) =>
        clearInterval(timer),
      );
    };
  }, [filteredProjects]);

  async function loadProjects() {
    try {
      const resp = await fetchWithTimeout(
        `${API_ENDPOINTS.projects}?t=${Date.now()}`,
        { 
          cache: "no-store",
          mode: "cors",
        },
      );

      // Verificar se a resposta é JSON
      const contentType = resp.headers.get("content-type");
      if (
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error("API não disponível");
      }

      const data = await resp.json();
      const list = (data.projects || [])
        .filter(
          (p: Project) =>
            p.title && p.description && p.category,
        )
        .sort(
          (a: Project, b: Project) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );

      if (list.length > 0) {
        setProjects(list);
        setFilteredProjects(list);
      } else {
        // Se a API retornar vazia, usar projetos de exemplo
        setProjects(exampleProjects);
        setFilteredProjects(exampleProjects);
      }
    } catch (error) {
      console.error("Erro ao carregar projetos da API:", error);
      // Em caso de erro, usar projetos de exemplo
      setProjects(exampleProjects);
      setFilteredProjects(exampleProjects);
    } finally {
      setLoading(false);
    }
  }

  const getProjectImages = (project: Project): string[] => {
    if (project.imageUrls && project.imageUrls.length > 0) {
      return project.imageUrls;
    }
    if (project.imageUrl) {
      return [project.imageUrl];
    }
    // SVG placeholder com gradiente baseado na categoria
    const colors: { [key: string]: string } = {
      web: "%2300ffc8,%2300b8ff",
      backend: "%2300b8ff,%236366f1",
      mobile: "%23ec4899,%23f43f5e",
      arduino: "%23f97316,%23eab308",
      projeto: "%2310b981,%2314b8a6",
    };
    const color =
      colors[project.category] || "%2300ffc8,%2300b8ff";
    return [
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(0,255,200)'/%3E%3Cstop offset='100%25' style='stop-color:rgb(0,184,255)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle' opacity='0.3'%3E${project.category.toUpperCase()}%3C/text%3E%3C/svg%3E`,
    ];
  };

  const nextImage = (projectId: string, maxIndex: number) => {
    // Clear auto-play timer for this project temporarily
    if (autoPlayTimers[projectId]) {
      clearInterval(autoPlayTimers[projectId]);
    }

    setCurrentImageIndex((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % maxIndex,
    }));
  };

  const prevImage = (projectId: string, maxIndex: number) => {
    // Clear auto-play timer for this project temporarily
    if (autoPlayTimers[projectId]) {
      clearInterval(autoPlayTimers[projectId]);
    }

    setCurrentImageIndex((prev) => ({
      ...prev,
      [projectId]:
        ((prev[projectId] || 0) - 1 + maxIndex) % maxIndex,
    }));
  };

  return (
    <section
      id="projects"
      className="py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Meus Projetos
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Confira os projetos que desenvolvi durante minha
            jornada na tecnologia
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 mt-4">
              Carregando projetos...
            </p>
          </div>
        )}

        {/* No Projects */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              Nenhum projeto encontrado nesta categoria.
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className={`grid gap-6 ${
            filteredProjects.length === 1 
              ? 'md:grid-cols-1 max-w-md mx-auto' 
              : filteredProjects.length === 2 
                ? 'md:grid-cols-2 max-w-4xl mx-auto' 
                : 'md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredProjects.map((project, index) => {
              const images = getProjectImages(project);
              const projectId =
                project.id || `project-${project.title}`;
              const currentIndex =
                currentImageIndex[projectId] || 0;

              return (
                <motion.div
                  key={projectId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
                >
                  {/* Image Carousel */}
                  <div className="relative h-56 bg-slate-900 overflow-hidden">
                    <motion.img
                      key={currentIndex}
                      src={images[currentIndex]}
                      alt={project.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            prevImage(projectId, images.length)
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 hover:bg-cyan-500/80 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                          onClick={() =>
                            nextImage(projectId, images.length)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 hover:bg-cyan-500/80 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6 text-white" />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (autoPlayTimers[projectId]) {
                                  clearInterval(
                                    autoPlayTimers[projectId],
                                  );
                                }
                                setCurrentImageIndex(
                                  (prev) => ({
                                    ...prev,
                                    [projectId]: idx,
                                  }),
                                );
                              }}
                              className={`h-2 rounded-full transition-all ${
                                idx === currentIndex
                                  ? "bg-cyan-400 w-8"
                                  : "bg-slate-500 w-2 hover:bg-slate-400"
                              }`}
                              aria-label={`Go to image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl mb-3 text-cyan-400">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}