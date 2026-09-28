---
title: "How to Break Out of a Nested Loop in C++"
description: "break only exits the innermost loop in C++. Four ways to break out of nested loops: a flag, goto, extracting a function, and restructuring."
pubDatetime: 2026-09-28T00:00:00Z
author: "Sahil"
tags: ["C++", "loops", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "Does break exit all loops in C++?"
    answer: "No. break exits only the loop it sits directly inside. In a nested loop it ends the inner loop and execution continues in the outer one, which is the most common surprise for beginners."
  - question: "How do you break out of two loops at once in C++?"
    answer: "The clearest options are extracting the loops into a function and using return, or setting a boolean flag that the outer loop checks. goto with a label after the loops also works and is accepted for this specific case."
  - question: "Is it bad practice to use goto to break nested loops in C++?"
    answer: "Breaking out of nested loops is the one case where goto is widely accepted, including in several major style guides, because the alternatives add more noise. The jump must go forward to a label just after the loops."
  - question: "Can you use a labelled break in C++?"
    answer: "No. Java and JavaScript have labelled break, C++ does not. The nearest equivalents are goto to a label placed after the loops, or returning from a function that contains them."
---

# How to Break Out of a Nested Loop in C++

**Short answer:** `break` only exits the innermost loop. To leave both, put the loops in a function and `return`, or use a flag, or `goto` a label after the loops.

C++ has no labelled `break` — that's a Java and JavaScript feature.

---

## The Problem

```cpp
#include <iostream>

int main() {
    int grid[3][3] = {{1,2,3},{4,5,6},{7,8,9}};

    for (int r = 0; r < 3; ++r) {
        for (int c = 0; c < 3; ++c) {
            if (grid[r][c] == 5) {
                std::cout << "Found at " << r << "," << c << '\n';
                break;                  // only leaves the INNER loop
            }
        }
        // execution lands here, then the outer loop keeps going
    }
}
```

The `break` ends the `c` loop. The `r` loop carries on to the next row. If you wanted to stop searching entirely, this doesn't do it.

## Option 1: Extract a Function and return (cleanest)

```cpp
#include <iostream>
#include <utility>

std::pair<int,int> findValue(int grid[3][3], int target) {
    for (int r = 0; r < 3; ++r) {
        for (int c = 0; c < 3; ++c) {
            if (grid[r][c] == target) {
                return {r, c};          // leaves both loops at once
            }
        }
    }
    return {-1, -1};                    // not found
}

int main() {
    int grid[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    auto [row, col] = findValue(grid, 5);

    if (row != -1) std::cout << "Found at " << row << "," << col << '\n';
    else           std::cout << "Not found\n";
}
```

`return` leaves every loop in the function, however deep. This is usually the right answer: searching is its own job, so it deserves its own function, and the code reads better afterwards.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers loops, functions and control flow in plain English — 87 pages, just $19.</div>

## Option 2: A Flag

```cpp
bool found = false;

for (int r = 0; r < 3 && !found; ++r) {
    for (int c = 0; c < 3; ++c) {
        if (grid[r][c] == 5) {
            std::cout << "Found at " << r << "," << c << '\n';
            found = true;
            break;                      // leave inner loop
        }
    }
}
```

The outer loop's condition now checks `!found`, so once the flag flips the outer loop stops too.

It works, but it costs you a variable and two extra places to look when reading the code. With three levels of nesting it gets genuinely ugly.

## Option 3: goto

```cpp
for (int r = 0; r < 3; ++r) {
    for (int c = 0; c < 3; ++c) {
        if (grid[r][c] == 5) {
            std::cout << "Found at " << r << "," << c << '\n';
            goto done;
        }
    }
}
done:
std::cout << "Search finished\n";
```

Yes, `goto`. Breaking out of nested loops is the one case where it's widely accepted — it appears in the Linux kernel, and several major C++ style guides permit it here specifically.

Two conditions make it safe: the jump goes **forward**, and the label sits immediately **after** the loops. Jumping backwards or into a block is where `goto` earns its reputation.

## Option 4: Restructure So You Don't Need To

Often the nesting isn't necessary. A single loop over a flattened index:

```cpp
for (int i = 0; i < 9; ++i) {
    int r = i / 3, c = i % 3;
    if (grid[r][c] == 5) {
        std::cout << "Found at " << r << "," << c << '\n';
        break;                          // one loop, one break
    }
}
```

Or let the standard library do the searching:

```cpp
#include <algorithm>
#include <vector>

std::vector<std::vector<int>> grid = {{1,2,3},{4,5,6},{7,8,9}};

for (const auto& row : grid) {
    auto it = std::find(row.begin(), row.end(), 5);
    if (it != row.end()) {
        std::cout << "Found\n";
        break;                          // only one loop to leave
    }
}
```

When you reach for a flag or a `goto`, it's worth a moment's thought about whether the loop structure itself is the problem. See [std::find in C++](/posts/cpp-find-in-vector/).

## What About continue?

`continue` has the same scope rule — it skips to the next iteration of the **innermost** loop only:

```cpp
for (int r = 0; r < 3; ++r) {
    for (int c = 0; c < 3; ++c) {
        if (grid[r][c] % 2 == 0) continue;   // next c, not next r
        std::cout << grid[r][c] << ' ';
    }
}
```

To skip to the next outer iteration, `break` out of the inner loop instead — that lands you at the end of the outer body, which is the same thing.

## Quick Reference

| Approach | When to use |
|---|---|
| Extract function + `return` | Default choice — clearest, works at any depth |
| Boolean flag | Two levels, when a function feels heavy |
| `goto` forward label | Deep nesting where a flag gets noisy |
| Flatten to one loop | When the nesting was incidental |
| `std::find` / algorithms | When you are really just searching |
| Labelled `break` | Not available in C++ |

---

## Take Your C++ Further

If you want loops, functions and control flow explained properly rather than pieced together, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [break and continue in C++](/posts/cpp-break-continue/) — the basics of both.
- [C++ Nested Loops](/posts/cpp-nested-loops/) — patterns and pitfalls.
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while and do-while.
- [How to Find an Element in a Vector](/posts/cpp-find-in-vector/) — searching without hand-rolled loops.
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — extracting logic into functions.
