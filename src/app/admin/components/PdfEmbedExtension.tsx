"use client";

import { Node, mergeAttributes } from "@tiptap/core";

export interface PdfEmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pdfEmbed: {
      setPdfEmbed: (attrs: { src: string }) => ReturnType;
    };
  }
}

export const PdfEmbedExtension = Node.create<PdfEmbedOptions>({
  name: "pdfEmbed",

  group: "block",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-src"),
        renderHTML: (attrs) => (attrs.src ? { "data-src": attrs.src } : {}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pdf-embed"]',
        getAttrs: (el) => ({
          src: (el as HTMLElement).getAttribute("data-src"),
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const src = node.attrs.src;
    if (!src) return ["div", mergeAttributes(this.options.HTMLAttributes, { "data-type": "pdf-embed" }), "PDF"];
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "pdf-embed",
        class: "my-4 rounded border border-zinc-200 overflow-hidden",
      }),
      [
        "iframe",
        {
          src,
          title: "PDF",
          class: "w-full border-0",
          style: "height: 600px;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setPdfEmbed:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
