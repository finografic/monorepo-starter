import { useEffect, useState } from 'react';
import type React from 'react';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function DashboardPage(): React.JSX.Element {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Server Health</h2>
      {error && <p style={{ color: 'oklch(0.628 0.258 29.234)' }}>Error: {error}</p>}
      {health && (
        <pre style={{ background: 'oklch(0.970 0.000 89.876)', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify(health, null, 2)}
        </pre>
      )}
      {!health && !error && <p>Loading...</p>}
    </div>
  );
}
