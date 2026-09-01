import type { NextApiRequest, NextApiResponse } from 'next';
import { getScheduledPosts } from '@/lib/supabase';

// Simulates Vercel Cron or Upstash background scheduled execution
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const scheduled = await getScheduledPosts('demo-user');
    const now = new Date().getTime();

    const duePosts = scheduled.filter(p => new Date(p.scheduled_timestamp).getTime() <= now && p.status === 'pending');

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      checked_posts_count: scheduled.length,
      published_due_count: duePosts.length,
      worker_status: 'healthy'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Cron worker error' });
  }
}
