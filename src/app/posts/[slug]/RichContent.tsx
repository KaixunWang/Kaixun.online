"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { ImageWithAlign } from "@/app/admin/components/ImageWithAlign";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";
import { PdfEmbedExtension } from "@/app/admin/components/PdfEmbedExtension";

type RichContent = Record<string, unknown>;

const lowlight = createLowlight(common);

interface RichContentProps {
  contentRich: RichContent | null;
  fallbackText: string;
  variant?: "light" | "dark";
}

export function RichContent({
  contentRich,
  fallbackText,
  variant = "light",
}: RichContentProps) {
  const baseClass =
    variant === "dark"
      ? "prose prose-sm max-w-none prose-invert text-zinc-100 leading-relaxed"
      : "prose prose-sm max-w-none text-zinc-800 leading-relaxed";

  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [
      Color.configure({ types: [TextStyle.name] }),
      TextStyle,
      Underline,
      Link,
      ImageWithAlign.configure({ resize: false }),
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Mathematics.configure({ katexOptions: { throwOnError: false } }),
      PdfEmbedExtension,
    ],
    content:
      contentRich && Object.keys(contentRich).length > 0
        ? contentRich
        : { type: "doc", content: [{ type: "paragraph", text: fallbackText }] },
    editorProps: {
      attributes: {
        class: baseClass,
      },
    },
  });

  if (!editor) {
    return (
      <div className={baseClass}>
        {fallbackText}
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}

