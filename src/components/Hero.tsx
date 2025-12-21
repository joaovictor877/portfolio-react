import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <span className="text-cyan-400">Engenheiro de Computação</span>
            </div>
            <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              João Victor Silva Souza
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-xl">
              Estudante apaixonado por tecnologia e inovação, sempre em busca de novos desafios para aprender e crescer na área de tecnologia.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                Entre em Contato
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all transform hover:scale-105"
              >
                Saiba Mais
              </button>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/joaovictor877"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all transform hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/jo%C3%A3o-victor-silva-souza-5057b1229"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all transform hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:silvasouzajoaovictor877@gmail.com"
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all transform hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="w-full aspect-square bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <img 
                  src="/images/juca_profssional.jpg" 
                  alt="João Victor Silva Souza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500 rounded-lg opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-lg opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-cyan-400" />
      </motion.button>
    </section>
  );
}