import type { NextApiRequest, NextApiResponse } from 'next';
import { getStrategyRecommendations, getAutopilotCampaign, triggerAutopilotLaunch } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const recommendations = await getStrategyRecommendations();
    const campaign = await getAutopilotCampaign();
    return res.status(200).json({ success: true, data: { recommendations, campaign } });
  }

  if (req.method === 'POST') {
    const { action, month, platforms } = req.body;
    if (action === 'launch_autopilot') {
      const campaign = await triggerAutopilotLaunch({
        name: `${month || 'September 2026'} Full-Month Autopilot`,
        month: month || 'September 2026',
        platforms_targeted: platforms || ['instagram', 'facebook', 'twitter'],
        total_posts_planned: 16,
        generated_posts_count: 16,
        scheduled_posts_count: 16,
        status: 'active'
      });
      return res.status(200).json({
        success: true,
        data: campaign,
        message: 'MarkAI Autonomous CMO Autopilot launched! 16 strategic campaigns generated & scheduled.'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
