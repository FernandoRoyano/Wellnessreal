'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, List, ListOrdered, Quote, ImageIcon, LinkIcon, Undo, Redo, Code,
} from 'lucide-react'
import { useCallback, useRef } from 'react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#FCEE21] hover:underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg w-full my-4' } }),
      Underline,
      Placeholder.configure({ placeholder: 'Escribe el contenido del artículo...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none min-h-[400px] p-4 outline-none text-gray-300',
      },
    },
  })

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL del enlace:')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !e.target.files?.[0]) return
    const file = e.target.files[0]

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
      }
    } catch (err) {
      console.error('Error uploading image:', err)
    }

    e.target.value = ''
  }, [editor])

  if (!editor) return null

  const ToolButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 rounded transition-colors"
      style={{
        backgroundColor: active ? 'rgba(252, 238, 33, 0.2)' : 'transparent',
        color: active ? '#FCEE21' : '#9ca3af',
      }}
    >
      {children}
    </button>
  )

  return (
    <div className="rounded-lg border" style={{ borderColor: '#662D91', backgroundColor: '#1a1535' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b" style={{ borderColor: '#662D91' }}>
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
          <Bold size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
          <Italic size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subrayado">
          <UnderlineIcon size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
          <Strikethrough size={16} />
        </ToolButton>

        <div className="w-px mx-1" style={{ backgroundColor: '#662D91' }} />

        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título H2">
          <Heading2 size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título H3">
          <Heading3 size={16} />
        </ToolButton>

        <div className="w-px mx-1" style={{ backgroundColor: '#662D91' }} />

        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">
          <Quote size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Código">
          <Code size={16} />
        </ToolButton>

        <div className="w-px mx-1" style={{ backgroundColor: '#662D91' }} />

        <ToolButton onClick={addLink} active={editor.isActive('link')} title="Enlace">
          <LinkIcon size={16} />
        </ToolButton>
        <ToolButton onClick={() => fileInputRef.current?.click()} title="Imagen">
          <ImageIcon size={16} />
        </ToolButton>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        <div className="w-px mx-1" style={{ backgroundColor: '#662D91' }} />

        <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
          <Undo size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
          <Redo size={16} />
        </ToolButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
