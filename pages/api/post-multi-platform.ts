import type { NextApiRequest, NextApiResponse } from 'next';
import { SocialPlatform, SocialPostResponse } from '@/lib/types';
import { updatePostStatus } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId, caption, platforms = ['instagram'], imageUrl, businessName } = req.body;

  if (!caption) {
    return res.status(400).json({ error: 'Caption is required' });
  }

  // Simulate network broadcast latency
  await new Promise(r => setTimeout(r, 1200));

  const platformResults: { [key in SocialPlatform]?: { success: boolean; id: string } } = {};
  (platforms as SocialPlatform[]).forEach(plat => {
    platformResults[plat] = {
      success: true,
      id: `${plat}_media_${Date.now()}_${Math.floor(Math.random() * 89999 + 10000)}`
    };
  });

  if (postId) {
    await updatePostStatus(postId, 'Posted', platformResults['instagram']?.id);
  }

  return res.status(200).json({
    success: true,
    published_at: new Date().toISOString(),
    platforms: platformResults,
    message: `Broadcast successfully published across ${platforms.length} connected channel(s)!`
  });
}
