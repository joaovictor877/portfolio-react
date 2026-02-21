import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { toast } from 'sonner';
import type { Project } from '../pages/Admin';

interface AdminProjectFormProps {
  editingProject: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminProjectForm({ editingProject, onSuccess, onCancel }: AdminProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [techList, setTechList] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description);
      setCategory(editingProject.category);
      setTechList(editingProject.tech || []);
    }
  }, [editingProject]);

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !techList.includes(tech)) {
      setTechList([...techList, tech]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechList(techList.filter(t => t !== tech));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('O título é obrigatório!');
      return;
    }
    if (!description.trim()) {
      toast.error('A descrição é obrigatória!');
      return;
    }
    if (!category) {
      toast.error('Selecione uma categoria!');
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData: any = {
        title: title.trim(),
        description: description.trim(),
        category,
        tech: techList,
        createdAt: editingProject?.createdAt || new Date().toISOString()
      };

      // Upload de imagens
      if (selectedImages.length > 0) {
        projectData.imageUrls = [];
        
        for (const file of selectedImages) {
          try {
            const compressedFile = await compressImage(file);
            const base64 = await fileToBase64(compressedFile);
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: file.name, 
                type: 'image/jpeg', 
                data: base64 
              })
            });

            if (!response.ok) {
              throw new Error(`Erro ao enviar ${file.name}`);
            }

            const json = await response.json();
            if (json.url) {
              projectData.imageUrls.push(json.url);
            }
          } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            toast.error(`Falha ao enviar ${file.name}`);
          }
        }

        if (projectData.imageUrls.length > 0) {
          projectData.imageUrl = projectData.imageUrls[0];
        }
      } else if (editingProject?.imageUrl) {
        projectData.imageUrl = editingProject.imageUrl;
        projectData.imageUrls = editingProject.imageUrls || [editingProject.imageUrl];
      }

      const action = editingProject ? 'update' : 'create';
      const body = action === 'update' 
        ? { action, project: { id: editingProject.id, ...projectData } }
        : { action, project: projectData };

      const saveResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!saveResponse.ok) {
        throw new Error('Falha ao salvar projeto');
      }

      toast.success(
        editingProject 
          ? 'Projeto atualizado com sucesso! ✅' 
          : 'Projeto adicionado com sucesso! ✅'
      );
      
      onSuccess();
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setTechList([]);
      setSelectedImages([]);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Título e Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="title" className="text-[#00ffc8] text-sm sm:text-base">
            Título do Projeto *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Sistema de Gerenciamento"
            className="bg-slate-950/50 border-slate-700 focus:border-[#00ffc8] focus:ring-[#00ffc8]/20 h-10 sm:h-11 text-sm sm:text-base"
            required
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="category" className="text-[#00ffc8] text-sm sm:text-base">
            Categoria *
          </Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 sm:py-2.5 bg-slate-950/50 border border-slate-700 rounded-md focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 outline-none transition-all text-white text-sm sm:text-base h-10 sm:h-11"
            required
          >
            <option value="">Selecione...</option>
            <option value="web">🌐 Web</option>
            <option value="backend">⚙️ Backend</option>
            <option value="mobile">📱 Mobile</option>
            <option value="arduino">🤖 Arduino</option>
            <option value="projeto">📂 Projeto</option>
          </select>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="description" className="text-[#00ffc8] text-sm sm:text-base">
          Descrição *
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva seu projeto..."
          className="bg-slate-950/50 border-slate-700 focus:border-[#00ffc8] focus:ring-[#00ffc8]/20 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
          required
        />
      </div>

      {/* Tecnologias */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-[#00ffc8] text-sm sm:text-base">Tecnologias</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="Ex: React, Node.js"
            className="bg-slate-950/50 border-slate-700 focus:border-[#00ffc8] focus:ring-[#00ffc8]/20 h-10 sm:h-11 text-sm sm:text-base"
          />
          <Button
            type="button"
            onClick={handleAddTech}
            className="bg-[#00ffc8] hover:bg-[#00e6b0] text-slate-950 h-10 sm:h-11 px-3 sm:px-4"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            {techList.map((tech) => (
              <motion.div
                key={tech}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#00ffc8]/10 border border-[#00ffc8] text-[#00ffc8] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload de Imagens */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-[#00ffc8] text-sm sm:text-base">🖼️ Imagens</Label>
        <div className="border-2 border-dashed border-slate-700 hover:border-[#00ffc8] rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-all cursor-pointer bg-slate-950/30">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 text-slate-500" />
            <p className="text-slate-400 text-xs sm:text-sm">
              Clique ou arraste imagens
            </p>
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
            {selectedImages.map((file, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 h-10 sm:h-11"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] hover:from-[#00e6b0] hover:to-[#00a0e6] text-slate-950 font-bold py-5 sm:py-6 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:shadow-[#00ffc8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              {editingProject ? 'Atualizando...' : 'Adicionando...'}
            </span>
          ) : (
            <span className="text-sm sm:text-base">{editingProject ? '✅ Atualizar' : '➕ Adicionar'}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
