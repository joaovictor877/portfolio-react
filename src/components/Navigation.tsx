import { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-cyan-400" />
            <span className="text-xl tracking-tight">João Victor</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="hover:text-cyan-400 transition-colors">
              Início
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors">
              Sobre
            </button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-cyan-400 transition-colors">
              Habilidades
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-cyan-400 transition-colors">
              Projetos
            </button>
            <button onClick={() => scrollToSection('education')} className="hover:text-cyan-400 transition-colors">
              Formação
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition-colors">
              Contato
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
            >
              Habilidades
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
            >
              Projetos
            </button>
            <button
              onClick={() => scrollToSection('education')}
              className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
            >
              Formação
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
            >
              Contato
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}