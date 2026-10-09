import { PromptTemplate, ProjectFile } from '../types';

export function createDefaultProjectFiles(title: string, html: string): ProjectFile[] {
  return [
    {
      name: 'index.html',
      language: 'html',
      description: 'Frontend UI Responsif (Tailwind CSS & JavaScript)',
      content: html,
    },
    {
      name: 'main.py',
      language: 'python',
      description: 'Backend API Server Python (FastAPI + Pydantic + Uvicorn)',
      content: `# Backend API Server - Python FastAPI
# Dibuat otomatis oleh Bara Web AI
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
from datetime import datetime

app = FastAPI(title="${title} API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataRecord(BaseModel):
    id: Optional[int] = None
    title: str
    status: str = "active"

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "${title}",
        "runtime": "Python 3.11 FastAPI",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/data")
async def get_data():
    return {
        "success": True,
        "items": [
            {"id": 1, "title": "Data Utama Sistem", "status": "active"},
            {"id": 2, "title": "Integrasi Database", "status": "verified"}
        ]
    }

@app.post("/api/submit", status_code=status.HTTP_201_CREATED)
async def submit_action(payload: DataRecord):
    return {
        "success": True,
        "message": f"Data '{payload.title}' berhasil disimpan di server Python!",
        "created_at": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`,
    },
    {
      name: 'server.js',
      language: 'javascript',
      description: 'Backend Server Alternatif Node.js (Express + CORS)',
      content: `// Backend Server Alternatif - Node.js Express
// Dibuat otomatis oleh Bara Web AI
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Node.js Express',
    app: '${title}',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/action', (req, res) => {
  res.json({
    success: true,
    message: 'Permintaan berhasil diproses oleh server Node.js!',
    received: req.body
  });
});

app.listen(PORT, () => {
  console.log(\`Node.js API Server berjalan di http://localhost:\${PORT}\`);
});
`,
    },
    {
      name: 'schema.sql',
      language: 'sql',
      description: 'Skema Database SQL Relasional (PostgreSQL / SQLite)',
      content: `-- Skema Tabel Database untuk ${title}
-- Dibuat otomatis oleh Bara Web AI

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`,
    },
    {
      name: 'requirements.txt',
      language: 'text',
      description: 'Dependensi Pustaka Python pip',
      content: `fastapi>=0.110.0\nuvicorn[standard]>=0.28.0\npydantic>=2.6.4\npython-dotenv>=1.0.1\n`,
    },
    {
      name: 'package.json',
      language: 'json',
      description: 'Dependensi Pustaka Node.js npm',
      content: `{\n  "name": "project-backend",\n  "version": "1.0.0",\n  "main": "server.js",\n  "dependencies": {\n    "express": "^4.19.2",\n    "cors": "^2.8.5"\n  }\n}\n`,
    },
    {
      name: 'README.md',
      language: 'markdown',
      description: 'Panduan Menjalankan Proyek',
      content: `# ${title}

Proyek full-stack multi-bahasa pemrograman dibuat oleh **Bara Web AI**.

## Struktur File:
- \`index.html\` : Frontend interaktif (HTML, Tailwind CSS, JS)
- \`main.py\` : Backend API berbasis **Python FastAPI**
- \`server.js\` : Backend API alternatif berbasis **Node.js Express**
- \`schema.sql\` : Skema tabel database SQL
- \`requirements.txt\` : Dependensi Python
- \`package.json\` : Dependensi Node.js

## Cara Menjalankan:
### 1. Jalankan Backend Python:
\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`

### 2. Atau Jalankan Backend Node.js:
\`\`\`bash
npm install
node server.js
\`\`\`
`,
    },
  ];
}

export const SAMPLE_TEMPLATES: PromptTemplate[] = [
  {
    id: 'saas-taskflow',
    title: 'TaskFlow AI - Modern SaaS Landing',
    badge: 'Full-Stack SaaS',
    description: 'Landing page untuk software produktivitas tim dengan fitur interaktif, API server Python & Node.js, tabel harga, dan form demo.',
    category: 'Teknologi',
    techStack: 'HTML5 + Tailwind + Python (FastAPI) + Node.js + SQL',
    prompt: 'Buatkan landing page SaaS AI Task Management dengan navigasi modern, hero interaktif, preview dashboard, tabel pricing 3 tier, dan formulir pendaftaran gratis bertema dark blue matte tanpa glow.',
    files: [],
    sampleHtml: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow AI - Kolaborasi Cerdas Tanpa Hambatan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">

  <!-- Header -->
  <header class="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-none">
          <i data-lucide="zap" class="w-5 h-5"></i>
        </div>
        <span class="font-bold text-lg tracking-tight text-white">Task<span class="text-blue-500">Flow</span> AI</span>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm text-slate-300">
        <a href="#fitur" class="hover:text-blue-400 transition-colors">Fitur</a>
        <a href="#demo" class="hover:text-blue-400 transition-colors">Demo</a>
        <a href="#harga" class="hover:text-blue-400 transition-colors">Harga</a>
        <a href="#faq" class="hover:text-blue-400 transition-colors">FAQ</a>
      </nav>

      <div class="flex items-center gap-3">
        <button class="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Masuk</button>
        <button onclick="document.getElementById('cta-modal').classList.remove('hidden')" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
          Coba Gratis
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-900 bg-blue-950/60 text-blue-400 text-xs font-semibold mb-6">
      <span class="w-2 h-2 rounded-full bg-blue-500"></span>
      TaskFlow 2.0 Kini Hadir dengan Smart Automation
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
      Kelola Proyek & Tugas Tim dengan <span class="text-blue-500">Kekuatan Kecerdasan Buatan</span>
    </h1>
    <p class="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
      Tingkatkan produktivitas tim hingga 300%. Otomatisasi pembagian tugas, analisis timeline cerdas, dan sinkronisasi lintas divisi secara instan.
    </p>

    <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      <button onclick="document.getElementById('cta-modal').classList.remove('hidden')" class="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
        Mulai Uji Coba 14 Hari
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
      <a href="#fitur" class="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-lg transition-colors">
        Pelajari Fitur
      </a>
    </div>

    <!-- Interactive Mock Dashboard Preview -->
    <div id="demo" class="mt-16 bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-left">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-rose-500"></div>
          <div class="w-3 h-3 rounded-full bg-amber-500"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-xs text-slate-400 font-mono ml-2">app.taskflow.ai/dashboard</span>
        </div>
        <span class="text-xs text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-900 font-medium">Live Interactive Widget</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Interactive Task Counter -->
        <div class="bg-slate-950 border border-slate-800 p-5 rounded-lg">
          <div class="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>Tugas Selesai</span>
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div class="text-3xl font-bold text-white" id="task-counter">24</div>
          <p class="text-xs text-slate-500 mt-2">+12% dari minggu lalu</p>
        </div>

        <div class="bg-slate-950 border border-slate-800 p-5 rounded-lg">
          <div class="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>Waktu Dihemat AI</span>
            <i data-lucide="clock" class="w-4 h-4 text-blue-400"></i>
          </div>
          <div class="text-3xl font-bold text-white">48 Jam</div>
          <p class="text-xs text-slate-500 mt-2">Per tim per bulan</p>
        </div>

        <div class="bg-slate-950 border border-slate-800 p-5 rounded-lg">
          <div class="flex justify-between items-center text-slate-400 text-xs mb-2">
            <span>Akurasi Deadline</span>
            <i data-lucide="target" class="w-4 h-4 text-blue-400"></i>
          </div>
          <div class="text-3xl font-bold text-white">99.4%</div>
          <p class="text-xs text-slate-500 mt-2">Diprediksi AI Engine</p>
        </div>
      </div>

      <!-- Quick Interactive To-Do list -->
      <div class="mt-6 bg-slate-950 border border-slate-800 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-semibold text-slate-200">Coba Simulasikan Tugas:</h4>
          <span class="text-xs text-slate-500">Klik checklist untuk menyelesaikan</span>
        </div>
        <div class="space-y-2.5" id="interactive-list">
          <label class="flex items-center gap-3 p-2.5 rounded bg-slate-900 border border-slate-800/80 hover:border-blue-900 cursor-pointer transition-colors">
            <input type="checkbox" onchange="toggleTask(this)" class="w-4 h-4 accent-blue-600 rounded">
            <span class="text-sm text-slate-300">Sinkronisasi sprint tim Frontend dengan model Gemini AI</span>
          </label>
          <label class="flex items-center gap-3 p-2.5 rounded bg-slate-900 border border-slate-800/80 hover:border-blue-900 cursor-pointer transition-colors">
            <input type="checkbox" onchange="toggleTask(this)" class="w-4 h-4 accent-blue-600 rounded">
            <span class="text-sm text-slate-300">Buat laporan kemajuan otomatis untuk manajer produk</span>
          </label>
          <label class="flex items-center gap-3 p-2.5 rounded bg-slate-900 border border-slate-800/80 hover:border-blue-900 cursor-pointer transition-colors">
            <input type="checkbox" onchange="toggleTask(this)" class="w-4 h-4 accent-blue-600 rounded">
            <span class="text-sm text-slate-300">Jadwalkan review arsitektur sistem baru</span>
          </label>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="fitur" class="py-20 border-t border-slate-900 max-w-7xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl font-bold text-white tracking-tight">Fitur Unggulan untuk Kebutuhan Skala Besar</h2>
      <p class="mt-4 text-slate-400 text-sm">Dirancang dengan arsitektur modern tanpa friksi untuk tim teknis dan non-teknis.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-800 transition-colors">
        <div class="w-10 h-10 bg-blue-950 border border-blue-900 rounded-lg flex items-center justify-center text-blue-400 mb-4">
          <i data-lucide="bot" class="w-5 h-5"></i>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Smart Auto-Assignment</h3>
        <p class="text-sm text-slate-400 leading-relaxed">AI menganalisis beban kerja masing-masing anggota dan merekomendasikan penanggung jawab ideal.</p>
      </div>

      <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-800 transition-colors">
        <div class="w-10 h-10 bg-blue-950 border border-blue-900 rounded-lg flex items-center justify-center text-blue-400 mb-4">
          <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Prediksi Bottleneck</h3>
        <p class="text-sm text-slate-400 leading-relaxed">Deteksi potensi keterlambatan jadwal 5 hari sebelum terjadi dengan analisis tren prediktif.</p>
      </div>

      <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-800 transition-colors">
        <div class="w-10 h-10 bg-blue-950 border border-blue-900 rounded-lg flex items-center justify-center text-blue-400 mb-4">
          <i data-lucide="shield-check" class="w-5 h-5"></i>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Keamanan Enterprise</h3>
        <p class="text-sm text-slate-400 leading-relaxed">Enkripsi end-to-end dengan kepatuhan SOC2 dan kontrol akses berbasis peran (RBAC).</p>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="harga" class="py-20 border-t border-slate-900 max-w-7xl mx-auto px-6">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl font-bold text-white tracking-tight">Pilihan Paket yang Fleksibel</h2>
      <p class="mt-4 text-slate-400 text-sm">Pilih kapasitas yang tepat sesuai ukuran tim Anda.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Starter -->
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-white">Starter</h3>
          <p class="text-xs text-slate-400 mt-1">Untuk profesional individu</p>
          <div class="mt-6">
            <span class="text-3xl font-bold text-white">Gratis</span>
            <span class="text-xs text-slate-400"> / selamanya</span>
          </div>
          <ul class="mt-8 space-y-3 text-sm text-slate-300">
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Hingga 5 Proyek Aktif</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> AI Assistant Dasar</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Riwayat 30 Hari</li>
          </ul>
        </div>
        <button class="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-sm transition-colors">Pilih Starter</button>
      </div>

      <!-- Pro -->
      <div class="p-8 bg-slate-900 border-2 border-blue-600 rounded-xl relative flex flex-col justify-between">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Paling Populer
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">Tim Pro</h3>
          <p class="text-xs text-slate-400 mt-1">Untuk tim 5-25 orang</p>
          <div class="mt-6">
            <span class="text-3xl font-bold text-white">Rp 149.000</span>
            <span class="text-xs text-slate-400"> / pengguna / bulan</span>
          </div>
          <ul class="mt-8 space-y-3 text-sm text-slate-300">
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Proyek Tanpa Batas</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> AI Automation Penuh</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Analisis Prediktif Deadlines</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Integrasi Slack & GitHub</li>
          </ul>
        </div>
        <button onclick="document.getElementById('cta-modal').classList.remove('hidden')" class="mt-8 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition-colors">Mulai Trial 14 Hari</button>
      </div>

      <!-- Enterprise -->
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-white">Enterprise</h3>
          <p class="text-xs text-slate-400 mt-1">Untuk korporasi dan skala besar</p>
          <div class="mt-6">
            <span class="text-3xl font-bold text-white">Hubungi Kami</span>
          </div>
          <ul class="mt-8 space-y-3 text-sm text-slate-300">
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Dedicated Support 24/7</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Custom AI Tuning</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> SLA Uptime 99.99%</li>
            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-blue-400"></i> Audit Log & SSO</li>
          </ul>
        </div>
        <button class="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-sm transition-colors">Kontak Tim Sales</button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-900 py-12 px-6 max-w-7xl mx-auto text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
    <div class="flex items-center gap-2 text-slate-400">
      <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
        <i data-lucide="zap" class="w-3.5 h-3.5"></i>
      </div>
      <span class="font-bold text-white">TaskFlow AI</span>
      <span>&copy; 2026. Hak Cipta Dilindungi.</span>
    </div>
    <div class="flex items-center gap-6">
      <a href="#" class="hover:text-blue-400 transition-colors">Kebijakan Privasi</a>
      <a href="#" class="hover:text-blue-400 transition-colors">Syarat Ketentuan</a>
      <a href="#" class="hover:text-blue-400 transition-colors">Status Server</a>
    </div>
  </footer>

  <!-- Modal Interaktif Coba Gratis -->
  <div id="cta-modal" class="hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full relative">
      <button onclick="document.getElementById('cta-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-white">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      <h3 class="text-xl font-bold text-white mb-2">Mulai Akun TaskFlow Anda</h3>
      <p class="text-xs text-slate-400 mb-6">Tanpa kartu kredit. Akses fitur AI pro selama 14 hari penuh.</p>
      
      <form onsubmit="handleModalSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
          <input required type="text" placeholder="Budi Santoso" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Email Perusahaan</label>
          <input required type="email" placeholder="budi@perusahaan.com" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
        </div>
        <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition-colors">
          Konfirmasi & Masuk Dashboard
        </button>
      </form>
      <div id="modal-success" class="hidden mt-4 p-3 bg-blue-950/80 border border-blue-900 rounded-lg text-xs text-blue-300 text-center">
        🎉 Akun berhasil didaftarkan! Selamat datang di TaskFlow.
      </div>
    </div>
  </div>

  <script>
    lucide.createIcons();

    let completedTasks = 24;
    function toggleTask(checkbox) {
      const counterEl = document.getElementById('task-counter');
      if (checkbox.checked) {
        completedTasks++;
        checkbox.nextElementSibling.classList.add('line-through', 'text-slate-500');
      } else {
        completedTasks--;
        checkbox.nextElementSibling.classList.remove('line-through', 'text-slate-500');
      }
      counterEl.textContent = completedTasks;
    }

    function handleModalSubmit(e) {
      e.preventDefault();
      document.getElementById('modal-success').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('cta-modal').classList.add('hidden');
        document.getElementById('modal-success').classList.add('hidden');
        alert('Simulasi pendaftaran berhasil!');
      }, 1500);
    }
  </script>
</body>
</html>`,
  },
  {
    id: 'portfolio-dev',
    title: 'Portofolio Developer & Desainer',
    badge: 'Karier & Portfolio',
    description: 'Showcase portofolio personal dengan filter proyek, timeline pengalaman kerja, dan form kontak.',
    category: 'Portofolio',
    techStack: 'HTML5 + Tailwind + Python (FastAPI) + Node.js + SQL',
    prompt: 'Buatkan portofolio website modern untuk Full Stack Developer & UI Designer dengan tema gelap biru solid, filter galeri proyek, timeline karier, dan formulir hubungi saya.',
    files: [],
    sampleHtml: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arya Pratama - Senior Full-Stack Engineer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .code-font { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-black text-slate-200 antialiased selection:bg-blue-600 selection:text-white">

  <!-- Nav -->
  <nav class="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between border-b border-slate-900">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 bg-blue-600 rounded-sm"></span>
      <span class="font-bold text-white code-font text-lg">arya.dev</span>
    </div>
    <div class="flex items-center gap-6 text-sm text-slate-400">
      <a href="#proyek" class="hover:text-blue-400 transition-colors">Proyek</a>
      <a href="#keahlian" class="hover:text-blue-400 transition-colors">Keahlian</a>
      <a href="#kontak" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">Hubungi</a>
    </div>
  </nav>

  <!-- Hero -->
  <header class="max-w-5xl mx-auto px-6 py-20">
    <div class="code-font text-blue-500 text-sm font-semibold mb-3">const role = "Full-Stack Engineer & AI Builder";</div>
    <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
      Membangun Solusi Digital Berperforma Tinggi dengan <span class="text-blue-500">React, Node, & AI</span>
    </h1>
    <p class="mt-6 text-slate-400 text-lg max-w-2xl leading-relaxed">
      Berpengalaman lebih dari 6 tahun merancang arsitektur sistem berskala ratusan ribu pengguna harian dengan fokus pada kehandalan, estetika, dan kecepatan.
    </p>

    <div class="mt-8 flex items-center gap-4">
      <a href="#proyek" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
        Lihat Karya Terpilih
        <i data-lucide="arrow-down" class="w-4 h-4"></i>
      </a>
      <a href="#kontak" class="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-blue-900 text-slate-300 font-medium rounded-lg transition-colors">
        Konsultasi Proyek
      </a>
    </div>
  </header>

  <!-- Interactive Project Filter -->
  <section id="proyek" class="max-w-5xl mx-auto px-6 py-16 border-t border-slate-900">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">Proyek Unggulan</h2>
        <p class="text-xs text-slate-400 mt-1">Studi kasus nyata yang pernah dikerjakan</p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex items-center gap-2 text-xs">
        <button onclick="filterProjects('all', this)" class="filter-btn px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium">Semua</button>
        <button onclick="filterProjects('web', this)" class="filter-btn px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-md font-medium">Web Apps</button>
        <button onclick="filterProjects('ai', this)" class="filter-btn px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-md font-medium">AI Integration</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="projects-grid">
      <!-- Card 1 -->
      <div class="project-card p-6 bg-slate-900/90 border border-slate-800 rounded-xl" data-category="ai">
        <div class="flex items-center justify-between text-xs text-blue-400 mb-3">
          <span class="bg-blue-950 px-2.5 py-1 rounded border border-blue-900 font-mono">AI & LLM</span>
          <span class="text-slate-500">2026</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">OmniDoc AI Assistant</h3>
        <p class="text-sm text-slate-400 mb-4 leading-relaxed">Ekstraksi dokumen legal dan kontrak bisnis otomatis menggunakan Gemini API dengan latency di bawah 800ms.</p>
        <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
          <span class="px-2 py-1 bg-black rounded border border-slate-800">TypeScript</span>
          <span class="px-2 py-1 bg-black rounded border border-slate-800">Next.js</span>
          <span class="px-2 py-1 bg-black rounded border border-slate-800">Gemini SDK</span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="project-card p-6 bg-slate-900/90 border border-slate-800 rounded-xl" data-category="web">
        <div class="flex items-center justify-between text-xs text-blue-400 mb-3">
          <span class="bg-blue-950 px-2.5 py-1 rounded border border-blue-900 font-mono">Fintech Web</span>
          <span class="text-slate-500">2025</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">VaultFlow Banking Dashboard</h3>
        <p class="text-sm text-slate-400 mb-4 leading-relaxed">Platform analisis transaksi real-time dengan visualisasi data interaktif, dark mode solid, dan arsitektur micro-frontend.</p>
        <div class="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
          <span class="px-2 py-1 bg-black rounded border border-slate-800">React</span>
          <span class="px-2 py-1 bg-black rounded border border-slate-800">Tailwind</span>
          <span class="px-2 py-1 bg-black rounded border border-slate-800">PostgreSQL</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Contact Form -->
  <section id="kontak" class="max-w-5xl mx-auto px-6 py-20 border-t border-slate-900">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold text-white mb-2">Diskusikan Proyek Anda</h2>
      <p class="text-sm text-slate-400 mb-6">Punya ide aplikasi atau butuh website baru? Kirim pesan langsung di bawah ini.</p>

      <form onsubmit="handleContact(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Nama</label>
          <input required type="text" placeholder="Nama Anda" class="w-full px-3 py-2.5 bg-black border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Email</label>
          <input required type="email" placeholder="email@domain.com" class="w-full px-3 py-2.5 bg-black border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Pesan / Brief Proyek</label>
          <textarea required rows="3" placeholder="Ceritakan kebutuhan atau proyek Anda..." class="w-full px-3 py-2.5 bg-black border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
          Kirim Pesan Langsung
          <i data-lucide="send" class="w-4 h-4"></i>
        </button>
      </form>
      <div id="contact-alert" class="hidden mt-4 p-3 bg-blue-950 border border-blue-900 text-blue-300 text-xs rounded-lg text-center">
        Pesan berhasil dikirim! Saya akan membalas via email dalam waktu 1x24 jam.
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
    &copy; 2026 Arya Pratama. Dibuat dengan Bara Web AI.
  </footer>

  <script>
    lucide.createIcons();

    function filterProjects(cat, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.className = 'filter-btn px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-md font-medium';
      });
      btn.className = 'filter-btn px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium';

      const cards = document.querySelectorAll('.project-card');
      cards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function handleContact(e) {
      e.preventDefault();
      document.getElementById('contact-alert').classList.remove('hidden');
      e.target.reset();
      setTimeout(() => {
        document.getElementById('contact-alert').classList.add('hidden');
      }, 4000);
    }
  </script>
</body>
</html>`,
  },
  {
    id: 'kopi-artisan',
    title: 'Kopi Artisan - Toko Online & Cafe',
    badge: 'F&B & E-Commerce',
    description: 'Katalog kafe modern dengan pemesanan menu interaktif, filter varian biji kopi, dan keranjang belanja mini.',
    category: 'E-Commerce',
    techStack: 'HTML5 + Tailwind + Python (FastAPI) + Node.js + SQL',
    prompt: 'Buatkan landing page untuk kafe kopi artisan modern dengan katalog menu interaktif, keranjang belanja langsung (cart drawer), dan pemesanan meja bertema hitam pekat dan aksen biru solid tanpa efek glow.',
    files: [],
    sampleHtml: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Coffee Roastery - Biji Kopi Pilihan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">

  <!-- Header -->
  <header class="border-b border-zinc-800 bg-zinc-950/95 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">
          <i data-lucide="coffee" class="w-4 h-4"></i>
        </div>
        <span class="font-bold tracking-tight text-white text-lg">Aura<span class="text-blue-500">Coffee</span></span>
      </div>

      <div class="flex items-center gap-4">
        <button onclick="toggleCart()" class="relative px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-blue-800 rounded-lg text-sm text-zinc-300 flex items-center gap-2 transition-colors">
          <i data-lucide="shopping-bag" class="w-4 h-4 text-blue-400"></i>
          <span>Keranjang</span>
          <span id="cart-count" class="bg-blue-600 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section class="max-w-6xl mx-auto px-6 py-16 text-center">
    <div class="inline-block px-3 py-1 bg-blue-950 border border-blue-900 text-blue-400 text-xs font-semibold rounded-full mb-4">
      Fresh Single Origin Batch 2026
    </div>
    <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
      Cita Rasa Kopi Nusantara yang <span class="text-blue-500">Dipanggang Sempurna</span>
    </h1>
    <p class="mt-4 text-zinc-400 text-base max-w-xl mx-auto">
      Dipetik langsung dari petani dataran tinggi Aceh Gayo, Toraja, dan Kintamani. Di-roast setiap hari untuk menjaga profil aroma dan body terbaik.
    </p>
  </section>

  <!-- Product Catalog -->
  <section class="max-w-6xl mx-auto px-6 pb-20">
    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
      <i data-lucide="sparkles" class="w-5 h-5 text-blue-500"></i>
      Pilihan Beans Unggulan
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Item 1 -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div class="h-36 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center mb-4">
            <i data-lucide="coffee" class="w-12 h-12 text-blue-500"></i>
          </div>
          <span class="text-xs text-blue-400 font-mono font-medium">Arabica 250gr</span>
          <h3 class="text-lg font-bold text-white mt-1">Gayo Wine Fermentation</h3>
          <p class="text-xs text-zinc-400 mt-1">Notes: Berry, Dark Chocolate, Winey Acidity</p>
          <div class="text-lg font-bold text-white mt-4">Rp 115.000</div>
        </div>
        <button onclick="addToCart('Gayo Wine Fermentation', 115000)" class="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> Tambah ke Keranjang
        </button>
      </div>

      <!-- Item 2 -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div class="h-36 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center mb-4">
            <i data-lucide="coffee" class="w-12 h-12 text-blue-400"></i>
          </div>
          <span class="text-xs text-blue-400 font-mono font-medium">Arabica 250gr</span>
          <h3 class="text-lg font-bold text-white mt-1">Toraja Sapan Washed</h3>
          <p class="text-xs text-zinc-400 mt-1">Notes: Caramel, Herbal, Sweet Citrus</p>
          <div class="text-lg font-bold text-white mt-4">Rp 98.000</div>
        </div>
        <button onclick="addToCart('Toraja Sapan Washed', 98000)" class="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> Tambah ke Keranjang
        </button>
      </div>

      <!-- Item 3 -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div class="h-36 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center mb-4">
            <i data-lucide="coffee" class="w-12 h-12 text-blue-300"></i>
          </div>
          <span class="text-xs text-blue-400 font-mono font-medium">House Blend 500gr</span>
          <h3 class="text-lg font-bold text-white mt-1">Aura Midnight Blend</h3>
          <p class="text-xs text-zinc-400 mt-1">Notes: Bold Brown Sugar, Roasted Almond</p>
          <div class="text-lg font-bold text-white mt-4">Rp 135.000</div>
        </div>
        <button onclick="addToCart('Aura Midnight Blend', 135000)" class="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> Tambah ke Keranjang
        </button>
      </div>
    </div>
  </section>

  <!-- Cart Modal -->
  <div id="cart-drawer" class="hidden fixed inset-0 z-50 bg-black/80 flex justify-end">
    <div class="w-full max-w-sm bg-zinc-900 border-l border-zinc-800 h-full p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <h3 class="font-bold text-white">Keranjang Belanja</h3>
          <button onclick="toggleCart()" class="text-zinc-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div id="cart-items" class="space-y-3 text-sm text-zinc-300">
          <p class="text-zinc-500 text-xs text-center py-6">Keranjang masih kosong.</p>
        </div>
      </div>

      <div class="border-t border-zinc-800 pt-4">
        <div class="flex justify-between font-bold text-white mb-4">
          <span>Total:</span>
          <span id="cart-total">Rp 0</span>
        </div>
        <button onclick="alert('Checkout simulasi berhasil diproses!')" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
          Checkout Sekarang
        </button>
      </div>
    </div>
  </div>

  <script>
    lucide.createIcons();

    let cart = [];

    function toggleCart() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('hidden');
    }

    function addToCart(name, price) {
      cart.push({ name, price });
      updateCartUI();
    }

    function updateCartUI() {
      document.getElementById('cart-count').textContent = cart.length;
      const list = document.getElementById('cart-items');
      if (cart.length === 0) {
        list.innerHTML = '<p class="text-zinc-500 text-xs text-center py-6">Keranjang masih kosong.</p>';
        document.getElementById('cart-total').textContent = 'Rp 0';
        return;
      }
      list.innerHTML = '';
      let total = 0;
      cart.forEach((item, idx) => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center bg-zinc-950 p-2.5 rounded border border-zinc-800 text-xs';
        row.innerHTML = '<span>' + item.name + '</span><span class="font-mono text-blue-400 font-semibold">Rp ' + item.price.toLocaleString('id-ID') + '</span>';
        list.appendChild(row);
      });
      document.getElementById('cart-total').textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
  </script>
</body>
</html>`,
  },
];

// Inisialisasi file proyek multi-bahasa (Python, Node.js, SQL, HTML) untuk setiap template
SAMPLE_TEMPLATES.forEach((tpl) => {
  tpl.files = createDefaultProjectFiles(tpl.title, tpl.sampleHtml);
});
