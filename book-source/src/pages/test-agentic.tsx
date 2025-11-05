import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { AgenticInterface } from '../components/AgenticInterface';

export default function TestAgentic() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Layout title="Test Agentic Interface">
      <div style={{ padding: '2rem', minHeight: '80vh' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Agentic Interface Test Page</h1>
          <p>Click the button below to toggle the agentic interface.</p>
          <button
            onClick={() => setIsVisible(!isVisible)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isVisible ? 'Hide Interface' : 'Show Agentic Interface'}
          </button>
        </div>

        {isVisible && (
          <div style={{ border: '2px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <AgenticInterface />
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h2>Instructions:</h2>
          <ol>
            <li>Make sure the backend is running: <code>cd backend && uv run uvicorn src.main:app --reload</code></li>
            <li>Set GEMINI_API_KEY in backend/.env file</li>
            <li>Click "Show Agentic Interface" above</li>
            <li>The interface will automatically detect the current chapter from the URL</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}

