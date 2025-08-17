// api/create-post.js (Node.js Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const { title, content, status = 'publish' } = req.body || {};

  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  try {
    const wpRes = await fetch('https://evergreenanalyticspartners.com/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, status }),
    });

    const wpJson = await wpRes.json();

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({ error: wpJson });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Post published',
      link: wpJson.link || null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}
