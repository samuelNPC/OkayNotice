"use client";

import dynamic from "next/dynamic";
// Required CSS imports for the UIW editor
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import the editor to prevent Next.js SSR hydration errors
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div data-color-mode="light" className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={600}
        preview="live"
      />
    </div>
  );
}
