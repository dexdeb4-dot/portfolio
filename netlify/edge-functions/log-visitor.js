import { Pusher } from "https://esm.sh/pusher@5.2.0";

export default async (request, context) => {
  const url = new URL(request.url);

  // Ignore asset requests (images, css, js) and don't log the admin page itself
  if (
    url.pathname.includes('.') || 
    url.pathname.startsWith('/admin') || 
    request.method !== 'GET'
  ) {
    return; 
  }

  // Netlify automatically populates the context object with geography data
  const ip = context.ip || "Unknown";
  const geo = context.geo || {};
  
  const logEntry = {
    ip: ip,
    location: `${geo.city || 'Unknown City'}, ${geo.country?.name || 'Unknown Country'}`,
    path: url.pathname,
    timestamp: new Date().toISOString()
  };
  const pusher = new Pusher({
    appId: Deno.env.get("PUSHER_APP_ID"),
    key: Deno.env.get("PUSHER_KEY"),
    secret: Deno.env.get("PUSHER_SECRET"),
    cluster: Deno.env.get("PUSHER_CLUSTER"),
    useTLS: true
  });

  try {
    // Broadcast the payload to the dashboard layout asynchronously
    await pusher.trigger("traffic-channel", "new-visit", logEntry);
  } catch (error) {
    console.error("Pusher error:", error);
  }

  return; 
};

export const config = { path: "/*" };
