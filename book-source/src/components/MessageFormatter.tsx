import React, { useState } from 'react';
import './MessageFormatter.css';

interface MessageFormatterProps {
  content: string;
}

export function MessageFormatter({ content }: MessageFormatterProps) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Simple markdown formatter for common patterns
  const renderMarkdown = (text: string) => {
    // Split by lines to handle line breaks
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockIndex = 0;
    
    const result: JSX.Element[] = [];
    
    lines.forEach((line, idx) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockContent = [];
        } else {
          // End of code block
          inCodeBlock = false;
          const code = codeBlockContent.join('\n');
          const currentIndex = codeBlockIndex++;
          result.push(
            <div key={`code-${idx}`} className="code-block-wrapper">
              <button
                className="code-copy-button"
                onClick={() => copyToClipboard(code, currentIndex)}
                aria-label="Copy code"
              >
                {copiedCode === currentIndex ? '✓ Copied!' : '📋 Copy'}
              </button>
              <pre className="code-block">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        return;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      
      // Bold text **text**
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic text *text* (but not inside words)
      formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      
      // Code inline `text`
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
      
      // Links - convert URLs to clickable links
      formatted = formatted.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="message-link">$1</a>'
      );
      
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 600 }}>
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} style={{ marginTop: '0.75rem', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 800 }}>
            {line.replace('# ', '')}
          </h1>
        );
      }
      
      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} style={{ marginLeft: '1.5rem' }}>
            {line.replace(/^[-*]\s/, '')}
          </li>
        );
      }
      
      // Regular paragraph
      if (line.trim()) {
        result.push(
          <p key={idx} style={{ margin: '0.25rem 0', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      } else {
        result.push(<br key={idx} />);
      }
    });
    
    return result;
  };

  return (
    <div className="message-formatter">
      {renderMarkdown(content)}
    </div>
  );
}

