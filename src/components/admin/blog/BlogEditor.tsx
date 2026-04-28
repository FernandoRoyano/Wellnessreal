'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { TableKit } from '@tiptap/extension-table'
import { marked } from 'marked'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, List, ListOrdered, Quote, ImageIcon, LinkIcon, Undo, Redo, Code,
  Table as TableIcon, Plus, Minus, FileCode2, X,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importValue, setImportValue] = useState('')
  const [importMode, setImportMode] = useState<'markdown' | 'html'>('markdown')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#FCEE21] hover:underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg w-full my-4' } }),
      Underline,
      Placeholder.configure({ placeholder: 'Escribe el contenido del artículo...' }),
      TableKit.configure({
        table: { resizable: true, HTMLAttributes: { class: 'tiptap-table' } },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
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

  const insertTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const handleImport = useCallback(async () => {
    if (!editor || !importValue.trim()) return
    let html = importValue.trim()

    if (importMode === 'markdown') {
      // marked.parse puede devolver Promise según opciones; await funciona en ambos casos
      html = await marked.parse(html, { breaks: true, gfm: true })
    } else {
      // En modo HTML, descartar frontmatter YAML si lo trae pegado del .md
      html = html.replace(/^---[\s\S]*?---\s*/m, '')
    }

    editor.chain().focus().insertContent(html).run()
    setImportValue('')
    setImportModalOpen(false)
  }, [editor, importValue, importMode])

  if (!editor) return null

  const ToolButton = ({ onClick, active, disabled, children, title }: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        backgroundColor: active ? 'rgba(252, 238, 33, 0.2)' : 'transparent',
        color: active ? '#FCEE21' : '#9ca3af',
      }}
    >
      {children}
    </button>
  )

  const inTable = editor.isActive('table')

  return (
    <>
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

          <ToolButton onClick={insertTable} title="Insertar tabla 3x3">
            <TableIcon size={16} />
          </ToolButton>

          {inTable && (
            <>
              <ToolButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Añadir fila debajo">
                <span className="inline-flex items-center text-fluid-xs"><Plus size={12} />fila</span>
              </ToolButton>
              <ToolButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Añadir columna a la derecha">
                <span className="inline-flex items-center text-fluid-xs"><Plus size={12} />col</span>
              </ToolButton>
              <ToolButton onClick={() => editor.chain().focus().deleteRow().run()} title="Eliminar fila">
                <span className="inline-flex items-center text-fluid-xs"><Minus size={12} />fila</span>
              </ToolButton>
              <ToolButton onClick={() => editor.chain().focus().deleteColumn().run()} title="Eliminar columna">
                <span className="inline-flex items-center text-fluid-xs"><Minus size={12} />col</span>
              </ToolButton>
              <ToolButton onClick={() => editor.chain().focus().deleteTable().run()} title="Eliminar tabla">
                <span className="text-fluid-xs">borrar tabla</span>
              </ToolButton>
            </>
          )}

          <div className="w-px mx-1" style={{ backgroundColor: '#662D91' }} />

          <ToolButton onClick={() => setImportModalOpen(true)} title="Importar Markdown o HTML">
            <FileCode2 size={16} />
          </ToolButton>

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

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border p-6" style={{ backgroundColor: '#1a1535', borderColor: '#662D91' }}>
            <button
              type="button"
              onClick={() => setImportModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded text-gray-400 hover:text-white"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Importar contenido</h3>
            <p className="text-sm text-gray-400 mb-4">
              Pega Markdown o HTML del artículo. Las tablas, encabezados, listas y enlaces se respetan.
            </p>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImportMode('markdown')}
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  backgroundColor: importMode === 'markdown' ? '#FCEE21' : 'transparent',
                  color: importMode === 'markdown' ? '#16122B' : '#9ca3af',
                  border: `1px solid ${importMode === 'markdown' ? '#FCEE21' : '#662D91'}`,
                }}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => setImportMode('html')}
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  backgroundColor: importMode === 'html' ? '#FCEE21' : 'transparent',
                  color: importMode === 'html' ? '#16122B' : '#9ca3af',
                  border: `1px solid ${importMode === 'html' ? '#FCEE21' : '#662D91'}`,
                }}
              >
                HTML
              </button>
            </div>

            <textarea
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder={importMode === 'markdown'
                ? '# Mi título\n\nPega aquí el contenido en Markdown.\n\n| Columna | Otra |\n|---|---|\n| dato | dato |'
                : '<h2>Mi título</h2>\n<p>Pega aquí el HTML.</p>'}
              rows={16}
              className="w-full px-4 py-3 rounded-lg text-white font-mono text-sm border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#0f0c20',
                borderColor: '#662D91',
              }}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => { setImportValue(''); setImportModalOpen(false) }}
                className="px-4 py-2 rounded text-sm font-medium border"
                style={{ borderColor: '#662D91', color: '#9ca3af' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={!importValue.trim()}
                className="px-4 py-2 rounded text-sm font-bold disabled:opacity-50"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                Insertar contenido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
