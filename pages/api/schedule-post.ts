import type { NextApiRequest, NextApiResponse } from 'next';
import { saveScheduledPost } from '@/lib/supabase';
import { ScheduledPostRecord } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { business_name, caption, platforms, scheduled_timestamp, image_data, userId } = req.body;

  if (!caption || !scheduled_timestamp) {
    return res.status(400).json({ error: 'Missing required schedule fields' });
  }

  try {
    const saved = await saveScheduledPost({
      user_id: userId || 'demo-user',
      business_name: business_name || 'My Business',
      caption,
      platforms: platforms || ['instagram'],
      scheduled_timestamp,
      image_data,
      status: 'pending'
    });

    return res.status(200).json({
      success: true,
      data: saved,
      message: 'Post successfully scheduled in background queue!'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to schedule post' });
  }
}
