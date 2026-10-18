// Book call-to-action copy, written once and used in two places:
//   - Markdown posts, via a marker that remarkBookCta turns into HTML at build time:
//       <!-- book-cta topic="memory" placement="mid_article" -->
//   - .astro pages, via <BookCTA topic="memory" placement="mid_article" />
//
// Claims allowed in this copy (already on the site): 87 pages, $19, plain
// English, analogies and diagrams, the 30-day money-back guarantee, and that the
// book covers pointers, memory, OOP and how C++ code gets compiled.
// Don't add anything else here without checking it against the book.

export const BOOK_URL = "https://start.cppbetterexplained.com/tw-sales-page";

export const BOOK_TOPICS = [
  "pointers",
  "memory",
  "oop",
  "compiling",
  "fundamentals",
] as const;
export type BookTopic = (typeof BOOK_TOPICS)[number];

// Values for GA4's `placement` parameter. Keep in sync with the click listener
// in src/layouts/Layout.astro.
export const PLACEMENTS = [
  "book_box",
  "early_link",
  "mid_article",
  "end_cta",
  "nav",
  "footer",
  "homepage_hero",
  "homepage_book",
  "comparison_table",
  "other",
] as const;
export type Placement = (typeof PLACEMENTS)[number];

interface TopicCopy {
  /** Mid-article: a bold lead plus one sentence. */
  midLead: string;
  midBody: string;
  /** End of post: one or two sentences. */
  end: string;
}

const COPY: Record<BookTopic, TopicCopy> = {
  pointers: {
    midLead: "Pointers still feel slippery?",
    midBody:
      "C++ Better Explained draws pointers and references out with diagrams and plain-English analogies, so you can see what your code is pointing at.",
    end: "Pointers and references are where most C++ beginners get stuck, and they're far easier once you can picture them. C++ Better Explained explains them with diagrams and analogies, then builds on them to cover memory and OOP.",
  },
  memory: {
    midLead: "Want to see where your data actually lives?",
    midBody:
      "C++ Better Explained uses diagrams and plain-English analogies to explain the stack, the heap, new and delete, and smart pointers.",
    end: "Memory bugs make much more sense once you can picture the stack and the heap. C++ Better Explained walks through how C++ manages memory, from new and delete to smart pointers, with diagrams and plain-English analogies.",
  },
  oop: {
    midLead: "Classes and inheritance feeling abstract?",
    midBody:
      "C++ Better Explained explains object-oriented C++ in plain English, with analogies and code diagrams, from your first class to inheritance and polymorphism.",
    end: "Object-oriented C++ clicks once you have a clear picture of what an object is and how classes relate to each other. C++ Better Explained covers classes, inheritance and polymorphism in plain English, with analogies and code diagrams.",
  },
  compiling: {
    midLead: "Header and linker errors are easier with the big picture.",
    midBody:
      "C++ Better Explained explains how C++ code gets compiled, including what header files and the linker each do, in plain English with diagrams.",
    end: "Header-file and linker errors stop being mysterious once you know how your .cpp files become a program. C++ Better Explained explains how C++ code gets compiled, step by step, in plain English with diagrams.",
  },
  fundamentals: {
    midLead: "Want the fundamentals explained properly?",
    midBody:
      "C++ Better Explained covers the core of C++ in plain English, with analogies and code diagrams, including the parts that trip beginners up most: pointers, memory and OOP.",
    end: "If you'd like the fundamentals explained in one place, C++ Better Explained covers them in 87 plain-English pages, with analogies and code diagrams, including the parts that trip beginners up most: pointers, memory and OOP.",
  },
};

export function isBookTopic(value: string): value is BookTopic {
  return (BOOK_TOPICS as readonly string[]).includes(value);
}

export function isPlacement(value: string): value is Placement {
  return (PLACEMENTS as readonly string[]).includes(value);
}

/** HTML for a topic-matched book call to action. Throws on unknown values so a
 *  typo in a post's marker fails the build instead of shipping silently. */
export function renderBookCta(topic: string, placement = "mid_article"): string {
  if (!isBookTopic(topic)) {
    throw new Error(
      `book-cta: unknown topic "${topic}". Use one of: ${BOOK_TOPICS.join(", ")}`
    );
  }
  if (!isPlacement(placement)) {
    throw new Error(
      `book-cta: unknown placement "${placement}". Use one of: ${PLACEMENTS.join(", ")}`
    );
  }
  const copy = COPY[topic];
  const button = `<a class="book-cta-btn" href="${BOOK_URL}">Get the book — $19</a>`;

  if (placement === "end_cta") {
    return [
      `<div class="book-cta book-cta--end" data-placement="end_cta" data-topic="${topic}">`,
      `<img src="/book-cover.jpg" alt="C++ Better Explained ebook cover" width="96" height="144" loading="lazy" onerror="this.style.display='none'" />`,
      `<div>`,
      `<p>${copy.end}</p>`,
      button,
      `<p class="book-cta-note">87 pages · plain English · 30-day money-back guarantee</p>`,
      `</div>`,
      `</div>`,
    ].join("");
  }

  return [
    `<div class="book-cta" data-placement="${placement}" data-topic="${topic}">`,
    `<p><strong>${copy.midLead}</strong> ${copy.midBody}</p>`,
    button,
    `</div>`,
  ].join("");
}

/** Inline checklist opt-in for quick-answer and error posts (Phase 3). Reuses
 *  the in-post opt-in form, so it posts to /api/subscribe with the existing
 *  "checklist" list and is handled by the form script in PostDetails.astro. */
export function renderQuickOptin(attrs: { error?: string; hook?: string }): string {
  // TODO(Sahil): the checklist's 10 mistakes aren't in this repo, so the hook
  // doesn't claim this error is one of them. If it is, switch to:
  // "Hit this one? Here are 9 more traps like it, as a free 1-page checklist."
  let hook = attrs.hook;
  if (!hook) {
    if (!attrs.error) {
      throw new Error('optin-quick: needs an error="..." or hook="..." attribute');
    }
    hook = `Hit “${attrs.error}”? It's a classic beginner trap, and there are others like it.`;
  }
  return [
    `<div class="quick-optin not-prose my-8 rounded-xl border border-accent/30 bg-accent/5 px-5 py-6 text-center">`,
    `<p class="text-lg font-bold text-accent mb-1">${hook}</p>`,
    `<p class="text-sm opacity-75 mb-4 max-w-md mx-auto">Get the free 1-page checklist: <strong>The 10 Mistakes Every C++ Beginner Makes (And How to Avoid Them)</strong>.</p>`,
    `<form class="post-optin-form flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" data-list="checklist" data-location="inline_quick_answer">`,
    `<input type="email" name="email" placeholder="your@email.com" required autocomplete="email" aria-label="Email address" class="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm outline-none focus:border-accent transition-colors" />`,
    `<button type="submit" class="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity disabled:opacity-50">Send it to me →</button>`,
    `</form>`,
    `<p class="text-xs opacity-40 mt-3">🔒 No spam. Unsubscribe anytime.</p>`,
    `<div class="post-optin-success hidden mt-4"><p class="text-base font-semibold text-accent">🎉 Check your inbox — it's on its way!</p></div>`,
    `</div>`,
  ].join("");
}
