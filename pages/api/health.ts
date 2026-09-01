import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const anthropicConfigured = Boolean(
    process.env.ANTHROPIC_API_KEY && 
    process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here'
  );

  const firebaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  );

  const metaConfigured = Boolean(
    process.env.META_ACCESS_TOKEN && 
    process.env.INSTAGRAM_ACCOUNT_ID &&
    process.env.META_ACCESS_TOKEN !== 'your_meta_system_user_or_page_access_token'
  );

  return res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    services: {
      anthropic_claude: {
        configured: anthropicConfigured,
        description: 'Claude 3.5 Sonnet AI generation engine'
      },
      firebase_auth: {
        configured: firebaseConfigured,
        description: 'Firebase Email/Password Authentication'
      },
      supabase_postgres: {
        configured: supabaseConfigured,
        description: 'Supabase profiles and post history persistence'
      },
      meta_graph_api: {
        configured: metaConfigured,
        description: 'Instagram Content Publishing API'
      }
    }
  });
}
