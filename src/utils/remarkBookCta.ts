// Remark plugin: turns marker comments in Markdown posts into HTML at build time.
//
//   <!-- book-cta topic="memory" placement="mid_article" -->   -> topic-matched book box
//   <!-- optin-quick error="was not declared in this scope" --> -> inline checklist opt-in
//   <!-- TODO(Sahil): ... -->                                  -> removed from the output
//
// Put each marker on its own line with a blank line before and after it.
import { renderBookCta, renderQuickOptin } from "./bookCta";

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
}

const MARKER = /^<!--\s*(book-cta|optin-quick)\b([\s\S]*?)-->$/;
const TODO = /^<!--\s*TODO\(Sahil\)[\s\S]*-->$/;

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(/([a-z]+)="([^"]*)"/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

export default function remarkBookCta() {
  return (tree: MdNode) => {
    const visit = (node: MdNode) => {
      if (node.type === "html" && typeof node.value === "string") {
        const value = node.value.trim();
        if (TODO.test(value)) {
          node.value = "";
          return;
        }
        const match = value.match(MARKER);
        if (match) {
          const attrs = parseAttrs(match[2]);
          node.value =
            match[1] === "book-cta"
              ? renderBookCta(
                  attrs.topic ?? "",
                  attrs.placement ?? "mid_article"
                )
              : renderQuickOptin(attrs);
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
