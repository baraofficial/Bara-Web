import { handleHealth } from '../src/server/geminiService';

export default async function handler(req: any, res: any) {
  return handleHealth(req, res);
}
