import type { NextApiRequest, NextApiResponse } from 'next';
import { getBrandKit, saveBrandKit } from '@/lib/supabase';
import { BrandKit } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req.query.userId as string) || (req.body?.user_id as string) || 'demo-user';

  if (req.method === 'GET') {
    try {
      const kit = await getBrandKit(userId);
      return res.status(200).json({ success: true, data: kit });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to fetch brand kit' });
    }
  }

  if (req.method === 'POST') {
    try {
      const payload: BrandKit = req.body;
      const saved = await saveBrandKit({ ...payload, user_id: userId });
      return res.status(200).json({ success: true, data: saved });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to save brand kit' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
