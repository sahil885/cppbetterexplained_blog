---
title: "C++ break and continue: Control Your Loops (with Examples)"
description: "Learn how break and continue work in C++ loops: break exits a loop, continue skips one iteration. See clear examples, nested loops, and switch gotchas."
pubDatetime: 2026-06-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "What is the difference between break and continue in C++?"
    answer: "break exits the loop completely and runs the code after it. continue skips the rest of the current iteration and jumps to the next one, so the loop keeps going."
  - question: "Does break exit all loops or just one?"
    answer: "break only exits the innermost loop that contains it. In nested loops, an inner break leaves the inner loop but the outer loop keeps running its remaining iterations."
  - question: "Does break in a switch exit the loop too?"
    answer: "No. Inside a loop, break in a switch statement only ends the switch, not the loop. The loop continues with its next iteration after the switch finishes."
draft: false
featured: false
---

# C++ break and continue

Loops normally run start to finish, but real programs need to bail out early or skip certain items. That's what `break` and `continue` are for. They look similar but do opposite-feeling jobs, and mixing them up is a classic beginner bug. Here's the clear version.

---

## break: Leave the Loop Now

`break` stops the loop immediately and jumps to the code after it, no matter how many iterations were left:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 10; ++i) {
        if (i == 5)
            break;          // leave the loop entirely
        std::cout << i << " ";
    }
    std::cout << "\n";      // 1 2 3 4
    return 0;
}
```

The loop was set up to count to 10, but `break` ends it the moment `i` hits 5. Think of `break` as an emergency exit out of the loop.

---

## continue: Skip Just This Round

`continue` skips the rest of the current iteration and jumps straight to the next one. The loop itself keeps running:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 10; ++i) {
        if (i % 2 != 0)
            continue;       // skip odd numbers
        std::cout << i << " ";
    }
    std::cout << "\n";      // 2 4 6 8 10
    return 0;
}
```

When `i` is odd, `continue` jumps past the `cout` and moves on. Only the even numbers get printed. Nothing is exited — one lap is just cut short.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## break vs continue at a Glance

| Statement | What it does | Loop keeps running? |
|-----------|--------------|---------------------|
| `break` | Exits the loop entirely | No |
| `continue` | Skips to the next iteration | Yes |

A simple way to remember it: `break` ends the whole loop, `continue` ends only the current pass.

---

## A Practical Use: Stop When You Find It

`break` shines when searching — once you've found what you want, there's no reason to keep looping:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {4, 8, 15, 16, 23, 42};
    int target = 15;
    for (std::size_t i = 0; i < data.size(); ++i) {
        if (data[i] == target) {
            std::cout << "Found at index " << i << "\n";
            break;   // no need to keep looking
        }
    }
    return 0;
}
```

Without `break`, the loop would needlessly scan every remaining element. Stopping early is both faster and clearer.

---

## break in Nested Loops

A `break` only exits the **innermost** loop it sits in — the outer loop carries on:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 3; ++i) {
        for (int j = 1; j <= 3; ++j) {
            if (j == 2)
                break;     // only breaks the inner loop
            std::cout << i << "," << j << "  ";
        }
    }
    std::cout << "\n";     // 1,1  2,1  3,1
    return 0;
}
```

For each value of `i`, the inner loop prints `j = 1` and then breaks at `j = 2`. The outer loop keeps going, which is why all three `i` values appear.

---

## A Gotcha: break Inside switch

Inside a loop, a `break` in a `switch` ends the **switch**, not the loop:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 3; ++i) {
        switch (i) {
            case 1:
                std::cout << "one\n";
                break;     // breaks the switch, not the loop
            case 2:
                std::cout << "two\n";
                break;
            default:
                std::cout << "other\n";
        }
    }
    return 0;
}
```

All three numbers print, because each `break` only leaves the `switch`. The loop runs to completion as normal. Keep this in mind when you have a `switch` inside a loop.

---

## Related Articles

- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while explained
- [C++ do-while Loop](/posts/cpp-do-while-loop/) — loops that run at least once
- [C++ switch Statement](/posts/cpp-switch-statement/) — where break also appears
- [C++ Range-Based For Loop](/posts/cpp-range-based-for-loop/) — the modern loop syntax
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — the if tests that drive break and continue

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
