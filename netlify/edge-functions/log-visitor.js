import Pusher from "https://esm.sh/pusher@5.2.0";

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
    appId: Deno.env.get("2168475"),
    key: Deno.env.get("4f07c352b23abd7a6eab"),
    secret: Deno.env.get("9face8f00b77aaa8eaa1"),
    cluster: Deno.env.get("ap2"),
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
