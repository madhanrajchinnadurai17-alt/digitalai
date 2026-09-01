import type { NextApiRequest, NextApiResponse } from 'next';
import { getAnalyticsSummary } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getAnalyticsSummary();
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to fetch analytics' });
  }
}
