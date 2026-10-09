import express from 'express';
import { handleChat, handleGenerateWebsite, handleHealth } from '../src/server/geminiService';

const app = express();
app.use(express.json({ limit: '10mb' }));

app.all('/api/health', handleHealth);
app.all('/api/chat', handleChat);
app.all('/api/generate-website', handleGenerateWebsite);

export default app;
