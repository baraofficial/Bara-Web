import { GoogleGenAI } from '@google/genai';

// System prompt for website generation with multi-language backend & frontend
export const WEBSITE_BUILDER_SYSTEM_PROMPT = `Anda adalah Arsitek Full-Stack Software Engineer kelas dunia untuk Bara Web.
Tugas Anda adalah merancang dan membuat sistem aplikasi website LENGKAP dengan arsitektur multi-bahasa:
1. Frontend: HTML5 semantik responsif + Tailwind CSS + JavaScript interaktif
2. Backend Python: File backend server berbasis Python (FastAPI / Flask) dengan route API, validasi data Pydantic, dan penanganan data
3. Backend Node.js: File backend server alternatif berbasis Node.js (Express) dengan REST API endpoints
4. Database: File skema SQL (PostgreSQL/SQLite) untuk penyimpanan data
5. Konfigurasi Dependensi: requirements.txt (Python) dan package.json (Node.js)
6. Dokumentasi: README.md panduan instalasi dan menjalankan backend

PERATURAN PENTING KODE:
1. "html": Kode HTML utama yang 100% lengkap dan mandiri (dari <!DOCTYPE html> sampai </html>), menggunakan CDN Tailwind CSS dan Lucide icons, dengan JavaScript interaktif yang siap dijalankan langsung di iframe browser.
2. "files": Array file proyek lengkap yang mencakup:
   - "index.html" (Frontend)
   - "main.py" (Server Python FastAPI lengkap dengan endpoint REST API)
   - "server.js" (Server Node.js Express alternatif lengkap dengan endpoint REST API)
   - "schema.sql" (Skema tabel database relasional)
   - "requirements.txt" (Pustaka Python: fastapi, uvicorn, pydantic)
   - "package.json" (Pustaka Node.js: express, cors, dotenv)
   - "README.md" (Panduan menjalankan server Python atau Node.js)
3. Desain visual harus modern, profesional, bersih, bertema hitam dan biru solid TANPA EFEK GLOW / BLOOM.
4. Desain WAJIB 100% responsif mobile-first:
   - Wajib mencantumkan <meta name="viewport" content="width=device-width, initial-scale=1.0"> di dalam <head>.
   - Tipografi responsif (contoh judul hero: text-2xl sm:text-4xl md:text-5xl, jangan gunakan ukuran statis raksasa tanpa breakpoint mobile).
   - Padding responsif (px-4 sm:px-6, py-8 sm:py-16) dan navbar tidak boleh terpotong atau wrap berantakan di layar kecil HP (gunakan whitespace-nowrap dan shrink-0).
   - Hindari lebar statis tetap (gunakan max-w-full w-full mx-auto) agar tidak ada elemen yang meluap ke samping.

Format output WAJIB JSON:
{
  "title": "Judul Singkat Website",
  "summary": "Deskripsi arsitektur sistem dan teknologi yang digunakan",
  "techStack": "HTML5, Tailwind, Python (FastAPI), Node.js (Express), SQL",
  "sections": ["Navigasi", "Hero", "Fitur", "API Showcase", "Harga", "Footer"],
  "html": "<!DOCTYPE html><html>...</html>",
  "files": [
    {
      "name": "index.html",
      "language": "html",
      "description": "Frontend UI responsif Tailwind CSS",
      "content": "<!DOCTYPE html>..."
    },
    {
      "name": "main.py",
      "language": "python",
      "description": "Backend API Server Python FastAPI",
      "content": "from fastapi import FastAPI..."
    },
    {
      "name": "server.js",
      "language": "javascript",
      "description": "Backend API Server Node.js Express",
      "content": "const express = require('express')..."
    },
    {
      "name": "schema.sql",
      "language": "sql",
      "description": "Skema database dan tabel SQL",
      "content": "CREATE TABLE..."
    },
    {
      "name": "requirements.txt",
      "language": "text",
      "description": "Dependensi Python pip",
      "content": "fastapi>=0.110.0\\nuvicorn>=0.28.0"
    },
    {
      "name": "package.json",
      "language": "json",
      "description": "Dependensi Node.js npm",
      "content": "{\\"dependencies\\": {\\"express\\": \\"^4.19.2\\"}}"
    },
    {
      "name": "README.md",
      "language": "markdown",
      "description": "Panduan menjalankan proyek",
      "content": "# Panduan Menjalankan..."
    }
  ],
  "nextSuggestions": ["Saran 1", "Saran 2", "Saran 3"]
}`;

// System prompt for general chat
export const CHAT_SYSTEM_PROMPT = `Anda adalah Bara Web AI, asisten kecerdasan buatan serbaguna yang ramah, cerdas, dan ahli dalam:
1. Pembuatan dan konsultasi website (HTML, Tailwind CSS, JavaScript, React, arsitektur web, UI/UX).
2. Backend engineering (Python FastAPI, Flask, Node.js Express, SQL database, REST API).
3. Percakapan umum, tanya-jawab, pemecahan masalah teknis, penulisan kreatif, dan coding dalam berbagai bahasa pemrograman.
4. Anda dapat berkomunikasi dalam Bahasa Indonesia dan Bahasa Inggris dengan lancar, jelas, dan ramah.

Jika pengguna bertanya tentang website yang sedang dibuat, berikan panduan teknis yang tajam.
Jika pengguna mengajak ngobrol santai atau menanyakan topik lain, jawab dengan informatif dan terstruktur.`;

// Inisialisasi client Google GenAI
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return aiClient;
}

// Helper pemanggil model Gemini dengan fallback otomatis
export async function generateWithGemini(params: {
  contents: any;
  config?: any;
}) {
  const client = getAiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di environment Vercel / server.');
  }

  const modelCandidates = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelCandidates) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} mengalami kendala: ${err?.message || err}. Mencoba model alternatif...`);
      lastError = err;
    }
  }

  throw lastError || new Error('Semua model Gemini sedang sibuk. Silakan coba kembali.');
}

// Helper untuk menyusun berkas proyek multi-bahasa lengkap
export function ensureFullStackFiles(data: any, prompt: string) {
  const html = data.html || '<!DOCTYPE html><html><body><h1>Bara Web</h1></body></html>';
  let files: Array<{ name: string; language: string; content: string; description: string }> = Array.isArray(data.files) ? [...data.files] : [];

  // 1. Frontend index.html
  const hasHtml = files.some(f => f.name === 'index.html');
  if (!hasHtml) {
    files.unshift({
      name: 'index.html',
      language: 'html',
      description: 'Frontend UI Responsif (HTML5, Tailwind CSS, JavaScript)',
      content: html,
    });
  } else {
    const htmlFile = files.find(f => f.name === 'index.html');
    if (htmlFile && html) {
      htmlFile.content = html;
    }
  }

  // 2. Backend Python (main.py)
  const hasPython = files.some(f => f.name.endsWith('.py'));
  if (!hasPython) {
    files.push({
      name: 'main.py',
      language: 'python',
      description: 'Backend API Server Python (FastAPI + Pydantic + CORS)',
      content: `# Backend API Server - Python FastAPI
# Dibuat otomatis oleh Bara Web AI
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime

app = FastAPI(
    title="${data.title || 'Bara Web API'}",
    description="Backend API untuk ${data.title || 'layanan website'}",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

class ItemRecord(BaseModel):
    id: Optional[int] = None
    title: str
    status: str = "active"
    created_at: Optional[str] = None

database_records: List[dict] = [
    {"id": 1, "title": "Data Awal Sistem", "status": "active", "created_at": datetime.now().isoformat()}
]

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "${data.title || 'Bara Web Application'}",
        "engine": "Python FastAPI",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/items")
async def get_items():
    return {"items": database_records, "total": len(database_records)}

@app.post("/api/items", status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemRecord):
    new_id = len(database_records) + 1
    record = {
        "id": new_id,
        "title": item.title,
        "status": item.status,
        "created_at": datetime.now().isoformat()
    }
    database_records.append(record)
    return {"message": "Item berhasil disimpan", "data": record}

@app.post("/api/contact")
async def send_contact(contact: ContactMessage):
    return {
        "status": "success",
        "message": f"Terima kasih {contact.name}, pesan Anda telah diterima server Python!",
        "received_at": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`,
    });
  }

  // 3. Backend Node.js (server.js)
  const hasNode = files.some(f => f.name === 'server.js' || f.name === 'index.js' || f.name === 'server.ts');
  if (!hasNode) {
    files.push({
      name: 'server.js',
      language: 'javascript',
      description: 'Backend API Server Node.js (Express + CORS + REST API)',
      content: `// Backend API Server - Node.js Express
// Dibuat otomatis oleh Bara Web AI
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, title: 'Inisialisasi Data Node.js', created_at: new Date().toISOString() }
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Node.js Express',
    app: '${data.title || 'Bara Web Service'}',
    uptime: process.uptime()
  });
});

app.get('/api/items', (req, res) => {
  res.json({ success: true, count: items.length, data: items });
});

app.post('/api/items', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title wajib diisi.' });
  }
  const newItem = { id: items.length + 1, title, created_at: new Date().toISOString() };
  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

app.post('/api/contact', (req, res) => {
  const { name } = req.body;
  res.json({
    success: true,
    message: \`Halo \${name || 'Kawan'}, pesan Anda berhasil dicatat oleh server Node.js!\`
  });
});

app.listen(PORT, () => {
  console.log(\`Node.js API Server berjalan di http://localhost:\${PORT}\`);
});
`,
    });
  }

  // 4. Skema Database SQL (schema.sql)
  const hasSql = files.some(f => f.name.endsWith('.sql'));
  if (!hasSql) {
    files.push({
      name: 'schema.sql',
      language: 'sql',
      description: 'Struktur Tabel Database SQL (PostgreSQL / SQLite)',
      content: `-- Database Schema untuk ${data.title || 'Bara Web App'}
-- Dibuat otomatis oleh Bara Web AI

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`,
    });
  }

  // 5. Dependensi Python (requirements.txt)
  const hasReq = files.some(f => f.name === 'requirements.txt');
  if (!hasReq) {
    files.push({
      name: 'requirements.txt',
      language: 'text',
      description: 'Dependensi Pustaka Python pip',
      content: `fastapi>=0.110.0\nuvicorn[standard]>=0.28.0\npydantic>=2.6.4\npython-dotenv>=1.0.1\n`,
    });
  }

  // 6. Dependensi Node.js (package.json)
  const hasPkg = files.some(f => f.name === 'package.json');
  if (!hasPkg) {
    files.push({
      name: 'package.json',
      language: 'json',
      description: 'Konfigurasi Package & Dependensi Node.js',
      content: `{
  "name": "bara-web-backend",
  "version": "1.0.0",
  "description": "Backend API untuk ${data.title || 'Bara Web'}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  }
}
`,
    });
  }

  // 7. README.md
  const hasReadme = files.some(f => f.name === 'README.md');
  if (!hasReadme) {
    files.push({
      name: 'README.md',
      language: 'markdown',
      description: 'Panduan Menjalankan Proyek Multi-Bahasa',
      content: `# ${data.title || 'Proyek Bara Web'}

Aplikasi full-stack multi-bahasa pemrograman yang dirancang oleh **Bara Web AI**.

## Struktur Proyek:
- \`index.html\` : Antarmuka Frontend (HTML5, Tailwind CSS, JavaScript)
- \`main.py\` : Backend Server Berbasis **Python** (FastAPI)
- \`server.js\` : Backend Server Alternatif Berbasis **Node.js** (Express)
- \`schema.sql\` : Struktur Database SQL Relasional
- \`requirements.txt\` : Pustaka Python
- \`package.json\` : Pustaka Node.js

## Cara Menjalankan Backend:

### Opsi A: Menggunakan Python (FastAPI)
\`\`\`bash
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
\`\`\`
Swagger API: \`http://localhost:8000/docs\`

### Opsi B: Menggunakan Node.js (Express)
\`\`\`bash
npm install
npm start
\`\`\`
`,
    });
  }

  data.files = files;
  data.techStack = data.techStack || 'HTML5 + Tailwind CSS + Python (FastAPI) + Node.js (Express) + PostgreSQL';
  return data;
}

// Handler untuk endpoint Chat (kompatibel dengan Express & Vercel Serverless)
export async function handleChat(req: any, res: any) {
  // Atur header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, image, history = [], systemInstruction } = body;

    if (!message && !image) {
      return res.status(400).json({ error: 'Pesan atau gambar tidak boleh kosong.' });
    }

    // Periksa apakah API key tersedia di environment Vercel
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        reply: `Halo! Saya Bara Web AI.\n\nAplikasi ini telah sukses ter-deploy di Vercel! Agar fitur AI dapat merespon secara dinamis dengan model Gemini, silakan tambahkan Environment Variable di Vercel Dashboard:\n\n1. Buka dashboard Vercel proyek Anda.\n2. Buka **Settings > Environment Variables**.\n3. Tambahkan key: \`GEMINI_API_KEY\` dengan value API Key Google AI Studio Anda.\n4. Lakukan **Redeploy**.\n\nSetelah itu, chat dan pembuatan website akan berjalan 100% otomatis!`,
      });
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<any> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role && item.content) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }],
          });
        }
      }
    }

    const userParts: Array<any> = [];
    if (image && image.data) {
      const base64Clean = image.data.includes(',') ? image.data.split(',')[1] : image.data;
      userParts.push({
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: base64Clean,
        },
      });
    }
    userParts.push({ text: message || 'Tolong analisa dan berikan tanggapan untuk gambar ini.' });

    contents.push({
      role: 'user',
      parts: userParts,
    });

    const response = await generateWithGemini({
      contents: contents,
      config: {
        systemInstruction: systemInstruction || CHAT_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat menghasilkan jawaban saat ini.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in handleChat:', error);
    res.status(200).json({
      reply: `⚠️ Terjadi kendala saat memproses: ${error?.message || 'Gagal menghubungi model Gemini.'}. Pastikan GEMINI_API_KEY valid di pengaturan environment Vercel.`,
    });
  }
}

// Handler untuk endpoint Generate Website (kompatibel dengan Express & Vercel Serverless)
export async function handleGenerateWebsite(req: any, res: any) {
  // Atur header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { prompt, currentCode, action = 'create', category, systemInstruction, image } = body;

    if (!prompt && !image) {
      return res.status(400).json({ error: 'Prompt atau gambar referensi website tidak boleh kosong.' });
    }

    // Jika API key belum dipasang di Vercel, berikan website fallback yang elegan agar tidak error 500
    if (!process.env.GEMINI_API_KEY) {
      const fallbackTitle = prompt ? prompt.slice(0, 30) : 'Bara Web Project';
      const fallbackData = {
        title: fallbackTitle,
        summary: 'Proyek website full-stack berhasil dibuat. Silakan tambahkan GEMINI_API_KEY di Vercel Dashboard untuk kustomisasi AI tak terbatas.',
        techStack: 'HTML5 + Tailwind CSS + Python (FastAPI) + Node.js (Express) + SQL',
        sections: ['Header', 'Hero', 'Fitur', 'Dokumentasi API', 'Footer'],
        html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fallbackTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-black text-slate-100 min-h-screen">
  <nav class="border-b border-slate-800 p-6 flex justify-between items-center max-w-6xl mx-auto">
    <div class="text-xl font-bold text-white">Bara<span class="text-blue-500">Web</span></div>
    <div class="text-xs text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-900 font-mono">Full-Stack Ready</div>
  </nav>
  <main class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-6">${fallbackTitle}</h1>
    <p class="text-slate-400 text-base max-w-2xl mx-auto mb-8">Aplikasi ini dirancang dengan arsitektur multi-bahasa lengkap: Frontend Tailwind CSS, Backend Python (FastAPI), Server Node.js (Express), dan Skema SQL.</p>
    <div class="inline-flex gap-4">
      <button onclick="alert('Server siap diintegrasikan!')" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">Coba Interaksi</button>
    </div>
  </main>
  <script>lucide.createIcons();</script>
</body>
</html>`,
        nextSuggestions: [
          'Tambahkan GEMINI_API_KEY di Vercel Dashboard untuk generasi AI dinamis',
          'Lihat berkas Python main.py di tab Kode Sumber',
          'Download ZIP proyek untuk menjalankan lokal',
        ],
      };

      return res.json(ensureFullStackFiles(fallbackData, prompt || ''));
    }

    let userPromptText = '';
    if (action === 'modify' && currentCode) {
      userPromptText = `Berikut adalah kode HTML website saat ini:
\`\`\`html
${currentCode.slice(0, 25000)}
\`\`\`

Instruksi modifikasi dari pengguna:
"${prompt || 'Perbarui website dengan menyesuaikan gambar referensi terlampir.'}"

Tolong perbarui kode website tersebut sesuai instruksi di atas dengan tetap mempertahankan elemen bagus yang sudah ada dan memastikan semua kode HTML, Tailwind CSS, dan script JS tetap lengkap dan berfungsi.`;
    } else {
      userPromptText = `Buatkan website profesional dan modern berdasarkan permintaan berikut:
"${prompt || 'Rancang website berdasarkan tata letak dan inspirasi dari gambar referensi terlampir.'}"
${category ? `Kategori / Industri: ${category}` : ''}
${image ? 'Catatan Tambahan: Pengguna melampirkan gambar referensi / mockup. Buatlah struktur website, penempatan elemen, gaya, dan komposisi visual yang terinspirasi dari gambar tersebut.' : ''}

Website harus memiliki:
1. Navigasi bar responsif dengan logo dan link menu
2. Hero section yang menarik dengan headline kuat, subheadline, call-to-action button, dan visual / ilustrasi
3. Bagian fitur utama atau showcase layanan/produk
4. Bagian interaktif (misalnya kalkulator, filter/katalog, formulir kontak dengan alert JS interaktif, atau testimonial slider/grid)
5. Bagian harga (pricing) atau portofolio atau statistik jika sesuai
6. Footer lengkap dengan copyright, link medsos, dan navigasi tambahan
7. Pastikan tema bersih, elegan (tanpa efek glow / bloom / neon blur), kontras tajam dan estetis.`;
    }

    const userParts: Array<any> = [];
    if (image && image.data) {
      const base64Clean = image.data.includes(',') ? image.data.split(',')[1] : image.data;
      userParts.push({
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: base64Clean,
        },
      });
    }
    userParts.push({ text: userPromptText });

    const response = await generateWithGemini({
      contents: [
        {
          role: 'user',
          parts: userParts,
        },
      ],
      config: {
        systemInstruction: systemInstruction || WEBSITE_BUILDER_SYSTEM_PROMPT,
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    let parsedData: any = null;

    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedData = JSON.parse(jsonMatch[0]);
        } catch {
          // ignore
        }
      }
    }

    if (!parsedData || !parsedData.html) {
      let extractedHtml = rawText;
      if (rawText.includes('```html')) {
        extractedHtml = rawText.split('```html')[1]?.split('```')[0] || rawText;
      } else if (rawText.includes('```')) {
        extractedHtml = rawText.split('```')[1]?.split('```')[0] || rawText;
      }

      parsedData = {
        title: 'Bara Web Project',
        summary: 'Proyek full-stack berhasil dibuat berdasarkan instruksi Anda.',
        sections: ['Header', 'Hero', 'Fitur', 'Footer'],
        html: extractedHtml.trim(),
        nextSuggestions: [
          'Tambahkan tema gelap / terang toggle',
          'Tambahkan form kontak dengan validasi backend',
          'Ubah palet warna utama ke biru solid',
        ],
      };
    }

    parsedData = ensureFullStackFiles(parsedData, prompt || '');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Error in handleGenerateWebsite:', error);
    res.status(500).json({
      error: error?.message || 'Gagal membuat website dengan AI.',
    });
  }
}

// Handler untuk health check
export function handleHealth(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'ok',
    app: 'Bara Web AI',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
}
