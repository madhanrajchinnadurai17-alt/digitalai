import type { NextApiRequest, NextApiResponse } from 'next';
import { submitLeadInquiry, getLeadInquiries } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const leads = await getLeadInquiries();
    return res.status(200).json({ success: true, data: leads });
  }

  if (req.method === 'POST') {
    const { site_slug, name, email, phone, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const lead = await submitLeadInquiry({
      site_slug: site_slug || 'general',
      name,
      email,
      phone: phone || '',
      message: message || ''
    });

    return res.status(200).json({
      success: true,
      data: lead,
      message: 'Inquiry submitted successfully! The business owner has been notified.'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
