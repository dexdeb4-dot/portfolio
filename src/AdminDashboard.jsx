import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function TrafficDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initialize the real-time websocket subscription channel
    const pusher = new Pusher('4f07c352b23abd7a6eab', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('traffic-channel');
    
    // Listen for the specific event broadcasted by Netlify Edge
    channel.bind('new-visit', (data) => {
      setLogs((prevLogs) => [data, ...prevLogs].slice(0, 50));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: '#111', color: '#eee', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#6FCF97', borderBottom: '1px solid #2FA084', paddingBottom: '10px' }}>
         LIVE SITE TRAFFIC LOGS
      </h2>
      <table width="100%" style={{ textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#2FA084' }}>
            <th style={{ padding: '12px' }}>Timestamp</th>
            <th style={{ padding: '12px' }}>IP Address</th>
            <th style={{ padding: '12px' }}>Location</th>
            <th style={{ padding: '12px' }}>Visited Path</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                Waiting for incoming traffic stream... Open your portfolio in another tab to trigger.
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #222', backgroundColor: index === 0 ? '#1f6f5f33' : 'transparent' }}>
                <td style={{ padding: '12px' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: '12px', color: '#6FCF97' }}>{log.ip}</td>
                <td style={{ padding: '12px' }}>{log.location}</td>
                <td style={{ padding: '12px', color: '#6FCF97' }}>{log.path}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
