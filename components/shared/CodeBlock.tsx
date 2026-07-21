"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "bash", filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("relative rounded-lg border overflow-hidden", className)}
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {filename && (
        <div
          className="flex items-center justify-between px-4 py-2 border-b text-xs"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <span style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{filename}</span>
          <span>{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code
            className="text-sm"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: "#e4e4e7",
            }}
          >
            {code}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded transition-colors"
          style={{ color: "var(--muted)" }}
          aria-label="Copy code"
        >
          {copied ? (
            <Check size={14} style={{ color: "#22c55e" }} />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>
  );
}
