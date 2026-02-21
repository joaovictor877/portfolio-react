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
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description);
      setCategory(editingProject.category);
      setTechList(editingProject.tech || []);

      const urls = (editingProject.imageUrls && editingProject.imageUrls.length > 0)
        ? editingProject.imageUrls
        : (editingProject.imageUrl ? [editingProject.imageUrl] : []);

      setExistingImageUrls(urls);
      setSelectedImages([]);
    } else {
      setExistingImageUrls([]);
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

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
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

      // Começa com as imagens já existentes (se estiver editando)
      const finalImageUrls: string[] = [...(existingImageUrls || [])];

      // Upload de imagens
      if (selectedImages.length > 0) {
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
              finalImageUrls.push(json.url);
            }
          } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            toast.error(`Falha ao enviar ${file.name}`);
          }
        }
      }

      if (finalImageUrls.length > 0) {
        projectData.imageUrls = finalImageUrls;
        projectData.imageUrl = finalImageUrls[0];
      } else {
        // sem imagens
        delete projectData.imageUrls;
        delete projectData.imageUrl;
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
      setExistingImageUrls([]);
      setSelectedImages([]);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título e Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-slate-300">
            Título do Projeto *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Sistema de Gerenciamento"
            className="h-11 bg-slate-950/50 border-slate-700/50 focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 text-white placeholder:text-slate-500 rounded-lg transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-slate-300">
            Categoria *
          </Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 px-4 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 outline-none transition-all text-white"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="web">Web Application</option>
            <option value="backend">Backend/API</option>
            <option value="mobile">Mobile App</option>
            <option value="arduino">IoT/Arduino</option>
            <option value="projeto">Outro Projeto</option>
          </select>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-slate-300">
          Descrição do Projeto *
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva as principais funcionalidades e objetivos do projeto..."
          className="bg-slate-950/50 border-slate-700/50 focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 min-h-[120px] text-white placeholder:text-slate-500 rounded-lg resize-none transition-all"
          required
        />
      </div>

      {/* Tecnologias */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-300">Tecnologias Utilizadas</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="Digite uma tecnologia e pressione Enter"
            className="h-11 bg-slate-950/50 border-slate-700/50 focus:border-[#00ffc8] focus:ring-2 focus:ring-[#00ffc8]/20 text-white placeholder:text-slate-500 rounded-lg transition-all"
          />
          <Button
            type="button"
            onClick={handleAddTech}
            className="h-11 px-4 bg-[#00ffc8]/10 hover:bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/20 rounded-lg transition-all sm:w-auto"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
            {techList.map((tech) => (
              <motion.div
                key={tech}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 bg-slate-800/70 border border-slate-700/50 text-slate-200 px-2.5 py-1 rounded-md text-xs hover:bg-slate-800 transition-colors"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload de Imagens */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-300">Imagens do Projeto</Label>
        <div className="border-2 border-dashed border-slate-700/50 hover:border-[#00ffc8]/50 rounded-xl p-8 text-center transition-all cursor-pointer bg-slate-950/30 hover:bg-slate-950/50">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
              <Upload className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium mb-1">Clique para selecionar imagens</p>
            <p className="text-xs text-slate-500">ou arraste e solte aqui</p>
          </label>
        </div>

        {existingImageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
            {existingImageUrls.map((url, index) => (
              <motion.div
                key={`${url}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-700/50 group hover:border-[#00ffc8]/30 transition-colors"
              >
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  aria-label="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
            {selectedImages.map((file, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-700/50 group hover:border-[#00ffc8]/30 transition-colors"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-800/50">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="h-12 border-slate-700/50 hover:bg-slate-800/50 text-slate-300"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 bg-gradient-to-r from-[#00ffc8] to-[#00b8ff] hover:from-[#00e6b0] hover:to-[#00a0e6] text-slate-950 font-bold rounded-xl shadow-lg shadow-[#00ffc8]/20 hover:shadow-[#00ffc8]/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {editingProject ? 'Atualizando...' : 'Salvando...'}
            </span>
          ) : (
            <span>{editingProject ? 'Atualizar Projeto' : 'Adicionar Projeto'}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
