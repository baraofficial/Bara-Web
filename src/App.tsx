/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StudioWeb } from './components/StudioWeb';
import { ChatAssistant } from './components/ChatAssistant';
import { TemplateModal } from './components/TemplateModal';
import { 
  SystemPromptModal, 
  DEFAULT_WEBSITE_PROMPT, 
  DEFAULT_CHAT_PROMPT 
} from './components/SystemPromptModal';
import { SAMPLE_TEMPLATES } from './data/templates';
import { AppMode, ChatMessage, WebsiteProject, PromptTemplate, SystemPrompts, UploadedImage } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('studio');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSystemPromptModalOpen, setIsSystemPromptModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // System prompts state with localStorage persistence
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompts>(() => {
    try {
      const saved = localStorage.getItem('baraweb_system_prompts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      websitePrompt: DEFAULT_WEBSITE_PROMPT,
      chatPrompt: DEFAULT_CHAT_PROMPT,
    };
  });

  const handleSaveSystemPrompts = (newPrompts: SystemPrompts) => {
    setSystemPrompts(newPrompts);
    try {
      localStorage.setItem('baraweb_system_prompts', JSON.stringify(newPrompts));
    } catch {
      // ignore
    }
  };

  // Initial starter fullstack project (Python FastAPI + Node.js + SQL + HTML)
  const initialProject: WebsiteProject = {
    id: 'initial-taskflow',
    title: 'TaskFlow AI - Modern SaaS Landing',
    prompt: SAMPLE_TEMPLATES[0].prompt,
    summary: 'Platform SaaS manajemen tugas berbasis AI dengan arsitektur full-stack: backend Python FastAPI, server Node.js Express, skema SQL relasional, dan frontend Tailwind CSS.',
    html: SAMPLE_TEMPLATES[0].sampleHtml,
    techStack: SAMPLE_TEMPLATES[0].techStack,
    files: SAMPLE_TEMPLATES[0].files,
    sections: ['Header', 'Hero', 'Interactive Dashboard', 'Fitur', 'Tabel Harga', 'Modal Trial', 'Footer'],
    suggestions: [
      'Tambahkan integrasi webhook API di server Python main.py',
      'Tambahkan endpoint JWT authentication di server Node.js server.js',
      'Tambahkan tabel relasi baru di skema database schema.sql',
    ],
    createdAt: Date.now(),
  };

  const [currentProject, setCurrentProject] = useState<WebsiteProject | null>(initialProject);
  const [projectHistory, setProjectHistory] = useState<WebsiteProject[]>([initialProject]);

  // Initial chat history
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content:
        'Halo! Saya Bara Web AI. Saya siap membantu Anda merancang website full-stack lengkap dengan frontend responsif, backend Python (FastAPI/Flask), server Node.js (Express), dan database SQL.\n\nAnda dapat mengunggah foto desain menggunakan tombol +, atau berdiskusi tentang arsitektur kode di sini. Ada yang bisa saya bantu sekarang?',
      timestamp: Date.now(),
    },
  ]);

  // Website Generation / Modification Handler
  const handleGenerateWebsite = async (
    prompt: string, 
    action: 'create' | 'modify' = 'create',
    image?: UploadedImage
  ) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          action,
          currentCode: action === 'modify' ? currentProject?.html : undefined,
          systemInstruction: systemPrompts.websitePrompt,
          image: image ? { data: image.data, mimeType: image.mimeType } : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Gagal menghubungi server (${response.status})`);
      }

      const data = await response.json();

      const newProject: WebsiteProject = {
        id: `web-${Date.now()}`,
        title: data.title || (action === 'modify' ? `${currentProject?.title} (Revisi)` : 'Website Baru'),
        prompt,
        summary: data.summary || 'Proyek full-stack berhasil dibuat oleh Bara Web AI.',
        html: data.html,
        files: data.files || [],
        techStack: data.techStack || 'HTML5 + Tailwind + Python (FastAPI) + Node.js (Express) + SQL',
        sections: data.sections || ['Header', 'Hero Section', 'Fitur', 'Footer'],
        suggestions: data.nextSuggestions || [
          'Tambahkan tema gelap / terang toggle',
          'Tambahkan form kontak dengan validasi backend',
          'Tambahkan bagian testimoni',
        ],
        createdAt: Date.now(),
        referenceImage: image?.data,
      };

      setCurrentProject(newProject);
      setProjectHistory((prev) => [newProject, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Chat Handler
  const handleSendMessage = async (text: string, image?: UploadedImage) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      image: image?.data,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatting(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          image: image ? { data: image.data, mimeType: image.mimeType } : undefined,
          systemInstruction: systemPrompts.chatPrompt,
          history: chatMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Gagal menghubungi server (${response.status})`);
      }

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Maaf, saya tidak dapat menjawab saat ini.',
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Terjadi kendala: ${err?.message || 'Gagal memproses pesan.'}`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatting(false);
    }
  };

  // Update HTML code from manual editor
  const handleUpdateCode = (newHtml: string) => {
    if (!currentProject) return;
    const updatedFiles = (currentProject.files || []).map((f) =>
      f.name === 'index.html' ? { ...f, content: newHtml } : f
    );
    const updated: WebsiteProject = {
      ...currentProject,
      html: newHtml,
      files: updatedFiles,
      id: `web-edit-${Date.now()}`,
      title: `${currentProject.title} (Diedit)`,
    };
    setCurrentProject(updated);
    setProjectHistory((prev) => [updated, ...prev]);
  };

  // Update specific file in project (Python, Node.js, SQL, etc.)
  const handleUpdateFile = (fileName: string, newContent: string) => {
    if (!currentProject) return;
    const existing = currentProject.files || [];
    const updatedFiles = existing.map((f) =>
      f.name === fileName ? { ...f, content: newContent } : f
    );
    if (!updatedFiles.some((f) => f.name === fileName)) {
      updatedFiles.push({
        name: fileName,
        language: 'text',
        content: newContent,
      });
    }
    const updated: WebsiteProject = {
      ...currentProject,
      files: updatedFiles,
      html: fileName === 'index.html' ? newContent : currentProject.html,
    };
    setCurrentProject(updated);
  };

  // Download HTML file
  const handleDownloadHtml = () => {
    if (!currentProject) return;
    const blob = new Blob([currentProject.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'website'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Template select handler
  const handleSelectTemplate = (template: PromptTemplate) => {
    const tplProject: WebsiteProject = {
      id: `tpl-${Date.now()}`,
      title: template.title,
      prompt: template.prompt,
      summary: template.description,
      html: template.sampleHtml,
      files: template.files,
      techStack: template.techStack,
      sections: ['Header', 'Hero', 'Fitur Interaktif', 'Katalog / Harga', 'Footer'],
      suggestions: [
        'Ubah route API di server Python main.py',
        'Sesuaikan endpoint controller di server Node.js server.js',
        'Tambahkan tabel baru di schema.sql',
      ],
      createdAt: Date.now(),
    };

    setCurrentProject(tplProject);
    setProjectHistory((prev) => [tplProject, ...prev]);
    setCurrentMode('studio');
  };

  // Switch from chat to studio with pre-filled prompt
  const handleSendToStudio = (prompt: string) => {
    setCurrentMode('studio');
    handleGenerateWebsite(prompt, 'create');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Navbar dengan Ikon Garis 3 Ditumpuk di Pojok Kiri Atas */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onDownloadHtml={handleDownloadHtml}
        onResetProject={() => setCurrentProject(null)}
        onOpenSystemPrompt={() => setIsSystemPromptModalOpen(true)}
        hasWebsite={Boolean(currentProject)}
      />

      {/* Main View Area */}
      {currentMode === 'studio' ? (
        <StudioWeb
          currentProject={currentProject}
          history={projectHistory}
          isGenerating={isGenerating}
          onGenerate={handleGenerateWebsite}
          onSelectHistory={(proj) => setCurrentProject(proj)}
          onUpdateCode={handleUpdateCode}
          onUpdateFile={handleUpdateFile}
          onDownloadHtml={handleDownloadHtml}
          onOpenTemplates={() => setIsTemplateModalOpen(true)}
        />
      ) : (
        <ChatAssistant
          messages={chatMessages}
          isChatting={isChatting}
          onSendMessage={handleSendMessage}
          onClearChat={() => setChatMessages([])}
          onSendToStudio={handleSendToStudio}
        />
      )}

      {/* Template Chooser Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* System Prompt Customizer Modal */}
      <SystemPromptModal
        isOpen={isSystemPromptModalOpen}
        onClose={() => setIsSystemPromptModalOpen(false)}
        systemPrompts={systemPrompts}
        onSave={handleSaveSystemPrompts}
      />
    </div>
  );
}
