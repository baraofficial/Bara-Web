import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Layers } from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/templates';
import { PromptTemplate } from '../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromptTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  if (!isOpen) return null;

  const categories = ['Semua', 'Teknologi', 'Portofolio', 'E-Commerce'];

  const filteredTemplates =
    selectedCategory === 'Semua'
      ? SAMPLE_TEMPLATES
      : SAMPLE_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Pilih Template Desain Siap Pakai
              </h3>
              <p className="text-xs text-slate-400">
                Mulai dengan fondasi website interaktif siap pakai yang dapat dimodifikasi langsung dengan AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950 flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 bg-black border border-slate-800 hover:border-blue-700/80 rounded-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-900 text-blue-400 font-semibold">
                    {tpl.badge}
                  </span>
                  <span className="text-[11px] text-slate-500">{tpl.category}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Tailwind CSS &bull; Interaktif
                </span>
                <button
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Gunakan Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
