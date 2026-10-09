import { handleChat } from '../src/server/geminiService';

export default async function handler(req: any, res: any) {
  return handleChat(req, res);
}
