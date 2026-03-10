"use client";

import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const ImageWithAlign = Image.extend({
  addAttributes() {
    const parent = this.parent?.();
    return {
      ...parent,
      align: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-align") || null,
        renderHTML: ({ align }) => (align ? { "data-align": align } : {}),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const align = node.attrs.align;
    const alignClass =
      align === "center"
        ? "block mx-auto"
        : align === "right"
          ? "block ml-auto"
          : "block";
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: [HTMLAttributes.class, alignClass].filter(Boolean).join(" "),
    });
    return ["img", merged];
  },

  addOptions() {
    const parent = this.parent?.();
    return {
      ...parent,
      inline: parent?.inline ?? false,
      allowBase64: parent?.allowBase64 ?? false,
      HTMLAttributes: parent?.HTMLAttributes ?? {},
      resize: {
        enabled: true,
        directions: ["bottom-right"],
        minWidth: 80,
        minHeight: 80,
        alwaysPreserveAspectRatio: true,
      },
    };
  },
});
