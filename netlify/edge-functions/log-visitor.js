export default async (request, context) => {
  // MASTER TRY-CATCH: Guarantees your website will NEVER crash from this script
  try {
    const url = new URL(request.url);

    if (
      url.pathname.includes('.') || 
      url.pathname.startsWith('/admin') || 
      request.method !== 'GET'
    ) {
      return; 
    }

    const logEntry = {
      ip: context.ip || "Unknown IP",
      location: `${context.geo?.city || 'Unknown City'}, ${context.geo?.country?.name || 'Unknown Country'}`,
      path: url.pathname,
      timestamp: new Date().toISOString()
    };

    const appId = Netlify.env.get("PUSHER_APP_ID") || "2168475";
    const key = Netlify.env.get("PUSHER_KEY") || "4f07c352b23abd7a6eab";
    const secret = Netlify.env.get("PUSHER_SECRET") || "9face8f00b77aaa8eaa1";
    const cluster = Netlify.env.get("PUSHER_CLUSTER") || "ap2";

    const body = JSON.stringify({
      name: "new-visit",
      channels: ["traffic-channel"],
      data: JSON.stringify(logEntry)
    });

    // Generate secure signature WITHOUT the unsupported MD5 step
    const encoder = new TextEncoder();
    const timestamp = Math.floor(Date.now() / 1000);
    const method = "POST";
    const path = `/apps/${appId}/events`;
    
    const authString = `${method}\n${path}\nauth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0`;
    
    const hmacKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = new Uint8Array(
      await crypto.subtle.sign("HMAC", hmacKey, encoder.encode(authString))
    );
    
    const authSignature = Array.from(signature).map(b => b.toString(16).padStart(2, '0')).join('');
    const pusherUrl = `https://api-${cluster}.pusher.com${path}?auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&auth_signature=${authSignature}`;

    // Fire and forget - don't await, so it doesn't slow down your website loading
    fetch(pusherUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    }).catch(() => {}); // Silently ignore fetch errors

  } catch (error) {
    // If absolutely anything goes wrong, log it secretly but DO NOT crash the site
    console.error("Edge function bypassed an error:", error);
  }
};

export const config = { path: "/*" };
