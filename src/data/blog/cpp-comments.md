---
title: "C++ Comments Explained: Single-Line, Multi-Line, and When to Use Them"
description: "Learn how to write comments in C++ with // and /* */, see clear examples, and find out when a comment really helps and when cleaner code is the better fix."
modDatetime: 2026-08-01T00:00:00Z
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "basics", "tutorial"]
faqSchema:
  - question: "How do you write a comment in C++?"
    answer: "Use // for a single-line comment — everything after it on that line is ignored by the compiler. Use /* */ to wrap a comment that spans multiple lines. Comments never change how your program runs."
  - question: "What is the difference between // and /* */ in C++?"
    answer: "// starts a comment that ends at the line break, so it covers one line. /* */ starts a block comment that continues until the closing */, so it can cover many lines. Use // for short notes and /* */ for longer explanations."
  - question: "Can you nest multi-line comments in C++?"
    answer: "No. A /* */ block ends at the first */ it finds, so you cannot put one /* */ inside another. You can, however, place // single-line comments inside a /* */ block without any problem."
draft: false
featured: false
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/e2rkO8iS9TU" title="How to Write Comments in C++" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# C++ Comments Explained

A comment is a note you leave in your code for humans to read — the compiler ignores it completely. Comments don't change what your program does, but they make it far easier to understand later. Here's how to write them in C++ and, just as important, when you actually should.

---

## How to Write a Single-Line Comment in C++ (//)

The most common comment starts with two forward slashes, `//`. Everything from the slashes to the end of that line is ignored:

```cpp
#include <iostream>

int main() {
    // This line greets the user
    std::cout << "Hello, world!\n";  // a comment can also sit after code
    return 0;
}
```

Notice you can put a `//` comment on its own line *or* at the end of a line of code. Both are fine. The comment simply stops at the line break — the next line is back to being real code.

---

## How to Write a Multi-Line Comment in C++ (/* */)

When a note is longer than one line, wrap it in `/*` and `*/`. Everything between them is ignored, no matter how many lines it covers:

```cpp
#include <iostream>

int main() {
    /*
       This program prints a welcome message.
       I'm writing it while learning how comments work.
    */
    std::cout << "Welcome!\n";
    return 0;
}
```

This style is handy for a longer explanation at the top of a file, or for temporarily switching off a chunk of code while you test something.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Commenting Out Code While You Debug

One of the most useful tricks for beginners is to *comment out* a line so the compiler skips it without you deleting it:

```cpp
#include <iostream>

int main() {
    int price = 100;
    // int discount = 20;   // disabled while testing the full price
    std::cout << "Price: " << price << "\n";
    return 0;
}
```

The `discount` line is still there for reference, but it no longer runs. When you want it back, just remove the `//`.

---

## What Comments Are Actually For

Here's the part most tutorials skip. A good comment explains **why**, not **what**. The code already shows *what* it does; your comment should add the reasoning that the code can't express on its own:

```cpp
#include <iostream>

int main() {
    int celsius = 30;
    // Standard formula: multiply by 9/5, then add 32
    int fahrenheit = celsius * 9 / 5 + 32;
    std::cout << fahrenheit << "\n";
    return 0;
}
```

A comment like `// add 1 to i` next to `i = i + 1` is just noise — the code already says that. A comment that explains a formula, a tricky edge case, or a business rule is genuinely valuable. When in doubt, prefer clear variable names over comments: well-named code often needs no explanation at all.

---

## A Common Gotcha: You Can't Nest /* */

A block comment ends at the **first** `*/` it sees. That means you cannot put one `/* */` inside another — the first closing `*/` ends the whole thing, and the leftover text becomes code (usually causing an error). Single-line `//` comments, though, sit happily inside a block:

```cpp
#include <iostream>

int main() {
    /* outer note — a // here is perfectly fine */
    std::cout << "Compiles cleanly\n";
    return 0;
}
```

If you ever need to disable a large region that already contains `/* */` comments, comment out each line with `//` instead.

---

## Quick Reference

| Goal | Syntax |
|------|--------|
| Short note on one line | `// your note` |
| Note after some code | `code; // your note` |
| Note spanning many lines | `/* your note */` |
| Temporarily disable code | put `//` in front of the line |
| Explain reasoning | comment the *why*, not the *what* |

---

## Related Articles

- [How to Learn C++ From Scratch: The Complete Roadmap](/learn-cpp/) — the full step-by-step learning path, in order, from your first program onward.
- [Best C++ Books and Resources for Beginners in 2026](/posts/best-cpp-books-resources/) — if you'd rather learn from one structured source than a hundred scattered tutorials, start here.
- [C++ Hello World Explained](/posts/cpp-hello-world-explained/) — your first program, line by line
- [Breakdown of a Simple C++ Program](/posts/breakdown-simple-cpp-program/) — what each part does
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — name things clearly so you need fewer comments
- [C++ Header Files](/posts/cpp-header-files/) — where bigger comment blocks often live
- [How to Start Learning C++](/posts/how-to-start-learning-cpp/) — set up your environment first

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-p