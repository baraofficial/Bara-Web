export interface UploadedImage {
  data: string; // base64 data url
  mimeType: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  image?: string;
}

export interface StudioChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  image?: string;
  version?: number;
  sections?: string[];
  suggestions?: string[];
}

export interface ProjectFile {
  name: string;
  language: 'html' | 'python' | 'javascript' | 'typescript' | 'json' | 'sql' | 'markdown' | 'text';
  content: string;
  description?: string;
}

export interface WebsiteProject {
  id: string;
  title: string;
  prompt: string;
  summary: string;
  html: string; // File utama index.html untuk pratinjau live iframe
  files: ProjectFile[]; // Kumpulan file multi-bahasa: main.py, server.js, schema.sql, requirements.txt, dll.
  techStack?: string;
  sections: string[];
  suggestions: string[];
  createdAt: number;
  referenceImage?: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type StudioTab = 'chat' | 'preview' | 'code' | 'split';
export type AppMode = 'studio' | 'chat';

export interface PromptTemplate {
  id: string;
  title: string;
  badge: string;
  description: string;
  category: string;
  techStack: string;
  prompt: string;
  sampleHtml: string;
  files: ProjectFile[];
}

export interface SystemPrompts {
  websitePrompt: string;
  chatPrompt: string;
}
