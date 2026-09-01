import type { NextApiRequest, NextApiResponse } from 'next';
import { updatePostStatus } from '@/lib/supabase';

const metaAccessToken = process.env.META_ACCESS_TOKEN;
const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { postId, caption, imageUrl, imageData, businessName } = req.body;

  if (!caption) {
    return res.status(400).json({ error: 'Caption is required to post' });
  }

  const isLiveConfigured = Boolean(
    metaAccessToken && 
    instagramAccountId && 
    metaAccessToken !== 'your_meta_system_user_or_page_access_token' &&
    instagramAccountId !== 'your_instagram_business_account_id'
  );

  // Live Meta Graph API Execution
  if (isLiveConfigured) {
    try {
      // Instagram Graph API requires a publicly accessible HTTPS image URL.
      // If none provided, use a high quality business asset URL.
      const mediaImageUrl = imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=1080&auto=format&fit=crop&q=80';

      // 1. Create Media Container
      const containerUrl = new URL(`https://graph.facebook.com/v20.0/${instagramAccountId}/media`);
      containerUrl.searchParams.append('image_url', mediaImageUrl);
      containerUrl.searchParams.append('caption', caption);
      containerUrl.searchParams.append('access_token', metaAccessToken!);

      const containerRes = await fetch(containerUrl.toString(), { method: 'POST' });
      const containerData = await containerRes.json();

      if (!containerRes.ok || !containerData.id) {
        throw new Error(containerData?.error?.message || 'Failed to create Instagram media container');
      }

      const creationId = containerData.id;

      // 2. Publish Media Container
      const publishUrl = new URL(`https://graph.facebook.com/v20.0/${instagramAccountId}/media_publish`);
      publishUrl.searchParams.append('creation_id', creationId);
      publishUrl.searchParams.append('access_token', metaAccessToken!);

      const publishRes = await fetch(publishUrl.toString(), { method: 'POST' });
      const publishData = await publishRes.json();

      if (!publishRes.ok || !publishData.id) {
        throw new Error(publishData?.error?.message || 'Failed to publish Instagram media container');
      }

      const publishedMediaId = publishData.id;

      if (postId) {
        await updatePostStatus(postId, 'Posted', publishedMediaId);
      }

      return res.status(200).json({
        success: true,
        media_id: publishedMediaId,
        simulated: false,
        published_at: new Date().toISOString(),
        message: 'Successfully published to live Instagram Business Account!'
      });

    } catch (err: any) {
      console.error('Meta Graph API Error:', err);
      const errMsg = err?.message || 'Meta Graph API Error';
      
      if (postId) {
        await updatePostStatus(postId, 'Failed', undefined, errMsg);
      }

      return res.status(502).json({
        success: false,
        error: errMsg,
        note: 'Check your META_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID permissions.'
      });
    }
  }

  // Simulated / Sandbox Mode for College Pitch Demo
  // Gives realistic network latency and returns a mock Instagram Media ID
  await new Promise((resolve) => setTimeout(resolve, 1400));
  
  const mockMediaId = `ig_biz_${Date.now()}_${Math.floor(100000000 + Math.random() * 900000000)}`;

  if (postId) {
    await updatePostStatus(postId, 'Posted', mockMediaId);
  }

  return res.status(200).json({
    success: true,
    media_id: mockMediaId,
    simulated: true,
    published_at: new Date().toISOString(),
    message: 'Posted in Sandbox Demo Mode (Configure META_ACCESS_TOKEN & INSTAGRAM_ACCOUNT_ID for live production)'
  });
}
