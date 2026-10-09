import { handleGenerateWebsite } from '../src/server/geminiService';

export default async function handler(req: any, res: any) {
  return handleGenerateWebsite(req, res);
}
