"use client";

import { Extension, InputRule } from "@tiptap/core";

/**
 * Typora-style math input: $...$ = inline, $$...$$ = block (at line start).
 * Add after Mathematics so schema has inlineMath and blockMath.
 */
export const MathInputRules = Extension.create({
  name: "mathInputRules",

  addInputRules() {
    const inlineMath = this.editor.schema.nodes.inlineMath;
    const blockMath = this.editor.schema.nodes.blockMath;
    if (!inlineMath || !blockMath) return [];

    return [
      // Inline: $latex$ (single dollars)
      new InputRule({
        find: /\$([^$\n]+)\$$/,
        handler: ({ state, range, match }) => {
          const latex = match[1].trim();
          if (!latex) return;
          const node = inlineMath.create({ latex });
          const tr = state.tr.replaceWith(range.from, range.to, node);
          this.editor.view.dispatch(tr);
        },
      }),
      // Block: $$latex$$ at line start (double dollars)
      new InputRule({
        find: /^\$\$([^$]+)\$\$$/,
        handler: ({ state, range, match }) => {
          const latex = match[1].trim();
          if (!latex) return;
          const node = blockMath.create({ latex });
          const tr = state.tr.replaceWith(range.from, range.to, node);
          this.editor.view.dispatch(tr);
        },
      }),
    ];
  },
});
