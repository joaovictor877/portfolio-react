import { motion } from 'motion/react';
import { Code2, Database, FileText, Palette } from 'lucide-react';

const skills = [
  {
    category: 'Programação',
    icon: Code2,
    color: 'from-cyan-500 to-blue-500',
    technologies: ['Java', 'SQL', 'HTML', 'CSS', 'JavaScript']
  },
  {
    category: 'Banco de Dados',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
    technologies: ['SQL Server', 'MySQL', 'Consultas', 'Otimização', 'Integridade de Dados']
  },
  {
    category: 'Microsoft Office',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    technologies: ['Word', 'Excel', 'PowerPoint', 'Access', 'Análise de Dados']
  },
  {
    category: 'Design & Frontend',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    technologies: ['HTML5', 'CSS3', 'Responsive Design', 'UI/UX', 'Web Design']
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Habilidades Técnicas
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Competências desenvolvidas durante minha formação acadêmica e projetos pessoais
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:transform hover:scale-105 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${skill.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300 border border-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Destaques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
              <h4 className="text-xl mb-3 text-cyan-400">💻 Java & Desenvolvimento</h4>
              <p className="text-slate-300">
                Conhecimento em Java, uma linguagem de programação versátil e robusta. 
                Capacidade de desenvolver soluções eficientes e escaláveis.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <h4 className="text-xl mb-3 text-purple-400">📊 Pacote Office Completo</h4>
              <p className="text-slate-300">
                Habilidades sólidas em Microsoft Word, PowerPoint, Excel para análise de dados 
                e criação de planilhas complexas, e Access para gerenciamento de bancos de dados.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}