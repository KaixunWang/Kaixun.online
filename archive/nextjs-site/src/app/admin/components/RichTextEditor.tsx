"use client";

import { useState, useRef, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { ImageWithAlign } from "./ImageWithAlign";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";
import { PdfEmbedExtension } from "./PdfEmbedExtension";
import { MathInputRules } from "./MathInputRules";

type RichContent = Record<string, unknown>;

const lowlight = createLowlight(common);

const CODE_LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "sql",
  "html",
  "css",
  "json",
  "markdown",
  "xml",
  "bash",
  "yaml",
] as const;

interface RichTextEditorProps {
  initialContentRich?: RichContent | null;
  initialPlainText?: string;
  onChange: (payload: { contentRich: RichContent | null; plainText: string }) => void;
}

export function RichTextEditor({
  initialContentRich,
  initialPlainText,
  onChange,
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [, setToolbarUpdate] = useState(0);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
      Underline,
      Link.configure({ openOnClick: false }),
      ImageWithAlign,
      StarterKit.configure({
        codeBlock: false,
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
        enableTabIndentation: true,
      }),
      Mathematics.configure({
        katexOptions: { throwOnError: false },
        blockOptions: {
          onClick: (node, pos) => {
            const e = editorRef.current;
            if (!e) return;
            const latex = window.prompt("Edit formula (LaTeX):", node.attrs.latex || "");
            if (latex != null) e.chain().focus().updateBlockMath({ pos, latex: latex.trim() }).run();
          },
        },
        inlineOptions: {
          onClick: (node, pos) => {
            const e = editorRef.current;
            if (!e) return;
            const latex = window.prompt("Edit formula (LaTeX):", node.attrs.latex || "");
            if (latex != null) e.chain().focus().updateInlineMath({ pos, latex: latex.trim() }).run();
          },
        },
      }),
      PdfEmbedExtension,
      MathInputRules,
    ],
    content:
      initialContentRich && Object.keys(initialContentRich).length > 0
        ? initialContentRich
        : initialPlainText
          ? { type: "doc", content: [{ type: "paragraph", text: initialPlainText }] }
          : undefined,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[240px] rounded-md border border-zinc-200 px-3 py-2 text-zinc-800 outline-none focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Tab" || event.key === "Shift+Tab") {
          const { $from } = view.state.selection;
          if ($from.parent.type.name === "codeBlock") {
            event.preventDefault();
          }
        }
      },
    },
    onUpdate({ editor }) {
      const json = editor.getJSON() as RichContent;
      const text = editor.getText();
      onChange({
        contentRich: json,
        plainText: text,
      });
      setToolbarUpdate((n) => n + 1);
    },
    onSelectionUpdate: () => setToolbarUpdate((n) => n + 1),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  if (!editor) return null;

  // Keep editor focus/selection when clicking toolbar (so: selection → toggle selection; no selection → toggle next-typing state)
  const preventFocusLoss = (e: React.MouseEvent) => e.preventDefault();
  // After toggling format (e.g. Bold), force toolbar re-render so button state updates immediately (even when only stored marks change)
  const refreshToolbar = () => setToolbarUpdate((n) => n + 1);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        // eslint-disable-next-line no-alert
        alert(data.message ?? "Failed to upload image.");
        return;
      }
      if (editor) editor.chain().focus().setImage({ src: data.url }).run();
    } catch {
      // eslint-disable-next-line no-alert
      alert("Network error. Please try again later.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handlePdfInsert(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        // eslint-disable-next-line no-alert
        alert(data.message ?? "Failed to upload PDF.");
        return;
      }
      if (editor) {
        editor.chain().focus().setPdfEmbed({ src: data.url }).run();
      }
    } catch {
      // eslint-disable-next-line no-alert
      alert("Network error. Please try again later.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs text-zinc-700">
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleBold().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("bold") ? "bg-zinc-800 text-white" : "hover:bg-zinc-200"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("italic") ? "bg-zinc-800 text-white" : "hover:bg-zinc-200"
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("underline")
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-200"
          }`}
        >
          Underline
        </button>
        <span className="h-4 w-px bg-zinc-300" />
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("bulletList")
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-200"
          }`}
        >
          Bullet list
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("orderedList")
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-200"
          }`}
        >
          Numbered list
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleBlockquote().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("blockquote")
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-200"
          }`}
        >
          Quote
        </button>
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            editor.chain().focus().toggleCodeBlock().run();
            refreshToolbar();
          }}
          className={`rounded px-2 py-0.5 ${
            editor.isActive("codeBlock")
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-200"
          }`}
        >
          Code block
        </button>
        {editor.isActive("codeBlock") && (
          <select
            onChange={(e) => {
              const lang = e.target.value as (typeof CODE_LANGUAGES)[number];
              editor.chain().focus().setCodeBlock({ language: lang }).run();
              refreshToolbar();
            }}
            value={
              (editor.getAttributes("codeBlock").language as string) || "plaintext"
            }
            className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-zinc-700"
          >
            {CODE_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onMouseDown={preventFocusLoss}
          onClick={() => {
            const latex = window.prompt("LaTeX (block math):", "E = mc^2");
            if (latex != null && latex.trim()) {
              editor.chain().focus().insertBlockMath({ latex: latex.trim() }).run();
              refreshToolbar();
            }
          }}
          className="rounded px-2 py-0.5 hover:bg-zinc-200"
        >
          Insert math
        </button>
        <span className="h-4 w-px bg-zinc-300" />
        <label
          className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 hover:bg-zinc-200"
          onMouseDown={preventFocusLoss}
        >
          <span>Text color</span>
          <input
            type="color"
            className="h-4 w-4 cursor-pointer border border-zinc-300 bg-white"
            onChange={(e) => {
              editor.chain().focus().setColor(e.target.value).run();
              refreshToolbar();
            }}
          />
        </label>
        <span className="h-4 w-px bg-zinc-300" />
        {editor.isActive("image") && (
          <>
            <span className="text-zinc-500">Align:</span>
            {(["left", "center", "right"] as const).map((align) => (
              <button
                key={align}
                type="button"
                onMouseDown={preventFocusLoss}
                onClick={() => {
                  editor.chain().focus().updateAttributes("image", { align }).run();
                  refreshToolbar();
                }}
                className={`rounded px-2 py-0.5 capitalize ${
                  editor.getAttributes("image").align === align
                    ? "bg-zinc-800 text-white"
                    : "hover:bg-zinc-200"
                }`}
              >
                {align}
              </button>
            ))}
          </>
        )}
        <label className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 hover:bg-zinc-200">
          <span>{uploading ? "Uploading image..." : "Add image"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 hover:bg-zinc-200">
          <span>{uploading ? "Uploading PDF..." : "Add PDF"}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfInsert}
            disabled={uploading}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

