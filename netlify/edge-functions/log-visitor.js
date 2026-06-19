import Pusher from "npm:pusher";

export default async (request, context) => {
  const url = new URL(request.url);

  // Ignore assets and the admin page
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

  try {
    // Using strict fallbacks so Netlify's cache can't break the connection
    const pusher = new Pusher({
      appId: Netlify.env.get("PUSHER_APP_ID") || "2168475",
      key: Netlify.env.get("PUSHER_KEY") || "4f07c352b23abd7a6eab",
      secret: Netlify.env.get("PUSHER_SECRET") || "9face8f00b77aaa8eaa1",
      cluster: Netlify.env.get("PUSHER_CLUSTER") || "ap2",
      useTLS: true
    });

    await pusher.trigger("traffic-channel", "new-visit", logEntry);
  } catch (error) {
    console.error("Pusher error:", error);
  }

  return; 
};

export const config = { path: "/*" };
