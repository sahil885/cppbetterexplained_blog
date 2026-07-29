---
title: "C++ vector reserve vs resize: What's the Difference?"
description: "C++ vector reserve vs resize: reserve allocates capacity without adding elements, resize changes the size. Learn when to use each, with clear examples."
pubDatetime: 2026-07-29T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "STL", "vectors", "tutorial"]
faqSchema:
  - question: "What is the difference between reserve and resize in C++ vector?"
    answer: "reserve only allocates capacity (memory) for future elements without creating them, so size() stays the same. resize actually changes the number of elements, creating or removing them so size() changes. reserve is an optimisation; resize changes contents."
  - question: "When should I use reserve on a vector?"
    answer: "Use reserve when you know roughly how many elements you'll push_back, to avoid repeated reallocations as the vector grows. Call reserve once before the loop, then push_back as normal. It improves performance without changing the vector's contents."
  - question: "Does reserve create elements you can index?"
    answer: "No. After reserve the size is unchanged, so accessing those slots with [] is undefined behaviour. reserve only reserves memory. If you want elements you can index immediately, use resize instead."
draft: false
featured: false
---

# C++ vector reserve vs resize: What's the Difference?

`reserve` and `resize` look similar and are constantly mixed up, but they do different jobs. The one-line version: **`resize` changes how many elements the vector has; `reserve` only sets aside memory for elements you'll add later.** Getting this wrong leads to either wasted performance or out-of-bounds bugs, so let's make it crystal clear.

---

## Size vs Capacity: The Key Idea

Every vector tracks two numbers:

- **Size** — how many elements it actually holds right now (`.size()`)
- **Capacity** — how many elements it *could* hold before it needs to grab more memory (`.capacity()`)

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    cout << "size: " << v.size() << "\n";       // 3
    cout << "capacity: " << v.capacity() << "\n"; // 3 or more
    return 0;
}
```

`resize` changes **size**. `reserve` changes **capacity**. That single distinction explains everything else.

---

## resize: Change the Number of Elements

`resize(n)` makes the vector have exactly `n` elements. If it grows, the new elements are value-initialised (zero for numbers); if it shrinks, the extra elements are removed.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    v.resize(5);        // now {1, 2, 3, 0, 0}
    cout << "size after resize(5): " << v.size() << "\n";  // 5
    cout << "v[4] = " << v[4] << "\n";                     // 0 — real element

    v.resize(2);        // now {1, 2} — last elements dropped
    cout << "size after resize(2): " << v.size() << "\n";  // 2
    return 0;
}
```

After `resize(5)`, index `4` is a real, valid element you can read and write. You can also give a fill value: `v.resize(5, -1)` pads with `-1` instead of `0`.

---

## reserve: Set Aside Memory Only

`reserve(n)` tells the vector "get ready to hold at least `n` elements," but it does **not** create any. The size stays exactly the same.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    v.reserve(100);     // capacity is now >= 100
    cout << "size: " << v.size() << "\n";          // still 3!
    cout << "capacity: " << v.capacity() << "\n";  // 100 or more

    // v[50] = 7;       // WRONG — index 50 doesn't exist yet, UB
    return 0;
}
```

Because the size is unchanged, indexing into the reserved-but-empty slots is undefined behaviour. `reserve` is purely a performance hint, not a way to make elements.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Why reserve Matters for Performance

When a vector runs out of capacity, it allocates a bigger block, copies all existing elements over, and frees the old block. Do that repeatedly in a big loop and the copying adds up. `reserve` lets you pay that cost once:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    v.reserve(1000);            // allocate once, up front

    for (int i = 0; i < 1000; i++) {
        v.push_back(i);          // no reallocations happen inside the loop
    }

    cout << "Added " << v.size() << " items\n";
    return 0;
}
```

This is efficient because all 1000 `push_back` calls reuse the memory you reserved, instead of triggering a chain of grow-and-copy operations. When you know (even roughly) how many elements you'll add, one `reserve` before the loop is an easy win.

---

## Choosing Between Them

Ask yourself what you actually want:

- **"I want N elements I can index right now."** → use `resize`.
- **"I'll `push_back` about N elements and want to avoid reallocations."** → use `reserve`.

A common mistake is calling `reserve` and then indexing with `[]`, expecting elements to be there. They aren't. Equally, calling `resize` and then `push_back` gives you the zero-filled elements *plus* your pushed ones, which is usually not what you meant.

---

## Side-by-Side Summary

| Aspect | `reserve(n)` | `resize(n)` |
|--------|--------------|-------------|
| Changes size()? | No | Yes |
| Changes capacity? | Yes (grows it) | Only if needed |
| Creates elements? | No | Yes (value-initialised) |
| Can you index new slots? | No (UB) | Yes |
| Main purpose | performance | change contents |
| Pair it with | `push_back` | direct `[]` access |

---

## The Takeaway

Use `resize` when you need the elements to exist, and `reserve` when you just want to pre-allocate room for elements you're about to `push_back`. Remember the mantra: **reserve = memory, resize = elements.** Keep those separate and a whole class of vector bugs disappears.

---

## Related Articles

- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the complete guide to std::vector
- [C++ Array vs Vector](/posts/cpp-array-vs-vector/) — when to pick each container
- [C++ Print a Vector](/posts/cpp-print-vector/) — displaying vector contents
- [C++ Remove from Vector](/posts/cpp-remove-from-vector/) — the erase-remove idiom
- [C++ Pass Vector to Function](/posts/cpp-pass-vector-to-function/) — by value vs by reference

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
