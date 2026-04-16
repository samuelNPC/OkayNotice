"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Type
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

  // Sharp, flat styling for the buttons
  const btnClass = (active: boolean) => 
    `p-2 transition-colors ${active ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;

  const colors = [
    { name: 'Black', code: '#0f172a' },
    { name: 'Blue', code: '#1d4ed8' },
    { name: 'Red', code: '#b91c1c' },
    { name: 'Green', code: '#15803d' },
    { name: 'Orange', code: '#c2410c' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-white sticky top-0 z-10">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} type="button" title="Bold">
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} type="button" title="Italic">
        <Italic size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} type="button" title="Heading 1">
        <Heading1 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} type="button" title="Heading 2">
        <Heading2 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} type="button" title="Heading 3">
        <Heading3 size={18} />
      </button>

      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      {/* Color Picker Buttons */}
      <div className="flex items-center gap-1 px-1">
        <Type size={16} className="text-slate-400 mr-1" />
        {colors.map((c) => (
          <button
            key={c.code}
            onClick={() => editor.chain().focus().setColor(c.code).run()}
            className={`w-6 h-6 border border-slate-200 transition-transform hover:scale-110 ${editor.isActive('textStyle', { color: c.code }) ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            style={{ backgroundColor: c.code }}
            title={c.name}
            type="button"
          />
        ))}
      </div>

      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} type="button" title="Bullet List">
        <List size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} type="button" title="Numbered List">
        <ListOrdered size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} type="button" title="Quote">
        <Quote size={18} />
      </button>

      <div className="w-[1px] h-6 bg-slate-200 mx-1" />

      <button onClick={setLink} className={btnClass(editor.isActive('link'))} type="button" title="Insert Link">
        <LinkIcon size={18} />
      </button>
      <button onClick={addImage} className={btnClass(false)} type="button" title="Insert Image">
        <ImageIcon size={18} />
      </button>

      <div className="flex-grow" />
      
      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} type="button" title="Undo">
        <Undo size={18} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} type="button" title="Redo">
        <Redo size={18} />
      </button>
    </div>
  );
};

export default function ModernEditor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // This ensures lists keep the text color if you apply a color to a whole list
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto mt-4 mb-4' } }),
      Placeholder.configure({ placeholder: 'Start writing your story...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); 
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none p-6 focus:outline-none min-h-[500px] bg-white',
      },
    },
  });

  return (
    <div className="w-full border border-slate-200 bg-white overflow-hidden">
      <MenuBar editor={editor} />
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
