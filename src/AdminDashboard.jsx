import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const pusher = new Pusher('4f07c352b23abd7a6eab', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('traffic-channel');
    
    channel.bind('new-visit', (data) => {
      setLogs((prevLogs) => [data, ...prevLogs].slice(0, 50));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'debmalya' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid ID or Password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFAF3', fontFamily: 'system-ui, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ padding: '40px', backgroundColor: '#FFF2DB', borderRadius: '12px', textAlign: 'center', border: '2px solid #FFE5BF', width: '300px', boxShadow: '0 10px 25px rgba(246, 36, 64, 0.05)' }}>
          <h2 style={{ color: '#F62440', marginBottom: '24px', letterSpacing: '1px', fontWeight: '800' }}>SYSTEM LOGIN</h2>
          
          {error && <p style={{ color: '#F62440', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>{error}</p>}
          
          <input 
            type="text" 
            placeholder="Admin ID" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '2px solid #FFE5BF', backgroundColor: '#FFFAF3', color: '#1f2937', boxSizing: 'border-box', outlineColor: '#F62440' }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '6px', border: '2px solid #FFE5BF', backgroundColor: '#FFFAF3', color: '#1f2937', boxSizing: 'border-box', outlineColor: '#F62440' }} 
          />
          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', backgroundColor: '#F62440', color: '#FFFAF3', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px', transition: 'background-color 0.2s' }}
          >
            AUTHORIZE
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#FFFAF3', color: '#1f2937', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #FFE5BF', paddingBottom: '15px' }}>
        <h2 style={{ color: '#F62440', margin: 0, fontWeight: '800' }}>
          LIVE SITE TRAFFIC LOGS
        </h2>
        <button 
          onClick={() => setIsAuthenticated(false)} 
          style={{ padding: '8px 16px', backgroundColor: '#FFF2DB', color: '#F62440', border: '2px solid #FFE5BF', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>

      <table width="100%" style={{ textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#F62440', borderBottom: '2px solid #FFE5BF' }}>
            <th style={{ padding: '15px' }}>Timestamp</th>
            <th style={{ padding: '15px' }}>IP Address</th>
            <th style={{ padding: '15px' }}>Location</th>
            <th style={{ padding: '15px' }}>Visited Path</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontWeight: '500' }}>
                Listening for incoming traffic... Open your portfolio in another tab to trigger.
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #FFE5BF', backgroundColor: index === 0 ? '#FFF2DB' : 'transparent', transition: 'background-color 0.5s' }}>
                <td style={{ padding: '15px', color: '#4b5563' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: '15px', fontWeight: '600' }}>{log.ip}</td>
                <td style={{ padding: '15px', color: '#4b5563' }}>{log.location}</td>
                <td style={{ padding: '15px', color: '#F62440', fontWeight: '500' }}>{log.path}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
