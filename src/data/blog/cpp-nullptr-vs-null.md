---
title: "C++ nullptr vs NULL: What's the Difference (Beginner Guide)"
description: "Learn the difference between nullptr and NULL in C++, why nullptr is safer, and how it fixes a real overload bug. Clear beginner examples with working code."
modDatetime: 2026-08-01T00:00:00Z
pubDatetime: 2026-06-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "pointers", "modern-cpp"]
faqSchema:
  - question: "What is the difference between nullptr and NULL in C++?"
    answer: "nullptr is a true null pointer of type std::nullptr_t, while NULL is usually just the integer 0 in disguise. Because NULL is an integer, it can call the wrong function overload or be misused; nullptr is type-safe and always means a pointer."
  - question: "Should I use nullptr or NULL in modern C++?"
    answer: "Always use nullptr in C++11 and later. It expresses intent clearly, prevents ambiguous overload resolution, and is the standard modern practice. NULL is kept only for backward compatibility with older code and C."
  - question: "Is nullptr the same as 0?"
    answer: "No. Although a null pointer compares equal to 0, nullptr has its own type (std::nullptr_t) and cannot be used as an integer. This distinction is exactly what makes nullptr safer than the old NULL macro."
draft: false
featured: false
---

# C++ nullptr vs NULL: What's the Difference

When a pointer doesn't point at anything yet, you give it a "null" value. For decades C++ programmers used `NULL` for this, but C++11 introduced `nullptr` as a safer replacement. Understanding why the change happened will make you a more careful pointer user.

---

## Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/y6Rt_aA7uW0" title="Null Pointers in C++ - The Key to Cleaner Code!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## The Problem with NULL

`NULL` is not a special keyword — it's a macro that, in most compilers, expands to the plain integer `0`. So when you write:

```cpp
int* p = NULL;
```

the compiler really sees `int* p = 0;`. That works for assigning pointers, but it creates a hidden problem: `NULL` is fundamentally an integer, not a pointer. Most of the time you never notice, until function overloading enters the picture.

---

## A Real Bug NULL Causes

Suppose you have two functions with the same name but different parameter types:

```cpp
void process(int x);    // overload 1
void process(char* s);  // overload 2
```

Now you call `process(NULL)` intending to use the pointer version. This goes wrong in one of two ways depending on how your compiler defines `NULL`:

- If `NULL` is defined as plain `0`, the compiler treats it as an `int` and silently calls `process(int)` — the opposite of what you wanted.
- If `NULL` is defined as a compiler builtin (common on modern GCC and Clang), the call becomes **ambiguous** and fails to compile, because `NULL` matches both overloads equally.

Either way, `process(NULL)` is a trap: it's a wrong call or an outright error, and which one you get isn't even portable across compilers. This is exactly the mess `nullptr` was created to fix.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## How nullptr Fixes It

`nullptr` has its own dedicated type, `std::nullptr_t`, which is convertible to any pointer type but *not* to `int`. Swap it in and the right function gets called:

```cpp
process(nullptr);  // called process(char*) — correct!
```

Because `nullptr` can only mean "a null pointer," the compiler unambiguously chooses the pointer overload. The intent is crystal clear to both the compiler and the next person reading your code.

---

## Everyday Usage

In normal pointer code, you use `nullptr` exactly where you used to use `NULL`:

```cpp
#include <iostream>

int main() {
    int* ptr = nullptr;        // pointer to nothing

    if (ptr == nullptr) {
        std::cout << "ptr is null, not safe to dereference\n";
    }

    int value = 42;
    ptr = &value;              // now it points somewhere
    if (ptr != nullptr) {
        std::cout << "ptr points to " << *ptr << "\n";  // 42
    }
    return 0;
}
```

Checking `if (ptr == nullptr)` before dereferencing is the habit that prevents crashes. A pointer that's null and gets dereferenced causes undefined behavior — often a segmentation fault.

---

## Quick Comparison

| Feature | NULL | nullptr |
|---------|------|---------|
| Real type | Integer `0` | `std::nullptr_t` |
| Overload-safe | No | Yes |
| Introduced | C / old C++ | C++11 |
| Recommended | Legacy only | Always |

The rule is simple: in any C++11 or newer code, always write `nullptr`. It says exactly what you mean, avoids subtle overload bugs, and is the universal modern standard.

---

## Related Articles

- [Pointers in C++](/posts/pointers-in-cpp/) — what pointers are and how to use them
- [C++ Smart Pointers](/posts/smart-pointers-cpp/) — modern, automatic memory management
- [C++ Reference vs Pointer](/posts/cpp-reference-vs-pointer/) — two ways to refer to data
- [C++ Segmentation Fault](/posts/cpp-segmentation-fault/) — what happens when null pointers go wrong
- [C++ Memory Management](/posts/memory-management-cpp/) — new, delete, and the heap

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
