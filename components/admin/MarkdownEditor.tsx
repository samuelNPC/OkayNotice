"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter Cloudinary Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const btnClass = (active: boolean) => 
    `p-2 transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} type="button">
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} type="button">
        <Italic size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} type="button">
        <Heading1 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} type="button">
        <Heading2 size={18} />
      </button>
      <div className="w-[1px] h-6 bg-slate-300 mx-1 self-center" />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} type="button">
        <List size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} type="button">
        <ListOrdered size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} type="button">
        <Quote size={18} />
      </button>
      <div className="w-[1px] h-6 bg-slate-300 mx-1 self-center" />
      <button onClick={setLink} className={btnClass(editor.isActive('link'))} type="button">
        <LinkIcon size={18} />
      </button>
      <button onClick={addImage} className={btnClass(false)} type="button">
        <ImageIcon size={18} />
      </button>
      <div className="flex-grow" />
      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} type="button">
        <Undo size={18} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} type="button">
        <Redo size={18} />
      </button>
    </div>
  );
};

export default function ModernEditor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your story...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // We save as HTML now for better reliability
    },
    editorProps: {
      attributes: {
        class: 'prose prose-blue max-w-none p-6 focus:outline-none min-h-[400px]',
      },
    },
  });

  return (
    <div className="w-full border border-slate-200 bg-white overflow-hidden shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
