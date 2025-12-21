import { motion } from 'motion/react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const education = [
  {
    degree: 'Ensino Médio Técnico em T.I',
    institution: 'Senac Santo Amaro',
    period: '2021 - 2023',
    status: 'Concluído',
    description: 'Formação técnica em Tecnologia da Informação com foco em desenvolvimento e infraestrutura.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    degree: 'Engenharia de Computação',
    institution: 'Senac Santo Amaro',
    period: '2024 - 2028',
    status: 'Cursando 4º semestre',
    description: 'Graduação em Engenharia de Computação com ênfase em desenvolvimento de software e sistemas.',
    color: 'from-blue-500 to-indigo-500'
  }
];

export function Education() {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Formação Acadêmica
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Minha trajetória educacional na área de tecnologia
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500 transform -translate-x-1/2"></div>

            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative mb-12 md:grid md:grid-cols-2 md:gap-8 ${
                  index % 2 === 0 ? '' : 'md:grid-flow-dense'
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-1/2 border-4 border-slate-950 shadow-lg shadow-cyan-500/50"></div>

                {/* Content */}
                <div className={index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${edu.color} group-hover:scale-110 transition-transform`}>
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        edu.status.includes('Concluído')
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {edu.status}
                      </span>
                    </div>

                    <h3 className="text-2xl mb-2 text-cyan-400">{edu.degree}</h3>
                    <h4 className="text-xl text-blue-400 mb-3">{edu.institution}</h4>
                    
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>Santo Amaro, SP</span>
                    </div>

                    <p className="text-slate-300">{edu.description}</p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className={index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'}></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8 text-center">
            <h4 className="text-2xl mb-3 text-cyan-400">🎓 Sempre Aprendendo</h4>
            <p className="text-lg text-slate-300">
              Além da formação acadêmica, estou constantemente me atualizando através de cursos online, 
              projetos pessoais e estudos de novas tecnologias do mercado.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
