import type { APIRoute } from 'astro';

// Server-rendered Vercel function, not prerendered. Holds the Beehiiv API key
// and proxies newsletter signups so the key is never shipped to the browser.
export const prerender = false;

const BEEHIIV_API = 'https://api.beehiiv.com/v2';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.BEEHIIV_API_KEY || process.env.BEEHIIV_API_KEY;
  const publicationId =
    import.meta.env.BEEHIIV_PUBLICATION_ID || process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  let payload: { email?: unknown; skill?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const email = String(payload?.email ?? '').trim();
  const skill = String(payload?.skill ?? '').trim();
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }

  // source via utm_source, skill via utm_campaign. Using UTM params means this
  // works with no Beehiiv-side custom-field setup, and both are segmentable.
  const body = {
    email,
    reactivate_existing: true,
    send_welcome_email: true,
    utm_source: 'jscottchapman.com',
    utm_medium: 'website',
    utm_campaign: skill || 'newsletter',
    referring_site: 'https://jscottchapman.com',
  };

  try {
    const res = await fetch(
      `${BEEHIIV_API}/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return json(
        { ok: false, error: 'beehiiv_error', status: res.status, detail: detail.slice(0, 300) },
        502,
      );
    }
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'network' }, 502);
  }
};

// A bare GET is handy for a health check and to confirm the route is a function.
export const GET: APIRoute = () =>
  json({ ok: true, service: 'subscribe', method: 'POST' });
