"use client";

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

// Dynamically import the editor and disable Server-Side Rendering
// This is critical to prevent hydration errors and build crashes in Next.js
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="w-full prose max-w-none">
      <SimpleMdeReact 
        value={value} 
        onChange={onChange}
        options={{
          spellChecker: false,
          placeholder: "Write your full article here using Markdown...",
          status: false,
        }}
      />
    </div>
  );
}
