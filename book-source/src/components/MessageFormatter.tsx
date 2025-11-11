import React, { useState } from "react";

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

  const renderInlineSegments = (value: string): React.ReactNode[] => {
    if (!value) return [];
    const inlinePattern =
      /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|https?:\/\/[^\s]+)/g;
    return value
      .split(inlinePattern)
      .filter(Boolean)
      .map((segment, index) => {
        if (segment.startsWith("**") && segment.endsWith("**")) {
          return (
            <strong
              key={`strong-${index}-${segment}`}
              className="font-semibold text-polar-night-deep dark:text-polar-night-light"
            >
              {segment.slice(2, -2)}
            </strong>
          );
        }
        if (segment.startsWith("*") && segment.endsWith("*")) {
          return (
            <em
              key={`italic-${index}-${segment}`}
              className="italic text-polar-night-deep/80 dark:text-neutral-200"
            >
              {segment.slice(1, -1)}
            </em>
          );
        }
        if (segment.startsWith("`") && segment.endsWith("`")) {
          return (
            <code
              key={`code-${index}-${segment}`}
              className="rounded-md bg-polar-night-gray/20 px-1.5 py-0.5 font-mono text-xs text-polar-night-deep dark:bg-neutral-800/80 dark:text-neutral-100"
            >
              {segment.slice(1, -1)}
            </code>
          );
        }
        if (segment.startsWith("http")) {
          return (
            <a
              key={`link-${index}-${segment}`}
              href={segment}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-polar-night-deep underline decoration-polar-night-deep/40 underline-offset-4 transition hover:text-polar-night-deep/80 dark:text-polar-night-light dark:hover:text-polar-night-light/80"
            >
              {segment}
            </a>
          );
        }
        return (
          <React.Fragment key={`text-${index}-${segment}`}>
            {segment}
          </React.Fragment>
        );
      });
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let index = 0;
    let codeBlockIndex = 0;

    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();

      if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
        const codeLines: string[] = [];
        const fence = trimmed.slice(0, 3);
        index++;
        while (index < lines.length && !lines[index].trim().startsWith(fence)) {
          codeLines.push(lines[index]);
          index++;
        }
        const code = codeLines.join("\n");
        const currentBlockIndex = codeBlockIndex++;
        elements.push(
          <div
            key={`code-block-${currentBlockIndex}`}
            className="relative mb-6 overflow-hidden rounded-2xl border border-polar-night-gray/20 bg-[#0d1117] shadow-lg dark:border-neutral-700"
          >
            <button
              type="button"
              onClick={() => copyToClipboard(code, currentBlockIndex)}
              className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {copiedCode === currentBlockIndex ? "✓ Copied" : "📋 Copy"}
            </button>
            <pre className="max-h-[420px] overflow-x-auto px-5 py-5 text-sm leading-6 text-white">
              <code>{code}</code>
            </pre>
          </div>
        );
        index += 1; // Skip closing fence
        continue;
      }

      if (!trimmed) {
        elements.push(<div key={`spacer-${index}`} className="h-2" />);
        index += 1;
        continue;
      }

      if (/^#{1,6}\s/.test(trimmed)) {
        const level = trimmed.match(/^#{1,6}/)?.[0].length ?? 1;
        const textValue = trimmed.replace(/^#{1,6}\s*/, "");
        const headingClasses: Record<number, string> = {
          1: "text-2xl font-semibold text-polar-night-deep dark:text-polar-night-light",
          2: "text-xl font-semibold text-polar-night-deep dark:text-polar-night-light",
          3: "text-lg font-semibold text-polar-night-deep dark:text-polar-night-light",
          4: "text-base font-semibold text-polar-night-deep dark:text-polar-night-light",
          5: "text-sm font-semibold text-polar-night-deep dark:text-polar-night-light",
          6: "text-xs font-semibold uppercase tracking-wide text-polar-night-deep dark:text-polar-night-light",
        };
        const className = headingClasses[level] ?? headingClasses[3];
        const HeadingTag = `h${Math.min(
          level,
          6
        )}` as keyof JSX.IntrinsicElements;
        elements.push(
          React.createElement(
            HeadingTag,
            {
              key: `heading-${index}`,
              className: `${className} mb-2 mt-4`,
            },
            textValue
          )
        );
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        const items: string[] = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
          index += 1;
        }
        elements.push(
          <ul
            key={`list-${index}`}
            className="mb-4 list-disc space-y-2 pl-6 text-sm leading-6 text-polar-night-charcoal dark:text-neutral-200"
          >
            {items.map((item, itemIndex) => (
              <li key={`list-item-${index}-${itemIndex}`}>
                {renderInlineSegments(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      elements.push(
        <p
          key={`paragraph-${index}`}
          className="text-sm leading-6 text-polar-night-charcoal dark:text-neutral-200"
        >
          {renderInlineSegments(line)}
        </p>
      );
      index += 1;
    }

    return elements;
  };

  return <div className="flex flex-col gap-3">{renderMarkdown(content)}</div>;
}
