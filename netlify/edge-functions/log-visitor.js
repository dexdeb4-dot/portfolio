// No imports needed!

export default async (request, context) => {
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

  // Your Pusher credentials
  const appId = Netlify.env.get("PUSHER_APP_ID") || "2168475";
  const key = Netlify.env.get("PUSHER_KEY") || "4f07c352b23abd7a6eab";
  const secret = Netlify.env.get("PUSHER_SECRET") || "9face8f00b77aaa8eaa1";
  const cluster = Netlify.env.get("PUSHER_CLUSTER") || "ap2";

  // Build the payload
  const body = JSON.stringify({
    name: "new-visit",
    channels: ["traffic-channel"],
    data: JSON.stringify(logEntry)
  });

  // Calculate the signature required by Pusher's REST API
  // Using native crypto available in Deno
  const encoder = new TextEncoder();
  const timestamp = Math.floor(Date.now() / 1000);
  const method = "POST";
  const path = `/apps/${appId}/events`;
  const bodyMd5 = new Uint8Array(
    await crypto.subtle.digest("MD5", encoder.encode(body))
  );
  const bodyMd5Hex = Array.from(bodyMd5).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const authString = `${method}\n${path}\nauth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${bodyMd5Hex}`;
  
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

  // The final URL
  const pusherUrl = `https://api-${cluster}.pusher.com${path}?auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${bodyMd5Hex}&auth_signature=${authSignature}`;

  try {
    // Fire the event directly to the API
    await fetch(pusherUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });
  } catch (error) {
    console.error("Pusher fetch error:", error);
  }

  return; 
};

export const config = { path: "/*" };
